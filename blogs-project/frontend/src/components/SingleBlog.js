import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { initializeBlogs, votedblog } from '../reducers/blogReducer'
import { setNotification } from '../reducers/notificationReducer'


const SingleBlog = () => {
  const id = useParams().id
  const dispatch = useDispatch()
  const blogs = useSelector(state => state.blogs)
  const blogToShow = blogs.find(u => u.id === id)

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [])

  const like = async () => {
    try {
      const blogToUpdate = {
        user: blogToShow.user.id,
        likes: blogToShow.likes + 1,
        author: blogToShow.author,
        title: blogToShow.title,
        url: blogToShow.url,
      }
      await dispatch(votedblog(id, blogToUpdate))
      dispatch(setNotification(`new like for ${blogToShow.title} added`, 3))
      dispatch(initializeBlogs())
    } catch (error) {
      dispatch(setNotification(error.response.data.error, 3))
    }
  }

  if(!blogToShow){
    return null
  }
  return(
    <div>
      <h2>{blogToShow.title}</h2>
      <a href='https://www.google.com/'>{blogToShow.url}</a>
      <div>{blogToShow.likes} likes<button onClick={like}>like</button></div>
      <div>added by {blogToShow.user.name}</div>
    </div>
  )
}

export default SingleBlog