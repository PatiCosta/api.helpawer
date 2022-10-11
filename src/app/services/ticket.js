import Ticket from '../../schema/Ticket.js'
import User from '../../schema/User.js'

class CompanyService {
	async findAll() {
		return await Ticket.find({}).populate('requester').populate('agent')
	}

	async findPaginated({ page, limit, query }) {
		const tickets = await Ticket.find(query)
			.skip(page * limit)
			.limit(limit)
			.populate('requester')
			.populate('agent')

		const count = await User.countDocuments(query)

		return {
			total: count,
			tickets,
		}
	}

	createOne({ title, description, category, status, requester }) {
		const ticket = new Ticket({
			title,
			description,
			category,
			status,
			requester,
		})

		ticket.save()

		return ticket
	}

	async changeStatus({ id, status }) {
		return await Ticket.findByIdAndUpdate(
			id,
			{ status: status },
			{ new: true },
		)
	}

	async checkAgent(agent) {
		try {
			const user = await User.findById(agent).populate('role')

			if (!user) {
				return { error: 'Este responsável não existe' }
			}

			if (
				user.role.title !== 'administrador' &&
				user.role.title !== 'agente'
			) {
				return { error: 'Este responsável é inválido' }
			}

			return { data: user }
		} catch {
			return { error: 'Este responsável é inválido' }
		}
	}

	async checkTicket(id) {
		try {
			const ticket = await Ticket.findById(id)
				.populate('requester')
				.populate('agent')

			if (!ticket) {
				return { error: 'Este ticket não existe' }
			}

			return { data: ticket }
		} catch {
			return { error: 'Este ticket é inválido' }
		}
	}

	async checkIfWriterIsValid(id) {
		try {
			const user = await User.findById(id)

			if (!user) {
				return { error: 'Este usuário não existe' }
			}
		} catch {
			return { error: 'Este usuário é inválido' }
		}
	}

	async changeAgent({ id, agentId }) {
		return await Ticket.findByIdAndUpdate(
			id,
			{ agent: agentId },
			{ new: true },
		)
	}

	async addComment({ id, writer, comment }) {
		return await Ticket.findByIdAndUpdate(
			id,
			{ $push: { comments: { writer, comment } } },
			{ new: true },
		)
	}
}

export default new CompanyService()
