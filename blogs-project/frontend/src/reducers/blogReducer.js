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
    }
  },
})

export const { vote, appendBlog, setBlogs } = blogSlice.actions
export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
  }
}
export const addblog = (content) => {
  return async dispatch => {
    const newblog =  await blogService.create(content)
    console.log('newBlog', newblog)
    dispatch(appendBlog(newblog))
  }
}
export const votedblog = id => {
  return async dispatch => {
    await blogService.updateOne(id)
    dispatch(vote(id))
  }
}
export default blogSlice.reducer