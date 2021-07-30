require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const api = require('covid19-api');
const CONTRIES_LIST = require('./constans');

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start((ctx) =>
  ctx.reply(
    `
  Привет ${ctx.message.from.first_name}!
  Узнай статистику по КОронавирусу.
  Введи на английском название страны и получит статистику.
  Посмотреть список стран можно коммандой /help.
  `,Markup.keyboard([
        ['/help'],
        ['US', 'Russia'],
        ['Canada', 'UK'],
    ]).resize()
  ));
bot.help((ctx) => ctx.reply(CONTRIES_LIST));
bot.on('text', async(ctx) => {
  let data = {};

  try {
  data = await api.getReportsByCountries(ctx.message.text);

  const formatData = `
Страна: ${data[0][0].country}
Случаи: ${data[0][0].cases}
Смертей:${data[0][0].deaths}
Вылечились: ${data[0][0].recovered}
  `;
  ctx.reply(formatData);
  } catch {
    console.log('Ошибка');
    ctx.reply('Ошибка, такой страны не существует');
  }
});
bot.launch();