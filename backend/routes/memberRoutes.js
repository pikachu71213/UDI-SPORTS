import { Router } from 'express'
import * as ctrl from '../controllers/memberController.js'
import { authMiddleware } from '../middleware/auth.js'
import { uploadSingle } from '../middleware/upload.js'

const r = Router()
r.use(authMiddleware)

r.get('/summary', ctrl.getSummary)
r.get('/general', ctrl.getGeneralMembers)
r.post('/general', ctrl.addGeneralMember)
r.put('/general/:id', ctrl.updateGeneralMember)
r.delete('/general/:id', ctrl.deleteGeneralMember)

r.get('/special', ctrl.getSpecialMembers)
r.post('/special', uploadSingle('photo'), ctrl.addSpecialMember)
r.put('/special/:id', uploadSingle('photo'), ctrl.updateSpecialMember)
r.delete('/special/:id', ctrl.deleteSpecialMember)

r.get('/committee', ctrl.getCommittee)
r.post('/committee', uploadSingle('photo'), ctrl.addCommittee)
r.put('/committee/:id', uploadSingle('photo'), ctrl.updateCommittee)
r.delete('/committee/:id', ctrl.deleteCommittee)

r.get('/committees', ctrl.getCommitteeGroups)
r.post('/committees', ctrl.addCommitteeGroup)
r.put('/committees/:id', ctrl.updateCommitteeGroup)
r.delete('/committees/:id', ctrl.deleteCommitteeGroup)
r.post('/committees/:id/members', ctrl.addCommitteeGroupMember)
r.put('/committees/:id/members/:memberId', ctrl.updateCommitteeGroupMember)
r.delete('/committees/:id/members/:memberId', ctrl.deleteCommitteeGroupMember)

export default r
