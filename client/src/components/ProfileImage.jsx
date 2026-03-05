import React from 'react';

const ProfileImage = ({ image, className }) => {
  const fallback = "https://res.cloudinary.com/dug7bhxwp/image/upload/v1750089381/default-avatar-profile-icon-social-media-user-vector-49816613_z23kqw.jpg";

  return (
    <div className={`profileImage ${className}`}>
      <img src={image || fallback} alt="Profile" />
    </div>
  );
};

export default ProfileImage;
