import mongoose from 'mongoose'

const collectionSchema = mongoose.Schema(
	{
		user      : {
			type     : mongoose.Schema.Types.ObjectId,
			required : true,
			ref      : 'User'
		},
		bggId     : {
			type     : String,
			required : true
		},
		title     : {
			type : String
		},
		year      : {
			type : Number
		},
		thumbnail : {
			type : String
		}
	},
	{
		timestamps : true
	}
)

const Collection = mongoose.model('Collection', collectionSchema)

export default Collection
