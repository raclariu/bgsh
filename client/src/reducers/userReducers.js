// @ Constants
import {
	GET_ME_FAIL,
	GET_ME_REQUEST,
	GET_ME_SUCCESS,
	USER_AUTH_SUCCESS,
	USER_LOGOUT,
	USER_PREFERENCES_SET_THEME
} from '../constants/userConstants'

export const userAuthReducer = (state = null, action) => {
	switch (action.type) {
		case USER_AUTH_SUCCESS:
			return action.payload
		case USER_LOGOUT:
			return null
		default:
			return state
	}
}

export const getMeReducer = (state = {}, action) => {
	switch (action.type) {
		case GET_ME_REQUEST:
			return { loading: true }
		case GET_ME_SUCCESS:
			return { loading: false, success: true, ...action.payload }
		case GET_ME_FAIL:
			return { loading: false, success: false, error: true }
		case USER_LOGOUT:
			return {}
		default:
			return state
	}
}

export const setThemeReducer = (state = {}, action) => {
	switch (action.type) {
		case USER_PREFERENCES_SET_THEME:
			return { theme: action.payload }

		default:
			return state
	}
}
