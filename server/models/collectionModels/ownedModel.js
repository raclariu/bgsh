import mongoose from 'mongoose'

const ownedSchema = mongoose.Schema(
	{
		user        : {
			type     : mongoose.Schema.Types.ObjectId,
			required : true,
			ref      : 'User'
		},
		bggUsername : String,
		owned       : [
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
				modified  : Date,
				numPlays  : Number,
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
		ownedCount  : Number
	},
	{
		timestamps : true,
		collection : 'bggOwned'
	}
)

const Owned = mongoose.model('Owned', ownedSchema)

export default Owned
