import mongoose from 'mongoose'

const RefreshTokenSchema = new mongoose.Schema(
	{
		user_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
			index: true,
		},
		refresh_token: {
			type: String,
			required: true,
			index: true,
		},
		expires_in: {
			type: Date,
			required: true,
		},
	},
	{
		timestamps: true,
	},
)

export default mongoose.model('RefreshToken', RefreshTokenSchema)
