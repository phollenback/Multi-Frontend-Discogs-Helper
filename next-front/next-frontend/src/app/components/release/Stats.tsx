import React from 'react';

interface Artist {
  name: string;
}

interface Format {
  name: string;
}

interface ReleaseData {
  numForSale: number;
  lowestPrice: number;
  formats: Format[];
  artists: Artist[];
  notes: string;
}

interface StatsProps {
  releaseData: ReleaseData;
}

const Stats: React.FC<StatsProps> = ({ releaseData }) => {
  // Format artists as a string
  const formattedArtists = releaseData.artists
    .map((artist) => artist.name)
    .join(', ') || 'N/A';

  // Format formats as a string
  const formattedFormats = releaseData.formats
    .map((format) => format.name)
    .join(', ') || 'N/A';

  return (
    <table className="w-full table-auto border border-gray-300 rounded-lg shadow-md">
      <thead className="bg-gray-100">
        <tr>
          <th className="border px-4 py-2">Number for Sale</th>
          <th className="border px-4 py-2">Lowest Price</th>
          <th className="border px-4 py-2">Formats</th>
          <th className="border px-4 py-2">Artists</th>
          <th className="border px-4 py-2">Notes</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="border px-4 py-2 text-center">{releaseData.numForSale}</td>
          <td className="border px-4 py-2 text-center">
            ${releaseData.lowestPrice.toFixed(2)}
          </td>
          <td className="border px-4 py-2">{formattedFormats}</td>
          <td className="border px-4 py-2">{formattedArtists}</td>
          <td className="border px-4 py-2">{releaseData.notes}</td>
        </tr>
      </tbody>
    </table>
  );
};

export default Stats;