import React from "react";
import SearchIcon from "@mui/icons-material/Search";

const SearchBar = ({ searchTerm, onSearchChange }) => {
  return (
    <section className="search_section">
      <div className="search_input_div relative">
        <input
          type="text"
          className="search_input w-full border px-4 py-2 rounded"
          placeholder="Search by location..."
          autoComplete="off"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <div className="search_icon absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500">
          <SearchIcon />
        </div>
      </div>
    </section>
  );
};

export default SearchBar;