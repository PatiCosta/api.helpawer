import * as Yup from 'yup'

async function createValidator(req, res, next) {
	// Validation
	const schema = Yup.object().shape({
		title: Yup.string()
			.required('O título é obrigatório')
			.min(1, 'O título não pode estar vazio'),
		description: Yup.string()
			.required('A descrição é obrigatória')
			.min(1, 'A descrição não pode estar vazio'),
		requester: Yup.string().required('O solicitante é obrigatório'),
		category: Yup.string()
			.required('A categoria é obrigatória')
			.oneOf(['Bug', 'Solicitação', 'Dúvida']),
	})

	schema.validateSync(req.body)

	return next()
}

async function changeStatusValidator(req, res, next) {
	// Validation
	const schema = Yup.object().shape({
		status: Yup.string()
			.required('A categoria é obrigatória')
			.oneOf(['Recebido', 'Em andamento', 'Finalizada', 'Cancelada']),
	})

	schema.validateSync(req.body)

	return next()
}

export { createValidator, changeStatusValidator }
