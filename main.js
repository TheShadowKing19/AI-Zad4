const WeatherApp = class {
    constructor(apiKey, resultsBlockSelector, forecastBlockName) {
        this.apiKey = apiKey;
        this.resultBlock = document.querySelector(resultsBlockSelector); // W naszym przypadku to będzie #weather-result-container
        this.forecastBlock = document.querySelector(forecastBlockName);
        this.currentWeatherLink = `https://api.openweathermap.org/data/2.5/weather?q={query}&appid=${apiKey}&units=metric&lang=pl`;
        
        this.currentWeather = undefined;
        
        this.forecastLink = `https://api.openweathermap.org/data/2.5/forecast?q={query}&appid=${apiKey}&units=metric&lang=pl`;
        this.forecast = undefined;
        
    }

    getCurrentWeather(query) {
        let url = this.currentWeatherLink.replace(`{query}`, query);
        
        // Stworzenie nowego zapytania
        let req = new XMLHttpRequest();
        
        // Ustalenie typu zapytania oraz jego parametrów
        req.open("GET", url, true);
        
        // Dodanie funkcji nasłuchującej, która wywoła się gdy program otrzyma odpowiedź
        req.addEventListener("load", () => {
            this.currentWeather = JSON.parse(req.responseText)
            console.log(this.currentWeather);
            this.drawWeather();
        });
        
        // Wysłanie zapytania
        req.send();
    }

    getForecast(query) {
        // Fetch API jest nowoczesnym intefejsem, ale działa tylko na aktulnych przeglądarkach
        let url = this.forecastLink.replace("{query}", query);
        
        // Niżej kolejno: odpowiedź od API zmieniamy do JSON/wrzucamy do listy i na podstawie tych danych rysujemy pogodę
        fetch(url)
            .then((response) => {
            return response.json();
        })
            .then((data) => {
                console.log(data);
                this.forecast = data.list;
                this.drawWeather();
            })
    }

    getWeather(query) {
        this.getCurrentWeather(query);
        this.getForecast(query);
    }

    drawWeather() {
        // Wyczyszczenie innerHTML przed rysowaniem powoduje, że kafelki pogody będą nadpisywane, zamiast duplikowane.
        this.resultBlock.innerHTML = '';
        this.forecastBlock.innerHTML = '';
        if (this.currentWeather) {
            
            // CurrentWeather jest JSON danych zawierającymi informacje o pogodzie na tą chwilę
            const date = new Date(this.currentWeather.dt * 1000);
            const weatherBlock = this.createWeatherBlock(
                `${date.toLocaleDateString("pl-PL")} ${date.toLocaleTimeString("pl-PL")}`,
                this.currentWeather.main.temp,
                this.currentWeather.main.feels_like,
                this.currentWeather.weather[0].icon, 
                this.currentWeather.weather[0].description
            );
            this.resultBlock.appendChild(weatherBlock);
        }
        
        if (this.forecast) {
            
            // forcast to list[JSON] danych o prognozie na daną godzinę co 3h
            for (let i = 0; i < this.forecast.length; i++) {
                let weather = this.forecast[i]
                const date = new Date(weather.dt * 1000);
                const weatherBlock = this.createWeatherBlock(
                    `${date.toLocaleDateString("pl-PL")} ${date.toLocaleTimeString("pl-PL")}`,
                    weather.main.temp,
                    weather.main.feels_like,
                    weather.weather[0].icon,
                    weather.weather[0].description
                );
                this.forecastBlock.appendChild(weatherBlock);
            }
        }
    }

    createWeatherBlock(dateString, temperature, feelsLikeTemperature, iconName, description) {
        const weatherBlock = document.createElement("div");
        weatherBlock.className = "weather-block";

        const dateBlock = document.createElement("div");
        dateBlock.className = "weather-date";
        dateBlock.innerHTML = dateString;
        weatherBlock.appendChild(dateBlock);

        const temperatureBlock = document.createElement("div");
        temperatureBlock.className = "weather-temperature";
        temperatureBlock.innerHTML = `${temperature} &degC`;
        weatherBlock.appendChild(temperatureBlock);

        const temperatureFeelBlock = document.createElement("div");
        temperatureFeelBlock.className = "weather-temperature-feels-like";
        temperatureFeelBlock.innerHTML = `Odczuwalna: ${feelsLikeTemperature} &degC`;
        weatherBlock.appendChild(temperatureFeelBlock);

        const iconImg = document.createElement("img");
        iconImg.className = "weather-icon";
        iconImg.src = `https://openweathermap.org/img/wn/${iconName}@2x.png`;
        weatherBlock.appendChild(iconImg);

        const DescriptionBlock = document.createElement("div");
        DescriptionBlock.className = "weather-description";
        DescriptionBlock.innerHTML = description;
        weatherBlock.appendChild(DescriptionBlock);

        return weatherBlock;
    }
}
// Nowa instancja obiektu weatherApp
document.weatherApp = new WeatherApp("7ded80d91f2b280ec979100cc8bbba94", "#weather-results-container", "#weather-forecast");

// Event Listener przypisany do przycisku "Sprawdź!"
document.querySelector("#checkButton").addEventListener("click", function() {
    const query = document.querySelector("#locationInput").value;
    document.weatherApp.getWeather(query);
});