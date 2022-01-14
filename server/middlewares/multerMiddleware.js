import multer from 'multer'
import path from 'path'

const memStorage = multer.memoryStorage()
const uploadAvatar = multer({
	storage    : memStorage,
	limits     : {
		fileSize : 1 * 1024 * 1024 // Maximum file size is 1MB
	},
	fileFilter : (_req, file, cb) => {
		checkFileType(file, cb)
	}
}).single('avatar')

const checkFileType = (file, cb) => {
	// Allowed ext
	// const filetypes = /jpeg|jpg|png/
	const filetypes = /pdf/
	// Check ext
	const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
	// Check mime
	const mimetype = filetypes.test(file.mimetype)

	if (mimetype && extname) {
		return cb(null, true)
	} else {
		// return cb(new Error('Only images are allowed'))
		cb(null, false)
	}
}

export { uploadAvatar }
