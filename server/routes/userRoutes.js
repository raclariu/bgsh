import express from 'express'
const router = express.Router()
import { protect } from '../middlewares/authMiddleware.js'
import { uploadAvatar, resizeAvatar } from '../middlewares/imagesMiddleware.js'
import {
	userLogin,
	userRegister,
	activateAccount,
	changePassword,
	forgotPassword,
	getMe,
	resetPassword,
	getUserProfileData,
	getUserProfileListingsData,
	changeAvatar,
	getOwnAvatar
} from '../controllers/userController.js'
import {
	validateLogin,
	validateSignUp,
	validatePasswordChange,
	validateUsernameExist,
	validateEmail,
	validateResetPasswordNew,
	validatePasswordNewConfirmation
} from '../validators/userValidators.js'

// @route /api/users
router.route('/login').post(validateLogin, userLogin)
router.route('/signup').post(validateSignUp, userRegister)
router.route('/me').get(protect, getMe)
router.route('/activate/:tokenUid').get(activateAccount)
router.route('/password/change').post([ protect, ...validatePasswordChange ], changePassword)
router.route('/password/forgot').post(validateEmail, forgotPassword)
router.route('/password/reset').post([ validateResetPasswordNew, validatePasswordNewConfirmation ], resetPassword)
router.route('/avatar').post([ protect, uploadAvatar, resizeAvatar ], changeAvatar).get([ protect ], getOwnAvatar)
router.route('/:username').get([ protect, validateUsernameExist ], getUserProfileData)
router.route('/:username/listings').get([ protect, validateUsernameExist ], getUserProfileListingsData)

export default router
