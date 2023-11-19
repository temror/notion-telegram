export class UseStore{
    constructor() {
        //Singleton

        if (!!UseStore.instance) {
            return UseStore.instance;
        }

        UseStore.instance = this;

        return this;
    }

    CONTENT_TYPE = null

    items= {
        film: {
            value: 'film',
            intro: '📽 Введите название фильма:',
            db: 'NOTION_DB_ID_FILM',
            title: 'Фильм',
            male: true
        },
        book: {
            value: 'book',
            intro: '📖 Введите название книги:',
            db: 'NOTION_DB_ID_BOOK',
            title: 'Книга',
            male: false
        },
        note: {
            value: 'note',
            intro: '📄 Введите заголовок заметки: ',
            db: 'NOTION_DB_ID_NOTE',
            title: 'Заметка',
            noteTitle: null,
            male: false
        },
        idea: {
            value: 'idea',
            intro: '💡 Введите идею: ',
            db: 'NOTION_DB_ID_IDEA',
            title: 'Идея',
            male: false
        },
        link: {
            value: 'link',
            intro: '🔗 Введите название источника: ',
            db: 'NOTION_DB_ID_LINK',
            title: 'Источник',
            male: true,
            linkTitle: null
        },
    }

    init(bot){

        Object.keys(this.items).forEach(item=>{

            bot.command(this.items[item].value, async (ctx) => {

                ctx.reply(this.items[item].intro)

                this.CONTENT_TYPE = this.items[item].value
            })

        })

        bot.command('clear', async (ctx) =>{
            this.CONTENT_TYPE = null
            ctx.reply('Тип очищен!')
        })
    }

    waitingAnswer(ctx){

        if(!this.CONTENT_TYPE) {
            ctx.reply('Сначала скажи, что будем записывать 😼')
            return true
        }

        if(this.CONTENT_TYPE === 'link' && !this.items.link.linkTitle){
            ctx.reply('Теперь введите ссылку: 🐋💨')
            this.items.link.linkTitle = ctx.message.text;
            return true
        }

        if(this.CONTENT_TYPE === 'note' && !this.items.note.noteTitle){
            ctx.reply('Теперь введите саму заметку: ❤️‍🔥')
            this.items.note.noteTitle = ctx.message.text;
            return true
        }

        return false
    }

    clearWaiting(){
        this.items.link.linkTitle = null
        this.items.note.noteTitle = null
    }
}