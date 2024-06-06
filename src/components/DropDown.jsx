import React, { useContext } from "react";
import { DataContext } from "../context/dataContext";

export const DropDown = ({ results, handleModal }) => {
  const { setLocation } = useContext(DataContext);

  const handleSelect = (option) => {
    setLocation(option.name);
    handleModal();
  };

  return (
    <div className="mt-2 py-2 w-full bg-white rounded-lg shadow-xl">
      {results?.map((option, index) => (
        <button
          className="block px-4 py-2 text-gray-800 hover:bg-indigo-600 hover:text-white w-full text-left"
          key={index}
          onClick={() => handleSelect(option)}
        >
          {`${option.name}, ${option.state}`}
        </button>
      ))}
    </div>
  );
};
