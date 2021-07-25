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
	TRADE_GAMES_REQUEST,
	TRADE_GAMES_SUCCESS,
	TRADE_GAMES_FAIL,
	BGG_GAMES_SEARCH_REQUEST,
	BGG_GAMES_SEARCH_SUCCESS,
	BGG_GAMES_SEARCH_FAIL,
	BGG_GAMES_SEARCH_RESET,
	GAMES_INDEX_REQUEST,
	GAMES_INDEX_SUCCESS,
	GAMES_INDEX_FAIL,
	FOR_SALE_SINGLE_GAME_REQUEST,
	FOR_SALE_SINGLE_GAME_SUCCESS,
	FOR_SALE_SINGLE_GAME_FAIL,
	FOR_SALE_SINGLE_GAME_RESET,
	SAVE_GAME_SWITCH_REQUEST,
	SAVE_GAME_SWITCH_SUCCESS,
	SAVE_GAME_SWITCH_FAIL,
	SAVED_GAMES_REQUEST,
	SAVED_GAMES_SUCCESS,
	SAVED_GAMES_FAIL,
	SAVED_GAMES_RESET,
	SAVED_GAMES_SINGLE_REQUEST,
	SAVED_GAMES_SINGLE_SUCCESS,
	SAVED_GAMES_SINGLE_FAIL,
	USER_ACTIVE_GAMES_REQUEST,
	USER_ACTIVE_GAMES_SUCCESS,
	USER_ACTIVE_GAMES_FAIL,
	GAME_DELETE_REQUEST,
	GAME_DELETE_SUCCESS,
	GAME_DELETE_FAIL
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

export const tradeGamesReducer = (state = {}, action) => {
	switch (action.type) {
		case TRADE_GAMES_REQUEST:
			return { loading: true }

		case TRADE_GAMES_SUCCESS:
			return { loading: false, success: true }

		case TRADE_GAMES_FAIL:
			return { loading: false, error: action.payload }

		default:
			return state
	}
}

export const getGamesReducer = (state = {}, action) => {
	switch (action.type) {
		case GAMES_INDEX_REQUEST:
			return { loading: true }

		case GAMES_INDEX_SUCCESS:
			return {
				loading    : false,
				success    : true,
				saleData   : action.payload.saleData,
				pagination : action.payload.pagination
			}

		case GAMES_INDEX_FAIL:
			return { loading: false, error: action.payload }

		default:
			return state
	}
}

export const getUserActiveGamesReducer = (state = {}, action) => {
	switch (action.type) {
		case USER_ACTIVE_GAMES_REQUEST:
			return { loading: true }

		case USER_ACTIVE_GAMES_SUCCESS:
			return {
				loading     : false,
				success     : true,
				activeGames : action.payload.activeGames,
				pagination  : action.payload.pagination
			}

		case USER_ACTIVE_GAMES_FAIL:
			return { loading: false, error: action.payload }

		default:
			return state
	}
}

export const getSingleGameReducer = (state = {}, action) => {
	switch (action.type) {
		case FOR_SALE_SINGLE_GAME_REQUEST:
			return { loading: true }

		case FOR_SALE_SINGLE_GAME_SUCCESS:
			return { loading: false, success: true, saleData: action.payload }

		case FOR_SALE_SINGLE_GAME_FAIL:
			return { loading: false, error: action.payload }

		case FOR_SALE_SINGLE_GAME_RESET:
			return {}

		default:
			return state
	}
}

export const savedGameStatusReducer = (state = {}, action) => {
	switch (action.type) {
		case SAVE_GAME_SWITCH_REQUEST:
			return { loading: true }

		case SAVE_GAME_SWITCH_SUCCESS:
			return { loading: false, success: true, isSaved: action.payload }

		case SAVE_GAME_SWITCH_FAIL:
			return { loading: false, error: action.payload }

		case SAVED_GAMES_SINGLE_REQUEST:
			return { loading: true }

		case SAVED_GAMES_SINGLE_SUCCESS:
			return { loading: false, success: true, isSaved: action.payload }

		case SAVED_GAMES_SINGLE_FAIL:
			return { loading: false, error: action.payload }

		default:
			return state
	}
}

export const savedGamesListReducer = (state = {}, action) => {
	switch (action.type) {
		case SAVED_GAMES_REQUEST:
			return { loading: true }

		case SAVED_GAMES_SUCCESS:
			return { loading: false, success: true, list: action.payload.list, pagination: action.payload.pagination }

		case SAVED_GAMES_FAIL:
			return { loading: false, error: action.payload }

		case SAVED_GAMES_RESET:
			return {}

		default:
			return state
	}
}

export const deleteGameReducer = (state = {}, action) => {
	switch (action.type) {
		case GAME_DELETE_REQUEST:
			return { loading: true }

		case GAME_DELETE_SUCCESS:
			return { loading: false, success: true }

		case GAME_DELETE_FAIL:
			return { loading: false, error: action.payload }

		default:
			return state
	}
}
