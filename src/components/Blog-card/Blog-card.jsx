import React from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import './Blog-card.css'
const Blogcard = ({ blog }) => {
  const { user } = useSelector((state) => state.users);
  return (
    <div className="card">
      <Link to={`/blog/${blog?.blogid || blog?._id}`}>
        <div className="card-header">
          <img
            // src="https://cdn.pixabay.com/photo/2017/08/30/12/45/girl-2696947_1280.jpg"
            src={blog?.imageUrl}
            width={500}
            height={500}
            alt="Picture of the author" />
        </div>
      </Link>
      <div className="card-body">
        <span className="tag tag-teal">
          {blog?.category}
          {/* Technology */}
        </span>
        <h4>
          {/* Title */}
          {blog?.title}
        </h4>
        <p>
          {/* Desc. */}
          {blog?.desc}
        </p>
        <div className="user">
          <img
            // src="https://cdn.pixabay.com/photo/2017/11/29/09/15/paint-2985569_1280.jpg"
            src={user?.profilePic}
            alt="user" />
          <div className="user-info">
            <h5>
              {/* Lorem Devi */}
              {user?.username}
            </h5>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Blogcard;
