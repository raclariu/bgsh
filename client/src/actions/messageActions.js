import axios from 'axios'
import {
	SEND_MESSAGE_REQUEST,
	SEND_MESSAGE_SUCCESS,
	SEND_MESSAGE_FAIL,
	GET_RECEIVED_MESSAGES_REQUEST,
	GET_RECEIVED_MESSAGES_SUCCESS,
	GET_RECEIVED_MESSAGES_FAIL,
	GET_SENT_MESSAGES_REQUEST,
	GET_SENT_MESSAGES_SUCCESS,
	GET_SENT_MESSAGES_FAIL,
	GET_NEW_MESSAGES_COUNT_SUCCESS,
	GET_NEW_MESSAGES_COUNT_FAIL,
	DELETE_MESSAGES_REQUEST,
	DELETE_MESSAGES_SUCCESS,
	DELETE_MESSAGES_FAIL,
	UPDATE_MESSAGE_SUCCESS,
	UPDATE_MESSAGE_FAIL
} from '../constants/messageConstants'

export const sendMessage = (subject, message, recipientUsername) => async (dispatch, getState) => {
	try {
		dispatch({ type: SEND_MESSAGE_REQUEST })

		const { userAuth: { userData } } = getState()

		const config = {
			headers : {
				'Content-Type' : 'application/json',
				Authorization  : `Bearer ${userData.token}`
			}
		}

		await axios.post('/api/messages', { subject, message, recipientUsername }, config)

		dispatch({
			type : SEND_MESSAGE_SUCCESS
		})
	} catch (error) {
		dispatch({
			type    : SEND_MESSAGE_FAIL,
			payload : error.response && error.response.data ? error.response.data.message : error.message
		})
	}
}

export const getReceivedMessages = (page) => async (dispatch, getState) => {
	try {
		dispatch({ type: GET_RECEIVED_MESSAGES_REQUEST })

		const { userAuth: { userData } } = getState()

		const config = {
			headers : {
				'Content-Type' : 'application/json',
				Authorization  : `Bearer ${userData.token}`
			},
			params  : {
				page : +page ? +page : 1
			}
		}

		const { data } = await axios.get('/api/messages/received', config)

		dispatch({
			type    : GET_RECEIVED_MESSAGES_SUCCESS,
			payload : data
		})
	} catch (error) {
		dispatch({
			type    : GET_RECEIVED_MESSAGES_FAIL,
			payload : error.response && error.response.data ? error.response.data.message : error.message
		})
	}
}

export const getSentMessages = (page) => async (dispatch, getState) => {
	try {
		dispatch({ type: GET_SENT_MESSAGES_REQUEST })

		const { userAuth: { userData } } = getState()

		const config = {
			headers : {
				'Content-Type' : 'application/json',
				Authorization  : `Bearer ${userData.token}`
			},
			params  : {
				page : +page ? +page : 1
			}
		}

		const { data } = await axios.get('/api/messages/sent', config)

		dispatch({
			type    : GET_SENT_MESSAGES_SUCCESS,
			payload : data
		})
	} catch (error) {
		dispatch({
			type    : GET_SENT_MESSAGES_FAIL,
			payload : error.response && error.response.data ? error.response.data.message : error.message
		})
	}
}

export const updateMessageStatus = (id) => async (dispatch, getState) => {
	try {
		const { userAuth: { userData } } = getState()

		const config = {
			headers : {
				'Content-Type' : 'application/json',
				Authorization  : `Bearer ${userData.token}`
			}
		}

		await axios.patch(`/api/messages/update/${id}`, {}, config)

		dispatch({
			type : UPDATE_MESSAGE_SUCCESS
		})
	} catch (error) {
		dispatch({
			type    : UPDATE_MESSAGE_FAIL,
			payload : error.response && error.response.data ? error.response.data.message : error.message
		})
	}
}

export const deleteMessages = (ids, type) => async (dispatch, getState) => {
	try {
		dispatch({ type: DELETE_MESSAGES_REQUEST })

		const { userAuth: { userData } } = getState()

		const config = {
			headers : {
				'Content-Type' : 'application/json',
				Authorization  : `Bearer ${userData.token}`
			}
		}

		await axios.patch('/api/messages/delete', { ids, type }, config)

		dispatch({
			type : DELETE_MESSAGES_SUCCESS
		})
	} catch (error) {
		dispatch({
			type    : DELETE_MESSAGES_FAIL,
			payload : error.response && error.response.data ? error.response.data.message : error.message
		})
	}
}

export const getNewMessagesCount = () => async (dispatch, getState) => {
	try {
		const { newMessagesCount: { count } } = getState()

		const { userAuth: { userData } } = getState()

		const config = {
			headers : {
				'Content-Type' : 'application/json',
				Authorization  : `Bearer ${userData.token}`
			}
		}

		const { data } = await axios.get('/api/messages/new', config)

		if (count !== data) {
			dispatch({
				type    : GET_NEW_MESSAGES_COUNT_SUCCESS,
				payload : data
			})
		}
	} catch (error) {
		dispatch({
			type    : GET_NEW_MESSAGES_COUNT_FAIL,
			payload : error.response && error.response.data ? error.response.data.message : error.message
		})
	}
}
