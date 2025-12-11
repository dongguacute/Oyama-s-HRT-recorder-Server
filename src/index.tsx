import { Hono } from 'hono'
import { renderer } from './renderer'
import { app as syncApp } from './router/sync'
import { HRTData } from './durable-objects/hrt-data'

export { HRTData }

interface Env {
  HRT_DATA: DurableObjectNamespace
}

const app = new Hono()

app.use(renderer)
app.get('/', (c) => {
  return c.render(<h1>Hello!</h1>)
})

app.route('/sync', syncApp)

export default app
