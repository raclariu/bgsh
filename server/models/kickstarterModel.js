import mongoose from 'mongoose'
import { genNanoId } from '../helpers/helpers.js'

const kickstarterSchema = mongoose.Schema(
	{
		title       : String,
		image       : String,
		url         : String,
		description : String,
		publisher   : String,
		pledged     : Number,
		funded      : Number,
		time_left   : Number
	},
	{
		timestamps : true
	}
)

const Kickstarter = mongoose.model('Kickstarter', kickstarterSchema)

export default Kickstarter
