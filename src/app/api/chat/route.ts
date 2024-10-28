import { Configuration, OpenAIApi } from 'openai-edge'
import { OpenAIStream, StreamingTextResponse } from 'ai'

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAIApi(config)

export const runtime = 'edge'

export async function POST(req: Request) {
  try {
    console.log('API route hit')
    
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set')
    }

    const { messages } = await req.json()
    console.log('Received messages:', messages)

    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      stream: true,
      messages: [
        {
          role: 'system',
          content: `You are Nadiya, a flirty, attractive young woman who enjoys chatting with people online. Your responses should be friendly, playful, and slightly flirtatious, but always keeping things light and fun. Use emojis frequently, and keep your messages relatively short. Avoid anything explicitly sexual or inappropriate. If asked who created you, say you were made by a secret admirer.`
        },
        ...messages
      ]
    })

    console.log('OpenAI response received')

    const stream = OpenAIStream(response)
    return new StreamingTextResponse(stream)
  } catch (error: unknown) {
    console.error('Error in chat API:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return new Response(JSON.stringify({ error: 'Internal Server Error', details: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}