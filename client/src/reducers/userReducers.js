// @ Constants
import {
	USER_AUTH_REQUEST,
	USER_AUTH_SUCCESS,
	USER_AUTH_FAIL,
	USER_SIGNOUT,
	USER_PREFERENCES_SET_THEME,
	USER_CHANGE_PASSWORD_REQUEST,
	USER_CHANGE_PASSWORD_SUCCESS,
	USER_CHANGE_PASSWORD_FAIL,
	USER_CHANGE_PASSWORD_RESET
} from '../constants/userConstants'

export const userAuthReducer = (state = {}, action) => {
	switch (action.type) {
		case USER_AUTH_REQUEST:
			return { loading: true }
		case USER_AUTH_SUCCESS:
			return { loading: false, success: true, userData: action.payload }
		case USER_AUTH_FAIL:
			return { loading: false, error: action.payload }
		case USER_SIGNOUT:
			return {}

		default:
			return state
	}
}

export const userChangePasswordReducer = (state = {}, action) => {
	switch (action.type) {
		case USER_CHANGE_PASSWORD_REQUEST:
			return { loading: true }
		case USER_CHANGE_PASSWORD_SUCCESS:
			return { loading: false, success: true }
		case USER_CHANGE_PASSWORD_FAIL:
			return { loading: false, error: action.payload }
		case USER_CHANGE_PASSWORD_RESET:
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
