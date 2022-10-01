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
    }
  }
})

export const { vote, appendBlog, setBlogs, deleteBlog } = blogSlice.actions
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
export default blogSlice.reducer