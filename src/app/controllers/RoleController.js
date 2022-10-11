import RoleService from '../services/role.js'

class RoleController {
	async index(req, res) {
		const roles = await RoleService.findAll()

		return res.status(200).json(roles)
	}
	async store(req, res) {
		const { title } = req.body

		const titleError = await RoleService.checkIfTitleAlreadyExists(title)

		if (titleError) {
			return res.status(400).json(titleError)
		}

		const role = RoleService.createOne(title)

		return res.json({
			id: role._id,
			title,
		})
	}
	async update(req, res) {
		const { title } = req.body

		const id = req.params.id

		const roleError = await RoleService.checkIfRoleExists(id)

		if (roleError) {
			return res.status(400).json(roleError)
		}

		const titleError =
			await RoleService.checkIfTitleAlreadyExistsAndIsNotSelf(
				title,
				req.params.id,
			)

		if (titleError) {
			return res.status(400).json(titleError)
		}

		await RoleService.update(id, title)

		return res.json({
			id,
			title,
		})
	}
	async delete(req, res) {
		const id = req.params.id

		const roleError = await RoleService.checkIfRoleExists(id)

		if (roleError) {
			return res.status(400).json(roleError)
		}

		const usersError = await RoleService.checkForUsersWithThisRole(id)

		if (usersError) {
			return res.status(400).json(usersError)
		}

		await RoleService.delete(id)

		return res.json({ success: true })
	}
}

export default new RoleController()
