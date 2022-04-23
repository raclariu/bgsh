import mongoose from 'mongoose'

const wishlistSchema = mongoose.Schema(
	{
		user          : {
			type     : mongoose.Schema.Types.ObjectId,
			required : true,
			ref      : 'User'
		},
		bggUsername   : String,
		wishlist      : [
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
				priority  : Number,
				modified  : Date,
				numPlays  : Number,
				_id       : false,
				stats     : {
					userRating : Number,
					avgRating  : Number,
					ratings    : Number
				}
			}
		],

		wishlistCount : Number
	},
	{
		timestamps : true,
		collection : 'bggWishlist'
	}
)

const Wishlist = mongoose.model('Wishlist', wishlistSchema)

export default Wishlist
