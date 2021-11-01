// @ Constants
import {
	BGG_COLLECTION_LIST_REQUEST,
	BGG_COLLECTION_LIST_SUCCESS,
	BGG_COLLECTION_LIST_FAIL,
	BGG_COLLECTION_LIST_RESET,
	DB_COLLECTION_LIST_REQUEST,
	DB_COLLECTION_LIST_SUCCESS,
	DB_COLLECTION_LIST_FAIL,
	DB_COLLECTION_LIST_RESET,
	WISHLIST_LIST_REQUEST,
	WISHLIST_LIST_SUCCESS,
	WISHLIST_LIST_FAIL,
	WISHLIST_LIST_RESET
} from '../constants/collectionConstants'

export const bggGetCollectionReducer = (state = {}, action) => {
	switch (action.type) {
		case BGG_COLLECTION_LIST_REQUEST:
			return { loading: true }
		case BGG_COLLECTION_LIST_SUCCESS:
			return { loading: false, success: true }
		case BGG_COLLECTION_LIST_FAIL:
			return { loading: false, error: action.payload }
		case BGG_COLLECTION_LIST_RESET:
			return {}

		default:
			return state
	}
}

export const dbGetCollectionReducer = (state = {}, action) => {
	switch (action.type) {
		case DB_COLLECTION_LIST_REQUEST:
			return { loading: true }
		case DB_COLLECTION_LIST_SUCCESS:
			return {
				loading    : false,
				success    : true,
				owned      : action.payload.owned,
				pagination : action.payload.pagination
			}
		case DB_COLLECTION_LIST_FAIL:
			return { loading: false, error: action.payload }
		case DB_COLLECTION_LIST_RESET:
			return {}

		default:
			return state
	}
}

export const getWishlistReducer = (state = {}, action) => {
	switch (action.type) {
		case WISHLIST_LIST_REQUEST:
			return { loading: true }
		case WISHLIST_LIST_SUCCESS:
			return {
				loading    : false,
				success    : true,
				wishlist   : action.payload.wishlist,
				pagination : action.payload.pagination
			}
		case WISHLIST_LIST_FAIL:
			return { loading: false, error: action.payload }
		case WISHLIST_LIST_RESET:
			return {}

		default:
			return state
	}
}
