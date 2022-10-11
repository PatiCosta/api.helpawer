import Company from '../../schema/Company.js'
import User from '../../schema/User.js'

class CompanyService {
	async findAll() {
		return await Company.find({})
	}

	async checkIfNameAlreadyExists(name) {
		const nameAlreadyExists = await Company.findOne({ name: name })

		if (nameAlreadyExists) {
			return { error: 'Esta empresa já existe' }
		}
	}

	async checkIfNameAlreadyExistsAndIsNotSelf(name, id) {
		const company = await Company.findOne({ name: name })

		if (company && company._id.toString() !== id) {
			return { error: 'Esta empresa já existe' }
		}
	}

	createOne(name) {
		const company = new Company({
			name,
		})

		company.save()

		return company
	}

	async checkIfCompanyExists(id) {
		try {
			const company = await Company.findById(id)

			if (!company) {
				return { error: 'Esta empresa não existe' }
			}
		} catch {
			return { error: 'Esta empresa é inválida' }
		}
	}

	async update(id, name) {
		return await Company.findByIdAndUpdate(
			id,
			{ name: name },
			{ new: true },
		)
	}

	async checkForUsersWithThisCompany(id) {
		const isAnyUserWithThisCompany = await User.find({ company: id })

		if (isAnyUserWithThisCompany.length > 0) {
			return {
				error: 'Existem usuários com esta empresa. Por favor edite a empresa destes usuários e tente novamente',
			}
		}
	}

	async delete(id) {
		return await Company.findByIdAndDelete(id)
	}
}

export default new CompanyService()
