import UserService from '../services/user.js'

class UserController {
	async index(req, res) {
		const users = await UserService.findAll()

		return res.json(users)
	}

	async findAgents(req, res) {
		const agents = await UserService.findAgents()

		return res.json(agents)
	}

	async viewUser(req, res) {
		const user = await UserService.findOne(req.params.id)

		return res.json(user)
	}

	async findPaginated(req, res) {
		const page = parseInt(req.query.page) - 1 || 0

		const limit = parseInt(req.query.limit)

		const query = {}

		if (req.query.search) {
			const rgx = (pattern) => new RegExp(`.*${pattern}.*`)
			const searchRgx = rgx(req.query.search)

			query.search = { $regex: searchRgx, $options: 'i' }
		}

		const users = await UserService.findPaginated({ page, limit, query })

		return res.status(200).json(users)
	}

	async publicStore(req, res) {
		const { email, name, password, company } = req.body

		const emailError = await UserService.checkIfEmailAlreadyExists(email)

		if (emailError) {
			return res.status(400).json(emailError)
		}

		const companyError = await UserService.checkForCompanyErrors(company)

		if (companyError) {
			return res.status(400).json(companyError)
		}

		const role = await UserService.findRequesterRole()

		const user = await UserService.createOne(
			name,
			email,
			password,
			role._id,
			company,
		)

		return res.status(200).json(user)
	}

	async privateStore(req, res) {
		const { email, name, password, company, role } = req.body

		const emailError = await UserService.checkIfEmailAlreadyExists(email)

		if (emailError) {
			return res.status(400).json(emailError)
		}

		const companyError = await UserService.checkForCompanyErrors(company)

		if (companyError) {
			return res.status(400).json(companyError)
		}

		const roleError = await UserService.checkForRoleErrors(role)

		if (roleError) {
			return res.status(400).json(roleError)
		}

		const user = await UserService.createOne(
			name,
			email,
			password,
			role,
			company,
		)

		return res.status(200).json(user)
	}

	async update(req, res) {
		const id = req.params.id

		if (req.body.password) {
			return res.status(400).json({
				error: 'Não é permitida a troca de senha por este método',
			})
		}

		if (req.body.role) {
			return res.status(400).json({
				error: 'Não é permitida a troca de cargo',
			})
		}

		const userError = await UserService.checkIfUserExists(id)

		if (userError) {
			return res.status(400).json(userError)
		}

		const companyError = await UserService.checkForCompanyErrors(
			req.body.company,
		)

		if (companyError) {
			return res.status(400).json(companyError)
		}

		if (req.body.email) {
			const emailError =
				await UserService.checkIfEmailAlreadyExistsAndIsNotSelf(
					req.body.email,
					req.params.id,
				)

			if (emailError) {
				return res.status(400).json(emailError)
			}
		}

		const user = await UserService.update(id, req.body)

		return res.json(user)
	}

	async changePassword(req, res) {
		const id = req.params.id

		const userError = await UserService.checkIfUserExists(id)

		if (userError) {
			return res.status(400).json(userError)
		}

		const user = await UserService.findOneWithAllFields(id)

		if (!(await user.checkPassword(req.body.oldPassword))) {
			return res
				.status(401)
				.json({ error: 'A senha anterior está incorreta' })
		}

		user.password = req.body.password

		await user.save()

		return res.status(200).json({ success: true })
	}

	async delete(req, res) {
		const id = req.params.id

		const userError = await UserService.checkIfUserExists(id)

		if (userError) {
			return res.status(400).json(userError)
		}

		await UserService.deleteRefreshTokensFromUser(id)

		await UserService.delete(id)

		return res.json({ success: true })
	}
}

export default new UserController()
