const TelegramBot = require('node-telegram-bot-api'); // подключение библиотеки telegram для работы бота

const bot = new TelegramBot('YOR_TOKEN', { polling: true }); // задание токена для подключения к созданному боту

bot.setMyCommands([ // задание команд, которые понимает бот
    {command: '/start', description: 'Начать игру'},
    {command: '/info', description: 'Информация о пользователе'},
])

class Person { // создание класса для любого персонажа с его характеристиками
    constructor(options){
        this.health = options.health; // здоровье персонажа
        this.strength = options.strength; // сила персонажа
        this.dexterity = options.dexterity; // ловкость персонажа
        this.intelligence = options.intelligence; // интеллект персонажа
        this.wisdom = options.wisdom; // мудрость персонажа
        this.charisma = options.charisma; // харизма персонажа
        this.weapon = options.weapon; // оружие персонажа
    }
}

let warrior = new Person({ // объект класса Person - наш главный герой
    health: 20,
    strength: 2,
    dexterity: 4,
    intelligence: 0,
    wisdom: 3,
    charisma: 0,
    weapon: 'рука'
})

let guard = new Person({ // объект класса Person - враг
    health: 20,
    strength: 2,
    dexterity: 2,
    intelligence: 0,
    wisdom: 0,
    charisma: 1,
    weapon: 'меч'
})

function generateRandomNumber20() { // функция по генерации числа от 1 до 20
    return Math.floor(Math.random() * 20) + 1;
}

function generateRandomNumber4() { // функция по генерации числа от 1 до 4
    return Math.floor(Math.random() * 4) + 1;
}

// сцены для игры, непосредственно переход от одного к другому происходит по индексу каждой сцены, также имеются дополнительные значения

const scenarios = [
    {
        id: 0, // индекс сцены
        text: 'Добро пожаловать, воин. Здесь вы сможете сыграть в игру, посвященную dnd', // текст выводящийся при выводе сцены
        sticker: 'https://tlgrm.ru/_/stickers/982/760/98276057-3f29-4c0e-a079-98ca4029d42e/192/40.webp', // стикер выводящийся при выводе сцены
        options: [
            { text: 'Начать приключение', nextScene: 1 } // варианты выбора выводящийся при выводе сцены и следующая сцена при нажатии на кнопку
        ]
    },
    {
        id: 1,
        text: 'Добро пожаловать воин. ' +
            '\n\nВы просыпаетесь с сильной головной болью в кромешной тьме, вы ничего не видите, поэтому можете опираться только слух и осязание.' +
            '\n\nВы ничего не помните. У вас сильная головная боль. Попытки вспомнить как вы здесь оказались не увенчиваются успехом, вы даже не можете вспомнить ваше имя. ' +
            '\n\nВаши дальнейшие действия: ',
        sticker: 'https://tlgrm.ru/_/stickers/982/760/98276057-3f29-4c0e-a079-98ca4029d42e/192/47.webp',
        options: [
            { text: 'Лечь спать', nextScene: 2 },
            { text: 'Закричать', nextScene: 3 },
            { text: 'Обыскать темницу', nextScene: 4 },
            { text: 'Совершить самоубийство', nextScene: 0 }
        ]
    },
    {
        id: 2,
        text: 'Вы ложитесь спать и ничего не происходит. Вы просываетесь непонятно через сколько часов, так как вам не определить сколько сейчас времени. Ваши действия:',
        sticker: 'https://tlgrm.ru/_/stickers/982/760/98276057-3f29-4c0e-a079-98ca4029d42e/192/48.webp',
        options: [
            { text: 'Лечь спать', nextScene: 2 },
            { text: 'Закричать', nextScene: 3 },
            { text: 'Обыскать темницу', nextScene: 4 },
            { text: 'Совершить самоубийство', nextScene: 0 }
        ]
    },
    {
        id: 3,
        text: 'Ничего не происходит, но вдалеке раздается сильный собачий лай. Ваши действия:',
        sticker: 'https://tlgrm.ru/_/stickers/982/760/98276057-3f29-4c0e-a079-98ca4029d42e/192/29.webp',
        options: [
            { text: 'Лечь спать', nextScene: 2 },
            { text: 'Закричать в ответ', nextScene: 5 },
            { text: 'Обыскать темницу', nextScene: 4 },
            { text: 'Совершить самоубийство', nextScene: 0 }
        ]
    },
    {
        id: 4,
        text: 'Обойдя по стенам помещения, вы понимаете, что находитесь в темнице. Вы на ощупь находите железные прутья с замочной скважиной и недалеко от нее скелет. По видимому он здесь уже давно. Ваши действия:',
        sticker: 'https://tlgrm.ru/_/stickers/982/760/98276057-3f29-4c0e-a079-98ca4029d42e/192/36.webp',
        options: [
            { text: 'Лечь спать', nextScene: 2 },
            { text: 'Закричать', nextScene: 3},
            { text: 'Обыскать скелет', nextScene: 6 },
            { text: 'Совершить самоубийство', nextScene: 0 }
        ]
    },
    {
        id: 5,
        text: 'Вы закричали в ответ, собаки стали гавкать еще сильнее, что разбудило стражника спящего недалеко от места, где вы находитесь, оказалось, что это темница. Стражник подходит к вашей клетке и отрубает вам голову мечом.',
        sticker: 'https://tlgrm.ru/_/stickers/982/760/98276057-3f29-4c0e-a079-98ca4029d42e/192/42.webp',
        options: [
            { text: 'Начать заново', nextScene: 0},
        ]
    },
    {
        id: 6,
        text: 'Вы тщательно, насколько это возможно, почти в слепую, обыскиваете скелет и находите связку ключей. Ваши действия:',
        sticker: 'https://cdn.tlgrm.app/stickers/982/760/98276057-3f29-4c0e-a079-98ca4029d42e/192/11.webp',
        options: [
            { text: 'Лечь спать', nextScene: 2 },
            { text: 'Закричать', nextScene: 3},
            { text: 'Попробовать отпереть дверь найденным ключом', nextScene: 7 },
            { text: 'Совершить самоубийство', nextScene: 0 }
        ]
    },
    {
        id: 7,
        text: 'Дверь со скрипом открывается, вдалеке слышен храп, скорее всего там находится какой-то человек. Ваши действия',
        sticker: 'https://tlgrm.ru/_/stickers/982/760/98276057-3f29-4c0e-a079-98ca4029d42e/192/31.webp',
        options: [
            { text: 'Вернуться в темницу и лечь спать', nextScene: 9 },
            { text: 'Закричать', nextScene: 8},
            { text: 'Пройти вперед', nextScene: 10 },
            { text: 'Совершить самоубийство', nextScene: 0 }
        ]
    },
    {
        id: 8,
        text: 'Вы закричали, вдруг собаки где-то в конце коридора стали гавкать, что разбудило стражника спящего недалеко от места, где вы находитесь. Стражник подходит к вам и отрубает вам голову мечом.',
        sticker: 'https://tlgrm.ru/_/stickers/982/760/98276057-3f29-4c0e-a079-98ca4029d42e/192/42.webp',
        options: [
            { text: 'Начать заново', nextScene: 0},
        ]
    },
    {
        id: 9,
        text: 'Спи спи',
        sticker: 'https://tlgrm.ru/_/stickers/982/760/98276057-3f29-4c0e-a079-98ca4029d42e/192/27.webp',
        options: [
            { text: 'Продолжить путь', nextScene: 7 }
        ]
    },
    {
        id: 10,
        text: 'Вы аккуратно крадетесь вперед. Совсем рядом вы видите очертания человека, по-видимому стражника. Ваши действия: ',
        sticker: 'https://cdn.tlgrm.app/stickers/982/760/98276057-3f29-4c0e-a079-98ca4029d42e/192/7.webp',
        options: [
            { text: 'Напасть на стражника', nextScene: 11 },
            { text: 'Пройти аккуратно мимо', nextScene: 12 }
        ]
    },
    {
        id: 11,
        text: 'Ваши действия по нападению на противника:',
        sticker: '',
        options: [
            { text: 'Пока стражник спит выхватить его меч и ударить мечом', nextScene: 15 },
            { text: 'Ударить стражника по лицу, чтобы его разбудить', nextScene: 16 },
            { text: 'Ударить кулаком стражнику в грудь', nextScene: 17 },
            { text: 'Вонзить в стражника ключ, которым вы открывали дверь темницы', nextScene: 18 }
        ]
    },
    {
        id: 12,
        text: 'Вы идете дальше и видете железную дверь, оттуда сочится свет, возможно это выход из тюрьмы, где вас держат. Ваши действия:',
        sticker: 'https://tlgrm.ru/_/stickers/982/760/98276057-3f29-4c0e-a079-98ca4029d42e/192/36.webp',
        options: [
            { text: 'Открыть дверь', nextScene: 13 },
            { text: 'Вернуться назад', nextScene: 10 }
        ]
    },
    {
        id: 13,
        text: 'Дверь не поддается',
        sticker: 'https://tlgrm.ru/_/stickers/982/760/98276057-3f29-4c0e-a079-98ca4029d42e/192/30.webp',
        options: [
            { text: 'Попробовать взломать дверь', nextScene: 14 },
            { text: 'Вернуться назад', nextScene: 10 }
        ]
    },
    {
        id: 14,
        text: 'Ключами, которые у вас остались от скелета вы пробуете открыть дверь подбирая поочереди каждый ключ, но к сожалению ни один не подходит.',
        sticker: 'https://tlgrm.ru/_/stickers/982/760/98276057-3f29-4c0e-a079-98ca4029d42e/192/23.webp',
        options: [
            { text: 'Вернуться назад', nextScene: 10 }
        ]
    },
    {
        id: 15,
        text: `Сноска: ` +
            `\n\nДля продолжения игры требуется объяснить базовые понятия в боевой системе dnd` +
            `\n\nУ каждого персонажа имеется характеристики, в вашем случае ваши характеристики:` +
            `\n\nЗдоровье: _${warrior.health}_`+
            `\nМодификатор Ловкость: _${warrior.dexterity}_`+
            `\nМодификатор Интеллект: _${warrior.intelligence}_`+
            `\nМодификатор Мудрость: _${warrior.wisdom}_`+
            `\nМодификатор Сила: _${warrior.strength}_`+
            `\nМодификатор Харизма: _${warrior.charisma}_`+
            `\nОружие: _${warrior.weapon}_`+
            `\n\nВы наносите удар по противнику, но для начала кидается кубик d20, который показывает попал ли ваш герой в противника или промахнулся. Далее кидается второй кубик, который показывает сколько урона нанес ваш персонаж, это значение отнимается от здоровья противника, но следует помнить, что также здоровье может отниматься и у вас, если противник по вам попал и нанес урон.`,
        sticker: 'https://tlgrm.ru/_/stickers/982/760/98276057-3f29-4c0e-a079-98ca4029d42e/192/21.webp',
        options: [
            { text: 'Продолжить', nextScene: 19 },
        ]
    },
    {
        id: 16,
        text: `Сноска: ` +
            `\n\nДля продолжения игры требуется объяснить базовые понятия в боевой системе dnd` +
            `\n\nУ каждого персонажа имеется характеристики, в вашем случае ваши характеристики:` +
            `\n\nЗдоровье: _${warrior.health}_`+
            `\nМодификатор Ловкость: _${warrior.dexterity}_`+
            `\nМодификатор Интеллект: _${warrior.intelligence}_`+
            `\nМодификатор Мудрость: _${warrior.wisdom}_`+
            `\nМодификатор Сила: _${warrior.strength}_`+
            `\nМодификатор Харизма: _${warrior.charisma}_`+
            `\nОружие: _${warrior.weapon}_`+
            `\n\nВы наносите удар по противнику, но для начала кидается кубик d20, который показывает попал ли ваш герой в противника или промахнулся. Далее кидается второй кубик, который показывает сколько урона нанес ваш персонаж, это значение отнимается от здоровья противника, но следует помнить, что также здоровье может отниматься и у вас, если противник по вам попал и нанес урон.`,
        sticker: '',
        options: [
            { text: 'Продолжить', nextScene: 20 },
        ]
    },
    {
        id: 17,
        text: `Сноска: ` +
            `\n\nДля продолжения игры требуется объяснить базовые понятия в боевой системе dnd` +
            `\n\nУ каждого персонажа имеется характеристики, в вашем случае ваши характеристики:` +
            `\n\nЗдоровье: _${warrior.health}_`+
            `\nМодификатор Ловкость: _${warrior.dexterity}_`+
            `\nМодификатор Интеллект: _${warrior.intelligence}_`+
            `\nМодификатор Мудрость: _${warrior.wisdom}_`+
            `\nМодификатор Сила: _${warrior.strength}_`+
            `\nМодификатор Харизма: _${warrior.charisma}_`+
            `\nОружие: _${warrior.weapon}_`+
            `\n\nВы наносите удар по противнику, но для начала кидается кубик d20, который показывает попал ли ваш герой в противника или промахнулся. Далее кидается второй кубик, который показывает сколько урона нанес ваш персонаж, это значение отнимается от здоровья противника, но следует помнить, что также здоровье может отниматься и у вас, если противник по вам попал и нанес урон.`,
        sticker: '',
        options: [
            { text: 'Продолжить', nextScene: 21 },
        ]
    },
    {
        id: 18,
        text: `Сноска: ` +
            `\n\nДля продолжения игры требуется объяснить базовые понятия в боевой системе dnd` +
            `\n\nУ каждого персонажа имеется характеристики, в вашем случае ваши характеристики:` +
            `\n\nЗдоровье: _${warrior.health}_`+
            `\nМодификатор Ловкость: _${warrior.dexterity}_`+
            `\nМодификатор Интеллект: _${warrior.intelligence}_`+
            `\nМодификатор Мудрость: _${warrior.wisdom}_`+
            `\nМодификатор Сила: _${warrior.strength}_`+
            `\nМодификатор Харизма: _${warrior.charisma}_`+
            `\nОружие: _${warrior.weapon}_`+
            `\n\nВы наносите удар по противнику, но для начала кидается кубик d20, который показывает попал ли ваш герой в противника или промахнулся. Далее кидается второй кубик, который показывает сколько урона нанес ваш персонаж, это значение отнимается от здоровья противника, но следует помнить, что также здоровье может отниматься и у вас, если противник по вам попал и нанес урон.`,
        sticker: '',
        options: [
            { text: 'Продолжить', nextScene: 22 },
        ]
    },
    {
        id: 19,
        text: `Выхватив меч у стражника вы пытаетесь ударить его и кидаете кубик d20, следом, при попадании вы кидаете кубик d4, если его значение равно 0, значит вы не попали и урона не нанесли.` +
        `\nТак как вашим оружием на данный момент является меч, то к выпавшему значению урона прибавляется ващ модификатор силы = 2.`,
        sticker: '',
        rand20: 'd20', // генерация числа от 1 до 20
        rand4: 'd4', // генерация числа от 1 до 4
        options: [
            { text: 'Бросить кубики', nextScene: 20 },
        ]
    },
    {
        id: 20,
        text: ``,
        target: 'damage4', // атака персонажа и нанесенный урон
        sticker: '',
        options: [
            { text: 'Бросить кубики', nextScene: 21 },
        ]
    },
    {
        id: 21,
        text: 'Ваш ход, бросаете кубики: ',
        rand20: 'd20',
        rand4: 'd4',
        sticker: '',
        options: [
            { text: 'Бросить кубики', nextScene: 20 },
        ]
    },
    {
        id: 22,
        text: `Вы пытаесь ударить противника, бросайте кубики:`,
        target: 'damage4',
        sticker: 'https://tlgrm.ru/_/stickers/982/760/98276057-3f29-4c0e-a079-98ca4029d42e/192/45.webp',
        options: [
            { text: 'Бросить кубики', nextScene: 23 },
        ]
    },
    {
        id: 23,
        text: ``,
        target: 'damage4',
        sticker: '',
        options: [
            { text: 'Бросить кубики', nextScene: 24 },
        ]
    },
    {
        id: 24,
        text: 'Ваш ход, бросаете кубики: ',
        rand20: 'd20',
        rand4: 'd4',
        sticker: '',
        options: [
            { text: 'Бросить кубики', nextScene: 23 },
        ]
    },
    {
        id: 99,
        text: 'Вы умерли',
        sticker: 'https://cdn.tlgrm.app/stickers/982/760/98276057-3f29-4c0e-a079-98ca4029d42e/192/1.webp',
        options: [
            { text: 'Начать заново', nextScene: 0},
        ]
    },
    {
        id: 30,
        text: 'Вы находите у стражника ключ от железной двери, вы свободны, поздравляю!',
        sticker: 'https://tlgrm.ru/_/stickers/982/760/98276057-3f29-4c0e-a079-98ca4029d42e/192/19.webp',
        options: [
            { text: 'Начать заново', nextScene: 0},
        ]
    }

];

const userScenes = {};

bot.onText(/\/start/, (msg) => { // при нажатии на кнопку /start происходит вывод первой сцены
    const chatId = msg.chat.id;
    sendScene(chatId, 0);
});

bot.onText(/\/info/, (msg) => { // при нажатии на кнопку /info происходит вывод информации о том, кто играет
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, `Ваше имя ${msg.from.first_name}, воин`)
});

bot.on('text', (msg) => { // вывод текста для сообщения - достается из массива scenarios и добавляется на сцену данные внутри тега text
    const chatId = msg.chat.id;
    const text = msg.text;

    const currentScene = getCurrentScene(chatId);

    if (currentScene) {
        const selectedOption = currentScene.options.find(option => option.text === text);

        if (selectedOption) {
            sendScene(chatId, selectedOption.nextScene);
        } else {
            bot.sendMessage(chatId, `Пожалуйста, выберите один из предложенных вариантов.`); // если пользователь ввел неизвестные данные, то выводится это сообщение
        }
    }
});

function sendScene(chatId, sceneId) { // процесс смены сцен
    const scene = scenarios.find(s => s.id === sceneId);

    if (scene) {
        updateUserScene(chatId, scene);

        let num = generateRandomNumber20();
        let num4 = 0;

        // генерация чисел d20 и d4 для подсчета попадания и урона нанесенного самим персонажем или врагом

        if('rand20' in scene && num > 10) {
            num4 = generateRandomNumber4();

            guard.health = guard.health - (num4 + warrior.strength)

            if (guard.health > 0) {
                bot.sendMessage(chatId, `\n${scene.text} \n\n d20: ${num} \n d4: ${num4 + warrior.strength} \n\n Вы нанесли ${num4 + warrior.strength} урона стражнику, теперь у него ${guard.health}.`, {
                    reply_markup: {
                        keyboard: scene.options.map(option => [{text: option.text}]),
                        resize_keyboard: true,
                        one_time_keyboard: true
                    }
                });
            }
            if (guard.health <= 0){
                sendScene(chatId, 30);
                guard.health = 20;
                warrior.health = 20;
            }
        }else if('rand20' in scene && num <= 10) {
            bot.sendMessage(chatId, `${scene.text}  \n\n d20: ${num} \n d4: 0 \n\n Вы нанесли ${num4} урона стражнику, теперь у него ${guard.health}.`, {
                reply_markup: {
                    keyboard: scene.options.map(option => [{ text: option.text }]),
                    resize_keyboard: true,
                    one_time_keyboard: true
                }
            });
        }else{
            bot.sendMessage(chatId, `${scene.text}`, {
                reply_markup: {
                    keyboard: scene.options.map(option => [{ text: option.text }]),
                    resize_keyboard: true,
                    one_time_keyboard: true
                }
            });
        }

        let guard_num_20 = generateRandomNumber20();
        let guard_num_4 = 0;

        if('target' in scene && guard_num_20 > 10){

            num4 = generateRandomNumber4();

            warrior.health = warrior.health - (guard_num_4 + guard.strength)

            if(warrior.health > 0) {
                bot.sendMessage(chatId, `\n${scene.text} \n\n d20: ${num} \n d4: ${guard_num_4 + guard.strength} \n\n Он нанес ${guard_num_4 + guard.strength} урона вам, теперь у вас ${warrior.health}.`, {
                    reply_markup: {
                        keyboard: scene.options.map(option => [{text: option.text}]),
                        resize_keyboard: true,
                        one_time_keyboard: true
                    }
                });
            }
            if (warrior.health <= 0){
                sendScene(chatId, 99);
                warrior.health = 20;
                guard.health = 20;
            }
        }else if('target' in scene && guard_num_20 <= 10) {
            bot.sendMessage(chatId, `${scene.text}  \n\n d20: ${num} \n d4: 0 \n\n Он нанес ${guard_num_4} урона вам, теперь у вас ${warrior.health}.`, {
                reply_markup: {
                    keyboard: scene.options.map(option => [{ text: option.text }]),
                    resize_keyboard: true,
                    one_time_keyboard: true
                }
            });
        }

        bot.sendSticker(chatId, scene.sticker);

    } else {
        bot.sendMessage(chatId, 'Упс! Что-то пошло не так.');
    }

}

// обновление сцены
function updateUserScene(chatId, scene) {
    userScenes[chatId] = { sceneId: scene.id };
}

// проверка на текущую сцену для перехода на след сцену
function getCurrentScene(chatId) {
    const userScene = userScenes[chatId];
    return userScene ? scenarios.find(scene => scene.id === userScene.sceneId) : null;
}

