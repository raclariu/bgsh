import mongoose from 'mongoose'

const userSchema = mongoose.Schema({
	email    : {
		type     : String,
		required : true
	},
	username : {
		type     : String,
		required : true
	},
	password : {
		type     : String,
		required : true
	},
	isAdmin  : {
		type     : Boolean,
		required : true,
		default  : false
	}
})

const User = mongoose.model('User', userSchema)

export default User
