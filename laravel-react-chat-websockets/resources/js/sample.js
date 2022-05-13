import React from 'react';
import ReactDOM from 'react-dom';

const Login = () => {



  return (
    <div className="w-screen h-screen flex">
      welcome
    </div>
  );
}

if(document.getElementById('chat-login-form')) {
  ReactDOM.render(<Login />, document.getElementById('chat-login-form'));
}