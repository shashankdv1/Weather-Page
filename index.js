const express = require("express");
const axios = require('axios');
const app = express();
const port = 8000;
const {API_KEY} = require("./config");
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.get("/",(req,res)=>{
res.send(
    `<html>
    <body>
    <h1>Weather data</h1>
    <form method="get" action="/weather">
    <label for="city">City: </label>
    <input name="city" type="text" placeholder="please enter the city name"><br>
    <button type="submit">Submit</button>
    </form>
     <div id="weather-data"></div>
    </body>
    </html>`
)

});
app.get("/weather",async (req,res)=>{
    const city = req.query.city;
if(!city)
{
    return res.send('City name is required.');
}
try{
    const weatherData = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`);

    const { main, weather, name } = weatherData.data;
    const temperature =main.temp-273;
    const weatherHtml = `
    <h2>Weather in ${name}</h2>
    <p>Temperature: ${temperature}°C</p>
    <p>Weather: ${weather[0].description}</p>
    <p>Humidity: ${main.humidity}%</p>
    <p>Wind Speed: ${weatherData.data.wind.speed} m/s</p>
  `;
  res.send(
    `<html>
    <body>
    <h1>Weather data</h1>
    <form method="get" action="/weather">
    <label for="city">City: </label>
    <input name="city" type="text" placeholder="please enter the city name"><br>
    <button type="submit">Submit</button>
    </form>
     <div id="weather-data">
     ${weatherHtml}
     </div>
    </body>
    </html>`
)
}
catch(error)
{
res.send('<p>Could not fetch weather data. Please try again later.</p>');
}
});

app.listen(port,(req,res)=>{
console.log(`Server started at port ${port}`);
});