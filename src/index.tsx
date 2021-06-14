import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import firebase from 'firebase/app';

firebase.initializeApp({
    apiKey: "AIzaSyAl_RhVK-B42FyfJIisSjNwD51e4VsnsO8",
    authDomain: "quantumjs-9e2ff.firebaseapp.com",
    projectId: "quantumjs-9e2ff",
    storageBucket: "quantumjs-9e2ff.appspot.com",
    messagingSenderId: "1040130958370",
    appId: "1:1040130958370:web:f0caf76eb2fbf13c5b967b"
});

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
