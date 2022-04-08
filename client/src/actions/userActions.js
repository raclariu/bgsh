import {
	USER_AUTH_REQUEST,
	USER_AUTH_SUCCESS,
	USER_AUTH_FAIL,
	USER_LOGOUT,
	USER_PREFERENCES_SET_THEME,
	GET_ME_REQUEST,
	GET_ME_SUCCESS,
	GET_ME_FAIL
} from '../constants/userConstants'
import { apiGetMe } from '../api/api'

export const logIn = (data) => async (dispatch) => {
	dispatch({
		type    : USER_AUTH_SUCCESS,
		payload : data
	})

	localStorage.setItem('userToken', JSON.stringify(data))
}

export const getMe = () => async (dispatch) => {
	try {
		dispatch({
			type : GET_ME_REQUEST
		})

		const data = await apiGetMe()

		dispatch({
			type    : GET_ME_SUCCESS,
			payload : data
		})
	} catch (error) {
		dispatch({
			type : GET_ME_FAIL
		})
	}
}

export const logOut = () => async (dispatch) => {
	localStorage.removeItem('userToken')

	dispatch({ type: USER_LOGOUT })
}

export const setCurrentTheme = (theme) => async (dispatch) => {
	localStorage.setItem('currentTheme', JSON.stringify(theme))

	dispatch({ type: USER_PREFERENCES_SET_THEME, payload: theme })
}
