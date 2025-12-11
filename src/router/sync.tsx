import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { auth } from '../middleware/auth'

interface Env {
  HRT_DATA: DurableObjectNamespace
  USERNAME: string
  PASSWORD: string
}

export const app = new Hono<{ Bindings: Env }>()

// CORS must be applied before authentication
app.use('*', cors({
  origin: (origin) => origin || '*', // Allow any origin
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: false, // Must be false when allowing all origins
}))

app.use('*', auth)

app.post('/data', async (c) => {
  const data = await c.req.json()
  console.log('=== SYNC ROUTER POST ===')
  console.log('Forwarding to Durable Object, events count:', data.events?.length)

  const id = c.env.HRT_DATA.idFromName('hrt')
  let stub = c.env.HRT_DATA.get(id)
  let response
  let retries = 3
  while (retries > 0) {
    try {
      response = await stub.fetch(new Request('http://do/post', {
        method: 'POST',
        body: JSON.stringify(data)
      }))
      break
    } catch (error: any) {
      if (error.durableObjectReset && retries > 1) {
        stub = c.env.HRT_DATA.get(id) // Get a new stub
        retries--
      } else {
        throw error
      }
    }
  }
  return response
})

app.get('/data', async (c) => {
  const id = c.env.HRT_DATA.idFromName('hrt')
  let stub = c.env.HRT_DATA.get(id)
  let response
  let retries = 3
  while (retries > 0) {
    try {
      response = await stub.fetch(new Request('http://do/get', {
        method: 'GET'
      }))
      break
    } catch (error: any) {
      if (error.durableObjectReset && retries > 1) {
        stub = c.env.HRT_DATA.get(id) // Get a new stub
        retries--
      } else {
        throw error
      }
    }
  }
  return response
})