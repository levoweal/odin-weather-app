async function getWeatherData(city) {
    const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=MYZTXBP9J8NAAXBJL3YLMKH94&contentType=json`);
    const data = await response.json();
    console.log(data);
    data.isActive = false;
    return data;
}

function elF(type, text, className) {
    const element = document.createElement(type);
    element.textContent = text;
    element.className = className;
    return element;
}

export {
    getWeatherData,
    elF
}