import {Client} from "@notionhq/client";
import config from "config"
import {UseStore} from "./store.js";

const notion = new Client({
    auth: config.get('NOTION_KEY_BOOK')
})

const store = new UseStore()

class UseNotion {
    constructor(id) {
        this.id = id
    }

    title = "Название"

    createTitle(content){
        return {
            [this.title]: {
                title: [
                    {
                        text: {
                            content
                        }
                    }
                ]
            }
        }
    }

    createProp(title, type, value){

        //"Идея": {
        //    type: "checkbox",
        //    checkbox: true
        //}

        return {
            [title]: {
                type,
                [type]: value
            }
        }
    }

    async createPageContent(page, text){
        await notion.blocks.children.append({
            block_id: page.id,
            children: [
                {
                    object: 'block',
                    type: 'paragraph',
                    paragraph: {
                        rich_text: [
                            {
                                type: 'text',
                                text: {
                                    content: text
                                }
                            }
                        ]
                    }
                }
            ]
        })
    }

    createContent(properties) {
        return {
            parent: {database_id: this.id},
            properties
        }
    }

    async create(title, properties = null) {

        const props = properties ? properties.map(item => this.createProp(...item)) : [{}]

        const content = Object.assign(this.createTitle(title), ...props)

        return await notion.pages.create(this.createContent(content))
    }
}

    export async function sendToNotion(text) {

        const use = new UseNotion(config.get(store.items[store.CONTENT_TYPE].db))

        switch (store.CONTENT_TYPE){

            case 'link':
                return await use.create(store.items.link.linkTitle, [["Url", "url", text]])

            case 'idea':
                return await use.create(text, [["Идея", "checkbox", true]])

            case 'note':
                const page = await use.create(store.items.note.noteTitle)
                await use.createPageContent(page, text)
                return page

            default:
                return await use.create(text)
        }
    }