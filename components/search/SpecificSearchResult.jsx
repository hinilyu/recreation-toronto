import React from "react";

const SpecificSearchResult = ({ searchParams }) => {
  return (
    <div>
      <div className="mt-5 font-semibold text-lg">Showing Results for {searchParams.keyword}</div>
    </div>
  );
};

export default SpecificSearchResult;
