import { useState, useEffect } from 'react'
import { setNotification } from './reducers/notificationReducer'
import { initializeBlogs, addblog, votedblog } from './reducers/blogReducer'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'

import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

import blogService from './services/blogs'
import loginService from './services/login'




const App = () => {
  const dispatch = useDispatch()

  // const [blogs, setBlogs] = useState([])
  // const [showAll, setShowAll] = useState(true)
  // const [errorMessage, setErrorMessage] = useState(null)
  const blogs = useSelector(state => state.blogs)
  const errorMessage = useSelector(state => state.notification)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)


  useEffect(() => {
    // blogService.getAll().then((blogs) => setBlogs(blogs))
    dispatch(initializeBlogs())
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.Token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username,
        password,
      })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
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
    setUser(null)
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

  const like = async (id, blog) => {
    try {
      // await blogService.update(id, blog)
      dispatch(votedblog(id, blog))
      // setErrorMessage(`new like for ${blog.title} added`)
      // setTimeout(() => {
      //   setErrorMessage(null)
      // }, 5000)
      dispatch(setNotification(`new like for ${blog.title} added`, 3))
      // blogService.getAll().then((blogs) => setBlogs(blogs))
      dispatch(initializeBlogs())
    } catch (error) {
      // setErrorMessage(error.response.data.error)
      // setTimeout(() => {
      //   setErrorMessage(null)
      // }, 5000)
      dispatch(setNotification(error.response.data.error, 3))
    }
  }

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
      <h2>Welcome</h2>
      {errorMessage && <Notification message={errorMessage} />}
      <div>
        {user.name} logged in{' '}
        <button id='logout-button' onClick={handleLogout}>
          log out
        </button>
      </div>
      <Togglable buttonLabel='new blog'>
        <BlogForm createBlog={createBlog}/>
      </Togglable>
      <h2>Blogs</h2>
      {[...blogs]
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            user={user}
            likeCallback={like}
          />
        ))}
    </div>
  )
}

export default App
