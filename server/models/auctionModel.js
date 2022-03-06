import mongoose from 'mongoose'
import { genNanoId } from '../helpers/helpers.js'

const auctionSchema = mongoose.Schema(
	{
		mode          : {
			type    : String,
			default : 'auction'
		},
		addedBy       : {
			type     : mongoose.Schema.Types.ObjectId,
			required : true,
			ref      : 'User'
		},
		altId         : {
			type    : String,
			unique  : true,
			default : () => genNanoId(8)
		},
		games         : Array,
		shipping      : {
			shipCourier      : Boolean,
			shipPost         : Boolean,
			shipPersonal     : Boolean,
			shipCourierPayer : String,
			shipPostPayer    : String,
			shipCities       : []
		},
		bids          : [
			{
				bidBy   : {
					type     : mongoose.Schema.Types.ObjectId,
					required : true,
					ref      : 'User'
				},
				amount  : Number,
				bidDate : {
					type    : Date,
					default : new Date()
				},
				winner  : {
					type    : Boolean,
					default : false
				}
			}
		],
		extraInfoPack : String,
		isPack        : Boolean,
		startingPrice : Number,
		buyNowPrice   : Number,
		endDate       : Date,
		snipeRule     : String
	},
	{
		timestamps : true
	}
)

auctionSchema.index({ createdAt: -1 })
const Auction = mongoose.model('Auction', auctionSchema)

export default Auction
