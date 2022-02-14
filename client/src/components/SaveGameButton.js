// @ Libraries
import React, { Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useQuery, useMutation, useQueryClient } from 'react-query'

// @ Mui
import Checkbox from '@mui/material/Checkbox'

// @ Icons
import FavoriteBorder from '@mui/icons-material/FavoriteBorder'
import Favorite from '@mui/icons-material/Favorite'

// @ Components
import CustomTooltip from './CustomTooltip'
import CustomIconBtn from './CustomIconBtn'
import Loader from './Loader'

// @ Others
import { apiFetchGameSavedStatus, apiUpdateSavedGameStatus } from '../api/api'
import { useNotiSnackbar } from '../hooks/hooks'

// @ Main
const SaveGameButton = ({ altId, addedById }) => {
	const dispatch = useDispatch()
	const queryClient = useQueryClient()

	const [ showSnackbar ] = useNotiSnackbar()

	const { isLoading, isFetching, data, isSuccess, status } = useQuery(
		[ 'savedStatus', altId ],
		() => apiFetchGameSavedStatus(altId),
		{
			staleTime : 1000 * 60 * 3,
			enabled   : !!altId,
			onError   : (err) => {
				const text = err.response.data.message || 'Error occured while fetching saved status'
				showSnackbar.error({ text })
			}
		}
	)

	const updateSaveStatusMutation = useMutation((altId) => apiUpdateSavedGameStatus(altId), {
		onMutate  : async (varAltId) => {
			// Cancel any outgoing refetches (so they don't overwrite our optimistic update)
			await queryClient.cancelQueries([ 'savedStatus', varAltId ])
			// Snapshot the previous value
			const prevStatus = queryClient.getQueryData([ 'savedStatus', altId ])
			// Optimistically update to the new value
			queryClient.setQueryData([ 'savedStatus', altId ], (oldStatus) => {
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
			queryClient.setQueryData([ 'savedStatus', varAltId ], ctx.prevStatus)
		},
		onSuccess : (data, varAltId) => {
			// Update query with data from mutation so that saved status useQuery won't run
			queryClient.setQueryData([ 'savedStatus', varAltId ], data)
			// Invalidate entire saved games list
			queryClient.invalidateQueries([ 'savedGames' ])
		}
	})

	const saveGameHandler = () => {
		updateSaveStatusMutation.mutate(altId)
	}

	return (
		<Fragment>
			{isFetching && (
				<CustomIconBtn disabled disableRipple size="large">
					<Loader size={20} />
				</CustomIconBtn>
			)}

			{isSuccess &&
			!isFetching && (
				// disabled={addedById === userId}

				<CustomTooltip title={data.isSaved ? 'Unsave' : 'Save'}>
					<Checkbox
						sx={{
							height : '44px',
							width  : '44px'
						}}
						color="secondary"
						id="save-button"
						onChange={saveGameHandler}
						icon={<FavoriteBorder fontSize="small" />}
						checkedIcon={<Favorite fontSize="small" />}
						name="saved"
						checked={data.isSaved}
					/>
				</CustomTooltip>
			)}
		</Fragment>
	)
}

export default SaveGameButton
