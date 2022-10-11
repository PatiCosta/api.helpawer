import { Router } from 'express'
const routes = new Router()

import companies from './companies.js'
import roles from './roles.js'
import session from './sessions.js'
import tickets from './tickets.js'
import users from './users.js'

routes.use('/companies', companies)
routes.use('/tickets', tickets)
routes.use('/users', users)
routes.use('/roles', roles)
routes.use('/session', session)

export default routes
