import PropTypes from 'prop-types'
import { Form, Button } from 'react-bootstrap'

const LoginForm = ({
  handleLogin,
  username,
  setUsername,
  password,
  setPassword,
}) => {
  const margin = {
    margin: '10px 0'
  }
  return (
    <Form onSubmit={handleLogin}>
      <Form.Group>
        <Form.Label>
          username:
        </Form.Label>
        <Form.Control
          id='username'
          type='text'
          value={username}
          name='Username'
          onChange={({ target }) => setUsername(target.value)}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>
          password:
        </Form.Label>
        <Form.Control
          id='password'
          type='password'
          value={password}
          name='Password'
          onChange={({ target }) => setPassword(target.value)}
        />
      </Form.Group>
      <Button style={margin} id='login-Button' type='submit'>
        login
      </Button>
    </Form>
  )
}

LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired,
  setUsername: PropTypes.func.isRequired,
  setPassword: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
}

export default LoginForm
