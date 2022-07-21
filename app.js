const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

let weatherData = {};
let temp = "";
let icon = "";
let flag = "false";
let city = "jaipur";
let des = "";
let speed = "";
let Humidity = "";
let cod = "";
app.get("/", function(req, res){
    
    res.render("./index",{
        temp : temp,
        url : icon,
        flag : flag,
        City : city,
        description : des,
        speed : speed,
        Humidity : Humidity,
        cod : cod
    });
    
});

app.post("/", function(req, res){
    city = req.body.city;
    let url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + `&appid=${process.env.API_KEY}&units=metric`;

    https.get(url, function(response){
        console.log(response.statusCode);

        response.on("data", function(d){

            weatherData = JSON.parse(d);
            cod = weatherData.cod;
            console.log(cod);
            if(cod==404){
                res.redirect("/")
            }
            else{
                temp = weatherData.main.temp;
                des = weatherData.weather[0].description;
                speed = weatherData.wind.speed;
                Humidity = weatherData.main.humidity;
                flag = "true";
                icon = "http://openweathermap.org/img/wn/" + weatherData.weather[0].icon + "@2x.png";
                console.log(icon);
                console.log(temp);
                res.redirect("/");
            }
            
        });


    });
});
port=process.env.PORT||3000;
app.listen(port, function(){
    console.log("server is running on port 3000.");
})