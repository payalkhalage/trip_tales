import React from "react";
import SearchIcon from "@mui/icons-material/Search";

const SearchBar = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="tt-search-container">
      <div className="tt-search-input-wrapper">
        <div className="tt-search-icon">
          <SearchIcon />
        </div>
        <input
          type="text"
          className="tt-search-input"
          placeholder="Search by location..."
          autoComplete="off"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default SearchBar;