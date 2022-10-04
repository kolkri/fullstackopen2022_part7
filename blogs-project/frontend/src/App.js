import { useState, useEffect } from 'react'
import { setNotification } from './reducers/notificationReducer'
import { initializeBlogs, addblog } from './reducers/blogReducer'
import { putUser, emptyUser } from './reducers/userReducer'
import { useSelector, useDispatch } from 'react-redux'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { Alert, Navbar, Nav } from 'react-bootstrap'



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
  const padding = {
    padding: '10px'
  }
  const dispatch = useDispatch()

  // const [blogs, setBlogs] = useState([])
  // const [showAll, setShowAll] = useState(true)
  // const [errorMessage, setErrorMessage] = useState(null)
  // const blogs = useSelector(state => state.blogs)
  const errorMessage = useSelector(state => state.notification)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState(null)
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
    try {
      const userObject = await loginService.login({
        username,
        password,
      })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(userObject))
      blogService.setToken(userObject.token)
      // setUser(user)
      await dispatch(putUser(userObject))
      setMessage(`welcome ${username}`)
      setTimeout(() => {
        setMessage(null)
        setUsername('')
        setPassword('')
      }, 3000)
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
      <div className="container">
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
    <div className="container">
      {(message &&
        <Alert variant="success">
          {message}
        </Alert>
      )}
      <Router>
        {errorMessage && <Notification message={errorMessage} />}
        <Navbar style={padding} collapseOnSelect expand="lg" bg="dark" variant="dark">
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link href="#" as="span">
                <Link to='/'>blogs</Link>
              </Nav.Link>
              <Nav.Link href="#" as="span">
                <Link to='/users'>users</Link>
              </Nav.Link>
              <Nav.Link href="#" as="span">
                {user.name} logged in{' '}
                <button id='logout-button' onClick={handleLogout}>
                  log out
                </button>
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Togglable buttonLabel='create new blog'>
          <BlogForm createBlog={createBlog}/>
        </Togglable>
        <h3>blog app</h3>
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
