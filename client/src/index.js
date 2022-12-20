import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'

// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCm0fN6mPOLDpzGAVRsFgqI_-Av2ItxZ-U',
  authDomain: 'blog-app-93c3c.firebaseapp.com',
  projectId: 'blog-app-93c3c',
  storageBucket: 'blog-app-93c3c.appspot.com',
  messagingSenderId: '551589239202',
  appId: '1:551589239202:web:be21292afd8768dc67fafb',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
