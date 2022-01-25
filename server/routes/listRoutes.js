import express from 'express'
const router = express.Router()
import { protect } from '../middlewares/authMiddleware.js'
import { getList, addOneToList, deleteOneFromList } from '../controllers/listController.js'

// @route /api/list
router.route('/').get(protect, getList).patch(protect, addOneToList).delete(protect, deleteOneFromList)

export default router
