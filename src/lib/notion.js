import { Client } from "@notionhq/client";
import config from "config"
import {UseStore} from "./store.js";

const notion = new Client({
    auth: config.get('NOTION_KEY_BOOK')
})

const store = new UseStore()
export async function sendToNotion(text){

    let response

    const id = config.get(store.items[store.CONTENT_TYPE].db)

    if(id === config.get('NOTION_DB_ID_LINK')){
        response = await notion.pages.create({
            parent: {database_id: id},
            properties: {
                "Название": {
                    title: [
                        {
                            text: {
                                content: store.items.link.linkTitle
                            }
                        }
                    ]
                },
                "URL": {
                    type: "url",
                    url: text
                }
            }
        })
    }
    else if(id === config.get('NOTION_DB_ID_IDEA') && store.CONTENT_TYPE === 'idea'){
        response = await notion.pages.create({
            parent: {database_id: id},
            properties: {
                "Название": {
                    title: [
                        {
                            text: {
                                content: text
                            }
                        }
                    ]
                },
                "Идея": {
                    type: "checkbox",
                    checkbox: true
                }
            }
        })
    }
    else if(id === config.get('NOTION_DB_ID_IDEA') && store.CONTENT_TYPE === 'note'){
        response = await notion.pages.create({
            parent: {database_id: id},
            properties: {
                "Название": {
                    title: [
                        {
                            text: {
                                content: store.items.note.noteTitle
                            }
                        }
                    ]
                }
            }
        })
        await notion.blocks.children.append({
            block_id: response.id,
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
    else {
        response = await notion.pages.create({
            parent: {database_id: id},
            properties: {
                "Название": {
                    title: [
                        {
                            text: {
                                content: text
                            }
                        }
                    ]
                }
            }
        })
    }
    return response
}