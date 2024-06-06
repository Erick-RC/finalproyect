import "./App.css";
import { CurrentWeather } from "./components/CurrentWeather";
import { TodayHighlights } from "./components/TodayHighlights";

function App() {
  return (
    <div className="md:flex md:justify-between h-[100vh]">
      <CurrentWeather />
      <TodayHighlights />
    </div>
  );
}

export default App;
