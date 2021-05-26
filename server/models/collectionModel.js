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
		title     : String,
		year      : Number,
		thumbnail : String
	},
	{
		timestamps : true
	}
)

const Collection = mongoose.model('Collection', collectionSchema)

export default Collection
