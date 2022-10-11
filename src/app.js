import 'dotenv/config'

import cors from 'cors'
import express from 'express'
import 'express-async-errors'
import * as Yup from 'yup'

import routes from './routes/index.js'
// import path from 'path'

import './database/index.js'

class App {
	constructor() {
		this.server = express()

		this.middlewares()
		this.routes()
		this.exceptionHandler()
	}

	middlewares() {
		this.server.use(cors())
		this.server.use(express.json())
	}

	routes() {
		this.server.use(routes)
	}

	exceptionHandler() {
		this.server.use(async (err, req, res) => {
			if (err instanceof Yup.ValidationError) {
				return res.status(400).json({ error: `${err.message}` })
			}

			// if(process.env.NODE_ENV === 'development') {
			//     const errors = await new Youch(err, req).toJSON()

			//     return res.status(500).json(errors)
			// }

			// return res.status(500).json({error: 'Internal server error'})
		})
	}
}

export default new App().server
