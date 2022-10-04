
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { putUsers } from '../reducers/usersReducer'
import { Link } from 'react-router-dom'
import { Table } from 'react-bootstrap'



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
        <Table striped>
          <tbody>
            <tr>
              <th>User</th>
              <th>Blogs created</th>
            </tr>
            {[...users]
              .map(u => (
                <tr key={u.id}>
                  <td><Link to={`/users/${u.id}`}>{u.name}</Link></td>
                  <td>{u.blogs.length}</td>
                </tr>
              ))}
          </tbody>
        </Table>
      </div>
    )
  }

}

export default User