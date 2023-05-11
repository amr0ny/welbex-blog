import React, { useState, useEffect } from 'react';
import Post from './Post';
import { Pagination } from 'react-bootstrap';
import { Field } from './Field';

function Feed() {
  const [currentPage, setCurrentPage] = useState(1);
  const [postsAmount, setPostsAmount] = useState(0);
  const [posts, setPosts] = useState([]);
  const [changed, setChanged] = useState(false);

  const postsPerPage = 20;
  useEffect(() => {
    fetch(`http://127.0.0.1:3010/api/posts?limit=${postsPerPage}&offset=${(currentPage-1)*postsPerPage}`)
      .then(response => response.json())
      .then(data => {
        setPosts(data.posts);
        setPostsAmount(data.count);
      })
      .catch(error => console.error(error.message));
  }, [currentPage, changed]);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const pageItems = [];
  for (let i = 1; i <= Math.ceil(postsAmount / postsPerPage); i++) {
    pageItems.push(
      <Pagination.Item key={i} active={i === currentPage} onClick={() => paginate(i)}>
        {i}
      </Pagination.Item>
    );
  }
  return (
    <div>
        <div style={{ margin: '0 auto', width: '50%' }}>
            <Field onChange={()=>setChanged(!changed)}/>
            {posts.map((post, index) => (
                <Post key={index} post_id={post.post_id} username={post.name} message={post.message} timestamp={post.timestamp}/>
            ))}
        <Pagination>{pageItems}</Pagination>
        </div>
    </div>
  );
}

export default Feed;