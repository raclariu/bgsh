import List from '../models/listModel.js'
import asyncHandler from 'express-async-handler'
import storage from '../helpers/storage.js'

// ~ @desc    Get list
// ~ @route   GET  /api/list
// ~ @access  Private route
const getList = asyncHandler(async (req, res) => {
	let userList = await List.findOneAndUpdate(
		{ addedBy: req.user._id },
		{},
		{ upsert: true, new: true, setDefaultsOnInsert: true }
	).lean()

	if (userList.list.length > 8) {
		userList.list = userList.list.slice(0, 8)
		return res.status(200).json(userList)
	}

	return res.status(200).json(userList)
})

// <> @desc    Add to list
// <> @route   PATCH  /api/list/add
// <> @access  Private route
const addOneToList = asyncHandler(async (req, res) => {
	const { bggId, title, year, thumbnail, image, version = null } = req.body
	let userList = await List.findOne({ addedBy: req.user._id }).lean()

	if (userList.list.length === 8) {
		res.status(400)
		throw {
			message : 'Maximum of 8 games can be added to your list'
		}
	}

	if (userList.list.some((item) => item.bggId === bggId)) {
		res.status(400)
		throw {
			message : `${title} is already in your list`
		}
	}

	userList.list.push({ bggId, title, year, thumbnail, image, version })
	const updatedUserList = await List.findOneAndUpdate(
		{ _id: userList._id },
		{ list: userList.list },
		{ new: true }
	).lean()

	return res.status(200).json(updatedUserList)
})

// ! @desc    Delete from list
// ! @route   DELETE  /api/list
// ! @access  Private route
const deleteOneFromList = asyncHandler(async (req, res) => {
	const { bggId } = req.body

	let userList = await List.findOne({ addedBy: req.user._id }).lean()

	if (userList.list.length === 0) {
		return res.status(200).json(userList)
	}

	const filtered = userList.list.filter((item) => item.bggId !== bggId)
	const toBeDeleted = userList.list.find((item) => item.bggId === bggId)

	const updatedUserList = await List.findOneAndUpdate({ _id: userList._id }, { list: filtered }, { new: true }).lean()

	res.status(200).json(updatedUserList)

	if (toBeDeleted.userImage) {
		await storage
			.bucket(process.env.IMG_BUCKET)
			.file(`f/${toBeDeleted.userImage.name}`)
			.delete({ ignoreNotFound: true })
		await storage
			.bucket(process.env.IMG_BUCKET)
			.file(`t/${toBeDeleted.userImage.name}`)
			.delete({ ignoreNotFound: true })
	}
})

// ! @desc    Clear list
// ! @route   DELETE  /api/list/clear
// ! @access  Private route
const clearList = async (req, res) => {
	const userList = await List.findOne({ addedBy: req.user._id }).select('_id').lean()

	if (!userList) {
		res.status(404)
		throw {
			message : 'List not found'
		}
	}

	await List.updateOne({ addedBy: req.user._id }, { list: [] })

	return res.status(204).end()
}

export { addOneToList, deleteOneFromList, getList, clearList }
