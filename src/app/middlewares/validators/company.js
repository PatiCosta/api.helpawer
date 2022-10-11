import * as Yup from 'yup'

async function createValidator(req, res, next) {
	// Validation
	const schema = Yup.object().shape({
		name: Yup.string()
			.required('O nome da empresa é obrigatório')
			.min(3, 'O nome não pode estar vazio'),
	})

	schema.validateSync(req.body)

	return next()
}

async function updateValidator(req, res, next) {
	// Validation
	const schema = Yup.object().shape({
		name: Yup.string().min(3, 'O nome não pode estar vazio'),
	})

	schema.validateSync(req.body)

	return next()
}

export { createValidator, updateValidator }
