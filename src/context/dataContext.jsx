import React, { createContext, useState, useEffect, useMemo } from "react";

export const DataContext = createContext(null);

const API_KEY = "969abeac77cc739597db7e76a82eb5e8";

export const DataContextProvider = ({ children }) => {
  const [unit, setUnit] = useState("metric");
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  const [weatherData, setWeatherData] = useState({
    temp: 0, description: "", iconId: "", windStatus: "", windDegree: "", windDirection: "",
    visibility: "", humidity: "", airPressure: "", todays: ""
  });
  const [list, setList] = useState([]);
  const [location, setLocation] = useState("New York");
  const [locationArray, setLocationArray] = useState(() =>
    JSON.parse(localStorage.getItem("locations")) || []
  );

  const getDay = (timestamp) =>
    new Date(timestamp * 1000).toUTCString().split(" ").slice(0, 3).join(" ");

  const degToCompass = (num) =>
    ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW",
      "W", "WNW", "NW", "NNW"][Math.floor((num / 22.5) + 0.5) % 16];

  const fetchLocation = async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Network response was not ok");
      return await response.json();
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const updateWeatherData = (data) => {
    if (!data) return;
    const { main, weather, wind, visibility, coord, dt } = data;
    const updatedWeatherData = {
      temp: Math.round(main.temp),
      description: weather[0].main,
      iconId: weather[0].icon,
      visibility,
      humidity: main.humidity,
      airPressure: main.pressure,
      todays: getDay(dt),
    };
  
    if (wind) {
      updatedWeatherData.windStatus = wind.speed.toFixed(1);
      updatedWeatherData.windDegree = wind.deg;
      updatedWeatherData.windDirection = degToCompass(wind.deg);
    }
  
    setWeatherData(updatedWeatherData);
    setLat(coord.lat);
    setLon(coord.lon);
  };

  const updateForecastData = (data) => {
    if (!data || !data.list) return;
    const forecastList = data.list;
    const uniqueDays = Array.from(new Set(forecastList.map(item => item.dt_txt.split(" ")[0])))
      .map(date => forecastList.find(item => item.dt_txt.startsWith(date)));
    setList(uniqueDays);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords: { latitude, longitude } }) => {
          setLat(latitude);
          setLon(longitude);
          fetchLocation(
            `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
          )
            .then(([result]) => result && setLocation(result.name))
            .catch((error) => console.error("Error fetching location:", error));
        },
        (error) => console.error(error),
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    }
  };

  useEffect(() => {
    if (location && !locationArray.includes(location)) {
      const updatedLocations = [...locationArray, location];
      setLocationArray(updatedLocations);
      localStorage.setItem("locations", JSON.stringify(updatedLocations));
    }
  }, [location]);

  useEffect(() => {
    if (location) {
      fetchLocation(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=${unit}&appid=${API_KEY}`
      )
        .then(updateWeatherData)
        .catch((error) =>
          console.error("Error fetching weather data:", error)
        );
    }
  }, [location, unit]);

  useEffect(() => {
    if (lat && lon) {
      const fetchWeatherData = () => fetchLocation(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${unit}&appid=${API_KEY}`
      ).then(updateWeatherData);

      const fetchForecastData = () => fetchLocation(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${unit}&appid=${API_KEY}`
      ).then(updateForecastData);

      fetchWeatherData();
      fetchForecastData();
    }
  }, [lat, lon, unit]);

  const contextValue = useMemo(
    () => ({...weatherData,list,unit,setUnit,location,setLocation,lat,lon,locationArray,getCurrentLocation,}),
    [weatherData, list, unit, location, lat, lon, locationArray]
  );

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};
