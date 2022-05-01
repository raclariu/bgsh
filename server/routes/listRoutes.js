import express from 'express'
const router = express.Router()
import { protect } from '../middlewares/authMiddleware.js'
import { getList, addOneToList, deleteOneFromList, clearList } from '../controllers/listController.js'

// @route /api/list
router.route('/').get(protect, getList).patch(protect, addOneToList).delete(protect, deleteOneFromList)
router.route('/clear').delete(protect, clearList)

export default router
