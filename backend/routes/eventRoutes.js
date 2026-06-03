import { Router } from 'express'
import * as ctrl from '../controllers/eventController.js'
import { authMiddleware } from '../middleware/auth.js'

const r = Router()
r.use(authMiddleware)

r.get('/', ctrl.getEvents)
r.post('/', ctrl.addEvent)
r.put('/:id', ctrl.updateEvent)
r.delete('/:id', ctrl.deleteEvent)

export default r
