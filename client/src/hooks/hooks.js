import { useQuery, useMutation, useQueryClient } from 'react-query'
import { useSnackbar } from 'notistack'
import * as api from '../api/api'

export const useNotiSnackbar = () => {
	const { enqueueSnackbar, closeSnackbar } = useSnackbar()

	const showSuccessSnackbar = ({ text, preventDuplicate }) => {
		enqueueSnackbar(text, {
			variant          : 'success',
			preventDuplicate : preventDuplicate || false
		})
	}

	const showErrorSnackbar = ({ text }) => {
		enqueueSnackbar(text, {
			variant          : 'error',
			preventDuplicate : true,
			autoHideDuration : 8000
		})
	}

	const showWarningSnackbar = ({ text, preventDuplicate }) => {
		enqueueSnackbar(text, {
			variant          : 'warning',
			preventDuplicate : preventDuplicate || false
		})
	}

	const showInfoSnackbar = ({ text, preventDuplicate }) => {
		enqueueSnackbar(text, {
			variant          : 'info',
			preventDuplicate : preventDuplicate || false
		})
	}

	const showSnackbar = {
		success : showSuccessSnackbar,
		error   : showErrorSnackbar,
		warning : showWarningSnackbar,
		info    : showInfoSnackbar
	}

	return [ showSnackbar ]
}

export const useDeleteFromListMutation = () => {
	const queryClient = useQueryClient()
	const [ showSnackbar ] = useNotiSnackbar()

	return useMutation(({ bggId }) => api.apiDeleteOneFromList(bggId), {
		onMutate  : async ({ bggId, title }) => {
			// Cancel any outgoing refetches (so they don't overwrite our optimistic update)
			await queryClient.cancelQueries([ 'list' ])
			// Snapshot the previous value
			const prevList = queryClient.getQueryData([ 'list' ])
			// Optimistically update to the new value
			queryClient.setQueryData([ 'list' ], (old) => {
				showSnackbar.info({ text: `${title} has been removed from your list` })
				return { ...old, list: old.list.filter((item) => item.bggId !== bggId) }
			})
			// Return a context object with the snapshotted value
			return { prevList }
		},
		onError   : async (err, { title }, ctx) => {
			// For sell/trade/wanted/buy screen
			const gamesDetails = await queryClient.getQueryData([ 'bggGamesDetails' ])
			// Show error snackbar
			showSnackbar.error({
				text : err.response.data.message || `Error occured while removing ${title} from your list`
			})
			// If the mutation fails, use the context returned from onMutate to roll back
			queryClient.setQueryData([ 'list' ], ctx.prevList)
			queryClient.setQueryData([ 'bggGamesDetails' ], gamesDetails)
		},
		onSuccess : (data) => {
			queryClient.setQueryData([ 'list' ], data)
		}
	})
}

export const useAddToListMutation = () => {
	const queryClient = useQueryClient()
	const [ showSnackbar ] = useNotiSnackbar()

	return useMutation((game) => api.apiAddOneToList(game), {
		onMutate  : async (game) => {
			// Cancel any outgoing refetches (so they don't overwrite our optimistic update)
			await queryClient.cancelQueries([ 'list' ])
			// Snapshot the previous value
			const prevList = queryClient.getQueryData([ 'list' ])
			// Optimistically update to the new value
			queryClient.setQueryData([ 'list' ], (old) => {
				const listArr = [ ...old.list, game ]
				showSnackbar.info({ text: `${game.title} has been added to your list` })
				return { ...old, list: listArr }
			})
			// Return a context object with the snapshotted value
			return { prevList }
		},
		onError   : (err, game, ctx) => {
			showSnackbar.error({
				text : err.response.data.message || `Error occured while adding ${game.title} to your list`
			})
			queryClient.setQueryData([ 'list' ], ctx.prevList)
		},
		onSuccess : (data) => {
			queryClient.setQueryData([ 'list' ], data)
		}
	})
}

export const useGetListQuery = (onSettled) => {
	const [ showSnackbar ] = useNotiSnackbar()

	return useQuery([ 'list' ], api.apiGetList, {
		staleTime : Infinity,
		retry     : 4,
		onError   : (err) => {
			const text = err.response.data.message || 'Error occured while fetching your list'
			showSnackbar.error({ text })
		},
		onSettled
	})
}

export const useGetOwnedCollectionQuery = (search, page) => {
	const userList = useGetListQuery()
	const [ showSnackbar ] = useNotiSnackbar()

	return useQuery([ 'collection', { search, page } ], () => api.apiFetchOwnedCollection(search, page), {
		staleTime : Infinity,
		enabled   : !!userList.data,
		onError   : (err) => {
			const text = err.response.data.message || 'Error occured while fetching collection'
			showSnackbar.error({ text })
		},
		onSuccess : (data) => {
			data.owned.length === 0 && showSnackbar.warning({ text: 'Collection not found' })
		}
	})
}

export const useGetWishlistCollectionQuery = (search, page) => {
	const userList = useGetListQuery()
	const [ showSnackbar ] = useNotiSnackbar()

	return useQuery([ 'wishlist', { search, page } ], () => api.apiFetchWishlistCollection(search, page), {
		staleTime : Infinity,
		enabled   : !!userList.data,
		onError   : (err) => {
			const text = err.response.data.message || 'Error occured while fetching wishlist'
			showSnackbar.error({ text })
		},
		onSuccess : (data) => {
			data.wishlist.length === 0 && showSnackbar.warning({ text: 'Wishlist not found' })
		}
	})
}
