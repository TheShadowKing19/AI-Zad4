const WeatherApp = class {
    constructor(apiKey, resultsBlockSelector) {
        this.apiKey = apiKey;
        this.resultBlock = document.querySelector(resultsBlockSelector); // W naszym przypadku to będzie #weather-result-container
    }

    getCurrentWeather(query) {

    }

    getForecast(query) {

    }

    getWeather(query) {
        this.resultBlock.innerText = query;
    }

    drawWeather() {

    }

    createWeatherBlock(dateString, temperature, feelsLikeTemperature, iconName, description) {

    }
}
// Nowa instancja obiektu weatherApp
document.weatherApp = new WeatherApp(" 7ded80d91f2b280ec979100cc8bbba94", "#weather-results-container");

// Event Listener przypisany do przycisku "Sprawdź!"
document.querySelector("#checkButton").addEventListener("click", function() {
    const query = document.querySelector("#locationInput").value;
    document.weatherApp.getWeather(query);
});