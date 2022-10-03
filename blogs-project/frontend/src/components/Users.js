
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { putUsers } from '../reducers/usersReducer'
import { Link } from 'react-router-dom'



const User = () => {
  const dispatch = useDispatch()
  const users = useSelector(state => state.users)

  useEffect(() => {
    dispatch(putUsers())
  }, [])

  if(users.length !== 0) {
    return (
      <div>
        <h2>Users</h2>
        <table>
          <thead>
            <tr>
              <th></th>
              <th>blogs created</th>
            </tr>
          </thead>
          <tbody>
            {[...users]
              .map(u => (
                <tr key={u.id}>
                  <td><Link to={`/users/${u.id}`}>{u.name}</Link></td>
                  <td>{u.blogs.length}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    )
  }

}

export default User