import * as Yup from 'yup'

async function createValidator(req, res, next) {
	// Validation
	const schema = Yup.object().shape({
		title: Yup.string()
			.required('O título da função é obrigatório')
			.oneOf(['administrador', 'solicitante', 'agente'])
			.min(1, 'O título não pode estar vazio'),
	})

	schema.validateSync(req.body)

	return next()
}

async function updateValidator(req, res, next) {
	// Validation
	const schema = Yup.object().shape({
		title: Yup.string().min(1, 'O título não pode estar vazio'),
	})

	schema.validateSync(req.body)

	return next()
}

export { createValidator, updateValidator }
