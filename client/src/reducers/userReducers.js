// @ Constants
import {
	USER_AUTH_REQUEST,
	USER_AUTH_SUCCESS,
	USER_AUTH_FAIL,
	USER_LOGOUT,
	USER_CHANGE_AVATAR,
	USER_PREFERENCES_SET_THEME
} from '../constants/userConstants'

export const userAuthReducer = (state = {}, action) => {
	switch (action.type) {
		case USER_AUTH_REQUEST:
			return { loading: true }
		case USER_AUTH_SUCCESS:
			return { loading: false, success: true, userData: action.payload }
		case USER_AUTH_FAIL:
			return { loading: false, error: action.payload }
		case USER_CHANGE_AVATAR:
			return { ...state, userData: { ...state.userData, avatar: action.payload } }
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
