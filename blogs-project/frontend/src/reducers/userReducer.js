import { createSlice } from '@reduxjs/toolkit'


const userSlice = createSlice({
  name: 'user',
  initialState: [],
  reducers: {
    setUser(state, action) {
      return action.payload
    },
    removeUser(state, action) {
      return action.payload
    }
  }
})

export const { setUser, removeUser } = userSlice.actions

export const putUser = userObject => {
  return async dispatch => {
    dispatch(setUser(userObject))
  }
}

export const emptyUser = () => {
  return async dispatch => {
    dispatch(removeUser(null))
  }
}

export default userSlice.reducer