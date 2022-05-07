import mongoose from 'mongoose'

const userSchema = mongoose.Schema(
	{
		email              : {
			type      : String,
			lowercase : true,
			trim      : true,
			unique    : true,
			required  : true
		},
		username           : {
			type      : String,
			lowercase : true,
			trim      : true,
			unique    : true,
			required  : true
		},
		password           : {
			type     : String,
			required : true
		},
		isAdmin            : {
			type     : Boolean,
			required : true,
			default  : false
		},
		lastSeen           : {
			type    : Date,
			default : Date.now
		},
		avatar             : {
			type    : String,
			default : null
		},
		status             : {
			type    : String,
			default : 'pending'
		},
		savedGames         : [
			{
				type     : mongoose.Schema.Types.ObjectId,
				required : true,
				ref      : 'Game'
			}
		],
		socials            : {
			bggUsername : {
				type    : String,
				default : null
			},
			fbgUsername : {
				type    : String,
				default : null
			},
			show        : {
				type    : Boolean,
				default : false
			}
		},
		emailNotifications : {
			type    : Boolean,
			default : false
		}
	},
	{
		timestamps : true,
		collection : 'users'
	}
)

const User = mongoose.model('User', userSchema)

export default User
