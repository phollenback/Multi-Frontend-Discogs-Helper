import React from 'react';

const Stats = (props) => {
  // Format artists as a string
  const formattedArtists = props.releaseData.artists.map(artist => artist.name).join(', ') || 'N/A';
  
  // Format formats as a string
  const formattedFormats = props.releaseData.formats.map(format => format.name).join(', ') || 'N/A';

  return (
    <table className="table table-striped">
        <thead>
            <tr>
                <th>Number for Sale</th>
                <th>Lowest Price</th>
                <th>Formats</th>
                <th>Artists</th>
                <th>Notes</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>{props.releaseData.numForSale}</td>
                <td>${props.releaseData.lowestPrice}</td>
                <td>{formattedFormats}</td>
                <td>{formattedArtists}</td>
                <td>{props.releaseData.notes}</td>
            </tr>
        </tbody>
    </table>
  );
};

export default Stats;