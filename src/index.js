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

        const currentHour = data.days[0].hours.find(hour => hour.datetime.slice(0, 2) === data.currentConditions.datetime.slice(0, 2));

        updateMain(currentHour);
        updateHours(data.days[0]);
        updateDays(data);
    })

    label.appendChild(input);
    searchbar.appendChild(label);
    searchbar.appendChild(button);
})()

function updateMain(hour) {
    const container = document.querySelector('.main');
    container.textContent = '';

    container.appendChild(elF('div', hour.datetime, 'current-time'));
    container.appendChild(elF('div', hour.temp, 'current-temperature'));
    container.appendChild(elF('div', hour.conditions, 'current-conditions'));
    container.appendChild(elF('div', `Feels like ${hour.feelslike}`, 'current-feels-like'));
}

function updateHours(day) {
    const container = document.querySelector('.hours');
    container.textContent = '';

    for (const i of [0, 3, 7, 10, 14, 17, 21]) {
        const con = elF('div', '', 'current-hour-container');
        const hour = day.hours[i];

        con.appendChild(elF('div', hour.datetime, 'current-hour-time'));
        con.appendChild(elF('div', hour.temp, 'current-hour-temperature'));
        con.appendChild(elF('div', hour.conditions, 'current-hour-conditions'));

        con.addEventListener('click', () => {
            updateMain(hour);
        })

        container.appendChild(con);
    }
}

function updateDays(data) {
    const container = document.querySelector('.days');
    container.textContent = '';

    for (const day of data.days.slice(0, 7)) {
        const con = elF('div', '', 'day-container');

        con.appendChild(elF('div', format(new Date(day.datetime), 'EEEE'), 'day-date'));
        con.appendChild(elF('div', day.conditions, 'day-conditions'));
        con.appendChild(elF('div', day.temp, 'day-average-temperature'));

        con.addEventListener('click', () => {
            updateMain(day.hours[12]);
            updateHours(day);
        })

        container.appendChild(con);
    }
}