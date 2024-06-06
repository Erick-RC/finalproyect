import React, { useContext, useState } from "react";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { DataContext } from "../context/dataContext";
import { Modal } from "./Modal";

export const CurrentWeather = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { unit, temp, description, iconId, todays, location, getCurrentLocation } = useContext(DataContext);

  const handleModal = () => {
    setIsOpen(!isOpen);
  };

  const ICON_URL = `http://openweathermap.org/img/wn/${iconId}@4x.png`;
  const UNIT_SYMBOL = unit === "imperial" ? "℉" : "℃";

  return (
    <section
      className="md:w-[31%] lg:w-[24%] xl:w-[31%] relative h-full p-5"
      style={{ backgroundColor: "#1e213a" }}
    >
      <nav className="w-full flex justify-between mt-[20px]">
        <button
          className="bg-gray-500 text-gray-100 rounded font-display px-[5%] py-[11px] shadow-3xl hover:shadow-inner"
          onClick={handleModal}
        >
          Search For Places
        </button>
        <button
          className="bg-gray-500 rounded-full w-[40px] h-[40px] text-gray-100 shadow-3xl hover:shadow-inner"
          onClick={getCurrentLocation}
        >
          <MyLocationIcon />
        </button>
      </nav>
      <section>
        <img
          src="./public/background.png"
          alt="background"
          className="w-full opacity-5 absolute bg-cover bg-center left-0"
        />
        <img
          src={ICON_URL}
          alt="weather icon"
          className="max-w-[250px] w-full mx-auto"
        />
      </section>
      <main className="flex flex-col items-center justify-around h-[50vh]">
        <div className="font-display font-medium text-gray-100 text-8xl">
          {temp}
          <span className="font-medium text-gray-500 text-5xl">
            {UNIT_SYMBOL}
          </span>
        </div>
        <div className="font-display font-semibold text-4xl text-gray-500 text-center">
          {description}
        </div>
        <p className="font-medium font-display text-lg" style={{ color: "#88869D" }}>
          Today &bull; {todays}
        </p>
        <div className="text-lg font-semibold" style={{ color: "#88869D" }}>
          <LocationOnIcon /> {location}
        </div>
      </main>
      {isOpen && <Modal handleModal={handleModal} />}
    </section>
  );
};

