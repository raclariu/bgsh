import { axsPUBLIC, axsAUTH } from '../api/axs'
import {
	USER_AUTH_REQUEST,
	USER_AUTH_SUCCESS,
	USER_AUTH_FAIL,
	USER_LOGOUT,
	USER_PREFERENCES_SET_THEME
} from '../constants/userConstants'

export const logIn = (data) => async (dispatch) => {
	dispatch({
		type    : USER_AUTH_SUCCESS,
		payload : data
	})

	localStorage.setItem('userData', JSON.stringify(data))
}

export const logOut = () => async (dispatch) => {
	localStorage.removeItem('userData')

	dispatch({ type: USER_LOGOUT })
}

export const setCurrentTheme = (theme) => async (dispatch) => {
	localStorage.setItem('currentTheme', JSON.stringify(theme))

	dispatch({ type: USER_PREFERENCES_SET_THEME, payload: theme })
}
