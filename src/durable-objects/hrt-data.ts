export class HRTData implements DurableObject {
  state: DurableObjectState

  constructor(state: DurableObjectState, env: Env) {
    this.state = state
  }

  async fetch(request: Request) {
    try {
      const url = new URL(request.url)

      if (request.method === 'POST' && url.pathname === '/post') {
        const data = await request.json()
        console.log('=== DURABLE OBJECT POST ===')
        console.log('Received data:', JSON.stringify(data, null, 2))
        console.log('Events count:', data.events?.length)

        // Store the object directly, Durable Object storage handles serialization
        await this.state.storage.put('data', data)
        console.log('Data stored successfully')

        return new Response('Stored', { status: 200 })
      } else if (request.method === 'GET' && url.pathname === '/get') {
        const result = await this.state.storage.get('data')
        console.log('=== DURABLE OBJECT GET ===')
        console.log('Retrieved data:', JSON.stringify(result, null, 2))
        console.log('Events count:', (result as any)?.events?.length)

        if (result) {
          // Return the data as JSON
          return new Response(JSON.stringify(result), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          })
        } else {
          return new Response('{}', {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          })
        }
      }

      return new Response('Method not allowed', { status: 405 })
    } catch (error) {
      console.error('DO error:', error)
      return new Response('Internal server error', { status: 500 })
    }
  }
}

interface Env {
  HRT_DATA: DurableObjectNamespace
}