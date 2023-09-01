import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar/Navbar'
import Verified from './components/Verified/Verified'
import Auth from './pages/Auth/Auth'
import BlogDetails from './pages/Blog/Blog'
import Home from './pages/Home/Home'
import { SetLoader } from './redux/loadersSlice';
import Spinner from './components/Spinner/Spinner'
import CreateBlog from './pages/Create-blog/Create-Blog'
import Collection from './pages/Collection/Collection'
import Saved from './pages/Saved/Saved'
import 'remixicon/fonts/remixicon.css'

function App() {
  const { loading } = useSelector(state => state.loaders)

  return (
    <>
      {loading && <Spinner />}
      <Navbar />
      <Routes>
        <Route exact path='/' element={<Home />} />
        <Route exact path='/auth' element={<Auth />} />
        <Route exact path='/collection' element={<Collection />} />
        <Route exact path='/saved' element={<Saved />} />
        <Route exact path='/blog/:id' element={<BlogDetails />} />
        <Route exact path='/create-blog' element={<CreateBlog />} />
        <Route path='/users/confirm/:token' element={<Verified />} />
      </Routes>
    </>
  )
}

export default App
