import axios from 'axios'
import { BGG_GAME_DETAILS_REQUEST, BGG_GAME_DETAILS_SUCCESS, BGG_GAME_DETAILS_FAIL } from '../constants/gameConstants'

export const bggGetGameDetails = (bggId) => async (dispatch, getState) => {
	try {
		dispatch({ type: BGG_GAME_DETAILS_REQUEST })

		const { userSignIn: { userInfo } } = getState()

		const config = {
			headers : {
				Authorization : `Bearer ${userInfo.token}`
			}
		}

		const { data } = await axios.get(`/api/games/${bggId}`, config)

		dispatch({
			type    : BGG_GAME_DETAILS_SUCCESS,
			payload : data
		})
	} catch (error) {
		dispatch({
			type    : BGG_GAME_DETAILS_FAIL,
			payload : error.response && error.response.data ? error.response.data.message : error.message
		})
	}
}
