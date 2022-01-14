import multer from 'multer'
import sharp from 'sharp'
import asyncHandler from 'express-async-handler'
import path from 'path'

const memStorage = multer.memoryStorage()
const upload = multer({
	storage    : memStorage,
	limits     : {
		fileSize : 1 * 1024 * 1024 // Maximum file size is 1MB
	},
	fileFilter : (req, file, cb) => {
		checkFileType(file, cb)
	}
}).single('avatar')

const uploadAvatar = (req, res, next) => {
	upload(req, res, (err) => {
		// FILE SIZE ERROR
		if (err instanceof multer.MulterError) {
			res.status(400)
			err.message = 'File is too damn big'
			next(err)
		} else if (err) {
			// INVALID FILE TYPE, message will return from fileFilter callback
			res.status(422)
			err.message = 'Invalid file. Only jpg/png files allowed'
			next(err)
		} else if (!req.file) {
			// FILE NOT SELECTED
			res.status(404)
			err.message = 'File not found'
			next(err)
		} else {
			next()
		}
	})
}

const checkFileType = (file, cb) => {
	console.log(file)
	// Allowed ext
	const filetypes = /jpeg|jpg|png/
	// const filetypes = /pdf/
	// Check ext
	const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
	// Check mime
	const mimetype = filetypes.test(file.mimetype)

	if (mimetype && extname) {
		return cb(null, true)
	} else {
		return cb(new Error(), false)
		// cb(null, false)
	}
}

const resizeImage = asyncHandler(async (req, res, next) => {
	try {
		const sharpBuffer = await sharp(req.file.buffer).resize(100).toBuffer()
		req.file.buffer = sharpBuffer
		next()
	} catch (error) {
		res.status(503)
		error.message = 'Error while uploading image. Please try again'
		next(error)
	}
})

export { uploadAvatar, resizeImage }
