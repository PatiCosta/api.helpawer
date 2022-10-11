import { Router } from 'express'
const routes = new Router()

// controllers
import SessionController from '../app/controllers/SessionController.js'

// routes
routes.post('/login', SessionController.store)
routes.post('/refresh', SessionController.refresh)
routes.delete('/logout', SessionController.delete)

export default routes
