import express from 'express'
const router = express.Router()
import { protect } from '../middlewares/authMiddleware.js'
import { uploadAvatar, resizeAvatar } from '../middlewares/imagesMiddleware.js'
import {
	userAuth,
	userRegister,
	changePassword,
	getUserProfileData,
	getNotifications,
	changeAvatar,
	getOwnAvatar
} from '../controllers/userController.js'
import {
	validateSignIn,
	validateSignUp,
	validatePasswordChange,
	validateUsernameExist
} from '../validators/userValidators.js'

// @route /api/users
router.route('/signin').post(validateSignIn, userAuth)
router.route('/notifications').get([ protect ], getNotifications)
router.route('/signup').post(validateSignUp, userRegister)
router.route('/password').post([ protect, ...validatePasswordChange ], changePassword)
router.route('/avatar').post([ protect, uploadAvatar, resizeAvatar ], changeAvatar).get([ protect ], getOwnAvatar)
router.route('/:username').get([ protect, validateUsernameExist ], getUserProfileData)

export default router
