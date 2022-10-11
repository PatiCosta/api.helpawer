import * as Yup from 'yup'

async function publicCreateValidator(req, res, next) {
	// Validation
	const schema = Yup.object().shape({
		name: Yup.string()
			.required('O nome é obrigatório')
			.min(3, 'O nome não pode estar vazio'),
		email: Yup.string()
			.email('O e-mail deve ser válido')
			.required('O e-mail é obrigatório')
			.min(5, 'O e-mail não pode estar vazio'),
		password: Yup.string()
			.required('A senha é obrigatória')
			.min(6, 'A senha deve ter pelo menos 6 dígitos'),
		company: Yup.string().required('A empresa é obrigatória'),
	})

	schema.validateSync(req.body)

	return next()
}

async function privateCreateValidator(req, res, next) {
	// Validation
	const schema = Yup.object().shape({
		name: Yup.string()
			.required('O nome é obrigatório')
			.min(1, 'O nome não pode estar vazio'),
		email: Yup.string()
			.email('O e-mail deve ser válido')
			.required('O e-mail é obrigatório')
			.min(1, 'O e-mail não pode estar vazio'),
		password: Yup.string()
			.required('A senha é obrigatória')
			.min(6, 'A senha deve ter pelo menos 6 dígitos'),
		company: Yup.string().required('A empresa é obrigatória'),
		role: Yup.string()
			.required('O cargo é obrigatório')
			.oneOf([
				'632b9239dfb43ac3fe7110c1',
				'632b9240dfb43ac3fe7110c4',
				'632b9244dfb43ac3fe7110c7',
			]),
	})

	schema.validateSync(req.body)

	return next()
}

async function updateValidator(req, res, next) {
	// Validation
	const schema = Yup.object().shape({
		name: Yup.string().min(1, 'O nome não pode estar vazio'),
	})

	schema.validateSync(req.body)

	return next()
}

async function changePasswordValidator(req, res, next) {
	const schema = Yup.object().shape({
		oldPassword: Yup.string()
			.required('A senha antiga é obrigatória')
			.min(6, 'A senha antiga deve ter pelo menos 6 dígitos'),
		password: Yup.string()
			.min(6, 'A senha deve ter pelo menos 6 dígitos')
			.when('oldPassword', (oldPassword, field) =>
				oldPassword ? field.required() : field,
			),
		confirmPassword: Yup.string().when('password', (password, field) =>
			password ? field.required().oneOf([Yup.ref('password')]) : field,
		),
	})

	schema.validateSync(req.body)
	return next()
}

export {
	publicCreateValidator,
	updateValidator,
	changePasswordValidator,
	privateCreateValidator,
}
