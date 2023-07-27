import { Configuration, OpenAIApi } from 'openai'
import { createRequire } from 'module'
import * as url from 'url'
const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

const require = createRequire(import.meta.url)
const express = require('express')
const app = express()
const multer = require('multer')
const path = require('path')

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(multer().none())

require('dotenv').config()

const openAI_SECRET_KEY = process.env.OPENAI_SECRET_KEY
const NUM_AUTOCOMPLETE_WORDS = 10

const configuration = new Configuration({
    apiKey: openAI_SECRET_KEY
})
const openai = new OpenAIApi(configuration)

async function sendPrompt(input) {
    const model = 'gpt-3.5-turbo'
    const messages = [
        {
            "role": 'system', 
            "content":'You are a helpful assistant who translates text using a specified tone'
        },
        {
            "role": 'user',
            "content": input
        }
    ]

    const completion = await openai.createChatCompletion({
        model,
        messages
    })

    console.log(completion.data.choices)
    return completion.data.choices
}


app.post('/server/prompt', async (req, res) => {
    try {
        const { prompt } = req.body
        const server_response = await sendPrompt(prompt)
        res.status(200).json({
            'message': server_response
        })
    } catch (err) {
        res.status(500).type("text")
        res.send("A Server Error Occurred: " + err)
    }
})


app.get('/server/test', async (req, res) => {
    try {
        res.type('text').send("HELLO")
    } catch (err) {
        res.status(500).type("text")
        res.send("A Server Error Occurred: " + err)
    }
})

app.post('/server/text-transform', async (req, res) => {
    console.log("RECEIVED REQUEST")
    try {
        const { text, tone } = req.body
        let prompt = `Rewrite the following text to use a ${tone} tone: ${text}`
        const chatGPTResponse = await sendPrompt(prompt)
        const chatGPTGeneratedText = chatGPTResponse[0].message.content
        console.log(chatGPTGeneratedText)
        console.log(typeof chatGPTGeneratedText)
        res.status(200).type("text").send(chatGPTGeneratedText)
    } catch (err) {
        res.status(500).type("text")
        res.send("A Server Error Occurred: " + err)
    }
})


app.post('/server/autocomplete', async (req, res) => {
    try {
        console.log(req.body)
        const { text, tone } = req.body
        let prompt = `Complete the next ${NUM_AUTOCOMPLETE_WORDS} words of the following text using a ${tone} tone: ${text}`
        const chatGPTResponse = await sendPrompt(prompt)
        const chatGPTGeneratedText = chatGPTResponse[0].message.content
        console.log(chatGPTGeneratedText)
        console.log(typeof chatGPTGeneratedText)
        res.status(200).type("text").send(chatGPTGeneratedText)
    } catch (err) {
        res.status(500).type("text")
        res.send("A Server Error Occurred: " + err)
    }
})

app.use(express.static(path.join(__dirname, 'public')))
console.log(path.join(__dirname, 'public'))
const PORT = process.env.PORT || 1337
app.listen(PORT, () => console.log(`Server has started on port: ${PORT}`))