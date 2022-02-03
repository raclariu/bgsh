import mongoose from 'mongoose'

const collectionSchema = mongoose.Schema(
	{
		user       : {
			type     : mongoose.Schema.Types.ObjectId,
			required : true,
			ref      : 'User'
		},
		owned      : [
			{
				bggId     : {
					type     : String,
					required : true
				},
				subtype   : String,
				title     : String,
				year      : Number,
				thumbnail : String,
				image     : String,
				added     : Date,
				_id       : false,
				stats     : {
					userRating : Number,
					avgRating  : Number,
					ratings    : Number
				},
				version   : {
					type    : {
						title : String,
						year  : String
					},
					default : null,
					_id     : false
				}
			}
		],
		ownedCount : Number
	},
	{
		timestamps : true,
		collection : 'bggCollections'
	}
)

const Collection = mongoose.model('Collection', collectionSchema)

export default Collection
