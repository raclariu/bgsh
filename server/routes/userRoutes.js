import express from 'express'
const router = express.Router()
import { protect } from '../middlewares/authMiddleware.js'
import { userAuth, userRegister, changePassword } from '../controllers/userController.js'
import {
	validateEmail,
	validateEmailDuplicate,
	validatePasswordSignIn,
	validatePasswordSignUp,
	validatePasswordConfirmation,
	validateUsername,
	validatePasswordCurrent,
	validatePasswordNew,
	validatePasswordNewConfirmation
} from '../validators/userValidators.js'

// @route /api/users
router.route('/signin').post([ validateEmail, validatePasswordSignIn ], userAuth)
router
	.route('/signup')
	.post(
		[ validateEmailDuplicate, validateUsername, validatePasswordSignUp, validatePasswordConfirmation ],
		userRegister
	)
router
	.route('/password')
	.post([ protect, validatePasswordCurrent, validatePasswordNew, validatePasswordNewConfirmation ], changePassword)

export default router
