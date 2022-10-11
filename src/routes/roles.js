import { Router } from 'express'
const routes = new Router()

import RoleController from '../app/controllers/RoleController.js'
import { validateAdmin } from '../app/middlewares/admOnly.js'
import auth from '../app/middlewares/auth.js'
import {
	createValidator,
	updateValidator,
} from '../app/middlewares/validators/role.js'

routes.use(auth)
routes.use(validateAdmin)

routes.get('/', RoleController.index)
routes.post('/create', createValidator, RoleController.store)
routes.put('/:id/update', updateValidator, RoleController.update)
routes.delete('/:id/delete', RoleController.delete)

export default routes
