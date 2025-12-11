import { Hono } from 'hono'

export const auth = async (c: any, next: any) => {
  // Skip authentication for OPTIONS requests (CORS preflight)
  if (c.req.method === 'OPTIONS') {
    // Manually add CORS headers for OPTIONS response
    c.header('Access-Control-Allow-Origin', '*')
    c.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    c.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    return c.text('', 204)
  }

  const authHeader = c.req.header('Authorization')

  if (!authHeader) {
    c.header('WWW-Authenticate', 'Basic realm="Secure Area"')
    c.header('Access-Control-Allow-Origin', '*')
    c.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    c.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    return c.text('Unauthorized', 401)
  }

  const [type, credentials] = authHeader.split(' ')

  if (type !== 'Basic') {
    c.header('Access-Control-Allow-Origin', '*')
    c.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    c.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    return c.text('Unauthorized', 401)
  }

  const decoded = atob(credentials)
  const [username, password] = decoded.split(':')

  const expectedUsername = c.env.USERNAME
  const expectedPassword = c.env.PASSWORD

  if (username !== expectedUsername || password !== expectedPassword) {
    c.header('Access-Control-Allow-Origin', '*')
    c.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    c.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    return c.text('Unauthorized', 401)
  }

  await next()
}