

import _ from 'lodash';
import React from 'react';
import * as ReactDOM from 'react-dom/client';
import appConfig from './config';
import Cookies from 'js-cookie'

const generatePastelColor = () => {
  var letters = '012345'.split('');
    var color = '#';
    color += letters[Math.round(Math.random() * 5)];
    letters = '0123456789ABCDEF'.split('');
    for (var i = 0; i < 5; i++) {
        color += letters[Math.round(Math.random() * 15)];
    }
    return color
}

const watchTyping = _.debounce((e, profile) => {
  window.Echo.private('chat').whisper('typing', {
    user: {
      ...profile,
      typing: true
    }
  });
}, 300)

const ChatRoom = () => {
  const messageBoxRef = React.useRef()
  const messagesBoxRef = React.useRef()
  const [isSendingMessage, setIsSendingMessage] = React.useState(false)
  const [message, setMessage] = React.useState('')
  const [profile, setProfile] = React.useState(null)
  const [messages, setMessages] = React.useState([])
  const [users, setUsers] = React.useState([])
  const [hasNewMessage, setHasNewMessage] = React.useState(false)

  const debounceTyping = e => watchTyping(e, profile)

  const watchWhosTyping = () => {
    Echo.private('chat').listenForWhisper('typing', (e) => {
      setUsers(prev => {

        return prev.map(user => {
          if(user.id === e.user.id){
            return e.user
          }

          return {
            ...user,
            typing: false
          }
        })
      })

      setTimeout(() => {
        setUsers(prev => {

          return prev.map(user => {
            if(user.id === e.user.id){
              return {
                ...user,
                typing: false
              }
            }

            return user
          })
        })
      }, 900);

    })
  }

  const watchGetUsers = async () => {
    const response = await axios.get(`${appConfig.baseUrl}/users`, appConfig.axiosConfig)
    if(response.status === 200){
      await setUsers(response.data.map(user => {
        return {
          ...user,
          color: generatePastelColor()
        }
      }))

      window.Echo.private('user-state')
      .listen('UserState', (e) => {
        setUsers(prev => {
          const isExist = prev.find(x => +x.id === +e.user.id)
          if(isExist)
            return prev.map(user => {
              if(+user.id === +e.user.id){
                return e.user
              }

              return user
            })

          return [
            ...prev,
            {
              ...e.user,
              color: generatePastelColor()
            }
          ]
        })
      });
    }
  }

  const watchGetProfile = async () => {
    const response = await axios.get(`${appConfig.baseUrl}/profile`, appConfig.axiosConfig)
    if(response.status === 200){
      return setProfile(response.data)
    }
    if(response.status === 401){
      return window.location.href = '/'
    }
  }

  const watchFetchMessages = async () => {
    const response = await axios.get(`${appConfig.baseUrl}/messages`, appConfig.axiosConfig)
    if(response.status === 200){
      await setMessages(response.data)
      setTimeout(() => {
        messagesBoxRef.current.scrollTop  = messagesBoxRef.current.scrollHeight
      }, 500)

      window.Echo.private('chat')
      .listen('MessageSent', (e) => {
        setMessages(prev => [
          ...prev,
          e.message
        ])
        setHasNewMessage(true)
      });
    }
  }

  React.useEffect(() => {
    watchGetProfile()
  }, [])

  React.useEffect(() => {
    if(profile){
      watchGetUsers()
      watchFetchMessages()
      watchWhosTyping()
    }
  }, [profile])

  const onHandleSendMessage = async e => {
    e.preventDefault()
    setIsSendingMessage(true)
    const response = await axios.post(`${appConfig.baseUrl}/messages`, {
      message
    }, appConfig.axiosConfig)

    if(response.status === 200){
      await setMessages([
        ...messages,
        {
          user_id: profile.id,
          message
        }
      ])

      await setMessage('')
      await setIsSendingMessage(false)

      messageBoxRef.current.focus()
      setTimeout(() => {
        messagesBoxRef.current.scrollTop  = messagesBoxRef.current.scrollHeight
      }, 500)
    }
  }

  const findUserProfile = (id) => {
    return users.find(user => +user.id === +id) || {}
  }

  const onHandleLogOut = async e => {
    e.preventDefault();
    const response = await axios.post(`${appConfig.baseUrl}/logout`, {}, appConfig.axiosConfig)
    if(response.status === 200){
      Cookies.remove('token')
      window.location.href = '/'
    }
  }

  const scrollToBottom = e => {
    e.preventDefault()
    messagesBoxRef.current.scrollTop  = messagesBoxRef.current.scrollHeight
    setHasNewMessage(false)
  }

  if(!profile){
    return (
      <div className="flex h-screen w-screen">
        <div className="m-auto">
          <svg
            className="w-10 h-10 animate-spin fill-current text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1000 1000"
            xmlSpace="preserve"
          >
            <path d="M669.7 25.7c-10.6-4-22.4 1.5-26.3 12.1-3.9 10.6 1.5 22.4 12.1 26.3C831 129 949 298.4 949 485.6c0 247.6-201.4 449-449 449S51 733.1 51 485.6c0-186.3 117.2-355.3 291.5-420.7 10.6-4 16-15.8 12-26.3-4-10.6-15.9-16-26.4-12C137.8 97.8 10 282.3 10 485.6c0 270.2 219.8 490 490 490s490-219.8 490-490c0-204.3-128.7-389.1-320.3-459.9z" />
          </svg>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen antialiased text-gray-800">
    <div className="flex flex-row h-full w-full overflow-x-hidden">
      <div className="flex flex-col py-8 pl-6 pr-2 w-64 bg-white flex-shrink-0">
        <div className="flex flex-row items-center justify-center h-12 w-full">
          <div
            className="flex items-center justify-center rounded-2xl text-indigo-700 bg-indigo-100 h-10 w-10"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              ></path>
            </svg>
          </div>
          <div className="ml-2 font-bold text-2xl">Chat Room</div>
        </div>
        <div
          className="flex flex-col items-center bg-indigo-100 border border-gray-200 mt-4 w-full py-6 px-4 rounded-lg"
        >
          <div className="text-sm font-semibold mt-2">{profile.name}</div>
          <div className="text-xs text-gray-500">{profile.email}</div>
          <div className="flex flex-row items-center mt-3">
            <div
              className="flex items-center justify-center ml-auto text-xs text-white bg-green-500 h-4 w-4 rounded-full leading-none"
            />
            <div className="leading-none ml-1 text-xs">Active</div>
          </div>
          <button onClick={onHandleLogOut} className="text-xs text-gray-500 mt-5 hover:underline cursor-pointer">Logout</button>
        </div>
        <div className="flex flex-col mt-8">
          <div className="flex flex-row items-center justify-between text-xs">
            <span className="font-bold">Users</span>
            <span
              className="flex items-center justify-center bg-gray-300 h-6 w-6 rounded-full"
              >{users.length}</span
            >
          </div>
          <div className="flex flex-col space-y-1 mt-4 -mx-2 h-full overflow-y-auto">
            {users.map(user => {
              return (
                <button
                  key={`user${user.id}`}
                  className="flex flex-row items-center hover:bg-gray-100 rounded-xl p-2"
                >
                  <div
                    className="flex items-center justify-center h-8 w-8  rounded-full text-white"
                    style={{ backgroundColor: `${user.color}` }}
                  >
                    {user.name[0]}
                  </div>

                  <div className="ml-2 text-sm font-semibold flex item-center space-x-1"><p>{user.name}</p>{user.typing ? <p className="text-xs">typing...</p> : null}</div>
                  {user?.is_active ? <div
                    title="Online"
                    className="flex items-center justify-center ml-auto text-xs text-white bg-green-500 h-4 w-4 rounded-full leading-none"
                  /> : <div
                  title="Offline"
                  className="flex items-center justify-center ml-auto text-xs text-white bg-gray-300 h-4 w-4 rounded-full leading-none"
                />}

                </button>
              )
            })}
          </div>
        </div>
      </div>
      <div className="flex flex-col flex-auto h-full p-6">
        <div
          className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 h-full p-4"
        >
          <div ref={messagesBoxRef} className="flex flex-col h-full overflow-x-auto mb-4 relative">
            <div className="flex flex-col h-full">
              <div className="grid grid-cols-12 gap-y-2">
                {messages.map((message, i) => {
                  const userProfile = findUserProfile(message.user_id)
                  if(+profile.id === +message.user_id){
                    return (
                      <div key={`message${i}`} className="col-start-6 col-end-13 p-3 pr-5 rounded-lg">
                        <div className="flex flex-col items-end justify-end flex-row-reverse">
                          <div
                            className={`flex items-center justify-center flex-shrink-0 text-black whitespace-nowrap drop-shadow-sm`}
                            style={{ color: `${userProfile.color}` }}
                          >
                            {userProfile.name}
                          </div>
                          <div
                            className="relative mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl"
                          >
                            <div>{message.message}</div>
                          </div>
                        </div>
                      </div>
                    )
                  }

                  return (
                    <div key={`message${i}`} className="col-start-1 col-end-8 p-3 rounded-lg">
                      <div className="flex flex-col items-start">
                        <div
                          className="flex items-center justify-center flex-shrink-0 text-black whitespace-nowrap drop-shadow-sm"
                          style={{ color: `${userProfile.color}` }}
                        >
                          {userProfile.name}
                        </div>

                        <div
                          className="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl"
                        >
                          <div >{message.message}</div>
                        </div>
                      </div>
                    </div>
                  )
                })}

              </div>
            </div>
            {hasNewMessage ?
            <button onClick={scrollToBottom} className="mx-auto bg-indigo-100 fixed bottom-32 left-1/2 translate-x-1/2 rounded-lg px-3 font-medium"><p>New messages</p></button> : null}
          </div>
          <form
            onSubmit={onHandleSendMessage}
            className="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4"
          >
            <div className="flex-grow ml-4">
              <div  className="relative w-full">
                <input
                  required
                  onKeyDown={debounceTyping}
                  ref={messageBoxRef}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  type="text"
                  className="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10"
                />
              </div>
            </div>
            <div className="ml-4">

              <button
                disabled={isSendingMessage}
                type="submit"
                className="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white px-4 py-1 flex-shrink-0"
              >
                {isSendingMessage ?
                  <svg
                    className="w-6 h-6 animate-spin fill-current text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 1000 1000"
                    xmlSpace="preserve"
                  >
                    <path d="M669.7 25.7c-10.6-4-22.4 1.5-26.3 12.1-3.9 10.6 1.5 22.4 12.1 26.3C831 129 949 298.4 949 485.6c0 247.6-201.4 449-449 449S51 733.1 51 485.6c0-186.3 117.2-355.3 291.5-420.7 10.6-4 16-15.8 12-26.3-4-10.6-15.9-16-26.4-12C137.8 97.8 10 282.3 10 485.6c0 270.2 219.8 490 490 490s490-219.8 490-490c0-204.3-128.7-389.1-320.3-459.9z" />
                  </svg>
                : null}
                {!isSendingMessage ?
                <React.Fragment>
                  <span>Send</span>
                  <span className="ml-2">
                    <svg
                      className="w-4 h-4 transform rotate-45 -mt-px"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      ></path>
                    </svg>
                  </span>
                </React.Fragment> : null}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  );
}

if (document.getElementById('chat-room')) {
  const root = ReactDOM.createRoot(document.getElementById('chat-room'));
  root.render(<ChatRoom />);
}