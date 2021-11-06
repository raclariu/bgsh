import mongoose from 'mongoose'

const userSchema = mongoose.Schema({
	email       : {
		type      : String,
		lowercase : true,
		trim      : true,
		required  : true
	},
	username    : {
		type      : String,
		lowercase : true,
		trim      : true,
		required  : true
	},
	bggUsername : {
		type      : String,
		lowercase : true,
		trim      : true,
		default   : ''
	},
	password    : {
		type     : String,
		required : true
	},
	isAdmin     : {
		type     : Boolean,
		required : true,
		default  : false
	},
	savedGames  : [
		{
			type     : mongoose.Schema.Types.ObjectId,
			required : true,
			ref      : 'Game'
		}
	]
})

const User = mongoose.model('User', userSchema)

export default User
