import bcrypt from 'bcryptjs'
import { parseString } from 'xml2js'
import jwt from 'jsonwebtoken'
import { customAlphabet } from 'nanoid/non-secure'

const genNanoId = (length) => {
	const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', length)
	return nanoid()
}

const parseXML = async (xml) => {
	const promise = await new Promise((resolve, reject) => {
		parseString(
			xml,
			{
				trim          : true,
				emptyTag      : null,
				explicitRoot  : false,
				explicitArray : false,
				mergeAttrs    : true
			},
			(error, result) => {
				if (error) reject(error)
				else resolve(result)
			}
		)
	})
	return promise
}

const comparePasswords = async (enteredPassword, dbPassword) => {
	return await bcrypt.compare(enteredPassword, dbPassword)
}

const hashPassword = async (password) => {
	return await bcrypt.hash(password, 11)
}

const generateToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn : '7d'
	})
}

export { parseXML, comparePasswords, hashPassword, generateToken, genNanoId }
