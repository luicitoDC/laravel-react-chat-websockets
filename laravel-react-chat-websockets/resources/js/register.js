import React from 'react';
import * as ReactDOM from 'react-dom/client';
import appConfig from './config';

const Register = () => {
  const [notification, setNotification] = React.useState(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const [formData, setFormData] = React.useState({
    email: '',
    password: '',
    name: '',
    password_confirmation: ''
  })

  const onChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const onHandleSubmit = async e => {
    e.preventDefault()
    setIsLoading(true)
    const response = await axios.post(`${appConfig.baseUrl}/register`, formData, appConfig.axiosConfig)
    setIsLoading(false)
    if(response.status === 201){
      document.cookie = `token=${response.data.access_token}`;
      setFormData({
        email: '',
        password: '',
        name: '',
        password_confirmation: ''
      })
      setNotification({
        'success': 'Successfully registered!'
      })
    }
    if(response.status === 422){
      setNotification(response.data)
    }

  }

  return (
    <div className="w-screen h-screen flex bg-indigo-100">
      <div className="flex items-center justify-center m-auto">
        <div className="w-full w-96">
          <form onSubmit={onHandleSubmit} className="bg-white shadow-lg rounded px-12 pt-6 pb-8 mb-4">
            <div
              className="text-gray-800 text-2xl flex justify-center items-center border-b-2 py-2 mb-4 space-x-2"
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
            <p className="font-bold text-blue-500">Chat Register</p>
            </div>
            <p className="text-xs text-green-500">{notification?.['success'] || null }</p>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-normal mb-2"
                htmlFor="username"
              >
                Email
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                name="email"
                v-model="form.email"
                type="email"
                autoFocus
                placeholder="Email"
                onChange={onChange}
                value={formData.email}
              />
              <p className="text-xs text-red-500">{notification?.['email'] || null }</p>
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-normal mb-2"
                htmlFor="username"
              >
                Name
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                name="name"
                v-model="form.name"
                type="name"
                autoFocus
                placeholder="Name"
                onChange={onChange}
                value={formData.name}
              />
              <p className="text-xs text-red-500">{notification?.['name'] || null }</p>
            </div>
            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-normal mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                v-model="form.password"
                type="password"
                placeholder="Password"
                name="password"
                autoComplete="current-password"
                onChange={onChange}
                value={formData.password}
              />
              <p className="text-xs text-red-500">{notification?.['password'] || null }</p>
            </div>
            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-normal mb-2"
                htmlFor="password_confirmation"
              >
                Confirm Password
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                v-model="form.password_confirmation"
                type="password"
                placeholder="password_confirmation"
                name="password_confirmation"
                autoComplete="current-password"
                onChange={onChange}
                value={formData.password_confirmation}
              />
              <p className="text-xs text-red-500">{notification?.['password_confirmation'] || null }</p>
            </div>
            <div className="flex items-center justify-between">
              <button className="px-4 py-2 rounded text-white inline-block shadow-lg bg-blue-500 hover:bg-blue-600 focus:bg-blue-700" type="submit">
                {isLoading ?
                    <svg
                      className="w-6 h-6 animate-spin fill-current text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 1000 1000"
                      xmlSpace="preserve"
                    >
                      <path d="M669.7 25.7c-10.6-4-22.4 1.5-26.3 12.1-3.9 10.6 1.5 22.4 12.1 26.3C831 129 949 298.4 949 485.6c0 247.6-201.4 449-449 449S51 733.1 51 485.6c0-186.3 117.2-355.3 291.5-420.7 10.6-4 16-15.8 12-26.3-4-10.6-15.9-16-26.4-12C137.8 97.8 10 282.3 10 485.6c0 270.2 219.8 490 490 490s490-219.8 490-490c0-204.3-128.7-389.1-320.3-459.9z" />
                    </svg>
                  : null}
                  {!isLoading ? 'Submit' : null}
              </button>
              <a
                className="inline-block align-baseline font-normal text-sm text-blue-500 hover:text-blue-800"
                href="/"
              >
                Sign In
              </a>
            </div>
          </form>
          <p className="text-center text-gray-500 text-xs">
            &copy;2022 Project. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

if (document.getElementById('chat-register-form')) {
  const root = ReactDOM.createRoot(document.getElementById('chat-register-form'));
  root.render(<Register />);
}