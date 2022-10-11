import mongoose from 'mongoose'

const RoleSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			index: true,
			unique: true,
		},
	},
	{
		timestamps: true,
	},
)

export default mongoose.model('Role', RoleSchema)
