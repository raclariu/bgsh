// @ Constants
import { SALE_LIST_ADD, SALE_LIST_REMOVE, SALE_LIST_RESET } from '../constants/saleListConstants'

export const saleListReducer = (state = [], action) => {
	switch (action.type) {
		case SALE_LIST_ADD:
			return [ ...state, action.payload ]

		case SALE_LIST_REMOVE:
			return action.payload

		case SALE_LIST_RESET:
			return []

		default:
			return state
	}
}
