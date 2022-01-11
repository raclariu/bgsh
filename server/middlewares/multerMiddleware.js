import multer from 'multer'

const storage = multer.diskStorage({
	destination : './server/public',
	filename    : function(req, file, cb) {
		console.log('inside mw', file)
		const ext = file.mimetype.split('/')[1]
		cb(null, `/avatars/${req.user.username}${Date.now()}.${ext}`)
	}
})

const uploadAvatar = multer({ storage: storage }).single('avatar')

export { uploadAvatar }
