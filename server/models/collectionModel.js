import mongoose from 'mongoose'

const collectionSchema = mongoose.Schema(
	{
		user          : {
			type     : mongoose.Schema.Types.ObjectId,
			required : true,
			ref      : 'User'
		},
		owned         : [
			{
				bggId     : {
					type     : String,
					required : true
				},
				title     : String,
				year      : Number,
				thumbnail : String
			}
		],
		wishlist      : [
			{
				bggId     : {
					type     : String,
					required : true
				},
				title     : String,
				year      : Number,
				thumbnail : String,
				priority  : Number
			}
		],
		totalOwned    : Number,
		totalWishlist : Number
	},
	{
		timestamps : true
	}
)

const Collection = mongoose.model('Collection', collectionSchema)

export default Collection
