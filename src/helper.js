async function getWeatherData(city) {
    const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&iconSet=icons1&key=MYZTXBP9J8NAAXBJL3YLMKH94&contentType=json`);
    const data = await response.json();
    console.log(data);
    return data;
}

//element factory
function elF(type, text, className) {
    const element = document.createElement(type);
    element.textContent = text;
    element.className = className;
    return element;
}

//label factory (input factory, but it goes inside label)
function laF(type, text, name) {
    const label = elF('label', text, `${name}-label`);
    label.htmlFor = `${text}-input`;
    const input = elF('input', '', `${name}-input`);
    input.id = `${text}-input`;
    input.type = type;
    input.name = name;
    label.appendChild(input);
    label.input = input;
    return label;

}

//dynamic C/F temp unit based on truthy check parameter
//true = C | false = F
//takes C as default
function ternaryUnit(temp, check) {
    const num = Math.floor(check ? temp : (temp * 9/5) +32);
    return check ? `${num}°C` : `${num}°F`
}

//svg icon helper, only needed for icons.js
function svgF(pathParam) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', pathParam);
    svg.appendChild(path);
    return svg;
}

//upper case helper
function upper(string) {
    return string[0].toUpperCase() + string.slice(1);
}

export {
    getWeatherData,
    elF,
    laF,
    ternaryUnit,
    svgF,
    upper
}