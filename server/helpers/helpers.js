import { parseString } from 'xml2js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const parseXML = async (xml) => {
	const promise = await new Promise((resolve, reject) => {
		parseString(xml, { trim: true, emptyTag: '-' }, (error, result) => {
			if (error) reject(error)
			else resolve(result)
		})
	})
	return promise
}

const comparePasswords = async (enteredPassword, dbPassword) => {
	return await bcrypt.compare(enteredPassword, dbPassword)
}

const hashPassword = async (password) => {
	return await bcrypt.hash(password, 10)
}

const generateToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn : '30d'
	})
}

export { parseXML, comparePasswords, hashPassword, generateToken }
