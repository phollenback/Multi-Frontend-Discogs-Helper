import React from 'react';
import { useAuthContext } from '../../AuthContext';
import { useNavigate  } from 'react-router-dom';



const HomeScreen = () => {
  const { logout } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  }
  const handleSearchClick = () => {
    navigate('/search')
  }
  return (
    <div>
      Home!
      <button onClick={handleLogout} className='btn btn-warning col-1'>Logout</button>
      <button onClick={handleSearchClick} className='btn btn-warning col-1'>Search</button>

    </div>
  )
}

export default HomeScreen
