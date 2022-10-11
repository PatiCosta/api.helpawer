import sgMail from '@sendgrid/mail'

const mailConfig = sgMail.setApiKey(process.env.SENDGRID_KEY)

export default mailConfig
