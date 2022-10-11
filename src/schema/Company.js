import mongoose from 'mongoose'

const CompanySchema = new mongoose.Schema(
	{
		name: {
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

export default mongoose.model('Company', CompanySchema)
