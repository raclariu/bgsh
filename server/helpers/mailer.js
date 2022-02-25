import nodemailer from 'nodemailer'

export const sendAccountActivationMail = async ({ address, token }) => {
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
		let info = await transporter.sendMail({
			from    : 'noreply@bgsh.ro', // sender address
			to      : address, // list of receivers
			subject : 'Activate your bgsh.ro account', // Subject line
			text    : `Activate your account: localhost:3000/activation?token=${token}`, // plain text body
			html    : '<p>`Activate your account: localhost:3000/activation?token=${token}`</p>' // html body
		})

		console.log('Message sent: %s', info.messageId)
		console.log('Message', info)
		console.log('Transporter', transporter)
		// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
	} catch (error) {
		console.log(error)
	}
}

export const sendForgetPasswordMail = async () => {
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
		let info = await transporter.sendMail({
			from    : '"Bgsh.ro" <noreply@bgsh.ro>', // sender address
			to      : 'suportmeimei@gmail.com', // list of receivers
			subject : 'Hello ✔', // Subject line
			text    : 'Hello world?', // plain text body
			html    : '<b>Hello world?</b>' // html body
		})

		console.log('Message sent: %s', info.messageId)
		console.log('Message', info)
		console.log('Transporter', transporter)
		// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
	} catch (error) {
		console.log(error)
	}
}

export const sendChangedPasswordMail = async () => {
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
		let info = await transporter.sendMail({
			from    : '"Bgsh.ro" <noreply@bgsh.ro>', // sender address
			to      : 'suportmeimei@gmail.com', // list of receivers
			subject : 'Hello ✔', // Subject line
			text    : 'Hello world?', // plain text body
			html    : '<b>Hello world?</b>' // html body
		})

		console.log('Message sent: %s', info.messageId)
		console.log('Message', info)
		console.log('Transporter', transporter)
		// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
	} catch (error) {
		console.log(error)
	}
}
