import React, { useEffect, useState } from "react";
import UserProfile from "../components/UserProfile";
import HeaderInfo from "../components/HeaderInfo";
import { useSelector } from "react-redux";
import axios from "axios";
import { useParams } from "react-router-dom";
import Feed from "../components/Feed";
import EditPostModal from "../components/EditPostModal";
import EditProfileModal from "../components/EditProfileModal";

const Profile = () => {
  const [user, setUser] = useState({});
  const [userPosts, setUserPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { id: userId } = useParams();
  const token = useSelector((state) => state?.user?.currentUser?.token);
  const editPostModalOpen = useSelector((state) => state?.ui?.editPostModalOpen);
  const editProfileModalOpen = useSelector((state) => state?.ui?.editProfileModalOpen);

  // GET USER POSTS
  const getUserPosts = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/${userId}/posts`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUser(data);
      setUserPosts(data?.posts || []);
    } catch (error) {
      console.error("Failed to load user posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUserPosts();
  }, [userId]);

  const deletePost = async (postId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/posts/${postId}`,
        { withCredentials: true, headers: { Authorization: `Bearer ${token}`}}
      );
      setUserPosts((prevPosts) => prevPosts.filter((p) => p?._id !== postId));
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  const updatePost = async (data, postId) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/posts/${postId}`,
        data,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response?.status === 200) {
        const updatedPost = response?.data;
        setUserPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === updatedPost._id
              ? { ...post, body: updatedPost.body, image: updatedPost.image }
              : post
          )
        );
      }
    } catch (error) {
      console.error("Failed to update post:", error);
    }
  };

  return (
    <section>
      <UserProfile />
      <HeaderInfo text={`${user?.fullName}'s posts`} />
      <section className="profile__posts">
        {isLoading ? (
          <p className="center">Loading posts...</p>
        ) : userPosts?.length < 1 ? (
          <p className="center">No posts found for this user</p>
        ) : (
          userPosts.map((post) => (
            <Feed
              key={post._id}
              post={post}
              onDeletePost={deletePost}
              onUpdatePost={updatePost} // ✅ Optional: in case Feed uses it
            />
          ))
        )}
      </section>

      {editPostModalOpen && (<EditPostModal onUpdatePost={updatePost} />)}
      {editProfileModalOpen && (<EditProfileModal />)}
    </section>
  );
};

export default Profile;
