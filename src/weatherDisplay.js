import React from "react";
import { useState, useEffect } from "react";


export default function WeatherDisplay(){

    const [cityName, setCityName] = useState('');
    const [finalCity, setFinalCity] = useState('');
    const [avgTemp, setAvgTemp] = useState(0);
    const [avgHumidity, setAvgHumidity] = useState(0);
    const [totalRain, setTotalRain] = useState(0);
    const [todayDate, setTodayDate] = useState('');
    const [water, setWater] = useState(0);
    const [start, setStart] = useState(true);

    const apiKey = '187552e3d23548b097b135823232909';
    const apiUrl = "http://api.weatherapi.com/v1/history.json";

    const getWeatherData = () => {
        const location = cityName;

        const dateObj = new Date();
        const year = dateObj.getFullYear();
        const month = (dateObj.getMonth() + 1) % 12;
        const date = dateObj.getDate();
        const today = `${year}-${month}-${date}`;
        setTodayDate(today);
        const url = `${apiUrl}?key=${apiKey}&q=${location}&dt=${today}`;

        fetch(url)
		  	.then(response => {
		    	if (!response.ok) {
		    		alert(`Invalid City Name: ${cityName}`);
		      		throw new Error('Network response was not ok');

		    	}
		    	return response.json();
		  	})
		  	.then(data => {
                setStart(false);
                setCityName(data.location.name);
		    	console.log(data.forecast.forecastday[0].day);
                showWeather(data);
		
		  	})
		  	.catch(error => {
		    	console.error('Fetch error: ' + error);
		  	});
    }

    const showWeather = (weatherData) =>{
        setFinalCity(weatherData.location.name);

        weatherData = weatherData.forecast.forecastday[0].day
        setAvgTemp(weatherData.avgtemp_c);
        setTotalRain(weatherData.totalprecip_mm);
        setAvgHumidity(weatherData.avghumidity);

    }
    const handleKeyPress = (event)=>{
        if (event.key === 'Enter' || event.key === 'Return'){
			getWeatherData();
		}
    } 

    const handleInputTyping = ({target}) => {
		setCityName(target.value);
	}

    useEffect(()=>{
        setWater(prev => prev-prev);
        let waterContent = 0;
        if (avgTemp > 30){
            waterContent = 90 + (avgTemp % 30)*2;
        } else {
            waterContent = 90;
        }
        waterContent = parseInt(waterContent - (totalRain) - (avgHumidity / 10));
        setWater(prev => prev + waterContent);
        if (start){
            setWater(0);
        }
    }, [avgTemp, avgHumidity, totalRain]);

    return (
        <div className="displayWeatherDiv">
            <input 
            type="text" 
            placeholder="Enter location" 
            onKeyPress={handleKeyPress}
            value={cityName}
            onChange={handleInputTyping}/>
            <h3 id="cityDisplay">{finalCity}</h3>
            <div>
                <h3><span>Today: </span>{todayDate}</h3>
                <h3><span>Average Temp: </span> {avgTemp} °C</h3>
                <h3><span>Total Precipitation: </span>{totalRain} mm</h3>
                <h3><span>Average Humidity: </span>{avgHumidity} %</h3>
                <h3><span>Average Soil Humidity: </span>{avgHumidity} %</h3>
            </div>
            <h3 id="waterDisplay">{water}%</h3>
 
        </div>
    );
}