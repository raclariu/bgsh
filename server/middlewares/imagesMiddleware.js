import multer from 'multer'
import sharp from 'sharp'
import asyncHandler from 'express-async-handler'
import path from 'path'

const memStorage = multer.memoryStorage()

// @ Avatar
const multerAvatar = multer({
	storage    : memStorage,
	limits     : {
		fileSize : 1 * 1024 * 1024 // Maximum file size is 1MB
	},
	fileFilter : (req, file, cb) => {
		checkAvatarFileType(file, cb)
	}
}).single('avatar')

const uploadAvatar = (req, res, next) => {
	multerAvatar(req, res, (err) => {
		// FILE SIZE ERROR
		if (err instanceof multer.MulterError) {
			res.status(400)
			err.message = 'After resizing, image size is larger than 1MB. Please upload a smaller image'
			next(err)
		} else if (err) {
			// INVALID FILE TYPE, message will return from fileFilter callback
			res.status(422)
			err.message = 'Only .jpg and .png images are allowed'
			next(err)
		} else if (!req.file) {
			// FILE NOT SELECTED
			res.status(404)
			err.message = 'File not found. Try again'
			next(err)
		} else {
			next()
		}
	})
}

const checkAvatarFileType = (file, cb) => {
	// Allowed ext
	const filetypes = /jpeg|jpg|png/
	// Check ext
	const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
	// Check mime
	const mimetype = filetypes.test(file.mimetype)

	if (mimetype && extname) {
		return cb(null, true)
	} else {
		return cb(new Error(), false)
	}
}

const resizeAvatar = asyncHandler(async (req, res, next) => {
	try {
		const resized = await sharp(req.file.buffer)
			.resize(96)
			.toFormat('webp')
			.webp({ quality: 95 })
			.toBuffer({ resolveWithObject: true })

		req.file = {
			...req.file,
			mimetype : 'image/webp',
			size     : resized.info.size,
			buffer   : resized.data
		}

		next()
	} catch (error) {
		res.status(503)
		error.message = 'Error while uploading image. Please try again'
		next(error)
	}
})

// @ Game image
const multerGameImage = multer({
	storage    : memStorage,
	limits     : {
		fileSize : 7 * 1024 * 1024 // Maximum file size is 7MB
	},
	fileFilter : (req, file, cb) => {
		checkGameImageFileType(file, cb)
	}
}).single('userImage')

const uploadGameImage = (req, res, next) => {
	multerGameImage(req, res, (err) => {
		// FILE SIZE ERROR
		if (err instanceof multer.MulterError) {
			res.status(400)
			err.message = 'Image size is larger than 5MB. Please upload a smaller image'
			next(err)
		} else if (err) {
			// INVALID FILE TYPE, message will return from fileFilter callback
			res.status(422)
			err.message = 'Only .jpg and .png images are allowed'
			next(err)
		} else if (!req.file) {
			// FILE NOT SELECTED
			res.status(404)
			err.message = 'File not found. Try again'
			next(err)
		} else {
			next()
		}
	})
}

const checkGameImageFileType = (file, cb) => {
	// Allowed ext
	const filetypes = /jpeg|jpg|png/
	// Check ext
	const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
	// Check mime
	const mimetype = filetypes.test(file.mimetype)

	if (mimetype && extname) {
		return cb(null, true)
	} else {
		return cb(new Error(), false)
	}
}

const resizeGameImage = asyncHandler(async (req, res, next) => {
	try {
		const resizedFull = await sharp(req.file.buffer)
			.resize({
				fit    : 'contain',
				height : 720
			})
			.toFormat('webp')
			.webp({ quality: 80 })
			.toBuffer({ resolveWithObject: true })

		const resizedThumb = await sharp(req.file.buffer)
			.resize({
				fit    : 'contain',
				height : 120
			})
			.toFormat('webp')
			.webp({ quality: 60 })
			.toBuffer({ resolveWithObject: true })

		const full = {
			...req.file,
			mimetype : 'image/webp',
			size     : resizedFull.info.size,
			buffer   : resizedFull.data
		}
		const thumbnail = {
			...req.file,
			mimetype : 'image/webp',
			size     : resizedThumb.info.size,
			buffer   : resizedThumb.data
		}

		req.resizedFiles = { full, thumbnail }

		next()
	} catch (error) {
		res.status(503)
		error.message = 'Error while uploading image. Please try again'
		next(error)
	}
})

export { uploadAvatar, resizeAvatar, uploadGameImage, resizeGameImage }
