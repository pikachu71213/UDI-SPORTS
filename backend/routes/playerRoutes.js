import { Router } from 'express'
import * as ctrl from '../controllers/playerController.js'
import { authMiddleware } from '../middleware/auth.js'
import { uploadSingle } from '../middleware/upload.js'

const r = Router()
r.use(authMiddleware)

r.get('/', ctrl.getPlayers)
r.get('/:id', ctrl.getPlayer)
r.post('/', uploadSingle('photo'), ctrl.addPlayer)
r.put('/:id', uploadSingle('photo'), ctrl.updatePlayer)
r.delete('/:id', ctrl.deletePlayer)

export default r
