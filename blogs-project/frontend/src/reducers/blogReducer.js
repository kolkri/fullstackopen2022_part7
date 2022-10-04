import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    vote(state, action) {
      const id = action.payload
      const blogToChange = state.find(b => b.id === id)
      const changedBlog = {
        ...blogToChange,
        likes: blogToChange.likes + 1
      }
      return state.map(b => b.id !== id ? b : changedBlog)
    },
    appendBlog(state, action) {
      state.push(action.payload)
    },
    setBlogs(state, action) {
      return action.payload
    },
    deleteBlog(state, action) {
      return state.filter(blog => blog.id !== action.payload.id)
    },
    comment(state, action) {
      const { id, addedComment } = action.payload
      const blogToUpdate = state.find(b => b.id === id)
      const updatedBlog = {
        ...blogToUpdate,
        comments: blogToUpdate.comments.concat(addedComment)
      }
      return state.map(b => b.id !== id ? b : updatedBlog)
    }
  }
})

export const { vote, appendBlog, setBlogs, deleteBlog, comment } = blogSlice.actions
export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
  }
}
export const addblog = (content) => {
  return async dispatch => {
    const newblog =  await blogService.create(content)
    dispatch(appendBlog(newblog))
  }
}
export const votedblog = (id, blog) => {
  return async dispatch => {
    await blogService.updateOne(id, blog)
    dispatch(vote(id))
  }
}
export const removeB = (blog) => {
  return async dispatch => {
    await blogService.remove(blog.id)
    dispatch(deleteBlog(blog))
  }
}
export const addNewComment = (id, newComment) => {
  return async dispatch => {
    const addedComment = await blogService.addComment(id, newComment)
    dispatch(comment({ id, addedComment }))
  }
}
export default blogSlice.reducer