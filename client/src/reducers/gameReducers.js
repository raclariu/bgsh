import {
	BGG_GAME_DETAILS_REQUEST,
	BGG_GAME_DETAILS_SUCCESS,
	BGG_GAME_DETAILS_FAIL,
	SALE_LIST_ADD,
	SALE_LIST_REMOVE,
	SALE_LIST_RESET
} from '../constants/gameConstants'

export const bggGetGameDetailsReducer = (state = {}, action) => {
	switch (action.type) {
		case BGG_GAME_DETAILS_REQUEST:
			return { loading: true }
		case BGG_GAME_DETAILS_SUCCESS:
			return {
				loading : false,
				success : true,
				games   : action.payload
			}
		case BGG_GAME_DETAILS_FAIL:
			return { loading: false, error: action.payload }

		default:
			return state
	}
}

export const saleListReducer = (state = [], action) => {
	switch (action.type) {
		case SALE_LIST_ADD:
			return [ ...state, action.payload ]

		case SALE_LIST_REMOVE:
			return action.payload

		case SALE_LIST_RESET:
			console.log('reseted')
			return []

		default:
			return state
	}
}
