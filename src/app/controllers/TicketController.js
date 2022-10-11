import MailService from '../services/mail.js'
import TicketService from '../services/ticket.js'

const target = '_blank'

class CompanyController {
	async index(req, res) {
		const tickets = await TicketService.findAll()

		return res.status(200).json(tickets)
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

		const users = await TicketService.findPaginated({ page, limit, query })

		return res.status(200).json(users)
	}

	async store(req, res) {
		const { title, description, category, requester } = req.body

		const status = 'Recebido'

		const ticket = await TicketService.createOne({
			title,
			category,
			description,
			status,
			requester,
		})

		const sendMailStatus = await MailService.sendMail({
			destination: 'contato@awer.co',
			subject: 'Novo ticket!',
			htmlMessage: `<strong>Olá awers!</strong><br><p>Há um novo ticket esperando para ser resolvido no helpawer</p><br><p>Acesse <a href=${process.env.CLIENT_URL} target=${target}>https://help.awer.co</a> para visualizar</p>`,
		})

		if (!sendMailStatus.success) {
			return res.status(400).json({
				error: 'Houve um problema ao enviar o e-mail, tente novamente',
			})
		}

		return res.json(ticket)
	}

	async changeStatus(req, res) {
		const { status } = req.body

		const id = req.params.id

		const ticket = await TicketService.checkTicket(id)

		if (ticket.error) {
			return res.status(400).json(ticket.error)
		}

		await TicketService.changeStatus({ status, id })

		const sendMailStatus = await MailService.sendMail({
			destination: ticket.data.requester.email,
			subject: 'O status do seu ticket foi alterado!',
			htmlMessage: `<h2>Olá ${ticket.data.requester.name}!</h2><br><p>Seu ticket <strong>${ticket.data.title}</strong> foi alterado para o status <strong>${status}</strong></p><br><p>Acesse <a href=${process.env.CLIENT_URL} target=${target}>https://help.awer.co</a> para visualizar</p>`,
		})

		if (!sendMailStatus.success) {
			return res.status(400).json({
				error: 'Houve um problema ao enviar o e-mail, tente novamente',
			})
		}

		return res.json({ success: true })
	}

	async changeAgent(req, res) {
		const { agentId } = req.body

		const id = req.params.id

		const ticket = await TicketService.checkTicket(id)

		if (ticket.error) {
			return res.status(400).json(ticket.error)
		}

		const agent = await TicketService.checkAgent(agentId)

		if (agent.error) {
			return res.status(400).json(agent.error)
		}

		const updatedTicket = await TicketService.changeAgent({ agentId, id })

		const sendMailStatus = await MailService.sendMail({
			destination: ticket.data.requester.email,
			subject: 'O responsável do seu ticket foi alterado!',
			htmlMessage: `<h2>Olá ${ticket.data.requester.name}!</h2><br><p>Seu ticket <strong>${ticket.data.title}</strong> está com o responsável <strong>${agent.data.name}</strong></p><br><p>Acesse <a href=${process.env.CLIENT_URL} target=${target}>https://help.awer.co</a> para visualizar</p>`,
		})

		if (!sendMailStatus.success) {
			return res.status(400).json({
				error: 'Houve um problema ao enviar o e-mail, tente novamente',
			})
		}

		return res.json(updatedTicket)
	}

	async addComment(req, res) {
		const { writer, comment } = req.body

		const id = req.params.id

		const ticket = await TicketService.checkTicket(id)

		if (ticket.error) {
			return res.status(400).json(ticket.error)
		}

		const writerError = await TicketService.checkIfWriterIsValid(writer)

		if (writerError) {
			return res.status(400).json(writerError)
		}

		console.log(writer === ticket.data.requester._id.toString())

		if (writer === ticket.data.requester._id.toString()) {
			const sendMailStatus = await MailService.sendMail({
				destination: ticket.data.agent.email,
				subject: `${ticket.data.requester.name} comentou no ticket ${ticket.data.title}`,
				htmlMessage: `<h2>Olá ${ticket.data.agent.name}!</h2><br><p>O ticket <strong>${ticket.data.title}</strong> está com um novo comentário de <strong>${ticket.data.requester.name}</strong></p><br><p>Acesse <a href=${process.env.CLIENT_URL} target=${target}>https://help.awer.co</a> para visualizar</p>`,
			})

			if (!sendMailStatus.success) {
				return res.status(400).json({
					error: 'Houve um problema ao enviar o e-mail, tente novamente',
				})
			}
		}

		if (writer === ticket.data.agent._id.toString()) {
			const sendMailStatus = await MailService.sendMail({
				destination: ticket.data.requester.email,
				subject: `${ticket.data.agent.name} comentou no ticket ${ticket.data.title}`,
				htmlMessage: `<h2>Olá ${ticket.data.requester.name}!</h2><br><p>O ticket <strong>${ticket.data.title}</strong> está com um novo comentário de <strong>${ticket.data.agent.name}</strong></p><br><p>Acesse <a href=${process.env.CLIENT_URL} target=${target}>https://help.awer.co</a> para visualizar</p>`,
			})

			if (!sendMailStatus.success) {
				return res.status(400).json({
					error: 'Houve um problema ao enviar o e-mail, tente novamente',
				})
			}
		}

		const updatedTicket = await TicketService.addComment({
			writer,
			comment,
			id,
		})

		return res.json(updatedTicket)
	}
}

export default new CompanyController()
