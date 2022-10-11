import crypto from 'crypto'
import jwt from 'jsonwebtoken'

import authConfig from '../../config/auth.js'
import RefreshToken from '../../schema/RefreshToken.js'
import User from '../../schema/User.js'

class SessionController {
	async store(req, res) {
		const { email, password } = req.body

		const user = await User.findOne({ email }).populate('role')

		if (!user) {
			return res.status(401).json({ error: 'Usuário não encontrado' })
		}

		// check if password match

		if (!(await user.checkPassword(password))) {
			return res.status(401).json({ error: 'Senha incorreta' })
		}

		const { _id: id, name, role, company } = user

		// create auth

		const accessToken = jwt.sign(
			{ id, role: role.title, email },
			authConfig.secretAccessToken,
			{
				expiresIn: authConfig.expiresInAccessToken,
			},
		)

		const { refresh_token: refreshToken } = await RefreshToken.create({
			user_id: id,
			refresh_token: `${id}${crypto.randomBytes(64).toString('hex')}`,
			expires_in: new Date(Date.now() + authConfig.expiresInRefreshToken),
		})

		return res.json({
			user: {
				_id: id,
				name,
				email,
				role,
				company,
			},
			accessToken,
			refreshToken,
		})
	}

	async refresh(req, res) {
		const { token } = req.body

		const refreshToken = await RefreshToken.findOne({
			refresh_token: token,
		})

		if (!refreshToken) {
			return res.status(401).json({ error: 'Refresh token invalid' })
		}

		if (refreshToken.expires_in <= Date.now()) {
			return res.status(401).json({ error: 'Refresh token invalid' })
		}

		const user = await User.findById(refreshToken.user_id)
			.populate('role company')
			.select('name email role company')

		await RefreshToken.findOneAndDelete({ id: refreshToken._id })

		// create auth

		const accessToken = jwt.sign(
			{ id: user._id, role: user.role.title, email: user.email },
			authConfig.secretAccessToken,
			{
				expiresIn: authConfig.expiresInAccessToken,
			},
		)

		const { refresh_token } = await RefreshToken.create({
			user_id: user._id,
			refresh_token: `${user._id}${crypto
				.randomBytes(64)
				.toString('hex')}`,
			expires_in: new Date(Date.now() + authConfig.expiresInRefreshToken),
		})

		return res.json({ user, accessToken, refreshToken: refresh_token })
	}

	async delete(req, res) {
		const { token } = req.body

		await RefreshToken.findOneAndDelete({ refresh_token: token })

		return res.status(200).json()
	}
}

export default new SessionController()
