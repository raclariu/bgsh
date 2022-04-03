import nodemailer from 'nodemailer'

export const sendAccountActivationMail = async ({ address, url }) => {
	// create reusable transporter object using the default SMTP transport
	let transporter = nodemailer.createTransport({
		host   : 'smtp-relay.sendinblue.com',
		port   : process.env.SIB_SMTP_PORT,
		secure : false, // true for 465, false for other ports
		auth   : {
			user : process.env.SIB_SMTP_LOGIN, // generated ethereal user
			pass : process.env.SIB_SMTP_KEY // generated ethereal password
		}
	})

	try {
		// send mail with defined transport object
		const info = await transporter.sendMail({
			from    : 'Meeps <noreply@meeps.ro>', // sender address
			to      : address, // list of receivers
			subject : 'MEEPS.RO - Activate your account', // Subject line
			text    :
				'Activate your Meeps account by clicking the link below' +
				'\n\n' +
				`${url}` +
				'\n\n' +
				'Link expires after 6 hours'
		})

		console.log('Message sent: %s', info.messageId)
		console.log('Message', info)

		// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
	} catch (error) {
		console.log(error)
	}
}

export const sendForgotPasswordMail = async ({ address, url }) => {
	// create reusable transporter object using the default SMTP transport
	let transporter = nodemailer.createTransport({
		host   : 'smtp-relay.sendinblue.com',
		port   : process.env.SIB_SMTP_PORT,
		secure : false, // true for 465, false for other ports
		auth   : {
			user : process.env.SIB_SMTP_LOGIN, // generated ethereal user
			pass : process.env.SIB_SMTP_KEY // generated ethereal password
		}
	})

	try {
		// send mail with defined transport object
		const info = await transporter.sendMail({
			from    : 'Meeps <noreply@meeps.ro>', // sender address
			to      : address, // list of receivers
			subject : 'MEEPS.RO - Reset password request', // Subject line
			text    :
				'Reset your Meeps password bu clicking the link below' +
				'\n\n' +
				`${url}` +
				'\n\n' +
				'Link expires after 6 hours'
		})

		console.log('Message sent: %s', info.messageId)
		console.log('Message', info)

		// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
	} catch (error) {
		console.log(error)
	}
}
