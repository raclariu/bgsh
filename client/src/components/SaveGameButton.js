// @ Libraries
import React, { Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useQuery, useMutation, useQueryClient } from 'react-query'

// @ Mui
import IconButton from '@material-ui/core/IconButton'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'

// @ Icons
import FavoriteBorder from '@material-ui/icons/FavoriteBorder'
import Favorite from '@material-ui/icons/Favorite'

// @ Components
import Loader from './Loader'

// @ Others
import { apiFetchGameSavedStatus, apiUpdateSavedGameStatus } from '../api/api'
import { useNotification } from '../hooks/hooks'

// @ Main
const SaveGameButton = ({ altId, addedById }) => {
	const dispatch = useDispatch()
	const queryClient = useQueryClient()

	const [ showSnackbar ] = useNotification()

	const { isLoading, data, isSuccess } = useQuery([ 'savedStatus', altId ], () => apiFetchGameSavedStatus(altId), {
		staleTime : 1000 * 60 * 3,
		onError   : (err) => {
			const text = err.response.data.message || 'Error occured while fetching saved status'
			showSnackbar.error({ text })
		}
	})

	const mutation = useMutation((altId) => apiUpdateSavedGameStatus(altId), {
		onMutate  : async () => {
			await queryClient.cancelQueries([ 'savedStatus', altId ])
			const prevStatus = queryClient.getQueryData([ 'savedStatus', altId ])
			queryClient.setQueryData([ 'savedStatus', altId ], (oldStatus) => {
				const newStatus = { isSaved: !oldStatus.isSaved }
				return newStatus
			})

			// return prevStatus in case mutation fails so that onError can use prevStatus to revert
			return { prevStatus }
		},
		onError   : (err, id, ctx) => {
			const text = err.response.data.message || 'Error occured while trying to add game to my saved list'
			showSnackbar.error({ text })
			queryClient.setQueryData([ 'savedStatus', altId ], ctx.prevStatus)
		},
		onSuccess : (data) => {
			queryClient.invalidateQueries([ 'savedStatus', altId ])
			queryClient.invalidateQueries([ 'savedGames' ])
			data.isSaved
				? showSnackbar.success({ text: 'Added to my saved list' })
				: showSnackbar.success({ text: 'Removed from my saved list' })
		}
	})

	const saveGameHandler = () => {
		mutation.mutate(altId)
	}

	return (
		<Fragment>
			{isLoading && (
				<IconButton disabled disableRipple>
					<Loader size={20} />
				</IconButton>
			)}

			{isSuccess && (
				// disabled={addedById === userId}

				<Checkbox
					id="save-button"
					onChange={saveGameHandler}
					icon={<FavoriteBorder />}
					checkedIcon={<Favorite />}
					name="saved"
					size="small"
					checked={data.isSaved}
				/>
			)}
		</Fragment>
	)
}

export default SaveGameButton
