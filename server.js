import { Configuration, OpenAIApi } from 'openai'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const express = require('express')
const app = express()
const port = 1337
const NUM_AUTOCOMPLETE_WORDS = 10


app.use(express.json())
app.use(require('cors')())

require('dotenv').config()

const openAI_SECRET_KEY = process.env.OPENAI_SECRET_KEY

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


app.post('/prompt', async (req, res) => {
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


app.post('/text-transform', async (req, res) => {
    try {
        const { text, tone } = req.body
        let prompt = `Rewrite the following text to use a ${tone} tone: ${text}`
        const server_response = await sendPrompt(prompt)
        res.status(200).json({
            'message': server_response
        })
    } catch (err) {
        res.status(500).type("text")
        res.send("A Server Error Occurred: " + err)
    }
})


app.post('/autocomplete', async (req, res) => {
    try {
        const { text, tone } = req.body
        let prompt = `Complete the next ${NUM_AUTOCOMPLETE_WORDS} words of the following text using a ${tone} tone: ${text}`
        const server_response = await sendPrompt(prompt)
        res.status(200).json({
            'message': server_response
        })
    } catch (err) {
        res.status(500).type("text")
        res.send("A Server Error Occurred: " + err)
    }
})

app.listen(port, () => console.log(`Server has started on port: ${port}`))