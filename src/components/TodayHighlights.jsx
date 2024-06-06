import React, { useContext } from "react";
import { DataContext } from "../context/dataContext";
import { Cards } from "./Cards";
import NavigationIcon from "@mui/icons-material/Navigation";

export const TodayHighlights = () => {
  const {
    list,
    unit,
    setUnit,
    windStatus,
    windDegree,
    windDirection,
    visibility,
    humidity,
    airPressure,
  } = useContext(DataContext);

  const isMetric = unit === "metric";

  return (
    <section
      className="p-[8%] pt-[20px] md:w-[71%] lg:w-[76%] xl:w-[69%] md:h-full overflow-y-scroll md:px-[8%] lg:px-[5%] xl:px-[7%] pb-9"
      style={{ backgroundColor: "#100E1D" }}
    >
      <div className="w-full">
        <div className="flex justify-end m-[30px]">
          <button
            className={`w-8 h-8 rounded-full text-gray-100 ${isMetric ? "bg-gray-400 text-black" : "bg-gray-500"}`}
            onClick={() => setUnit("metric")}
          >
            &#8451;
          </button>
          <button
            className={`w-8 h-8 rounded-full text-gray-100 ml-4 ${!isMetric ? "bg-gray-400 text-black" : "bg-gray-500"}`}
            onClick={() => setUnit("imperial")}
          >
            &#8457;
          </button>
        </div>
        <div className="flex flex-wrap gap-4 md:gap-2.5 xl:gap-4">
          {list?.slice(1).map((item, index) => (
            <Cards key={index} index={index + 1} info={item} />
          ))}
        </div>
      </div>
      <div className="w-full">
        <h3 className="mb-8 mt-16 text-gray-100 text-2xl font-display font-bold">
          Today's Highlights
        </h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-4 md:gap-3 xl:gap-4">
          <HighlightCard
            title="Wind Status"
            value={windStatus}
            unit={isMetric ? "m/s" : "mph"}
            extra={
              <>
                <NavigationIcon
                  style={{ transform: `rotate(${windDegree}deg)` }}
                  className="inline-block mr-4"
                />
                {windDirection}
              </>
            }
          />
          <HighlightCard
            title="Humidity"
            value={humidity}
            unit="%"
            extra={
              <HumidityIndicator humidity={humidity} />
            }
          />
          <HighlightCard
            title="Visibility"
            value={Math.round(visibility / 1000)}
            unit="Km"
          />
          <HighlightCard
            title="Air Pressure"
            value={airPressure}
            unit="mbr"
          />
        </div>
      </div>
    </section>
  );
};

const HighlightCard = ({ title, value, unit, extra }) => (
  <div
    className="w-full flex flex-col items-center justify-center p-[7%]"
    style={{ backgroundColor: "#1e213a" }}
  >
    <div className="text-gray-100 font-display font-medium text-base mb-[22px]">
      {title}
    </div>
    <span className="text-gray-100 font-display font-bold text-6xl">
      {value}{" "}
      <span className="text-gray-100 font-display font-normal text-4xl">
        {unit}
      </span>
    </span>
    {extra && <div className="text-gray-100 font-display font-bold mt-2">{extra}</div>}
  </div>
);

const HumidityIndicator = ({ humidity }) => {
  const humidityPercentage = `${humidity}%`;
  const backgroundStyle = {
    backgroundImage: `linear-gradient(to right, rgba(255, 255, 0, 0.6) ${humidityPercentage}, transparent ${humidityPercentage})`,
    maxWidth: "300px"
  };

  return (
    <div className="w-full mt-5 text-gray-100">
      <span className="flex justify-between text-base">
        <p>0</p>
        <p>50</p>
        <p>100</p>
      </span>
      <span
        className="w-full bg-slate-100 h-3 mt-2 block rounded-2xl relative"
        style={backgroundStyle}
      >
        <span
          className="block h-full min-w-[300px] rounded-2xl after:content-['%'] after:absolute after:right-0 after:top-3 after:text-[12px] after:text-gray-500"
          style={{ width: humidityPercentage }}
        ></span>
      </span>
    </div>
  );
};
