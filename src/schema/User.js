import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			index: true,
		},
		email: {
			type: String,
			required: true,
			index: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		role: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Role',
		},
		company: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Company',
		},
	},
	{
		timestamps: true,
	},
)

UserSchema.pre('save', async function (next) {
	const user = this

	if (!user.isModified('password')) return next()

	this.password = await bcrypt.hash(user.password, 8)
})

UserSchema.methods.checkPassword = function (password) {
	return bcrypt.compare(password, this.password)
}

export default mongoose.model('User', UserSchema)
