import { Comment, CreatePost, FriendsList, Loader, Post } from '../components';
// import { getPosts } from '../api';
import styles from '../styles/home.module.css';
import { Link } from 'react-router-dom';
import { useAuth, usePosts } from '../hooks';

const Home = () => {
  const auth = useAuth();
  const posts = usePosts();
  if (posts.loading) {
    return <Loader />;
  }
  console.log('posts', posts);
  return (
    <div className={styles.home}>
      <div className={styles.postsList}>
        <CreatePost />

        {posts.data.map((post) => (
          <Post post={post} key={`post-${post._id}`} />
        ))}
      </div>
      {auth.user && <FriendsList />}
    </div>
  );
};

export default Home;
