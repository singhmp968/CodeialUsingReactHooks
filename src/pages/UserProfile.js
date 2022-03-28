import { useState, useEffect } from 'react';
import { useToasts } from 'react-toast-notifications';
import styles from '../styles/settings.module.css';
import { useAuth } from '../hooks';
import { useParams, useHistory } from 'react-router-dom';
import { addFriend, fetchUserProfile, removeFriend } from '../api';
import { Loader } from '../components';
const UserProfile = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [requestInProgress, setRequestInProgress] = useState(false);
  const { userId } = useParams();
  const { addToast } = useToasts();
  const history = useHistory();
  const auth = useAuth();
  console.log('usedId', userId);
  useEffect(() => {
    const getUser = async () => {
      const response = await fetchUserProfile(userId);
      if (response.success) {
        setUser(response.data.user);
      } else {
        addToast(response.message, {
          appearance: 'error',
        });
        return history.push('/'); // navagating the user to home page
      }
      setLoading(false);
    };
    getUser();
  }, [userId, history, addToast]);
  // const location = console.log('location', location);
  if (loading) {
    return <Loader />;
  }
  const checkIfUserIsAFriend = () => {
    const friends = auth.user.friends;
    console.log('friends', friends);
    const friendsIds = friends.map((friend) => friend.to_user._id);
    const index = friendsIds.indexOf(userId);
    if (index !== -1) {
      return true;
    }
    return false;
  };
  // const showAddFriendsBtn = checkIfUserIsAFriend();
  const handleRemoveFriendClick = async () => {
    setRequestInProgress(true);
    const response = await removeFriend(userId);
    if (response.success) {
      const friendship = auth.user.friends.filter(
        (friend) => friend.to_user._id === userId
      );
      auth.updateUserFriends(false, friendship[0]);
      addToast('friend remove successs fully', {
        appearance: 'success',
      });
    } else {
      addToast(response.message, {
        appearance: 'error',
      });
    }
    setRequestInProgress(false);
  };
  const handleAddFriendClick = async () => {
    setRequestInProgress(true);
    const response = await addFriend(userId);
    if (response.success) {
      const { friendship } = response.data;
      auth.updateUserFriends(true, friendship);
      addToast('friend added successs fully', {
        appearance: 'success',
      });
    } else {
      addToast(response.message, {
        appearance: 'error',
      });
    }
    setRequestInProgress(false);
  };

  return (
    <div className={styles.settings}>
      <div className={styles.imgContainer}>
        <img
          src="https://image.flaticon.com/icons/svg/2154/2154651.svg"
          alt=""
        />
      </div>

      <div className={styles.field}>
        <div className={styles.fieldLabel}>Email</div>
        <div className={styles.fieldValue}>{user.email}</div>
      </div>

      <div className={styles.field}>
        <div className={styles.fieldLabel}>Name</div>

        <div className={styles.fieldValue}>{user.name}</div>
      </div>

      <div className={styles.btnGrp}>
        {checkIfUserIsAFriend() ? (
          <button
            className={`button ${styles.saveBtn}`}
            onClick={handleRemoveFriendClick}
          >
            {requestInProgress ? 'Rmoving Friend ...' : 'Remove friend'}
          </button>
        ) : (
          <button
            className={`button ${styles.saveBtn}`}
            onClick={handleAddFriendClick}
            disabled={requestInProgress}
          >
            {requestInProgress ? 'Ading friend...' : 'Add friend'}
          </button>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
