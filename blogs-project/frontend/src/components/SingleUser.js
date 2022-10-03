import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { putUsers } from '../reducers/usersReducer'

const SingleUser = () => {
  const id = useParams().id
  const dispatch = useDispatch()
  const users = useSelector(state => state.users)
  const userToShow = users.find(u => u.id === id)

  useEffect(() => {
    dispatch(putUsers())
  }, [])


  if(!userToShow){
    return null
  }
  return(
    <div>
      <h2>{userToShow.name}</h2>
      <h3>added blogs</h3>
      <ul>
        {userToShow.blogs.map(b => (
          <li key={b.id}>{b.title}</li>
        ))}
      </ul>
    </div>
  )
}

export default SingleUser