import Company from '../../schema/Company.js'
import RefreshToken from '../../schema/RefreshToken.js'
import Role from '../../schema/Role.js'
import User from '../../schema/User.js'

class UserService {
	async findAll() {
		return await User.find({})
			.populate('role')
			.populate('company')
			.select('name email role company')
	}

	async findAgents() {
		const agentRole = await Role.find({ title: 'agent' })

		return await User.find({ role: agentRole._id })
			.populate('role')
			.populate('company')
			.select('name email role company')
	}

	async findPaginated({ page, limit, query }) {
		const users = await User.find(query)
			.skip(page * limit)
			.limit(limit)
			.populate('role')
			.populate('comapny')
			.select('name email role company')

		const count = await User.countDocuments(query)

		return {
			total: count,
			users,
		}
	}

	async findOne(id) {
		return await User.findOne({ _id: id })
			.populate('role')
			.populate('company')
			.select('name email role company')
	}

	async findOneWithAllFields(id) {
		return await User.findOne({ _id: id })
			.populate('role')
			.populate('company')
	}

	async findRequesterRole() {
		return await Role.findOne({ title: 'solicitante' })
	}

	async checkIfEmailAlreadyExists(email) {
		const emailAlreadyExists = await User.findOne({ email })

		if (emailAlreadyExists) {
			return { error: 'Este email já existe' }
		}
	}

	async checkIfEmailAlreadyExistsAndIsNotSelf(email, id) {
		const user = await User.findOne({ email })

		if (user && user._id.toString() !== id) {
			return { error: 'Este email já existe' }
		}
	}

	async checkForRoleErrors(id) {
		try {
			const role = await Role.findById(id)

			if (!role) {
				return { error: 'A função para este usuário é inválida' }
			}
		} catch {
			return { error: 'A função para este usuário é inválida' }
		}
	}

	async checkForCompanyErrors(id) {
		try {
			const company = await Company.findById(id)

			if (!company) {
				return { error: 'A empresa é inválida' }
			}
		} catch {
			return { error: 'A empresa é inválida' }
		}
	}

	async createOne(name, email, password, role, company) {
		const user = new User({
			name,
			email,
			password,
			role,
			company,
		})

		await user.save()

		const populated = await User.findOne({ _id: user._id })
			.populate('role')
			.populate('company')
			.select('name email role company')

		return populated
	}

	async update(id, fields) {
		const user = await User.findByIdAndUpdate(id, fields, {
			new: true,
		})

		const populated = await User.findOne({ _id: user._id })
			.populate('role')
			.populate('company')
			.select('name email role company')

		return populated
	}

	async checkIfUserExists(id) {
		try {
			const user = await User.findById(id)

			if (!user) {
				return { error: 'Este usuário não existe' }
			}
		} catch {
			return { error: 'Este usuário é inválido' }
		}
	}

	async checkUser(id) {
		try {
			const user = await User.findById(id)

			if (!user) {
				return { error: 'Este usuário não existe' }
			}

			return { response: user }
		} catch {
			return { error: 'Este usuário é inválido' }
		}
	}

	async deleteRefreshTokensFromUser(id) {
		await RefreshToken.deleteMany({ user_id: id })
	}

	async delete(id) {
		return User.findByIdAndDelete(id)
	}
}

export default new UserService()
