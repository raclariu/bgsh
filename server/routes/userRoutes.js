import express from 'express'
const router = express.Router()
import { protect } from '../middlewares/authMiddleware.js'
import {
	userAuth,
	userRegister,
	changePassword,
	getUserProfileData,
	getNotifications
} from '../controllers/userController.js'
import {
	validateEmail,
	validateEmailDuplicate,
	validatePasswordSignIn,
	validatePasswordSignUp,
	validatePasswordConfirmation,
	validateUsername,
	validatePasswordCurrent,
	validatePasswordNew,
	validatePasswordNewConfirmation,
	validateUsernameExist
} from '../validators/userValidators.js'

// @route /api/users
router.route('/signin').post([ validateEmail, validatePasswordSignIn ], userAuth)
router.route('/notifications').get([ protect ], getNotifications)
router
	.route('/signup')
	.post(
		[ validateEmailDuplicate, validateUsername, validatePasswordSignUp, validatePasswordConfirmation ],
		userRegister
	)
router
	.route('/password')
	.post([ protect, validatePasswordCurrent, validatePasswordNew, validatePasswordNewConfirmation ], changePassword)
router.route('/:username').get([ protect, validateUsernameExist ], getUserProfileData)

export default router
