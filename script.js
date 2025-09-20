const apiKey = "6cc134aa2c1730add8283af3aa38f9a9"; // OpenWeather API key
const searchBtn = document.getElementById("search-btn");
const cityInput = document.getElementById("city-input");
const weatherResult = document.getElementById("weather-result");

const cloudLayer = document.getElementById("cloud-layer");
const rainLayer = document.getElementById("rain-layer");
const snowLayer = document.getElementById("snow-layer");
const sunLayer = document.getElementById("sun-layer");

searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (!city) return alert("Enter a city name");
    getWeather(city);
});

cityInput.addEventListener("keyup", e => { 
    if (e.key === "Enter") searchBtn.click(); 
});

async function getWeather(city) {
    try {
        const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );
        const data = await res.json();

        if (data.cod === "404") {
            weatherResult.innerHTML = "<p>City not found!</p>";
            resetLayers();
            return;
        }

        const weather = data.weather[0].main.toLowerCase();
        const hour = new Date().getHours();
        const isNight = hour >= 18 || hour < 6;

        // Show weather with emojis
        weatherResult.innerHTML = `
            <h2>${data.name}, ${data.sys.country}</h2>
            <p>${data.weather[0].main} | Temp: ${data.main.temp}°C</p>
            <p>${getMoodMessage(weather)}</p>
        `;

        // Keep 3D animations
        generateLayer(weather, isNight);

    } catch (e) {
        weatherResult.innerHTML = "<p>Error fetching data</p>";
        resetLayers();
    }
}

function getMoodMessage(weather) {
    switch(weather) {
        case "clear": return "☀️ Sunny vibes! Sunglasses on 😎";
        case "clouds": return "☁️ Cloudy… relax ☕";
        case "rain":
        case "drizzle": return "🌧️ Rainy… umbrella ☔";
        case "snow": return "❄️ Snowfall! Build a snowman ⛄";
        default: return "🌈 Weather doing its thing…";
    }
}

// 3D Animation Layers
function generateLayer(weather, isNight){
    resetLayers();
    if(weather === "clouds") createClouds(5);
    if(weather === "rain" || weather === "drizzle") { createRain(50); createClouds(3); }
    if(weather === "snow") { createSnow(30); createClouds(2); }
    if(weather === "clear") { isNight ? createMoon() : createSun(); }
}

function createSun(){ const s=document.createElement("div"); s.className="sun"; sunLayer.appendChild(s); }
function createMoon(){ const m=document.createElement("div"); m.className="moon"; sunLayer.appendChild(m); }
function createClouds(count){ 
    for(let i=0;i<count;i++){ 
        const c=document.createElement("div"); 
        c.className="cloud-element"; 
        c.style.width=`${100+Math.random()*50}px`; 
        c.style.height=`${60+Math.random()*30}px`; 
        c.style.top=`${Math.random()*40}vh`; 
        c.style.left=`${-150+i*60}px`; 
        cloudLayer.appendChild(c); 
    } 
}
function createRain(count){ 
    for(let i=0;i<count;i++){ 
        const r=document.createElement("div"); 
        r.className="rain-drop"; 
        r.style.left=`${Math.random()*100}vw`; 
        r.style.top=`${Math.random()*-50}vh`; 
        rainLayer.appendChild(r); 
    } 
}
function createSnow(count){ 
    for(let i=0;i<count;i++){ 
        const s=document.createElement("div"); 
        s.className="snowflake"; 
        s.style.left=`${Math.random()*100}vw`; 
        s.style.top=`${Math.random()*-50}vh`; 
        snowLayer.appendChild(s); 
    } 
}

function resetLayers(){ 
    cloudLayer.innerHTML=""; 
    rainLayer.innerHTML=""; 
    snowLayer.innerHTML=""; 
    sunLayer.innerHTML=""; 
}
