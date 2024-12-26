import React, { useState } from 'react';

// Define the type for props
interface SearchFormProps {
  setSearchTerm: (term: string) => void;  // setSearchTerm is a function that accepts a string
}

const SearchForm: React.FC<SearchFormProps> = ({ setSearchTerm }) => {
  const [searchKey, setSearchKey] = useState<string>("");

  // Handle input change, event is of type React.ChangeEvent<HTMLInputElement>
  const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchKey(value);
  };

  // Handle form submission, event is of type React.FormEvent<HTMLFormElement>
  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearchTerm(searchKey);  // Pass the search key to the parent component
  };

  return (
    <div className="search-form flex gap-4 justify-center items-center">
      <form onSubmit={handleFormSubmit} className="w-full flex gap-4">
        <input
          type="text"
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchKey}
          placeholder="Enter search term"
          onChange={handleChangeInput}
        />
        <button
          type="submit"
          className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchForm;