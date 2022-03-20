import React, { useState } from "react";
import "../css/Landing.css";

function Landing() {
  const axios = require("axios").default;

  const [cityKnown, setCityKnown] = useState(false);
  const [location, setLocation] = useState({
    city: "",
    state: "",
    country: "",
  });
  const [weather, setWeather] = useState({});
  const [errMsg, setErrMsg] = useState(false);

  const update = (e: any) => {
    // update location array
    let value = e.target.value;
    let toUpdate = e.target.name;
    setLocation((prevVal) => ({
      ...prevVal,
      [toUpdate]: value,
    }));
  };

  const search = async () => {
    let status = await fetchWeatherData();
    console.log(status);
    if (status) {
      setCityKnown(true);
    } else {
      setErrMsg(true);
    }
  };


  const fetchWeatherData: any = async () => {
    const Zipcode = await getZipcode();
    if (!Zipcode) {
      // zip code was invalid, no results
      return false;
    }
    // call to weather API to get weather
    const key = "2ca2e5cd765449fa99d60857221903";
    const call = `https://api.weatherapi.com/v1/forecast.json?key=${key}&q=${Zipcode}`;

    return axios
      .get(call)
      .then(function (res: any) {
        let curr = res.data.current;
        let forecast = res.data.forecast.forecastday[0];
        setWeather((prevVal) => ({
          ...prevVal,
          "": curr.condition.text,
          "Temperature": curr.temp_f + '\u00b0'+"F",
          "Feels Like": curr.feelslike_f + '\u00b0'+"F",
          "High": forecast.day.maxtemp_f + '\u00b0'+"F",
          "Low": forecast.day.mintemp_f + '\u00b0'+"F",
          "Humidity": curr.humidity + "%",
          "Wind Speed": curr.wind_mph + " mph",
        }));
        return weather;
      })
      .catch(function (err: any) {
        console.log(err);
        return false;
      });
  };

  const getZipcode: any = () => {
    let city = location.city.replaceAll(" ", "+");
    let state = location.state.replaceAll(" ", "+");
    let country = location.country.replaceAll(" ", "+");
    let username = "blueh";
    console.log(city, state, country);

    // call to geonames to get zip code based on city state and country
    const call = `https://api.geonames.org/findNearbyPostalCodesJSON?country=${country}&placename=${city},${state}&username=${username}&maxRows=1`;
    return axios
      .get(call)
      .then(function (res: any) {
        return JSON.stringify(res.data.postalCodes[0].postalCode);
      })
      .catch(function (err: any) {
        console.log(err);
        return false;
      });
  };

  const FormattedWeather = () => {
    return (
      <>
        <p>{location.city + "'s" + " Forecast"} </p>
        {Object.entries(weather).map(function(key: any) {
          if (key[0] === "") {
            return <p>{key[1]}</p>;
          } else {
            return <p>{key[0] + ": " + key[1]}</p>;
          }
        })}
      </>
    );
  };

  return (
    <>
      <div className="header">Weather App</div>

      <div className="content">
        {!cityKnown ? (
          <>
            <div className="form">
              <label>
                City:
                <input type="text" name="city" onChange={(e) => update(e)} />
              </label>
              <label>
                State:
                <input type="text" name="state" onChange={(e) => update(e)} />
              </label>
              <label>
                Country:
                <input type="text" name="country" onChange={(e) => update(e)} />
              </label>
              <button onClick={search}>Submit</button>
              {errMsg ? (
                <p>The input location could not be identified.</p>
              ) : (
                <></>
              )}
            </div>
          </>
        ) : (
          <div className="output">
            <FormattedWeather />

            <button onClick={() => setCityKnown(false)}>Go Back</button>
          </div>
        )}
      </div>
    </>
  );
}

export default Landing;
