import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import FriendRequest from "./FriendRequest";

const FriendRequests = () => {
  const [friends, setFriends] = useState([]);

  const userId = useSelector((state) => state?.user?.currentUser?.id);
  const token = useSelector((state) => state?.user?.currentUser?.token);

  // GET PEOPLE FROM DB
  const getFriends = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/users`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // ❗FIX: Proper filter return
      const people = response?.data?.filter(
        (person) => !person?.followers?.includes(userId) && person?._id !== userId
      );

      setFriends(people);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getFriends();
  }, []);

  // ❗FIX: Make sure to return filtered list correctly
  const closeFriendBadge = (id) => {
    setFriends((prev) => prev.filter((friend) => friend._id !== id));
  };

  return (
    <menu className="friendRequests">
      <h3>Suggested Friends</h3>
      {friends?.length === 0 ? (
        <p>No suggestions available</p>
      ) : (
        friends.map((friend) => (
          <FriendRequest
            key={friend?._id}
            friend={friend}
            onFilterFriend={closeFriendBadge}
          />
        ))
      )}
    </menu>
  );
};

export default FriendRequests;
