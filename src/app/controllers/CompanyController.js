import CompanyService from '../services/company.js'

class CompanyController {
	async index(req, res) {
		const companies = await CompanyService.findAll()

		return res.status(200).json(companies)
	}
	async store(req, res) {
		const { name } = req.body

		const nameError = await CompanyService.checkIfNameAlreadyExists(name)

		if (nameError) {
			return res.status(400).json(nameError)
		}
		const company = CompanyService.createOne(name)

		return res.json({
			id: company._id,
			name,
		})
	}
	async update(req, res) {
		const { name } = req.body

		const id = req.params.id

		const companyError = await CompanyService.checkIfCompanyExists(id)

		if (companyError) {
			return res.status(400).json(companyError)
		}

		const nameError =
			await CompanyService.checkIfNameAlreadyExistsAndIsNotSelf(
				name,
				req.params.id,
			)

		if (nameError) {
			return res.status(400).json(nameError)
		}

		await CompanyService.update(id, name)

		return res.json({
			id,
			name,
		})
	}
	async delete(req, res) {
		const id = req.params.id

		const companyError = await CompanyService.checkIfCompanyExists(id)

		if (companyError) {
			return res.status(400).json(companyError)
		}

		const usersError = await CompanyService.checkForUsersWithThisCompany(id)

		if (usersError) {
			return res.status(400).json(usersError)
		}

		await CompanyService.delete(id)

		return res.json({ success: true })
	}
}

export default new CompanyController()
