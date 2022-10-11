import { Router } from 'express'
const routes = new Router()

import CompanyController from '../app/controllers/CompanyController.js'
import { validateAdmin } from '../app/middlewares/admOnly.js'
import auth from '../app/middlewares/auth.js'
import {
	createValidator,
	updateValidator,
} from '../app/middlewares/validators/company.js'

routes.use(auth)
routes.use(validateAdmin)

routes.get('/', CompanyController.index)
routes.post('/create', createValidator, CompanyController.store)
routes.put('/:id/update', updateValidator, CompanyController.update)
routes.delete('/:id/delete', CompanyController.delete)

export default routes
