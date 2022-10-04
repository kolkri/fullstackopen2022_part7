import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import { initializeBlogs, votedblog, addNewComment } from '../reducers/blogReducer'
import { setNotification } from '../reducers/notificationReducer'


const SingleBlog = () => {
  const id = useParams().id
  const dispatch = useDispatch()
  const blogs = useSelector(state => state.blogs)
  const blogToShow = blogs.find(u => u.id === id)
  const [newComment, setNewComment] = useState('')

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [])

  const addComment = async () => {
    const commentObject = {
      text: newComment
    }
    try {
      await dispatch(addNewComment(id, commentObject))
      dispatch(initializeBlogs())
      dispatch(setNotification(`new comment for the blog '${blogToShow.title}' added`, 3))
    } catch(error) {
      dispatch(setNotification(error.response.data.error, 3))
    }
    setNewComment('')
  }

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
      <h4>comments</h4>
      <div>
        <input
          id='comment'
          type='text'
          value={newComment}
          name='comment'
          onChange={(e) => setNewComment(e.target.value)}/>
        <button onClick={addComment}>add comment</button>
      </div>
      <ul>
        {blogToShow.comments.map(c => (
          <li key={c.id}>{c.text}</li>
        ))}
      </ul>
    </div>
  )
}

export default SingleBlog