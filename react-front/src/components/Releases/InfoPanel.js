import React from 'react';
import ImageSlider from './ImageSlider';

const InfoPanel = (props) => {
  return (
    <>
        <ul className="list-group ">
            <li className="list-group-item"><ImageSlider images={props.releaseData.images}/></li>
            <li className="list-group-item text-center fw-bold"><p className='fw-lighter'>Title</p>{props.releaseData.title}</li>    
            <li className="list-group-item text-center fw-bold"><p className='fw-lighter'>Release Date</p>{props.releaseData.released}</li> 
            <li className="list-group-item text-center fw-bold"><p className='fw-lighter'>Genre</p>{props.releaseData.genres}</li>        
            <li className="list-group-item text-center fw-bold"><p className='fw-lighter'>Style(s)</p>{props.releaseData.styles}</li> 
            <li className="list-group-item text-center fw-bold"><p className='fw-lighter'>Community Rating</p>{props.releaseData.rating}</li> 
        </ul>
    </>
  )
}

export default InfoPanel
