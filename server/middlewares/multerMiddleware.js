import multer from 'multer'
import path from 'path'

const __dirname = path.resolve()

const storage = multer.diskStorage({
	destination : function(req, file, cb) {
		cb(null, 'server/public')
	},
	filename    : function(req, file, cb) {
		console.log('inside mw', file)
		const ext = file.mimetype.split('/')[1]
		cb(null, `avatars/${req.user._id.toString()}.${ext}`)
	}
})

const uploadAvatar = multer({ storage: storage }).single('avatar')

export { uploadAvatar }
