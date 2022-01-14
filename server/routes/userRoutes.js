import express from 'express'
const router = express.Router()
import { protect } from '../middlewares/authMiddleware.js'
import { uploadAvatar, resizeImage } from '../middlewares/multerMiddleware.js'
import {
	userAuth,
	userRegister,
	changePassword,
	getUserProfileData,
	getNotifications,
	changeAvatar
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
router.route('/:username').get([ protect, validateUsernameExist ], getUserProfileData)
router.route('/avatar').post([ protect, uploadAvatar, resizeImage ], changeAvatar)

export default router
