import "./styles.css";

const content = document.querySelector('.content');

(() => {
    const label = document.createElement('label');
    label.textContent = 'city';
    label.htmlFor = 'search';

    const input = document.createElement('input');
    input.id = 'search';
    input.type = 'text';

    const button = document.createElement('button');
    button.className = 'confirm';
    button.textContent = 'search';

    button.addEventListener('click', () => {
        if (!input.value) {
            input.setCustomValidity('type something first');
            input.reportValidity();
            return;
        };
        getWeatherData(input.value);
    })

    label.appendChild(input);
    content.appendChild(label);
    content.appendChild(button);
})()

async function getWeatherData(city) {
    const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=us&include=current&key=MYZTXBP9J8NAAXBJL3YLMKH94&contentType=json`);
    const data = await response.json();
    console.log(data);
    return data;
}