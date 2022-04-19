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
		await transporter.sendMail({
			from    : 'Meeples.ro <no-reply@meeples.ro>', // sender address
			to      : address, // list of receivers
			subject : 'Meeples.ro - Instructions to activate your account', // Subject line
			text    :
				'Activate your Meeples account by clicking the link below' +
				'\n\n' +
				`${url}` +
				'\n\n' +
				'Link expires after 6 hours'
		})
	} catch (error) {
		console.error(error)
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
		await transporter.sendMail({
			from    : 'Meeples <no-reply@meeples.ro>', // sender address
			to      : address, // list of receivers
			subject : 'Meeples.ro - Instructions to reset password', // Subject line
			text    :
				'Reset your Meeples password by clicking the link below' +
				'\n\n' +
				`${url}` +
				'\n\n' +
				'Link expires after 6 hours'
		})
	} catch (error) {
		console.error(error)
	}
}

export const sendNewMessageMailNotification = async ({ address, sender, subject, message }) => {
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
		await transporter.sendMail({
			from    : 'Meeples <no-reply@meeples.ro>', // sender address
			to      : address, // list of receivers
			subject : `Meeples.ro - New message from ${sender}`, // Subject line
			text    :
				`You received a new message from ${sender}` +
				'\n\n' +
				'Subject:' +
				'\n' +
				subject +
				'\n\n' +
				'Message:' +
				'\n' +
				message +
				'\n\n' +
				'Go to https://meeples.ro/received to reply',
			html    : `<p style="font-size: 16px;"><b>You received a new message from ${sender}</b></p>
			<br/>
			<hr/>
			<p style="font-size: 20px;"><b>Subject:</b></p>
			<p>${subject}</p>
			<p style="font-size: 20px;"><b>Message:</b></p>
			${message}
			<hr/>
			<br/>
			<p>Go to https://meeples.ro/received to reply</p>
			`
		})
	} catch (error) {
		console.error(error)
	}
}
