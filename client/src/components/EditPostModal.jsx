import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uiSliceActions } from "../store/uiSlice";

const EditPostModal = ({ onUpdatePost }) => {
  const editPostId = useSelector((state) => state?.ui?.editPostId);
  const token = useSelector((state) => state?.user?.currentUser?.token);
  const [body, setBody] = useState("");
  const dispatch = useDispatch();

  // GET POST TO UPDATE
  const getPost = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/posts/${editPostId}`,
        { withCredentials: true, headers: { Authorization: `Bearer ${token}`}}
      );
      setBody(response?.data?.body || "");
    } catch (error) {
      console.error("Error fetching post for edit:", error);
    }
  };

  useEffect(() => {
    if (editPostId) {
      getPost();
    }
  }, [editPostId]);

  
  const updatePost = async (e) => {
    e.preventDefault();
    const postData = new FormData();
    postData.set("body", body);
    if (onUpdatePost && editPostId) {
      await onUpdatePost(postData, editPostId);
    }
    dispatch(uiSliceActions.closeEditPostModal());
  };

  const closeEditPostModal = (e) => {
    if (e.target.classList.contains("editPost")) {
      dispatch(uiSliceActions.closeEditPostModal());
    }
  };

  return (
    <div className="editPost" onClick={closeEditPostModal}>
      <form className="editPost__container" onSubmit={updatePost}>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="What's on your mind?"
          autoFocus
        />
        <button type="submit" className="btn primary">
          Update Post
        </button>
      </form>
    </div>
  );
};

export default EditPostModal;
