import { SALE_LIST_ADD, SALE_LIST_REMOVE, SALE_LIST_RESET, saleListLimit } from '../constants/saleListConstants'

export const addToSaleList = (data) => (dispatch, getState) => {
	const { saleList } = getState()

	if (saleList.length === saleListLimit) {
		return
	}

	if (saleList.find((el) => el.bggId === data.bggId)) {
		return
	}

	localStorage.setItem('saleList', JSON.stringify([ ...saleList, data ]))

	dispatch({
		type    : SALE_LIST_ADD,
		payload : data
	})
}

export const removeFromSaleList = (id) => (dispatch, getState) => {
	const { saleList } = getState()

	const filtered = saleList.filter((el) => el.bggId !== id)
	localStorage.setItem('saleList', JSON.stringify(filtered))

	dispatch({
		type    : SALE_LIST_REMOVE,
		payload : filtered
	})
}

export const clearSaleList = () => (dispatch) => {
	localStorage.removeItem('saleList')

	dispatch({ type: SALE_LIST_RESET })
}
