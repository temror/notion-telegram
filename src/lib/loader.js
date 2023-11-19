export class Loader {
    icon = 'Загружается ... 🕐'

    message = null

    constructor(ctx) {
        this.ctx = ctx;
    }

    async show() {
        this.message = await this.ctx.reply(this.icon)
    }

    hide() {
        this.ctx.telegram.deleteMessage(this.ctx.chat.id, this.message.message_id)
    }
}