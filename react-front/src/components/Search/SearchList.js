import React from 'react';
import Card from './Card'

const SearchList = (props) => {

    const albums = props.releases.map((release) => {
        return (
            <Card
                key={release.id}
                id={release.id}
                albumTitle={release.title}
                thumb={release.thumb}
                year={release.year}
                genre={release.genre}
                style={release.style}
            />
        );
    });
  return (
    <div className="search-list">
      <ul className="list-group">
        {albums}
      </ul>
    </div>
  );
};

export default SearchList;