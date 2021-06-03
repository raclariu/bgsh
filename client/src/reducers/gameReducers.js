import {
	BGG_GAMES_DETAILS_REQUEST,
	BGG_GAMES_DETAILS_SUCCESS,
	BGG_GAMES_DETAILS_FAIL,
	BGG_GAMES_DETAILS_RESET,
	SALE_LIST_ADD,
	SALE_LIST_REMOVE,
	SALE_LIST_RESET,
	SELL_GAMES_REQUEST,
	SELL_GAMES_SUCCESS,
	SELL_GAMES_FAIL,
	BGG_GAMES_SEARCH_REQUEST,
	BGG_GAMES_SEARCH_SUCCESS,
	BGG_GAMES_SEARCH_FAIL,
	BGG_GAMES_SEARCH_RESET,
	FOR_SALE_GAMES_REQUEST,
	FOR_SALE_GAMES_SUCCESS,
	FOR_SALE_GAMES_FAIL
} from '../constants/gameConstants'

export const bggGetGamesDetailsReducer = (state = {}, action) => {
	switch (action.type) {
		case BGG_GAMES_DETAILS_REQUEST:
			return { loading: true }
		case BGG_GAMES_DETAILS_SUCCESS:
			return {
				loading : false,
				success : true,
				games   : action.payload
			}
		case BGG_GAMES_DETAILS_FAIL:
			return { loading: false, error: action.payload }
		case BGG_GAMES_DETAILS_RESET:
			return {}

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
			return []

		default:
			return state
	}
}

export const bggSearchGamesReducer = (state = {}, action) => {
	switch (action.type) {
		case BGG_GAMES_SEARCH_REQUEST:
			return { loading: true }
		case BGG_GAMES_SEARCH_SUCCESS:
			return {
				loading : false,
				success : true,
				games   : action.payload
			}
		case BGG_GAMES_SEARCH_FAIL:
			return { loading: false, error: action.payload }
		case BGG_GAMES_SEARCH_RESET:
			return {}

		default:
			return state
	}
}

export const sellGamesReducer = (state = {}, action) => {
	switch (action.type) {
		case SELL_GAMES_REQUEST:
			return { loading: true }

		case SELL_GAMES_SUCCESS:
			return { loading: false, success: true }

		case SELL_GAMES_FAIL:
			return { loading: false, error: action.payload }

		default:
			return state
	}
}

export const getGamesForSaleReducer = (state = {}, action) => {
	switch (action.type) {
		case FOR_SALE_GAMES_REQUEST:
			return { loading: true }

		case FOR_SALE_GAMES_SUCCESS:
			return { loading: false, success: true, games: action.payload }

		case FOR_SALE_GAMES_FAIL:
			return { loading: false, error: action.payload }

		default:
			return state
	}
}
