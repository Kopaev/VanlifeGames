
// This JavaScript file is a rewritten version of the original script.
const loadMessages = async () => {
    try {
        // Используем переданный URL к messages.json через wp_localize_script
        const response = await fetch(vanlifeGameConfig.messagesUrl);
        if (!response.ok) {
            throw new Error('Failed to load messages JSON file');
        }
        return await response.json();
    } catch (error) {
        console.error('Error loading messages:', error);
        return null;
    }
};


// ============================== Локализация ==============================
function __(msgid) {
    // Placeholder function to retrieve the translated text from .mo files
    // Assume gettext or a similar library is being used for actual translation retrieval
    return msgid;
}

// ============================== День и время ==============================
let days = 1;
let hours = 0;
let minutes = 0;
let money = 1500;

function incrementTime() {
    minutes += 60;
    if (minutes >= 60) {
        hours += Math.floor(minutes / 60);
        minutes = minutes % 60;
        updateWeatherAndVoltage();
    }
    if (hours >= 24) {
        hours = 0;
        days += 1;
        updateWeatherAndVoltage();
        money -= 50;
        if (money < 0) money = 0;
        updateStats();
    }
    updateTimeDisplay();
}

// ============================== Обновление времени ==============================
function updateTimeDisplay() {
    const dayTime = document.getElementById('day-time');
    if (dayTime) {
        dayTime.innerText = `${days}, ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }
    updateMobileDisplay();
}


// ============================== Основные ресурсы ==============================
function updateCost(resourceValue, baseCost) {
    return baseCost * ((100 - resourceValue) / 100);
}
let water = 30;
let toilet = 50;
let gas = 33;
let fridge = 14;
let diesel = 47;
let laundry = 65;

function fillResource(resource, cost) {
    let resourceValue = eval(resource);
    const costToPay = updateCost(resourceValue, cost);
    if (resourceValue < 100 && money >= costToPay) {
        eval(resource + ' = 100');
        money -= costToPay;
        updateStats();
    } else if (resourceValue < 100) {
        showNotification(__('Not enough money!'), true);
    }
}

function fillWater() {
console.log('Translations at fillWater call:', window.translations);

const waterMessages = window.translations.water_fill_messages || ["Вода заправлена, всё готово!"];
const randomMessage = waterMessages[Math.floor(Math.random() * waterMessages.length)];
showNotification(randomMessage, false);
    fillResource('water', 20);

}

function fillDiesel() {
    const dieselCost = 150;

    if (money >= dieselCost) {
        fillResource('diesel', dieselCost);
        money -= dieselCost;
        updateStats();

        // Добавляем уведомление с рандомным текстом
        const dieselMessages = window.translations.fill_diesel_messages || ["Дизель заполнен! Теперь можем проехать хоть всю Европу!"];
        const randomMessage = dieselMessages[Math.floor(Math.random() * dieselMessages.length)];
        showNotification(randomMessage, false);
    } else {
        // Недостаточно денег для заправки
        const noMoneyMessages = window.translations.not_enough_money_for_diesel_messages || ["Недостаточно денег для заправки дизелем! Идите, заработайте немного."];
        const randomMessage = noMoneyMessages[Math.floor(Math.random() * noMoneyMessages.length)];
        showNotification(randomMessage, true);
    }
}

function fillGas() {
    const gasCost = 20;

    if (money >= gasCost) {
        fillResource('gas', gasCost);
        money -= gasCost;
        updateStats();

        // Добавляем уведомление с рандомным текстом
        const gasMessages = window.translations.fill_gas_messages || ["Газ пополнен! Теперь на кухне точно будет весело."];
        const randomMessage = gasMessages[Math.floor(Math.random() * gasMessages.length)];
        showNotification(randomMessage, false);
    } else {
        // Недостаточно денег для заправки газом
        const noMoneyMessages = window.translations.not_enough_money_for_gas_messages || ["Недостаточно денег для заправки газом! Идите, заработайте немного."];
        const randomMessage = noMoneyMessages[Math.floor(Math.random() * noMoneyMessages.length)];
        showNotification(randomMessage, true);
    }
}

function fillFridge() {
    const fridgeCost = 120;

    if (money >= fridgeCost) {
        fillResource('fridge', fridgeCost);
        money -= fridgeCost;
        updateStats();

        // Добавляем уведомление с рандомным текстом
        const fridgeMessages = window.translations.fill_fridge_messages || ["Холодильник полный! Теперь запасов хватит на долгое путешествие!"];
        const randomMessage = fridgeMessages[Math.floor(Math.random() * fridgeMessages.length)];
        showNotification(randomMessage, false);
    } else {
        // Недостаточно денег для заполнения холодильника
        const noMoneyMessages = window.translations.not_enough_money_for_fridge_messages || ["Недостаточно денег для заполнения холодильника! Идите, заработайте немного."];
        const randomMessage = noMoneyMessages[Math.floor(Math.random() * noMoneyMessages.length)];
        showNotification(randomMessage, true);
    }
}


function doLaundry() {
    if (money >= 10) {
        laundry = 0;
        money -= 10;
        updateStats();

        // Добавляем уведомление с рандомным текстом
        const laundryMessages = window.translations.laundry_wash_messages || ["Бельё постирано, и теперь всё пахнет свежестью!"];
        const randomMessage = laundryMessages[Math.floor(Math.random() * laundryMessages.length)];
        showNotification(randomMessage, false);
    
    } else {
        showNotification(window.translations.not_enough_money_for_laundry || "Недостаточно денег для стирки!", true);
    }
}

//======Туалет========
function emptyToilet() {
    console.log('Translations at emptyToilet call:', window.translations);

    if (toilet > 0) {
        toilet = 0;
        updateBar('toilet-bar', toilet, '#4CAF50', '#f44336');

        const funnyMessages = window.translations.toilet_empty_messages || ["Фууу, наконец-то свободно! Туалет опустошен."];
        const randomMessage = funnyMessages[Math.floor(Math.random() * funnyMessages.length)];
        showNotification(randomMessage, false);
    } else {
        showNotification(window.translations.toilet_already_empty || "Туалет уже пустой!", false);
    }
}



// ============================== Погода ==============================
let forceRain = false;
let weather = Math.random() < 0.3 ? "rainy" : "sunny";
let daysOfRain = 0;
let daysWithoutRain = 0;

function updateWeatherAndVoltage() {
    if (forceRain) {
        weather = "rainy";
        daysOfRain = 0;
    } else if (daysWithoutRain > 0) {
        daysWithoutRain -= 1;
        weather = "sunny";
    } else if (daysOfRain > 0) {
        daysOfRain -= 1;
        weather = "rainy";
    } else {
        if (hours >= 6 && hours < 18) {
            if (Math.random() < 0.3) {
                weather = "rainy";
                if (Math.random() < 0.5) {
                    daysOfRain = Math.floor(Math.random() * 3) + 2;
                }
            } else {
                weather = "sunny";
            }
        } else {
            weather = "night";
        }

        if (daysOfRain > 0) {
            daysWithoutRain = 14;
        }
    }
    updateWeatherDisplay();
}

function updateWeatherDisplay() {
    const weatherStatus = document.getElementById('weather-status');
    if (weatherStatus) {
        weatherStatus.innerText = getWeatherEmoji(weather);
    }
    updateMobileDisplay();
}

function getWeatherEmoji(weather) {
    switch (weather) {
        case "sunny":
            return '☀️☀️☀️';
        case "night":
            return '🌙 🌙 🌙';
        case "rainy":
            return '🌧️🌧️🌧️';
        default:
            return '❓❓❓';
    }
}


// ============================== Электричество ==============================
let voltage = 13.3;

function getBatteryPercentage(voltage) {
    if (voltage >= 13.3) {
        return 100;
    } else if (voltage <= 12.9) {
        return 0;
    } else {
        return Math.floor(((voltage - 12.9) / (13.3 - 12.9)) * 100);
    }
}

function updateVoltage() {
    if (weather === "night") {
        voltage -= 0.1 / 12;
        if (voltage < 12.9) voltage = 12.9;
    } else if (weather === "rainy") {
        voltage -= 0.2 / 24;
        if (voltage < 12.9) voltage = 12.9;
    } else if (weather === "sunny") {
        if (voltage < 13.3) {
            voltage += 0.1 / 24;
            if (voltage > 13.3) voltage = 13.3;
        }
    }
    if (voltage === 12.9) {
        showBatteryActions();
    }
    updateVoltageDisplay();
}

function updateVoltageDisplay() {
    const voltageDisplay = document.getElementById('voltage-display');
    if (voltageDisplay) {
        const batteryPercentage = Math.floor(getBatteryPercentage(voltage));
        const batteryEmoji = batteryPercentage > 0 ? '🔋' : '🪫';
        voltageDisplay.innerText = `${batteryEmoji} ${voltage.toFixed(1)} V (${batteryPercentage}%)`;
    }
    updateMobileDisplay();
}
// ============================== Управление кнопками ==============================
function showBatteryActions() {
    const engineButton = document.getElementById('engine-button');
    const campingButton = document.getElementById('camping-button');
    if (engineButton && campingButton) {
        engineButton.style.display = 'block';
        campingButton.style.display = 'block';
    }
}

function startEngine() {
    voltage = 13.0;
    hideBatteryActions();
    const startEngineMessages = window.translations.start_engine_messages || ["Let the engine run for an hour!"];
    const randomMessage = startEngineMessages[Math.floor(Math.random() * startEngineMessages.length)];
    showNotification(randomMessage, false);
    updateVoltageDisplay();
}

function goCamping() {
    if (money >= 25) {
        money -= 25;
        voltage = 13.3;
        hideBatteryActions();
        const campingMessages = window.translations.camping_expensive_messages || ["Camping is always good, but expensive!"];
        const randomMessage = campingMessages[Math.floor(Math.random() * campingMessages.length)];
        showNotification(randomMessage, false);
        updateStats();
        updateVoltageDisplay();
    } else {
        const noMoneyCampingMessages = window.translations.no_money_for_camping_messages || ["Not enough money for camping!"];
        const randomMessage = noMoneyCampingMessages[Math.floor(Math.random() * noMoneyCampingMessages.length)];
        showNotification(randomMessage, true);
    }
}

function hideBatteryActions() {
    const engineButton = document.getElementById('engine-button');
    const campingButton = document.getElementById('camping-button');
    if (engineButton && campingButton) {
        engineButton.style.display = 'none';
        campingButton.style.display = 'none';
    }
}

// ============================== Бюджет ==============================
function earnMoney() {
    money += 23;
    updateBudgetDisplay();

    // Добавляем уведомление с рандомным текстом
    const earnMoneyMessages = window.translations.earn_money_messages || ["Вы заработали немного денег!"];
    const randomMessage = earnMoneyMessages[Math.floor(Math.random() * earnMoneyMessages.length)];
    showNotification(randomMessage, false);
}

function updateBudgetDisplay() {
    const budgetAmount = document.getElementById('budget-amount');
    if (budgetAmount) {
        budgetAmount.innerText = money.toFixed(2);
    }
    updateMobileDisplay();
}


// ============================== Уведомления ==============================
function showNotification(message, isCritical) {
    const container = document.getElementById('notification-container');
    const notification = document.createElement('div');
    notification.classList.add(isCritical ? 'notification-critical' : 'notification-light');
    notification.innerText = message;

    container.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 500);
    }, 3000);
}

function updateStats() {
    updateBar('water-bar', Math.max(0, Math.min(100, water)), '#00BFFF', '#FF4500', false, 30);
    updateBar('toilet-bar', Math.max(0, Math.min(100, toilet)), '#FF6347', '#8B4513', true, 70);
    updateBar('gas-bar', Math.max(0, Math.min(100, gas)), '#FFD700', '#FF4500');
    updateBar('fridge-bar', Math.max(0, Math.min(100, fridge)), '#87CEFA', '#FF4500', false, 20);
    updateBar('diesel-bar', Math.max(0, Math.min(100, diesel)), '#2F4F4F', '#FF4500');
    updateBar('laundry-bar', Math.max(0, Math.min(100, laundry)), '#8B0000', '#A9A9A9', false, 80);

    updateBudgetDisplay();
    updateWeatherDisplay();
    updateVoltageDisplay();
}

function updateBar(barId, value, startColor, endColor, reverse = false, threshold = 50) {
    const bar = document.getElementById(barId);
    if (bar) {
        value = parseFloat(value.toFixed(2));
        bar.style.width = value + '%';
        bar.innerText = value + '%';
        bar.style.backgroundColor = value > threshold ? startColor : endColor;
    }
}

function updateMobileDisplay() {
    const time = document.getElementById("time-display")?.innerText;
    const weather = document.getElementById("weather-display")?.innerText;
    const voltage = document.getElementById("voltage-display")?.innerText;
    const money = document.getElementById("money-display")?.innerText;

    const mobileDisplay = document.getElementById("mobile-display");
    if (mobileDisplay) {
        mobileDisplay.innerText = `${time} / ${weather}\n${voltage} / ${money}`;
    }
}

setInterval(() => {
    incrementTime();
    updateTimeDisplay();
    updateVoltage();

    if (minutes === 0) {
        updateWeatherAndVoltage();

        const waterDecrement = 100 / 3;
        const toiletIncrement = 100 / 3;
        const gasDecrement = 100 / 7;
        const fridgeDecrement = 100 / 4.5;
        const dieselDecrement = 100 / 8;
        const laundryIncrement = 100 / 7;

        water -= waterDecrement / 24;
        toilet += toiletIncrement / 24;
        gas -= gasDecrement / 24;
        fridge -= fridgeDecrement / 24;
        diesel -= dieselDecrement / 24;
        laundry += laundryIncrement / 24;

        if (water < 0) water = 0;
        if (toilet > 100) toilet = 100;
        if (gas < 0) gas = 0;
        if (fridge < 0) fridge = 0;
        if (diesel < 0) diesel = 0;
        if (laundry > 100) laundry = 100;

        updateStats();
    }
}, 1000);

document.addEventListener("DOMContentLoaded", function() {
    updateMobileDisplay();
    observeChanges();
});

function observeChanges() {
    const targetNodes = [
        document.getElementById("time-display"),
        document.getElementById("weather-display"),
        document.getElementById("voltage-display"),
        document.getElementById("money-display")
    ];

    const observer = new MutationObserver(() => {
        updateMobileDisplay();
    });

    targetNodes.forEach(node => {
        if (node) {
            observer.observe(node, { childList: true, subtree: true });
        }
    });
}
document.addEventListener("DOMContentLoaded", function() {
    updateMobileDisplay();
    observeChanges();
});


// ============================== Перевод на другие языки ==============================

document.addEventListener('DOMContentLoaded', function() {
    // Проверяем, что переменная vanlifeGameConfig и translationUrl существуют
    if (typeof vanlifeGameConfig !== 'undefined' && vanlifeGameConfig.translationUrl) {
        console.log('Translation URL:', vanlifeGameConfig.translationUrl); // Для отладки
        loadTranslations(vanlifeGameConfig.translationUrl);  // Загружаем файл перевода
    } else {
        console.error('Translation URL not found. Unable to load translations.');
    }
});

function loadTranslations(url) {
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                console.error(`Не удалось загрузить файл перевода по адресу: ${url}`);
                return;
            }
            return response.json();
        })
        .then(data => {
            if (data) {
                window.translations = data;
                updateTexts();  // Применяем переводы на страницу
            }
        })
        .catch(error => {
            console.error('Ошибка загрузки переводов:', error);
        });
}

function updateTexts() {
    // Пример обновления текстов на странице
    const gameTitle = document.getElementById('game-title');
    if (gameTitle && window.translations.vanlife_title) {
        gameTitle.innerText = window.translations.vanlife_title;
    }

    const dayLabel = document.getElementById('day-label');
    if (dayLabel && window.translations.day) {
        dayLabel.innerText = window.translations.day;
    }

    const budgetLabel = document.getElementById('budget-label');
    if (budgetLabel && window.translations.budget) {
        budgetLabel.innerText = window.translations.budget;
    }

    // Статусы ресурсов
    const waterLabel = document.getElementById('water-label');
    if (waterLabel && window.translations.water) {
        waterLabel.innerText = window.translations.water;
    }
    const toiletLabel = document.getElementById('toilet-label');
    if (toiletLabel && window.translations.toilet) {
        toiletLabel.innerText = window.translations.toilet;
    }
    const gasLabel = document.getElementById('gas-label');
    if (gasLabel && window.translations.gas) {
        gasLabel.innerText = window.translations.gas;
    }
    const fridgeLabel = document.getElementById('fridge-label');
    if (fridgeLabel && window.translations.fridge) {
        fridgeLabel.innerText = window.translations.fridge;
    }
    const dieselLabel = document.getElementById('diesel-label');
    if (dieselLabel && window.translations.diesel) {
        dieselLabel.innerText = window.translations.diesel;
    }
    const laundryLabel = document.getElementById('laundry-label');
    if (laundryLabel && window.translations.laundry) {
        laundryLabel.innerText = window.translations.laundry;
    }

    // Кнопки действий
    const earnButton = document.getElementById('earn-money-button');
    if (earnButton && window.translations.earn_money) {
        earnButton.innerText = window.translations.earn_money;
    }
    const fillWaterBtn = document.getElementById('fill-water-btn');
    if (fillWaterBtn && window.translations.fill) {
        fillWaterBtn.innerText = window.translations.fill;
    }
    const emptyToiletBtn = document.getElementById('empty-toilet-btn');
    if (emptyToiletBtn && window.translations.empty) {
        emptyToiletBtn.innerText = window.translations.empty;
    }
    const fillGasBtn = document.getElementById('fill-gas-btn');
    if (fillGasBtn && window.translations.fill) {
        fillGasBtn.innerText = window.translations.fill;
    }
    const fillFridgeBtn = document.getElementById('fill-fridge-btn');
    if (fillFridgeBtn && window.translations.stock) {
        fillFridgeBtn.innerText = window.translations.stock;
    }
    const fillDieselBtn = document.getElementById('fill-diesel-btn');
    if (fillDieselBtn && window.translations.refuel) {
        fillDieselBtn.innerText = window.translations.refuel;
    }
    const doLaundryBtn = document.getElementById('do-laundry-btn');
    if (doLaundryBtn && window.translations.wash) {
        doLaundryBtn.innerText = window.translations.wash;
    }

    // Пример для других текстов
    const startEngineButton = document.getElementById('engine-button');
    if (startEngineButton && window.translations.start_engine) {
        startEngineButton.innerText = window.translations.start_engine;
    }

    const campingButton = document.getElementById('camping-button');
    if (campingButton && window.translations.go_camping) {
        campingButton.innerText = window.translations.go_camping;
    }

    // Добавьте другие элементы, которые нужно перевести
}


// ============================== LocalStorage Integration for Resources ==============================

// Define resource variables with unique names
let waterLevel = 0;       // Water level
let toiletStatus = 100;    // Toilet status
let gasLevel = 1.45;      // Gas level
let fridgeStatus = 0;      // Fridge level
let dieselLevel = 19.4;   // Diesel level
let laundryStatus = 0;     // Laundry status

// Function to safely retrieve and parse resource values from localStorage
function getSavedValue(key, defaultValue) {
    const savedValue = localStorage.getItem(key);
    return savedValue !== null ? parseFloat(savedValue) : defaultValue;
}

// Function to load the game state from localStorage, including resources
function loadGameState() {
    days = getSavedValue('days', 1);
    hours = getSavedValue('hours', 0);
    minutes = getSavedValue('minutes', 0);
    money = getSavedValue('money', 1500);

    // Load resources using unique variable names
    waterLevel = getSavedValue('waterLevel', 0);
    toiletStatus = getSavedValue('toiletStatus', 100);
    gasLevel = getSavedValue('gasLevel', 1.45);
    fridgeStatus = getSavedValue('fridgeStatus', 0);
    dieselLevel = getSavedValue('dieselLevel', 19.4);
    laundryStatus = getSavedValue('laundryStatus', 0);
}

// Function to save the game state into localStorage, including resources
function saveGameState() {
    localStorage.setItem('days', days);
    localStorage.setItem('hours', hours);
    localStorage.setItem('minutes', minutes);
    localStorage.setItem('money', money);

    // Save resources with unique variable names to localStorage
    localStorage.setItem('waterLevel', waterLevel);
    localStorage.setItem('toiletStatus', toiletStatus);
    localStorage.setItem('gasLevel', gasLevel);
    localStorage.setItem('fridgeStatus', fridgeStatus);
    localStorage.setItem('dieselLevel', dieselLevel);
    localStorage.setItem('laundryStatus', laundryStatus);
}

// Load the game state when the page is loaded
window.onload = function() {
    loadGameState();  // Restore saved game state and resources
    updateUI();  // Update the UI based on loaded data
};

// Call saveGameState when game values or resources are updated

// Update the game's UI to reflect the current state of the game, including resources
function updateUI() {
    console.log(`Days: ${days}, Hours: ${hours}, Minutes: ${minutes}, Money: ${money}`);
    console.log(`Water: ${waterLevel}%, Toilet: ${toiletStatus}%, Gas: ${gasLevel}%, Fridge: ${fridgeStatus}%, Diesel: ${dieselLevel}%, Laundry: ${laundryStatus}`);
    // Here you can update UI elements related to days, hours, minutes, money, and all resources
    // The actual UI updating code should already exist in your game logic, this just triggers it
}
