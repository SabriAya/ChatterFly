import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProfileImage from "../components/ProfileImage";
import { useSelector } from "react-redux";
import axios from "axios";
import TimeAgo from "react-timeago";
import LikeDislikePost from "../components/LikeDislikePost";
import { FaRegCommentDots } from "react-icons/fa";
import { IoMdSend, IoMdShare } from "react-icons/io";
import BookmarksPost from "../components/BookmarksPost";
import PostComment from "../components/PostComment";

const SinglePost = () => {
  const { id } = useParams();
  const [post, setPost] = useState({});
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const token = useSelector((state) => state?.user?.currentUser?.token);

  // GET POST FROM DB
  const getPost = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/posts/${id}`,
        { withCredentials: true, headers: { Authorization: `Bearer ${token}`}}
      );
      setPost(response?.data);
      setComments(response?.data?.comments || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPost();
  }, []);

  // FUNCTION TO CREATE COMMENT
  const createComment = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/comments/${id}`, { comment },
        { withCredentials: true, headers: { Authorization: `Bearer ${token}`}}
      );
      const newComment = response?.data;
      setComments([newComment, ...comments]);
      setComment("");
    } catch (err) {
      console.log(err);
    }
  };

  // FUNCTION TO DELETE A COMMENT
  const deleteComment = async (commentId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/comments/${commentId}`,
        { withCredentials: true, headers: { Authorization: `Bearer ${token}`}}
      );
      setComments(comments?.filter((c) => c?._id !== commentId));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <section className="singlePost">
      <header className="feed__header">
        <ProfileImage image={post?.creator?.profilePhoto} />
        <div className="feed__header-details">
          <h4>{post?.creator?.fullName}</h4>
          <small>
            {post?.createdAt && <TimeAgo date={post.createdAt} />}
          </small>
        </div>
      </header>

      <div className="feed__body">
        <p>{post?.body}</p>
        <div className="feed__images">
          {post?.image && <img src={post?.image} alt="Post" />}
        </div>
      </div>

      <footer className="feed__footer">
        <div>
          {post?.likes && <LikeDislikePost post={post} />}
          <button className="feed__footer-comments">
            <FaRegCommentDots />
          </button>
          <button className="feed__footer-share">
            <IoMdShare />
          </button>
        </div>
        <BookmarksPost post={post} />
      </footer>

      <ul className="singlePost__comments">
        <form
          className="singlePost__comments-form"
          onSubmit={(e) => {
            e.preventDefault();
            createComment();
          }}
        >
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Enter your comment..."
          />
          <button type="submit" className="singlePost__comments-btn">
            <IoMdSend />
          </button>
        </form>

        {comments?.map((comment) => (
          <PostComment
            key={comment?._id}
            comment={comment}
            onDeleteComment={deleteComment}
          />
        ))}
      </ul>
    </section>
  );
};

export default SinglePost;
