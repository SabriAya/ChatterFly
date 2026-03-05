import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { LuUpload } from "react-icons/lu";
import { FaCheck } from "react-icons/fa";
import { uiSliceActions } from "../store/uiSlice";

const UserProfile = () => {
  const token = useSelector((state) => state?.user?.currentUser?.token);
  const loggedInUserId = useSelector((state) => state?.user?.currentUser?.id);

  const [user, setUser] = useState({});
  const [followsUser, setFollowsUser] = useState(user?.followers?.includes(loggedInUserId));
  const [avatar, setAvatar] = useState(user?.profilePhoto);
  const { id: userId } = useParams();
  const [avatarTouched, setAvatarTouched] = useState(false);
  const dispatch = useDispatch();

  // GET USER FROM DB
  const getUser = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/${userId}`,
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(response?.data);
      setFollowsUser(response?.data?.followers?.includes(loggedInUserId));
      setAvatar(response?.data?.profilePhoto);
    } catch (error) {
      console.log(error);
    }
  };

  // FUNCTION TO CHANGE AVATAR
  const changeAvatarHandler = async (e) => {
  e.preventDefault();
  if (!avatar) return;

  const formData = new FormData();
  formData.append("avatar", avatar);

  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/users/avatar`,
      formData,
      { withCredentials: true, headers: { Authorization: `Bearer ${token}`}}
    );

    console.log("Avatar upload success:", res.data);
    await getUser(); // reload updated user
    setAvatarTouched(false);
  } catch (error) {
    console.error("Avatar upload failed:", error.response?.data || error);
  }
};

  // FUNCTION TO OPEN "EDIT PROFILE" MODAL
  const openEditProfileModal = () => {
    dispatch(uiSliceActions.openEditProfileModal())
  };

  const followUnfollowUser = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/${userId}/follow-unfollow`,
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
      );
      setFollowsUser(response?.data?.followers?.includes(loggedInUserId));
    } catch (error) {
      console.log(error)
    }
  };

  useEffect(() => {
    getUser();
  }, [userId, followsUser, avatar]);

  return (
    <section className="profile">
      <div className="profile__container">
        <form
          className="profile__image"
          onSubmit={changeAvatarHandler}
          encType="multipart/form-data"
        >
          <img src={user?.profilePhoto} alt="Profile" />

          {!avatarTouched ? (
            <label htmlFor="avatar" className="profile__image-edit">
              <LuUpload />
            </label>
          ) : (
            <button type="submit" className="profile__image-btn">
              <FaCheck />
            </button>
          )}

          <input
            type="file"
            id="avatar"
            accept="png, jpg, jpeg"
            onChange={(e) => {
              setAvatar(e.target.files[0]);
              setAvatarTouched(true);
            }}
          />
        </form>
        <h4>{user?.fullName}</h4>
        <small>{user?.email}</small>
        <ul className="profile__follows">
          <li>
            <h4>{user?.following?.length}</h4>
            <small>Followings</small>
          </li>
          <li>
            <h4>{user?.followers?.length}</h4>
            <small>Followers</small>
          </li>
          <li>
            <h4>0</h4>
            <small>Likes</small>
          </li>
        </ul>
        <div className="profile__actions-wrapper">
          {user?._id == loggedInUserId ? (
            <button className="btn" onClick={openEditProfileModal}>
              Edit Profile
            </button>
          ) : (
            <button onClick={followUnfollowUser} className="btn dark">
              {followsUser ? "Unfollow" : "Follow"}
            </button>
          )}
          {user?._id != loggedInUserId && (
            <Link to={`/messages/${user?._id}`} className="btn default">
              Message
            </Link>
          )}
        </div>
        <article className="profile__bio">
          <p>{user?.bio}</p>
        </article>
      </div>
    </section>
  );
};

export default UserProfile;
