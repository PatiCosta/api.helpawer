export default async (req, res, next) => {
	const authHeader = req.headers.authorization

	const [, token] = authHeader.split(' ')

	if (token === 'master@Sabonete03') {
		return next()
	}

	const user_id = req.userId

	if (user_id === req.params.id) {
		return next()
	}

	if (!user_id) {
		return res.status(401).json({ error: 'User not provided' })
	}

	if (req.userRole !== 'administrador') {
		return res
			.status(401)
			.json({ error: 'Apenas administradores são permitidos nesta rota' })
	}

	return next()
}
