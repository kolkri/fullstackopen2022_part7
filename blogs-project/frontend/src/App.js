import { useState, useEffect } from 'react'
import { setNotification } from './reducers/notificationReducer'
import { initializeBlogs, addblog } from './reducers/blogReducer'
import { putUser, emptyUser } from './reducers/userReducer'
import { useSelector, useDispatch } from 'react-redux'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'



// import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import Users from './components/Users'
import SingleBlog from './components/SingleBlog'
import Blogs from './components/Blogs'

import blogService from './services/blogs'
import loginService from './services/login'
import SingleUser from './components/SingleUser'




const App = () => {
  const dispatch = useDispatch()

  // const [blogs, setBlogs] = useState([])
  // const [showAll, setShowAll] = useState(true)
  // const [errorMessage, setErrorMessage] = useState(null)
  // const blogs = useSelector(state => state.blogs)
  const errorMessage = useSelector(state => state.notification)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  // const [user, setUser] = useState(null)
  const user = useSelector(state => state.user)


  useEffect(() => {
    // blogService.getAll().then((blogs) => setBlogs(blogs))
    dispatch(initializeBlogs())
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const userObject = JSON.parse(loggedUserJSON)
      // setUser(user)
      dispatch(putUser(userObject))
      blogService.setToken(user.Token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('states', username, password)
    try {
      const userObject = await loginService.login({
        username,
        password,
      })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(userObject))
      blogService.setToken(userObject.token)
      // setUser(user)
      dispatch(putUser(userObject))
      setUsername('')
      setPassword('')
    } catch (error) {
      // setErrorMessage(error.response.data.error)
      // setTimeout(() => {
      //   setErrorMessage(null)
      // }, 5000)
      dispatch(setNotification(error.response.data.error, 3))
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    window.localStorage.clear()
    // setUser(null)
    dispatch(emptyUser())
  }

  const createBlog = async (blogObject) => {
    try {
      blogService.setToken(user.token)
      // const returnedBlog = await blogService.create(blogObject)
      // setBlogs(blogs.concat(returnedBlog))
      await dispatch(addblog(blogObject))
      dispatch(initializeBlogs())

      // setErrorMessage(
      //   `a new blog ${blogObject.title} by ${blogObject.author} added`
      // )
      // setTimeout(() => {
      //   setErrorMessage(null)
      // }, 5000)
      dispatch(setNotification(`a new blog ${blogObject.title} by ${blogObject.author} added`, 3))
      // blogService.getAll().then((blogs) => setBlogs(blogs))
    } catch (error) {
      // setErrorMessage(error.response.data.error)
      // setTimeout(() => {
      //   setErrorMessage(null)
      // }, 5000)
      dispatch(setNotification(error.response.data.error, 3))
    }
  }

  // const like = async (id, blog) => {
  //   try {
  //     // await blogService.update(id, blog)
  //     await dispatch(votedblog(id, blog))
  //     // setErrorMessage(`new like for ${blog.title} added`)
  //     // setTimeout(() => {
  //     //   setErrorMessage(null)
  //     // }, 5000)
  //     dispatch(setNotification(`new like for ${blog.title} added`, 3))
  //     // blogService.getAll().then((blogs) => setBlogs(blogs))
  //     dispatch(initializeBlogs())
  //   } catch (error) {
  //     // setErrorMessage(error.response.data.error)
  //     // setTimeout(() => {
  //     //   setErrorMessage(null)
  //     // }, 5000)
  //     dispatch(setNotification(error.response.data.error, 3))
  //   }
  // }

  if (user === null)
    return (
      <div>
        <h2>Log in to application</h2>
        {errorMessage && <Notification message={errorMessage} />}
        <Togglable buttonLabel='login'>
          <LoginForm
            handleLogin={handleLogin}
            username={username}
            setUsername={setUsername}
            password={password}
            setPassword={setPassword}
          />
        </Togglable>
      </div>
    )

  return (
    <div>
      <Router>
        {errorMessage && <Notification message={errorMessage} />}
        <div>
          <Link to='/'>blogs</Link>
          <Link to='/users'>users</Link>
          {user.name} logged in{' '}
          <button id='logout-button' onClick={handleLogout}>
            log out
          </button>
        </div>
        <Togglable buttonLabel='new blog'>
          <BlogForm createBlog={createBlog}/>
        </Togglable>
        {/* <h2>Blogs</h2>
        {[...blogs]
          .sort((a, b) => b.likes - a.likes)
          .map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              user={user}
              likeCallback={like}
            />
          )
          )
        } */}
        <Routes>
          <Route path='/' element={<Blogs />} />
          <Route path='/users' element={<Users />} />
          <Route path="/users/:id" element={<SingleUser />} />
          <Route path="/blogs/:id" element={<SingleBlog />} />
        </Routes >
      </Router>
    </div>
  )
}

export default App
