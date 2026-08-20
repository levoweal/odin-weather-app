import "./styles.css";

import {
    getWeatherData,
    elF
} from './helper.js'

import {
    format
} from 'date-fns';

const content = document.querySelector('.content');

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

        const data = await getWeatherData(input.value);

        updateMain(data);
        updateExtra(data);
    })

    label.appendChild(input);
    searchbar.appendChild(label);
    searchbar.appendChild(button);
})()

function updateMain(data) {
    const main = document.querySelector('.main');
    main.textContent = '';

    main.appendChild(elF('div', data.currentConditions.datetime, 'current-time'));
    main.appendChild(elF('div', data.currentConditions.temp, 'current-temperature'));
    main.appendChild(elF('div', data.currentConditions.conditions, 'current-conditions'));
    main.appendChild(elF('div', `Feels like ${data.currentConditions.feelslike}`, 'current-feels-like'));
}

function updateExtra(data) {
    const extra = document.querySelector('.extra');
    extra.textContent = '';

    data.days.slice(1, 6).forEach(day => {
        const con = elF('div', '', 'day-container');

        con.appendChild(elF('div', format(new Date(day.datetime), 'EEEE'), 'day-date'));
        con.appendChild(elF('div', day.conditions, 'day-conditions'));
        con.appendChild(elF('div', day.temp, 'day-average-temperature'));

        extra.appendChild(con);
    });
}