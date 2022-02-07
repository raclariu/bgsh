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
		onMutate  : async ({ bggId }) => {
			// Cancel any outgoing refetches (so they don't overwrite our optimistic update)
			await queryClient.cancelQueries([ 'list' ])
			// Snapshot the previous value
			const prevList = queryClient.getQueryData([ 'list' ])
			// Optimistically update to the new value
			queryClient.setQueryData([ 'list' ], (old) => {
				return { ...old, list: old.list.filter((item) => item.bggId !== bggId) }
			})
			// Return a context object with the snapshotted value
			return { prevList }
		},
		onError   : async (err, { title }, ctx) => {
			// Show error snackbar
			showSnackbar.error({
				text : err.response.data.message || `Error occured while removing ${title} from your list`
			})
			// If the mutation fails, use the context returned from onMutate to roll back
			queryClient.invalidateQueries([ 'bggGamesDetails' ])
			queryClient.setQueryData([ 'list' ], ctx.prevList)
		},
		onSuccess : (data, { title }) => {
			showSnackbar.info({ text: `${title} has been removed from your list` })
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
		onSuccess : (data, game) => {
			showSnackbar.info({ text: `${game.title} has been added to your list` })
			queryClient.setQueryData([ 'list' ], data)
		}
	})
}

export const useGetListQuery = (onSettled) => {
	const [ showSnackbar ] = useNotiSnackbar()

	return useQuery([ 'list' ], api.apiGetList, {
		staleTime : Infinity,
		onError   : (err) => {
			const text = err.response.data.message || 'Error occured while fetching your list'
			showSnackbar.error({ text })
		},
		onSettled
	})
}

export const useGetBggGamesDetailsQuery = (onSuccess) => {
	const userList = useGetListQuery()

	return useQuery([ 'bggGamesDetails' ], () => api.apiFetchGameDetails(userList.data.list.map((el) => el.bggId)), {
		staleTime      : Infinity,
		enabled        : !!userList.data && userList.data.list.length > 0,
		refetchOnMount : 'always',
		onSuccess
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
		}
	})
}

export const useGetSavedGamesListQuery = (search, page) => {
	const [ showSnackbar ] = useNotiSnackbar()

	return useQuery([ 'savedGames', { search, page } ], () => api.apiFetchSavedGames(search, page), {
		staleTime : 1000 * 60 * 60,
		onError   : (err) => {
			const text = err.response.data.message || 'Error occured while fetching saved games'
			showSnackbar.error({ text })
		}
	})
}

export const useGetMyListedGames = (search, page) => {
	const [ showSnackbar ] = useNotiSnackbar()

	return useQuery([ 'myListedGames', { search, page } ], () => api.apiFetchMyListedGames(search, page), {
		staleTime : 1000 * 60 * 60,
		onError   : (err) => {
			const text = err.response.data.message || 'Error occured while fetching listed games'
			showSnackbar.error({ text })
		}
	})
}

export const useGetGamesHistoryListQuery = ({ search, page, mode }) => {
	const [ showSnackbar ] = useNotiSnackbar()
	return useQuery([ 'history', mode, { search, page } ], () => api.apiFetchGamesHistory({ search, page, mode }), {
		staleTime : 1000 * 60 * 60,
		onError   : (err) => {
			const text = err.response.data.message || 'Error occured while fetching history'
			showSnackbar.error({ text })
		}
	})
}

export const useGetGamesIndexQuery = ({ sort, search, page, mode }) => {
	const [ showSnackbar ] = useNotiSnackbar()

	return useQuery([ 'index', mode, { sort, search, page } ], () => api.fetchGames({ sort, search, page, mode }), {
		staleTime : 1000 * 60 * 5,
		onError   : (err) => {
			const text = err.response.data.message || 'Error occured while fetching games'
			showSnackbar.error({ text })
		}
	})
}

export const useGetMessagesQuery = ({ search, page, type }) => {
	const [ showSnackbar ] = useNotiSnackbar()

	return useQuery(
		[ 'inbox', type, { search, page } ],
		() => {
			if (type === 'received') {
				return api.apiGetReceivedMessages(search, page)
			}
			if (type === 'sent') {
				return api.apiGetSentMessages(search, page)
			}
		},
		{
			staleTime : 1000 * 60 * 60,
			onError   : (err) => {
				const text = err.response.data.message || 'Error occured while fetching messages'
				showSnackbar.error({ text })
			}
		}
	)
}

export const useUpdateMessageStatusMutation = ({ page, search }) => {
	const queryClient = useQueryClient()
	const [ showSnackbar ] = useNotiSnackbar()

	return useMutation((id) => api.apiUpdateMessageStatus(id), {
		onMutate  : async (id) => {
			await queryClient.cancelQueries([ 'inbox', 'received', { page, search } ])
			await queryClient.cancelQueries([ 'inbox', 'count' ])
			const data = queryClient.getQueryData([ 'inbox', 'received', { page, search } ])
			queryClient.setQueryData([ 'inbox', 'received', { page, search } ], (oldMsg) => {
				const index = oldMsg.messages.findIndex((msg) => msg._id === id)
				oldMsg.messages[index].read = true
				oldMsg.messages[index].readAt = new Date().toISOString()
				return oldMsg
			})

			return { data }
		},
		onError   : (err, id, context) => {
			const text = err.response.data.message || 'Message could not be updated'
			showSnackbar.error({ text })
			queryClient.setQueryData([ 'inbox', 'received', { page, search } ], context.data)
		},
		onSuccess : (updatedMsg) => {
			showSnackbar.info({ text: 'Message has been read' })

			queryClient.setQueryData([ 'inbox', 'received', { page, search } ], (data) => {
				const copyData = { ...data }
				const idx = copyData.messages.findIndex((msg) => msg._id === updatedMsg._id)
				copyData.messages[idx] = updatedMsg

				return copyData
			})

			queryClient.setQueryData([ 'inbox', 'count' ], (count) => count - 1)
		}
	})
}

export const useDeleteMessagesMutation = (currLoc) => {
	const queryClient = useQueryClient()
	const [ showSnackbar ] = useNotiSnackbar()

	return useMutation(({ ids, type }) => api.apiDeleteMessages(ids, type), {
		onError   : (err) => {
			const text = err.response.data.message || 'Error occured while deleting messages'
			showSnackbar.error({ text })
		},
		onSuccess : () => {
			if (currLoc === 'received') {
				queryClient.invalidateQueries([ 'inbox', currLoc ])
				queryClient.invalidateQueries([ 'inbox', 'count' ])
			}
			if (currLoc === 'sent') {
				queryClient.invalidateQueries([ 'inbox', 'sent' ])
			}

			showSnackbar.success({ text: 'Message(s) deleted successfully' })
			// setSelected([])
		}
	})
}

export const useGetSingleGameQuery = (altId) => {
	return useQuery([ 'singleGame', 'data', { altId } ], () => api.apiFetchSingleGame(altId), {
		staleTime : 1000 * 60 * 60
	})
}

export const useGetSingleGameGalleryQuery = ({ altId, galleryInView, index }) => {
	const { isSuccess, data } = useGetSingleGameQuery(altId)

	return useQuery([ 'singleGame', 'gallery', { altId, index } ], () => api.apiFetchGallery(data.games[index].bggId), {
		enabled          : isSuccess && galleryInView,
		staleTime        : 1000 * 60 * 60,
		keepPreviousData : true
	})
}

export const useGetSingleGameRecommendationsQuery = ({ altId, recsInView, index }) => {
	const { isSuccess, data } = useGetSingleGameQuery(altId)

	return useQuery(
		[ 'singleGame', 'recs', { altId, index } ],
		() => api.apiFetchRecommendations(data.games[index].bggId),
		{
			enabled          : isSuccess && recsInView,
			staleTime        : 1000 * 60 * 60,
			keepPreviousData : true
		}
	)
}
