import mongoose from 'mongoose'

const listSchema = mongoose.Schema(
	{
		addedBy : {
			type     : mongoose.Schema.Types.ObjectId,
			required : true,
			ref      : 'User'
		},
		list    : [
			{
				bggId     : {
					type     : String,
					required : true
				},
				image     : String,
				thumbnail : String,
				title     : String,
				year      : Number,
				userImage : {
					type    : Object,
					default : null
				},
				_id       : false
			}
		]
	},
	{
		timestamps : true
	}
)

const List = mongoose.model('List', listSchema)

export default List
