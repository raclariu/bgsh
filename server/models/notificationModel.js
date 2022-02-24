import mongoose from 'mongoose'

const notificationSchema = mongoose.Schema(
	{
		// sender    : {
		// 	type     : mongoose.Schema.Types.ObjectId,
		// 	required : true,
		// 	ref      : 'User'
		// },
		recipient : {
			type     : mongoose.Schema.Types.ObjectId,
			required : true,
			ref      : 'User'
		},
		type      : {
			type    : String,
			default : 'general'
		},
		text      : String,
		meta      : {},
		read      : {
			type    : Boolean,
			default : false
		},
		readAt    : {
			type    : Date,
			default : null
		}
	},
	{
		timestamps : true,
		collection : 'notifications'
	}
)

const Notification = mongoose.model('Notification', notificationSchema)

export default Notification
