import nodemailer from 'nodemailer'
import winstonLogger from '../helpers/winstonLogger.js'

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
			from    : 'Meeples <no-reply@meeples.ro>', // sender address
			to      : address, // list of receivers
			subject : 'Activate your account', // Subject line
			text    :
				'Activate your Meeples account by clicking the link below' +
				'\n\n' +
				`${url}` +
				'\n\n' +
				'Link expires after 6 hours'
		})
	} catch (error) {
		winstonLogger.log({
			level   : 'error',
			message : {
				timestamp : new Date(),
				error     : `ERROR ACTIVATION EMAIL - ${error}`
			}
		})
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
		await transporter.sendMail({
			from    : 'Meeples <no-reply@meeples.ro>', // sender address
			to      : address, // list of receivers
			subject : 'Reset password request', // Subject line
			text    :
				'Reset your Meeples password by clicking the link below' +
				'\n\n' +
				`${url}` +
				'\n\n' +
				'Link expires after 6 hours'
		})
	} catch (error) {
		winstonLogger.log({
			level   : 'error',
			message : {
				timestamp : new Date(),
				error     : `ERROR FORGOT PASSWORD EMAIL - ${error}`
			}
		})
		console.log(error)
	}
}
