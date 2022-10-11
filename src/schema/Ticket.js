import mongoose from 'mongoose'

const TicketSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			index: true,
		},
		description: {
			type: String,
			required: true,
		},
		category: {
			type: String,
			required: true,
		},
		status: {
			type: String,
		},
		requester: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		agent: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		comments: [
			{
				writer: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'User',
				},
				comment: String,
			},
		],
	},
	{
		timestamps: true,
	},
)

export default mongoose.model('Ticket', TicketSchema)
