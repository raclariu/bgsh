import mongoose from 'mongoose'

const userSchema = mongoose.Schema(
	{
		email      : {
			type      : String,
			lowercase : true,
			trim      : true,
			unique    : true,
			required  : true
		},
		username   : {
			type      : String,
			lowercase : true,
			trim      : true,
			unique    : true,
			required  : true
		},
		password   : {
			type     : String,
			required : true
		},
		isAdmin    : {
			type     : Boolean,
			required : true,
			default  : false
		},
		lastSeen   : {
			type    : Date,
			default : new Date()
		},
		avatar     : {
			type    : String,
			default : null
		},
		savedGames : [
			{
				type     : mongoose.Schema.Types.ObjectId,
				required : true,
				ref      : 'Game'
			}
		]
	},
	{
		timestamps : true,
		collection : 'users'
	}
)

const User = mongoose.model('User', userSchema)

export default User
