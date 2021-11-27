import mongoose from 'mongoose'

const wishlistSchema = mongoose.Schema(
	{
		user          : {
			type     : mongoose.Schema.Types.ObjectId,
			required : true,
			ref      : 'User'
		},

		wishlist      : [
			{
				bggId     : {
					type     : String,
					required : true
				},
				title     : String,
				year      : Number,
				thumbnail : String,
				image     : String,
				priority  : Number,
				added     : Date,
				_id       : false
			}
		],

		wishlistCount : Number
	},
	{
		timestamps : true,
		collection : 'bggWishlists'
	}
)

const Wishlist = mongoose.model('Wishlist', wishlistSchema)

export default Wishlist
