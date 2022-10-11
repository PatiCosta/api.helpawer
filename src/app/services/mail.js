import mailConfig from '../../config/sendgrid.js'

class MailService {
	async sendMail({ destination, subject, htmlMessage }) {
		return await mailConfig
			.send({
				to: destination,
				from: 'contato@awer.co',
				subject: subject,
				html: htmlMessage,
			})
			.then((response) => {
				return {
					success: true,
					code: response[0].statusCode,
				}
			})
			.catch((error) => {
				return {
					success: false,
					error,
				}
			})
	}
}

export default new MailService()
