import "./styles.css";

import {
    getWeatherData,
    elF
} from './helper.js'

import {
    format
} from 'date-fns';

const content = document.querySelector('.content');

let data;

(() => {
    //searchbar stuff
    const searchbar = document.querySelector('.searchbar');

    const label = elF('label', 'city', 'search-label');
    label.htmlFor = 'search';

    const input = elF('input', '', 'search-input');
    input.id = 'search';
    input.type = 'text';

    const button = elF('button', 'search', 'search-button');

    button.addEventListener('click', async () => {
        if (!input.value) {
            input.setCustomValidity('type something first');
            input.reportValidity();
            return;
        };

        data = await getWeatherData(input.value);

        updateMain(data);
        updateHours(data);
        updateDays(data);
    })

    label.appendChild(input);
    searchbar.appendChild(label);
    searchbar.appendChild(button);
})()

function updateMain(data) {
    const container = document.querySelector('.main');
    container.textContent = '';

    container.appendChild(elF('div', data.currentConditions.datetime, 'current-time'));
    container.appendChild(elF('div', data.currentConditions.temp, 'current-temperature'));
    container.appendChild(elF('div', data.currentConditions.conditions, 'current-conditions'));
    container.appendChild(elF('div', `Feels like ${data.currentConditions.feelslike}`, 'current-feels-like'));
}

function updateHours(data) {
    const container = document.querySelector('.hours');
    container.textContent = '';

    for (const i of [0, 3, 7, 10, 14, 17, 21]) {
        const con = elF('div', '', 'current-hour-container');
        const hour = data.days[0].hours[i];

        con.appendChild(elF('div', hour.datetime, 'current-hour-time'));
        con.appendChild(elF('div', hour.temp, 'current-hour-temperature'));
        con.appendChild(elF('div', hour.conditions, 'current-hour-conditions'));

        container.appendChild(con);
    }
}

function updateDays(data) {
    const container = document.querySelector('.days');
    container.textContent = '';

    for (const day of data.days.slice(1, 8)) {
        const con = elF('div', '', 'day-container');

        con.appendChild(elF('div', format(new Date(day.datetime), 'EEEE'), 'day-date'));
        con.appendChild(elF('div', day.conditions, 'day-conditions'));
        con.appendChild(elF('div', day.temp, 'day-average-temperature'));

        container.appendChild(con);
    }
}