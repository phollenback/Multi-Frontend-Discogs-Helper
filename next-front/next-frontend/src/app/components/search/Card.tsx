import React from 'react';
import Image from 'next/image';

// Define a type for the props
interface CardProps {
  thumb: string;
  albumTitle: string;
  onClick: () => void; // A callback function for when the card is clicked
}

const Card: React.FC<CardProps> = ({ thumb, albumTitle, onClick }) => {
  const handleCardClick = () => {
    // Invoke the callback passed through props
    console.log("Card clicked!");
    onClick(); // You can call the parent function that is passed as a prop
  };

  return (
    <div className="max-w-full rounded-lg shadow-lg bg-white mb-8 overflow-hidden">
      <button
        type="button"
        onClick={handleCardClick}
        className="w-full p-4 hover:bg-gray-100 rounded-lg"
      >
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0 w-24 h-24">
            <Image
              src={thumb}
              alt="Thumbnail"
              width={96}  // Set width and height for the image
              height={96}
              className="w-full h-full object-cover rounded-md"
            />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 truncate">{albumTitle}</h3>
          </div>
        </div>
      </button>
    </div>
  );
};

const CardGrid: React.FC<{ cards: Array<CardProps> }> = ({ cards }) => {
  return (
    <div className="grid grid-cols-1 gap-8">
      {cards.map((card, index) => (
        <Card
          key={index}
          thumb={card.thumb}
          albumTitle={card.albumTitle}
          onClick={card.onClick}
        />
      ))}
    </div>
  );
};

export default CardGrid;