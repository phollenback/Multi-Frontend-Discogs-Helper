import React from 'react';
import {Link} from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <Link to='/home' className="navbar-brand">Discogs-Helper</Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
            <li className="nav-item active">
                <Link to='/search' className="nav-link">Search</Link>
            </li>
            <li className="nav-item">
            <Link to='/collection' className="nav-link">Collection</Link>
            </li>
            <li className="nav-item">
                <Link to='/wantlist' className="nav-link">Wantlist</Link>
            </li>   
            </ul>
        </div>
    </nav>
  )
}

export default Navbar
