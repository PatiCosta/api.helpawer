import { Router } from 'express'
const routes = new Router()

import TicketController from '../app/controllers/TicketController.js'
import auth from '../app/middlewares/auth.js'
import {
	createValidator,
	changeStatusValidator,
} from '../app/middlewares/validators/ticket.js'

routes.use(auth)

routes.get('/', TicketController.index)
routes.get('/paginated', TicketController.findPaginated)
routes.post('/create', createValidator, TicketController.store)
// adicionar middleware de validação: apenas admin ou agent pode usar

routes.put(
	'/:id/update/status',
	changeStatusValidator,
	TicketController.changeStatus,
)
routes.put('/:id/update/agent', TicketController.changeAgent)

//
routes.put('/:id/comment', TicketController.addComment)

// add remove comment

export default routes
