import "./styles.css";

import {
    getWeatherData,
    elF,
    laF,
    ternaryUnit
} from './helper.js'

import {
    format
} from 'date-fns';

let data;
let state = {
    celsius: true,
    hour: '',
    day: ''
};

const content = document.querySelector('.content');

(() => {
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

        const loading = elF('div', '', 'loading');
        loading.appendChild(elF('p', 'loading', 'loading-text'));
        content.appendChild(loading);
        try {
            data = await getWeatherData(input.value);
        } catch (error) {
            console.log(error.message);
            if (error.message.includes('Failed to fetch')) {
                input.setCustomValidity('connection error');
                input.reportValidity();
            } else {
                input.setCustomValidity('invalid city');
                input.reportValidity();
            }
            return;
        } finally {
            loading.remove();
        }

        const currentHour = data.days[0].hours.find(hour => hour.datetime.slice(0, 2) === data.currentConditions.datetime.slice(0, 2));

        //current time reset
        const utility = elF('div', '', 'utility');
        const resetTime = elF('button', 'Show current time', 'reset-button');
        resetTime.addEventListener('click', () => {
            state.day = data.days[0];
            state.hour = currentHour;
            updateMain();
            updateHours();
            updateDays();
        });

        //temperature unit switch
        const unitSwitch = elF('fieldset', '', 'unit-switch-container');
        const celLabel = laF('radio', 'Celsius', 'temp-unit');
        celLabel.input.checked = true;
        const fahLabel = laF('radio', 'Fahrenheit', 'temp-unit');
        unitSwitch.appendChild(celLabel);
        unitSwitch.appendChild(fahLabel);

        [celLabel.input, fahLabel.input].forEach(input => {
            input.addEventListener('change', () => {
                state.celsius = celLabel.input.checked;
                updateMain();
                updateHours();
                updateDays();
            })
        })

        utility.textContent = '';
        utility.appendChild(resetTime);
        utility.appendChild(unitSwitch);
        searchbar.appendChild(utility);

        state.day = data.days[0];
        state.hour = currentHour;
        updateMain();
        updateHours();
        updateDays();
    })

    label.appendChild(input);
    searchbar.appendChild(label);
    searchbar.appendChild(button);
})()

function updateMain() {
    const container = document.querySelector('.main');
    container.textContent = '';

    container.appendChild(elF('div', state.day.datetime, 'current-date'));
    container.appendChild(elF('div', format(new Date(state.day.datetime), 'EEEE'), 'current-week-day'));
    container.appendChild(elF('div', state.hour.datetime.slice(0, 5), 'current-time'));
    container.appendChild(elF('div', ternaryUnit(state.hour.temp, state.celsius), 'current-temperature'));
    container.appendChild(elF('div', state.hour.conditions, 'current-conditions'));
    container.appendChild(elF('div', `Feels like ${Math.floor(state.hour.feelslike)}`, 'current-feels-like'));
    container.appendChild(elF('div', `Humidity: ${Math.floor(state.hour.humidity)}%`, 'current-humidity'));
}

function updateHours() {
    const container = document.querySelector('.hours');
    container.textContent = '';

    for (const i of [0, 3, 7, 10, 14, 17, 21]) {
        const con = elF('div', '', 'hour-container');
        const hour = state.day.hours[i];

        con.appendChild(elF('div', hour.datetime.slice(0, 5), 'hour-time'));
        con.appendChild(elF('div', ternaryUnit(hour.temp, state.celsius), 'hour-temperature'));
        con.appendChild(elF('div', hour.conditions, 'hour-conditions'));
        if (state.hour === hour) {
            con.classList.add('selected');
        };

        con.addEventListener('click', () => {
            state.hour = hour;
            updateMain();
            updateHours();
        })

        container.appendChild(con);
    }
}

function updateDays() {
    const container = document.querySelector('.days');
    container.textContent = '';

    for (const day of data.days.slice(0, 7)) {
        const con = elF('div', '', 'day-container');

        con.appendChild(elF('div', format(new Date(day.datetime), 'EEEE'), 'day-week-day'));
        con.appendChild(elF('div', ternaryUnit(day.temp, state.celsius), 'day-average-temperature'));
        con.appendChild(elF('div', day.conditions, 'day-conditions'));

        if (state.day === day) {
            con.classList.add('selected');
        }

        con.addEventListener('click', () => {
            state.day = day;
            state.hour = day.hours[10];
            updateMain();
            updateHours();
            updateDays();
        })

        container.appendChild(con);
    }
}