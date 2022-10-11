import { Router } from 'express'
const routes = new Router()

import UserController from '../app/controllers/UserController.js'
import { validateAdmin } from '../app/middlewares/admOnly.js'
import admOrSelfOnly from '../app/middlewares/admOrSelfOnly.js'
import auth from '../app/middlewares/auth.js'
import {
	changePasswordValidator,
	publicCreateValidator,
	updateValidator,
	privateCreateValidator,
} from '../app/middlewares/validators/user.js'

routes.get('/', auth, validateAdmin, UserController.index)
routes.get('/paginated', auth, validateAdmin, UserController.findPaginated)
routes.get('/agents', auth, UserController.findAgents)
routes.post('/public/create', publicCreateValidator, UserController.publicStore)
routes.post(
	'/private/create',
	auth,
	validateAdmin,
	privateCreateValidator,
	UserController.privateStore,
)

routes.get('/:id', auth, UserController.viewUser)

routes.put(
	'/:id/update',
	auth,
	admOrSelfOnly,
	updateValidator,
	UserController.update,
)
routes.put(
	'/:id/password/update',
	auth,
	admOrSelfOnly,
	changePasswordValidator,
	UserController.changePassword,
)

routes.delete('/:id/delete', auth, validateAdmin, UserController.delete)

export default routes
