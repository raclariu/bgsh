import express from 'express'
const router = express.Router()
import { protect } from '../middlewares/authMiddleware.js'
import { userAuth, userRegister, changePassword } from '../controllers/userController.js'
import {
	validateEmail,
	validateEmailDuplicate,
	validatePassword,
	validatePasswordConfirmation,
	validateUsername,
	validatePasswordCurrent,
	validatePasswordNew,
	validatePasswordNewConfirmation
} from '../validators/userValidators.js'

// @route /api/users
router.route('/signin').post([ validateEmail, validatePassword ], userAuth)
router
	.route('/signup')
	.post([ validateEmailDuplicate, validateUsername, validatePassword, validatePasswordConfirmation ], userRegister)
router
	.route('/password')
	.post([ protect, validatePasswordCurrent, validatePasswordNew, validatePasswordNewConfirmation ], changePassword)

export default router
