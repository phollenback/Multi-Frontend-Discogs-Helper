import React from 'react'

const Tracks = ({ tracklist }) => {
    const tracklisting = tracklist.map((track) => {
        return (
            <li className="list-group-item">
                <div className='row'>
                    <div className='col-2'>
                        <h6>{track.position}</h6>
                    </div>
                    <div className='col-10'>
                        <h5>{track.title}</h5>
                    </div>
                </div>
                

            </li>

        );
    });
  return (
    <>
        <ul className="list-group list-group-flush">
            {tracklisting}
        </ul>
    </>
  )
}

export default Tracks
