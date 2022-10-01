import { createSlice } from '@reduxjs/toolkit'

const initialState = null
let timeoutID = null

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    showNotification(state, action) {
      if(timeoutID){
        clearTimeout(timeoutID)
      }
      return action.payload
    }
  }
})

export const { showNotification } = notificationSlice.actions
export const setNotification = (message, duration) => dispatch => {
  dispatch(showNotification(message))
  timeoutID = setTimeout(() => {
    dispatch(showNotification(null))
  }, duration*1000)
}


export default notificationSlice.reducer