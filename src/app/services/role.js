import Role from '../../schema/Role.js'
import User from '../../schema/User.js'

class RoleService {
	async findAll() {
		return await Role.find({}).select('title')
	}

	async checkIfTitleAlreadyExists(title) {
		const titleAlreadyExists = await Role.findOne({ title: title })

		if (titleAlreadyExists) {
			return { error: 'Esta função já existe' }
		}
	}

	async checkIfTitleAlreadyExistsAndIsNotSelf(title, id) {
		const role = await Role.findOne({ title: title })

		if (role && role._id.toString() !== id) {
			return { error: 'Esta função já existe' }
		}
	}

	createOne(title) {
		const role = new Role({
			title,
		})

		role.save()

		return role
	}

	async checkIfRoleExists(id) {
		try {
			const role = await Role.findById(id)

			if (!role) {
				return { error: 'Esta função não existe' }
			}
		} catch {
			return { error: 'Esta função é inválida' }
		}
	}

	async update(id, title) {
		return await Role.findByIdAndUpdate(id, { title: title }, { new: true })
	}

	async checkForUsersWithThisRole(id) {
		const isAnyUserWithThisRole = await User.find({ role: id })

		if (isAnyUserWithThisRole.length > 0) {
			return {
				error: 'Existem usuários com esta função. Por favor edite a função destes usuários e tente novamente',
			}
		}
	}

	async delete(id) {
		return await Role.findByIdAndDelete(id)
	}
}

export default new RoleService()
