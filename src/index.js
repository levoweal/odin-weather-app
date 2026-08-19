import "./styles.css";

const content = document.querySelector('.content');

(() => {
    //searchbar stuff
    const searchbar = document.querySelector('.searchbar');

    const label = document.createElement('label');
    label.textContent = 'city';
    label.htmlFor = 'search';

    const input = document.createElement('input');
    input.id = 'search';
    input.type = 'text';

    const button = document.createElement('button');
    button.className = 'confirm';
    button.textContent = 'search';

    button.addEventListener('click', async () => {
        if (!input.value) {
            input.setCustomValidity('type something first');
            input.reportValidity();
            return;
        };

        const data = await getWeatherData(input.value);

        updateMain(data);
    })

    label.appendChild(input);
    searchbar.appendChild(label);
    searchbar.appendChild(button);
})()

async function getWeatherData(city) {
    const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=MYZTXBP9J8NAAXBJL3YLMKH94&contentType=json`);
    const data = await response.json();
    console.log(data);
    data.isActive = false;
    return data;
}

function updateMain(data) {
    const main = document.querySelector('.main');
    main.textContent = '';

    const current = document.createElement('div');
    current.textContent = data.currentConditions.temp;
    current.className = 'current-temperature';

    const conditions = document.createElement('div');
    conditions.textContent = data.currentConditions.conditions;
    conditions.className = 'current-conditions';

    const feels = document.createElement('div');
    feels.textContent = `Feels like ${data.currentConditions.feelslike}`;
    feels.className = 'current-feels-like';

    main.appendChild(current);
    main.appendChild(conditions);
    main.appendChild(feels);
}