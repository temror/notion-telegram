import {Telegraf} from "telegraf";
import {message} from "telegraf/filters";
import config from "config";
import {sendToNotion} from "./lib/notion.js"
import {Loader} from "./lib/loader.js";
import { UseStore } from "./lib/store.js";

const bot = new Telegraf(config.get('TELEGRAM_TOKEN'), {
    handlerTimeout: Infinity
});

const store = new UseStore()

store.init(bot)

bot.on(message('text'), async (ctx) => {
    try {
        const waiting = store.waitingAnswer(ctx)

        if (waiting) return true

        const loader = new Loader(ctx)

        const text = ctx.message.text;

        const currentItem = store.items[store.CONTENT_TYPE]

        if (!text.trim()) ctx.reply('Текст не может быть пустым!')

        await loader.show()

        await sendToNotion(text)

        await loader.hide()

        ctx.reply(`${currentItem.title} успешно добавлен${currentItem.male ? "" : "а"}! 🎉🎉🎉`)

        store.clearWaiting()

    } catch (e) {
        console.error(e.message)
    }
})

bot.launch()
