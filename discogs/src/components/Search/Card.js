import React from 'react';
import {useNavigate} from 'react-router-dom';

const Card = (props) => {

    const navigate = useNavigate();
    const handleCardClick = () => {
        navigate(`/release/${props.id}`)
    }
  return (
    <div className="card w-100 m-1"> 
        <button type='button' onClick={handleCardClick}>
            <div className='row'>
                <div className='col'>
                   <img src={props.thumb} alt='heyoooo' className='img-thumbnail rounded d-block'></img>
                </div>
                <div className='col'>
                    <b>{props.albumTitle}</b>
                </div>
            </div>
        </button>
    </div>
  )
}

export default Card;
