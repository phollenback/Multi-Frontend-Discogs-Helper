import React, { useState } from 'react';

const SearchForm = ({ setSearchTerm }) => {
  const [searchKey, setSearchKey] = useState("");

  const handleChangeInput = (event) => {
    const value = event.target.value;
    setSearchKey(value);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    setSearchTerm(searchKey);
    console.log("Form submitted with search term:", searchKey); 
  };

  return (
    <div className="search-form row g-3">
      <div className="form-group col">
        <input
          type="text"
          className="form-control"
          value={searchKey}
          placeholder="Enter search term"
          onChange={handleChangeInput}  // Log each time input changes
        />
      </div>
      <form className='col' onSubmit={handleFormSubmit}>
        <button type='submit' className='btn btn-success col-2'>Search</button>
      </form>
    </div>
  );
};

export default SearchForm;