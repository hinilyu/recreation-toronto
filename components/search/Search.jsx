"use client";

import { useEffect, useState } from "react";
import DefaultResult from "./DefaultResult";
import SpecificSearchResult from "./SpecificSearchResult";

const Search = () => {
  const [searchText, setSearchText] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchParams, setSearchParams] = useState({});

  const [isSpecificSearch, setIsSpecificSearch] = useState(false);

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    setSearchTimeout(
      setTimeout(() => {
        setSearchParams({ keyword: e.target.value });
      }, 500)
    );
  };

  useEffect(() => {
    if (searchText !== "") {
      setIsSpecificSearch(true);
    } else {
      setIsSpecificSearch(false);
    }
  }, [searchText]);

  return (
    <section className="mt-3">
      <form className="relative w-full flex-center">
        <input
          type="text"
          placeholder="Find registered or drop-in programs"
          value={searchText}
          onChange={handleSearchChange}
          required
          className="search_input peer"
        />
      </form>
      {/* Default Search Result */}
      {isSpecificSearch ? <SpecificSearchResult searchParams={searchParams} /> : <DefaultResult />}
    </section>
  );
};

export default Search;
