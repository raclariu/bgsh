import { useQuery, useMutation, useQueryClient } from 'react-query'
import { useSnackbar } from 'notistack'
import * as api from '../api/api'

export const useNotiSnackbar = () => {
	const { enqueueSnackbar } = useSnackbar()

	const showSuccessSnackbar = ({ text, preventDuplicate }) => {
		enqueueSnackbar(text, {
			variant          : 'success',
			preventDuplicate : preventDuplicate || false
		})
	}

	const showErrorSnackbar = ({ text, preventDuplicate }) => {
		enqueueSnackbar(text, {
			variant          : 'error',
			preventDuplicate : preventDuplicate || false,
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

export const useGetNewListingsQuery = () => {
	return useQuery([ 'newListings' ], api.apiGetNewListings, {
		staleTime : Infinity
	})
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
			showSnackbar.info({ text: `${title} has been deleted from your list` })
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

export const useListGamesMutation = (mode) => {
	const queryClient = useQueryClient()
	const [ showSnackbar ] = useNotiSnackbar()
	const clearListMutation = useClearListMutation()

	return useMutation(
		(gamesData) => {
			if (mode === 'sell') {
				return api.apiListGamesForSale(gamesData)
			} else if (mode === 'trade') {
				return api.apiListGamesForTrade(gamesData)
			} else if (mode === 'want') {
				return api.apiAddWantedGames(gamesData)
			} else if (mode === 'buy') {
				return api.apiAddBoughtGamesToHistory(gamesData)
			}
		},
		{
			onSuccess : () => {
				clearListMutation.mutate()
				if (mode === 'sell') {
					showSnackbar.success({ text: 'Successfully listed game(s) for sale' })
					queryClient.invalidateQueries([ 'index', 'sell' ])
					queryClient.invalidateQueries([ 'myListedGames' ])
				} else if (mode === 'trade') {
					showSnackbar.success({ text: 'Successfully listed game(s) for trade' })
					queryClient.invalidateQueries([ 'index', 'trade' ])
					queryClient.invalidateQueries([ 'myListedGames' ])
				} else if (mode === 'want') {
					showSnackbar.success({ text: 'Successfully added wanted game(s)' })
					queryClient.invalidateQueries([ 'index', 'want' ])
					queryClient.invalidateQueries([ 'myListedGames' ])
				} else if (mode === 'buy') {
					showSnackbar.success({ text: 'Successfully added game(s) to your buy history' })
					queryClient.invalidateQueries([ 'history', 'buy' ])
				}
			}
		}
	)
}

export const useClearListMutation = () => {
	const queryClient = useQueryClient()
	const [ showSnackbar ] = useNotiSnackbar()

	return useMutation(api.apiClearList, {
		onSuccess : async () => {
			showSnackbar.info({ text: 'Your list was cleared' })
			await queryClient.refetchQueries([ 'list' ])
			queryClient.removeQueries([ 'bggGamesDetails' ])
		}
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
		staleTime        : Infinity,
		enabled          : !!userList.data,
		keepPreviousData : true,
		onError          : (err) => {
			const text = err.response.data.message || 'Error occured while fetching collection'
			showSnackbar.error({ text })
		}
	})
}

export const useGetWishlistCollectionQuery = (search, page) => {
	const userList = useGetListQuery()
	const [ showSnackbar ] = useNotiSnackbar()

	return useQuery([ 'wishlist', { search, page } ], () => api.apiFetchWishlistCollection(search, page), {
		staleTime        : Infinity,
		enabled          : !!userList.data,
		keepPreviousData : true,
		onError          : (err) => {
			const text = err.response.data.message || 'Error occured while fetching wishlist'
			showSnackbar.error({ text })
		}
	})
}

export const useGetSavedGamesListQuery = (search, page) => {
	const [ showSnackbar ] = useNotiSnackbar()

	return useQuery([ 'savedGames', { search, page } ], () => api.apiFetchSavedGames(search, page), {
		staleTime        : 1000 * 60 * 60,
		keepPreviousData : true,
		onError          : (err) => {
			const text = err.response.data.message || 'Error occured while fetching saved games'
			showSnackbar.error({ text })
		}
	})
}

export const useGetMyListedGames = (search, page) => {
	const [ showSnackbar ] = useNotiSnackbar()

	return useQuery([ 'myListedGames', { search, page } ], () => api.apiFetchMyListedGames(search, page), {
		staleTime        : 1000 * 60 * 60,
		keepPreviousData : true,
		onError          : (err) => {
			const text = err.response.data.message || 'Error occured while fetching listed games'
			showSnackbar.error({ text })
		}
	})
}

export const useGetGamesHistoryListQuery = ({ search, page, mode }) => {
	const [ showSnackbar ] = useNotiSnackbar()
	return useQuery([ 'history', mode, { search, page } ], () => api.apiFetchGamesHistory({ search, page, mode }), {
		staleTime        : 1000 * 60 * 60,
		keepPreviousData : true,
		onError          : (err) => {
			const text = err.response.data.message || 'Error occured while fetching history'
			showSnackbar.error({ text })
		}
	})
}

export const useGetGamesIndexQuery = ({ sort, search, page, mode }) => {
	const [ showSnackbar ] = useNotiSnackbar()

	return useQuery(
		[ 'index', mode, { sort, search, page } ],
		() => api.apiGetGamesIndex({ sort, search, page, mode }),
		{
			staleTime        : 1000 * 60 * 5,
			refetchOnMount   : true,
			keepPreviousData : true,
			onError          : (err) => {
				const text = err.response.data.message || 'Error occured while fetching games'
				showSnackbar.error({ text })
			}
		}
	)
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
	return useQuery([ 'singleGameScreen', 'data', { altId } ], () => api.apiFetchSingleGame(altId), {
		staleTime : 1000 * 60 * 60,
		retry     : 1
	})
}

export const useGetGameGalleryQuery = ({ altId, galleryInView, idx }) => {
	const { isSuccess, data } = useGetSingleGameQuery(altId)

	return useQuery(
		[ 'singleGameScreen', 'gallery', { altId, idx } ],
		() => api.apiFetchGallery(data.games[idx].bggId),
		{
			enabled          : isSuccess && galleryInView,
			staleTime        : 1000 * 60 * 60,
			keepPreviousData : true
		}
	)
}

export const useGetGameRecommendationsQuery = ({ altId, recsInView, idx }) => {
	const { isSuccess, data } = useGetSingleGameQuery(altId)

	return useQuery(
		[ 'singleGameScreen', 'recs', { altId, idx } ],
		() => api.apiFetchRecommendations(data.games[idx].bggId),
		{
			enabled          : isSuccess && recsInView,
			staleTime        : 1000 * 60 * 60,
			keepPreviousData : true
		}
	)
}

export const useGetGameVideosQuery = ({ altId, vidsInView, idx }) => {
	const { isSuccess, data } = useGetSingleGameQuery(altId)

	return useQuery([ 'singleGameScreen', 'videos', { altId, idx } ], () => api.apiFetchVideos(data.games[idx].bggId), {
		enabled          : isSuccess && vidsInView,
		staleTime        : 1000 * 60 * 60,
		keepPreviousData : true
	})
}

export const useGetOwnAvatarQuery = () => {
	return useQuery([ 'ownAvatar' ], api.apiGetOwnAvatar, {
		staleTime : Infinity
	})
}

export const useChangeOwnAvatarMutation = ({ changeState }) => {
	const queryClient = useQueryClient()
	const [ showSnackbar ] = useNotiSnackbar()

	return useMutation((imgBlob) => api.apiUserChangeAvatar(imgBlob), {
		onSuccess : (avatarObj) => {
			changeState()
			queryClient.setQueryData([ 'ownAvatar' ], avatarObj)
			showSnackbar.success({ text: 'Avatar changed successfully' })
		},
		onError   : (err) => {
			queryClient.invalidateQueries([ 'ownAvatar' ])
			showSnackbar.error({ text: `${err.response.data.message}` })
		}
	})
}

export const useGetHotGamesQuery = () => {
	return useQuery([ 'hotGames' ], api.apiFetchHotGames, {
		staleTime        : 1000 * 60 * 60,
		keepPreviousData : true
	})
}

export const useGetKickstartersQuery = ({ inView }) => {
	return useQuery([ 'kickstarters' ], api.apiFetchKickstarters, {
		enabled   : inView,
		staleTime : 1000 * 60 * 60
	})
}

export const useGetRedditPostsQuery = ({ inView }) => {
	return useQuery([ 'redditPosts' ], api.apiFetchRedditPosts, {
		enabled        : inView,
		staleTime      : 1000 * 60 * 60,
		refetchOnMount : false
	})
}

export const useGetUserProfileDataQuery = ({ username }) => {
	const [ showSnackbar ] = useNotiSnackbar()

	return useQuery([ 'userData', { username } ], () => api.apiGetProfileData(username), {
		staleTime : 1000 * 60 * 5,
		onError   : (err) => {
			const text = err.response.data.message || 'Error occured while trying to fetch user data'
			showSnackbar.error({ text })
		}
	})
}

export const useGetUserProfileListingsDataQuery = ({ username }) => {
	return useQuery([ 'profile', { username } ], () => api.apiGetProfileListingsData(username), {
		staleTime : 1000 * 60 * 30
	})
}

export const useHistoryAddGameMutation = ({ handleCleanup, mode }) => {
	const queryClient = useQueryClient()
	const [ showSnackbar ] = useNotiSnackbar()

	return useMutation(
		({ games, otherUsername, finalPrice, extraInfo, mode, gameId }) => {
			if (mode === 'sell') {
				return api.apiAddSoldGamesToHistory({
					games,
					otherUsername : otherUsername.trim() ? otherUsername.trim().toLowerCase() : null,
					finalPrice    : finalPrice,
					extraInfo     : extraInfo.trim() ? extraInfo.trim() : null,
					gameId
				})
			}

			if (mode === 'trade') {
				return api.apiAddTradedGamesToHistory({
					games,
					otherUsername : otherUsername.trim() ? otherUsername.trim().toLowerCase() : null,
					extraInfo     : extraInfo.trim() ? extraInfo.trim() : null,
					gameId
				})
			}
		},
		{
			onSuccess : () => {
				handleCleanup()

				queryClient.invalidateQueries([ 'myListedGames' ])
				if (mode === 'sell') {
					queryClient.invalidateQueries([ 'index', 'sell' ])
					queryClient.invalidateQueries([ 'history', 'sell' ])
				}
				if (mode === 'trade') {
					queryClient.invalidateQueries([ 'index', 'trade' ])
					queryClient.invalidateQueries([ 'history', 'trade' ])
				}

				showSnackbar.success({ text: 'Successfully added to history' })
			}
		}
	)
}

export const useDeleteListedGameMutation = ({ handleCleanup, mode }) => {
	const queryClient = useQueryClient()
	const [ showSnackbar ] = useNotiSnackbar()

	return useMutation((gameId) => api.apiDeleteListedGame(gameId), {
		onError   : (err) => {
			const text = err.response.data.message || 'Error occured while trying to delete a listing'
			showSnackbar.error({ text })
		},
		onSuccess : () => {
			handleCleanup()

			queryClient.invalidateQueries([ 'myListedGames' ])
			if (mode === 'sell') {
				queryClient.invalidateQueries([ 'index', 'sell' ])
				queryClient.invalidateQueries([ 'history', 'sell' ])
			}
			if (mode === 'trade') {
				queryClient.invalidateQueries([ 'index', 'trade' ])
				queryClient.invalidateQueries([ 'history', 'trade' ])
			}

			showSnackbar.success({ text: 'Successfully deleted listing' })
		}
	})
}

export const useReactivateListedGameMutation = ({ handleCleanup, mode }) => {
	const queryClient = useQueryClient()
	const [ showSnackbar ] = useNotiSnackbar()

	return useMutation((gameId) => api.apiReactivateListedGame(gameId), {
		onError   : (err) => {
			const text = err.response.data.message || 'Error occured while trying to reactivate a listing'
			showSnackbar.error({ text })
		},
		onSuccess : () => {
			handleCleanup()

			queryClient.invalidateQueries([ 'myListedGames' ])
			if (mode === 'sell') {
				queryClient.invalidateQueries([ 'index', 'sell' ])
				queryClient.invalidateQueries([ 'history', 'sell' ])
			}
			if (mode === 'trade') {
				queryClient.invalidateQueries([ 'index', 'trade' ])
				queryClient.invalidateQueries([ 'history', 'trade' ])
			}

			showSnackbar.success({ text: 'Successfully reactivated listing' })
		}
	})
}

export const useBggSearchGamesMutation = ({ onSuccess }) => {
	return useMutation((debKeyword) => api.apiBggSearchGames(debKeyword), {
		onSuccess
	})
}

export const useChangePasswordMutation = ({ resetForm }) => {
	const [ showSnackbar ] = useNotiSnackbar()

	return useMutation(
		({ passwordCurrent, passwordNew, passwordNewConfirmation }) =>
			api.apiUserChangePassword({ passwordCurrent, passwordNew, passwordNewConfirmation }),
		{
			onSuccess : () => {
				resetForm()
				showSnackbar.success({ text: 'Password changed successfully' })
			}
		}
	)
}

export const useResetPasswordMutation = ({ resetForm }) => {
	const [ showSnackbar ] = useNotiSnackbar()

	return useMutation(
		({ tokenUid, passwordNew, passwordNewConfirmation }) =>
			api.apiResetPassword({ tokenUid, passwordNew, passwordNewConfirmation }),
		{
			onError   : (err) => {
				resetForm()
				const text = err.response.data.message || 'Error occured while trying to change password'
				showSnackbar.error({ text })
			},
			onSuccess : () => {
				resetForm()
				showSnackbar.success({ text: 'Password changed successfully' })
			}
		}
	)
}

export const useBggFetchCollectionMutation = () => {
	const queryClient = useQueryClient()
	const [ showSnackbar ] = useNotiSnackbar()

	return useMutation((bggUsername) => api.apiFetchBggCollection(bggUsername), {
		retry      : 6,
		retryDelay : 3500,
		onSuccess  : (data, bggUsername) => {
			queryClient.invalidateQueries([ 'collection' ])
			queryClient.invalidateQueries([ 'wishlist' ])
			showSnackbar.success({
				text : `Collection data from BGG for ${bggUsername} was successfully fetched`
			})
		}
	})
}

export const useUploadListedGameImageMutation = ({ title, handleGameInfo }) => {
	const queryClient = useQueryClient()
	const [ showSnackbar ] = useNotiSnackbar()

	return useMutation((formData) => api.apiUploadImage(formData), {
		onSuccess : (userImageObj, vars) => {
			const bggId = vars.get('bggId')
			handleGameInfo(userImageObj, bggId, 'userImage')
			queryClient.setQueryData([ 'list' ], (oldUserListObj) => {
				const copyUserListObj = { ...oldUserListObj }
				const idx = copyUserListObj.list.findIndex((obj) => obj.bggId === bggId)
				copyUserListObj.list[idx].userImage = userImageObj
				return copyUserListObj
			})
			showSnackbar.success({ text: `Image for ${title} uploaded successfully` })
		},
		onError   : (error) => {
			showSnackbar.error({ text: error.response.data.message || 'Error occured while uploading image' })
		}
	})
}

export const useDeleteUploadedGameImageMutation = ({ handleGameInfo }) => {
	const [ showSnackbar ] = useNotiSnackbar()
	const queryClient = useQueryClient()

	return useMutation(({ fileName, bggId }) => api.apiDeleteImage(fileName, bggId), {
		onSuccess : (data, vars) => {
			handleGameInfo(null, vars.bggId, 'userImage')
			queryClient.setQueryData([ 'list' ], (oldUserListObj) => {
				const copyUserListObj = { ...oldUserListObj }
				const idx = copyUserListObj.list.findIndex((obj) => obj.bggId === vars.bggId)
				copyUserListObj.list[idx].userImage = null
				return copyUserListObj
			})
			showSnackbar.info({ text: `Image for ${vars.title} deleted successfully` })
		},
		onError   : (error) => {
			showSnackbar.error({ text: error.response.data.message || 'Error occured while removing uploaded image' })
		}
	})
}

export const useGetNewMessagesCountQuery = () => {
	return useQuery([ 'inbox', 'count' ], api.apiGetNewMessagesCount, {
		refetchInterval : 1000 * 60 * 2,
		refetchOnMount  : false
	})
}

export const useGetNotificationsQuery = () => {
	return useQuery([ 'notifications' ], api.apiGetNotifications, {
		refetchInterval : 1000 * 60 * 2,
		refetchOnMount  : false
	})
}

export const useDeleteNotificationMutation = () => {
	const queryClient = useQueryClient()
	const [ showSnackbar ] = useNotiSnackbar()

	return useMutation((ntfId) => api.apiDeleteOneNotification(ntfId), {
		onMutate  : async (ntfId) => {
			// Cancel any outgoing refetches (so they don't overwrite our optimistic update)
			await queryClient.cancelQueries([ 'notifications' ])
			// Snapshot the previous value
			const prevNtfList = queryClient.getQueryData([ 'notifications' ])

			// Optimistically update to the new value
			queryClient.setQueryData([ 'notifications' ], (old) => {
				return { ...old, notifications: old.notifications.filter((ntf) => ntf._id !== ntfId) }
			})

			// Return a context object with the snapshotted value
			return { prevNtfList }
		},
		onError   : async (err, vars, ctx) => {
			// Show error snackbar
			showSnackbar.error({
				text : err.response.data.message || 'Error occured while deleting notification'
			})

			queryClient.setQueryData([ 'notifications' ], ctx.prevNtfList)
		},
		onSuccess : (data) => {
			queryClient.setQueryData([ 'notifications' ], data)
		}
	})
}

export const useClearAllNotificationsMutation = () => {
	const queryClient = useQueryClient()
	const [ showSnackbar ] = useNotiSnackbar()

	return useMutation(api.apiClearAllNotifications, {
		onMutate  : async () => {
			// Cancel any outgoing refetches (so they don't overwrite our optimistic update)
			await queryClient.cancelQueries([ 'notifications' ])
			// Snapshot the previous value
			const prevNtfList = queryClient.getQueryData([ 'notifications' ])

			// Optimistically update to the new value
			queryClient.setQueryData([ 'notifications' ], { notifications: [] })

			// Return a context object with the snapshotted value
			return { prevNtfList }
		},
		onError   : async (err, vars, ctx) => {
			// Show error snackbar
			showSnackbar.error({
				text : err.response.data.message || 'Error occured while clearing notifications'
			})

			queryClient.setQueryData([ 'notifications' ], ctx.prevNtfList)
		},
		onSuccess : () => {
			showSnackbar.success({
				text : 'Notifications cleared'
			})
		}
	})
}

export const useSendNewMessageMutation = ({ resetForm }) => {
	const queryClient = useQueryClient()
	const [ showSnackbar ] = useNotiSnackbar()

	return useMutation(({ subject, message, recipient }) => api.apiSendMessage(subject, message, recipient), {
		onSuccess : () => {
			resetForm()
			showSnackbar.success({ text: 'Message sent successfully' })
			queryClient.invalidateQueries([ 'inbox', 'sent' ])
		}
	})
}

export const useUpdateSaveGameStatusMutation = () => {
	const [ showSnackbar ] = useNotiSnackbar()
	const queryClient = useQueryClient()

	return useMutation((altId) => api.apiUpdateSavedGameStatus(altId), {
		onMutate  : async (varAltId) => {
			// Cancel any outgoing refetches (so they don't overwrite our optimistic update)
			await queryClient.cancelQueries([ 'singleGameScreen', 'savedStatus', varAltId ])
			// Snapshot the previous value
			const prevStatus = queryClient.getQueryData([ 'singleGameScreen', 'savedStatus', varAltId ])
			// Optimistically update to the new value
			queryClient.setQueryData([ 'singleGameScreen', 'savedStatus', varAltId ], (oldStatus) => {
				const newStatus = { isSaved: !oldStatus.isSaved }
				newStatus.isSaved
					? showSnackbar.info({ text: 'Added to my saved list' })
					: showSnackbar.info({ text: 'Removed from my saved list' })

				return newStatus
			})

			// Return a context object with the snapshotted value in case of error so we can revert to old status
			return { prevStatus }
		},
		onError   : (err, varAltId, ctx) => {
			showSnackbar.error({
				text : err.response.data.message || 'Error occured while trying to add game to my saved list'
			})
			// If the mutation fails, use the context returned from onMutate to roll back
			queryClient.setQueryData([ 'singleGameScreen', 'savedStatus', varAltId ], ctx.prevStatus)
		},
		onSuccess : (data, varAltId) => {
			// Update query with data from mutation so that saved status useQuery won't run
			queryClient.setQueryData([ 'singleGameScreen', 'savedStatus', varAltId ], data)
			// Invalidate entire saved games list
			queryClient.invalidateQueries([ 'savedGames' ])
		}
	})
}

export const useDeleteSavedGameMutation = () => {
	const [ showSnackbar ] = useNotiSnackbar()
	const queryClient = useQueryClient()

	return useMutation((altId) => api.apiDeleteSavedGame(altId), {
		onError   : (err) => {
			showSnackbar.error({
				text : err.response.data.message || 'Error occured while trying to delete saved game from my saved list'
			})
		},
		onSuccess : () => {
			showSnackbar.success({
				text : 'Saved game successfully deleted'
			})
			queryClient.invalidateQueries([ 'savedGames' ])
		}
	})
}

export const useGetSaveGameStatusQuery = ({ altId }) => {
	const [ showSnackbar ] = useNotiSnackbar()

	return useQuery([ 'singleGameScreen', 'savedStatus', altId ], () => api.apiFetchGameSavedStatus(altId), {
		staleTime : 1000 * 60 * 3,
		enabled   : !!altId,
		onError   : (err) => {
			const text = err.response.data.message || 'Error occured while fetching saved status'
			showSnackbar.error({ text })
		}
	})
}

export const useSubmitReportMutation = ({ resetForm }) => {
	const [ showSnackbar ] = useNotiSnackbar()

	return useMutation((data) => api.apiSubmitReport(data), {
		onSuccess : () => {
			resetForm()
			showSnackbar.success({ text: 'Report sent successfully' })
		}
	})
}

export const useGetSocialsQuery = () => {
	return useQuery([ 'socials' ], api.apiGetSocials, {
		staleTime : Infinity
	})
}

export const useUpdateSocialsMutation = () => {
	const [ showSnackbar ] = useNotiSnackbar()
	const queryClient = useQueryClient()

	return useMutation((data) => api.apiUpdateSocials(data), {
		onSuccess : () => {
			showSnackbar.success({ text: 'Socials updated successfully' })
			queryClient.invalidateQueries([ 'socials' ])
		}
	})
}

export const useGetEmailNotificationStatusQuery = ({ emailCheckboxInView }) => {
	return useQuery([ 'emailNtfStatus' ], api.apiGetEmailNotificationStatus, {
		staleTime : Infinity,
		enabled   : emailCheckboxInView
	})
}

export const useUpdateEmailNotificationStatusMutation = () => {
	const [ showSnackbar ] = useNotiSnackbar()
	const queryClient = useQueryClient()

	return useMutation(() => api.apiUpdateEmailNotificationStatus(), {
		onMutate  : async () => {
			// Cancel any outgoing refetches (so they don't overwrite our optimistic update)
			await queryClient.cancelQueries([ 'emailNtfStatus' ])
			// Snapshot the previous value
			const prevStatus = queryClient.getQueryData([ 'emailNtfStatus' ])
			// Optimistically update to the new value
			queryClient.setQueryData([ 'emailNtfStatus' ], (oldStatus) => {
				const newStatus = { emailNotifications: !oldStatus.emailNotifications }
				newStatus.emailNotifications
					? showSnackbar.success({ text: 'Email notifications activated' })
					: showSnackbar.info({ text: 'Email notifications deactivated' })

				return newStatus
			})

			// Return a context object with the snapshotted value in case of error so we can revert to old status
			return { prevStatus }
		},
		onError   : (err, data, ctx) => {
			showSnackbar.error({
				text : err.response.data.message || 'Error occured while trying update email notification status'
			})
			// If the mutation fails, use the context returned from onMutate to roll back
			queryClient.setQueryData([ 'emailNtfStatus' ], ctx.prevStatus)
		},
		onSuccess : (data) => {
			// Update query with data from mutation so that saved status useQuery won't run
			queryClient.setQueryData([ 'emailNtfStatus' ], data)
		}
	})
}
