import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { userActions } from '../store/userSlice'


const Logout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(userActions.changeCurrentUser({}));
    localStorage.setItem("currentUser", null);
    navigate('/login')
  }, [])

  return (
    <div>Logout</div>
  )
}

export default Logout