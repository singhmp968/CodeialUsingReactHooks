import { useContext, useState, useEffect } from 'react';
import jwt from 'jwt-decode';

import { AuthContext } from '../providers/AuthProvider';

import {
  addFriend,
  editProfile,
  fetchUserFriends,
  getPosts,
  login as userLogin,
  register,
} from '../api';
import {
  setItemInLocalStorage,
  LOCALSTORAGE_TOKEN_KEY,
  removeItemFromLocalStorage,
  getItemFromLocalStorage,
} from '../utils';
import { PostsContext, PostsProvider } from '../providers/PostProvider';

export const useAuth = () => {
  return useContext(AuthContext);
};

export const useProvideAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const userToken = getItemFromLocalStorage(LOCALSTORAGE_TOKEN_KEY);

      if (userToken) {
        const user = jwt(userToken);
        let friends = [];
        const response = await fetchUserFriends();
        console.log('called', response);
        if (response.success) {
          friends = response.data.friends;
        }
        console.log('useeeee->', user);
        setUser({
          ...user,
          friends,
        });
        //  setUser(user);
        console.log('useeeee->', user);
      }

      setLoading(false);
    };
    getUser();
  }, []);
  const updateUser = async (userId, name, password, confirmPassword) => {
    const response = await editProfile(userId, name, password, confirmPassword);
    if (response.success) {
      setUser(response.data.user);
      setItemInLocalStorage(
        LOCALSTORAGE_TOKEN_KEY,
        response.data.token ? response.data.token : null
      );
      return {
        success: true,
      };
    } else {
      return {
        success: false,
        message: response.message,
      };
    }
  };
  const login = async (email, password) => {
    const response = await userLogin(email, password);

    if (response.success) {
      setUser(response.data.user);
      setItemInLocalStorage(
        LOCALSTORAGE_TOKEN_KEY,
        response.data.token ? response.data.token : null
      );
      return {
        success: true,
      };
    } else {
      return {
        success: false,
        message: response.message,
      };
    }
  };

  const signup = async (name, email, password, confirmPassword) => {
    const response = await register(name, email, password, confirmPassword);

    if (response.success) {
      return {
        success: true,
      };
    } else {
      return {
        success: false,
        message: response.message,
      };
    }
  };

  const logout = () => {
    setUser(null);
    removeItemFromLocalStorage(LOCALSTORAGE_TOKEN_KEY);
  };
  // creating the state for adding the user as update friends
  const updateUserFriends = (addFriend, friend) => {
    if (addFriend) {
      setUser({
        ...user,
        friends: [...user.friends, friend], // updating user frined
      });
      return;
    }
    // updatig the hooks and updating the friends
    const newFriends = user.friends.filter(
      (f) => f.to_user._id !== friend.to_user._id
    );
    setUser({ ...user, friends: newFriends });
  };
  return {
    user,
    login,
    logout,
    loading,
    signup,
    updateUser,
    updateUserFriends,
  };
};
/*****************post hooks custom******************* */
export const usePosts = () => {
  return useContext(PostsContext);
};

export const useProvidePosts = () => {
  const [posts, setPosts] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await getPosts();

      if (response.success) {
        setPosts(response.data.posts);
      }

      setLoading(false);
    };

    fetchPosts();
  }, []);

  const addPostToState = (post) => {
    const newPost = [post, ...posts];
    setPosts(newPost);
  };

  return {
    data: posts,
    loading,
    addPostToState,
  };
};
