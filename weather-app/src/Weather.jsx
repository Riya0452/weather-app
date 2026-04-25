
import { useState, useEffect } from "react";
import "./weather.css";

function Weather() {
    const [city, setCity] = useState("");
    const [data, setData] = useState(null);
    const [error, setError] = useState("");
    const [load, setload] = useState(false);
    const [aqiData, setaqiData] = useState(null);
    const [forecast, setforecast] = useState([]);
    const [theme, settheme] = useState("light");


    useEffect(() => {
        if (data) {
            const lat = data.coord.lat;
            const lon = data.coord.lon;
            handleAQI(lat, lon);
        }
    }, [data]);
    
    

    function handletheme() {
        settheme(prev => (prev === "light" ? "dark" : "light"));
    }

    async function handleApi() {
        try {
            setload(true);
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=6ffbe5c120551c2d6b4d2fe70a5e0a25&units=metric`;

            const result = await fetch(url);

            if (!result.ok) {
                throw new Error("City not found!");
            }

            const resData = await result.json();
            setData(resData);
            handleForecast(city);
           
            setError("");
            setCity("");
        } catch (err) {
            setError(err.message);
            setData(null);
        }
        setload(false);
    }
    
    async function handleAQI(lat, lon) {
        try {
            const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=6ffbe5c120551c2d6b4d2fe70a5e0a25`;

            const res = await fetch(url);

            if (!res.ok) {
                throw new Error("AQI failed!");
            }

            const ResData = await res.json();
            setaqiData(ResData.list[0].main.aqi);

        } catch (err) {
            console.log(err);
        }
    }

    async function handleForecast(city) {
        try {
            const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=6ffbe5c120551c2d6b4d2fe70a5e0a25&units=metric`;

            const res = await fetch(url);
            const data = await res.json();

            const dailyData = data.list.filter((item, index) => index % 8 === 0);
            setforecast(dailyData);

        } catch (err) {
            console.log(err);
        }
    }

    function getAQIText(aqi) {
        switch (aqi) {
            case 1: return "good 🟢";
            case 2: return "Fair 🟡";
            case 3: return "moderate 🟠";
            case 4: return "poor 🟣";
            case 5: return "very poor 🔴";
            default: return "";
        }
    }

    let bgImage = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e";

    if (data) {
        const weather = data.weather[0].main;
        const temp = data.main.temp;

        //  LIGHT THEME
        if (theme === "light") {

            if (weather === "Clear") {
                bgImage = "https://images.unsplash.com/photo-1502082553048-f009c37129b9";
            } else if (weather === "Clouds") {
                bgImage = "https://images.unsplash.com/photo-1499346030926-9a72daac6c63";
            } else if (weather === "Rain") {
                bgImage = "https://images.unsplash.com/photo-1501594907352-04cda38ebc29";
            } else if (weather === "Snow" || temp < 3) {
                bgImage = "https://images.pexels.com/photos/688660/pexels-photo-688660.jpeg";
            }

        }

        // DARK THEME
        else if (theme === "dark") {

            bgImage = "https://images.unsplash.com/photo-1519681393784-d120267933ba";

            if (weather === "Clear") {
                bgImage = "https://images.unsplash.com/photo-1470770841072-f978cf4d019e";
            } else if (weather === "Clouds") {
                bgImage = "https://images.pexels.com/photos/167699/pexels-photo-167699.jpeg";
            } else if (weather === "Rain") {
                bgImage = "https://images.unsplash.com/photo-1519692933481-e162a57d6721";
            } else if (weather === "Snow" || temp < 3) {
                bgImage = "https://images.pexels.com/photos/730256/pexels-photo-730256.jpeg";
            }

        }

    } else {

        if (theme === "dark") {
            bgImage = "https://images.unsplash.com/photo-1519681393784-d120267933ba";
        }
    }

    let weatherClass = "";
    if (data) {
        const weather = data.weather[0].main;

        if (weather === "Clear") {
            weatherClass = "sunny";
        } else if (weather === "Clouds") {
            weatherClass = "cloudy";
        } else if (weather === "Rain") {
            weatherClass = "rainy";
        } else if (weather === "Snow") {
            weatherClass = "winter";
        }
    }

    return (
        <div
            className={`app ${weatherClass} ${theme}`}
            style={{
                backgroundImage: `url(${bgImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center"
            }}
        >

            <div className="layout">
                <input type="checkbox" className="toggle" onChange={handletheme} />

                <div className="card">
                    <h1>Weather App</h1>

                    <input
                        type="text"
                        placeholder="Enter City"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                    />
                    
                    <button onClick={handleApi}>Search</button>

                    {load && <h3>⏳ Loading..</h3>}
                    {error && <p>{error}</p>}

                    {data && (
                        <div className="weather-box">

                            <h1>{data?.name}</h1>
                            <h2>{data?.main.temp}°C</h2>
                            <p>{data?.weather[0].main}</p>

                            <img
                                className="weather-icon"
                                src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
                                alt="weather"
                            />

                            <div className="details">
                                <div>💧 {data?.main.humidity}%</div>
                                <div>🍃 {data?.wind.speed} m/s</div>
                                <div>🌡 {data?.main.feels_like}°C</div>
                                <div>🌅 {new Date(data.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                <div>🌄 {new Date(data.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>

                                {aqiData && (
                                    <div>💨 AQI: {getAQIText(aqiData)}</div>
                                )}
                            </div>

                        </div>
                    )}
                </div>
            </div>

            {/* {forecast.length > 0 && (
                <div className={`forecast-cast $ {day-weather}`}>
                    {forecast.map((item, index) => (
                        <div key={index}>
                            <p>
                                {new Date(item.dt_txt).toLocaleDateString("en-IN", {
                                    weekday: "short",
                                    day: "numeric",
                                    month: "short"
                                })}
                            </p>

                            <p>{item.main.temp}°C</p>
                            <p>{item.weather[0].main}</p>
                        </div>
                    ))}
                </div>
            )} */}
            {forecast.length > 0 && (
  <div className="forecast-container">
    {forecast.map((item, index) => (
      <div
        key={index}
        className={`forecast-card ${item.weather[0].main}`}
      >
        <p>
          {new Date(item.dt_txt).toLocaleDateString("en-IN", {
            weekday: "short",
            day: "numeric",
            month: "short"
          })}
        </p>
        <img
      className="forecast-icon"
      src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
      alt="icon"
    />

        <p>{item.main.temp}°C</p>
        <p>{item.weather[0].main}</p>
      </div>
    ))}
  </div>
)}

        </div>
    );
}

export default Weather;
