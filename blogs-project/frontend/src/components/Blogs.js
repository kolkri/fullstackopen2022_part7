import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { initializeBlogs } from '../reducers/blogReducer'
import { Link } from 'react-router-dom'

const Blogs = () => {

  const blogs = useSelector(state => state.blogs)
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(initializeBlogs())
  }, [])

  return (
    <div>
      {blogs.map(b => (
        <div key={b.id}>
          <Link to={`/blogs/${b.id}`} >{b.title}</Link>
        </div>
      ))}
    </div>
  )

}

export default Blogs

