import express from 'express'
const router = express.Router()
import { userAuth, userRegister } from '../controllers/userController.js'
import {
	validateEmail,
	validatePassword,
	validatePasswordConfirmation,
	validateUsername
} from '../validators/userValidators.js'

// @route /api/users
router.route('/signin').post([ validateEmail, validatePassword ], userAuth)
router
	.route('/signup')
	.post([ validateEmail, validateUsername, validatePassword, validatePasswordConfirmation ], userRegister)

export default router
