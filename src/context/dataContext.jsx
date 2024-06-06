import { createContext, useState, useEffect, useMemo } from "react";

export const DataContext = createContext(null);

export const DataContextProvider = ({ children }) => {
  const [unit, setUnit] = useState("metric");
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  const [weatherData, setWeatherData] = useState({
    temp: 0,
    description: "",
    iconId: "",
    windStatus: "",
    windDegree: "",
    windDirection: "",
    visibility: "",
    humidity: "",
    airPressure: "",
    todays: "",
  });
  const [list, setList] = useState([]);
  const [location, setLocation] = useState("New York"); // Ubicación predeterminada
  const [locationArray, setLocationArray] = useState(() =>
    JSON.parse(localStorage.getItem("locations")) || []
  );

  const getDay = (timestamp) => new Date(timestamp * 1000).toUTCString().split(" ").slice(0, 3).join(" ");
  const degToCompass = (num) => ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"][Math.floor(num / 22.5 + 0.5) % 16];

  const fetchLocation = async (url) => {
    try {
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const updateWeatherData = (data) => {
    setWeatherData({
      temp: Math.round(data.main.temp),
      description: data.weather[0].main,
      iconId: data.weather[0].icon,
      windStatus: data.wind.speed.toFixed(1),
      windDegree: data.wind.deg,
      windDirection: degToCompass(data.wind.deg),
      visibility: data.visibility,
      humidity: data.main.humidity,
      airPressure: data.main.pressure,
      todays: getDay(data.dt),
    });
    setLat(data.coord.lat);
    setLon(data.coord.lon);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords: { latitude, longitude } }) => {
          setLat(latitude);
          setLon(longitude);
          fetchLocation(`https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&appid=969abeac77cc739597db7e76a82eb5e8`)
            .then(([result]) => result && setLocation(result.name));
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
      fetchLocation(`https://api.openweathermap.org/data/2.5/weather?q=${location}&units=${unit}&appid=969abeac77cc739597db7e76a82eb5e8`)
        .then(updateWeatherData);
    }
  }, [location, unit]);

  useEffect(() => {
    if (lat && lon) {
      fetchLocation(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${unit}&appid=969abeac77cc739597db7e76a82eb5e8`)
        .then(({ list: forecastList }) => {
          const uniqueDays = Array.from(new Set(forecastList.map(item => item.dt_txt.split(" ")[0])))
            .map(date => forecastList.find(item => item.dt_txt.startsWith(date)));
          setList(uniqueDays);
        });
    }
  }, [lat, lon, unit]);

  const contextValue = useMemo(() => ({
    ...weatherData,
    list,
    unit,
    setUnit,
    location,
    setLocation,
    lat,
    lon,
    locationArray,
    getCurrentLocation,
  }), [weatherData, list, unit, location, lat, lon, locationArray]);

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};
