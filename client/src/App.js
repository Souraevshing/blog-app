import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import axios from 'axios'

import Navbar from './Navbar'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import ArticlesPage from './pages/ArticlesPage'
import ArticlesList from './pages/ArticlesList'
import RegisterForm from './pages/RegisterForm'
import LoginForm from './pages/LoginForm'
import Error from './pages/404'

import './App.css'

const App = () => {
  return (
    <>
      <Router>
        <div className='App'>
          <Navbar />
          <div id='page-body'>
            <Routes>
              <Route path='/' element={<HomePage />} />
              <Route path='/about' element={<AboutPage />} />
              <Route path='/articles' element={<ArticlesList />} />
              <Route path='/articles/:articleId' element={<ArticlesPage />} />
              <Route path='/login' element={<LoginForm />} />
              <Route path='/create-account' element={<RegisterForm />} />
              <Route path='*' element={<Error />} />
            </Routes>
          </div>
        </div>
      </Router>
    </>
  )
}

export default App
