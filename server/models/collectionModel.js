import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

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
			type     : String,
			required : true
		},
		year      : {
			type     : String,
			required : true
		},
		thumbnail : {
			type     : String,
			required : true
		}
	},
	{
		timestamps : true
	}
)

collectionSchema.plugin(mongoosePaginate)

const Collection = mongoose.model('Collection', collectionSchema)

export default Collection
