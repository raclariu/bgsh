// @ Libraries
import React, { Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useQuery, useMutation, useQueryClient } from 'react-query'

// @ Mui
import IconButton from '@material-ui/core/IconButton'

// @ Icons
import BookmarkTwoToneIcon from '@material-ui/icons/BookmarkTwoTone'
import BookmarkIcon from '@material-ui/icons/Bookmark'

// @ Components
import Loader from './Loader'

// @ Others
import { switchSaveGame } from '../actions/gameActions'
import { apiFetchGameSavedStatus, apiUpdateSavedStatus } from '../api/api'

// @ Main
const SaveGameButton = ({ altId, sellerId }) => {
	const dispatch = useDispatch()
	const queryClient = useQueryClient()

	const { isLoading, isError, error, data: isSaved, isSuccess } = useQuery(
		[ 'savedStatus', altId ],
		() => apiFetchGameSavedStatus(altId),
		{
			staleTime : 1000 * 60 * 3
		}
	)

	const mutation = useMutation((altId) => apiUpdateSavedStatus(altId), {
		onSuccess : () => {
			queryClient.invalidateQueries([ 'savedStatus', altId ])
			queryClient.invalidateQueries([ 'savedGames' ])
		}
	})

	const saveGameHandler = () => {
		mutation.mutate(altId)
	}

	const renderButtonHandler = () => {
		if (isSaved) {
			return <BookmarkIcon fontSize="small" />
		} else {
			return <BookmarkTwoToneIcon fontSize="small" />
		}
	}

	return (
		<Fragment>
			{isLoading || mutation.isLoading ? (
				<IconButton disabled disableRipple>
					<Loader size={20} />
				</IconButton>
			) : (
				// disabled={sellerId === userId}
				<IconButton onClick={saveGameHandler} color="secondary">
					{renderButtonHandler()}
				</IconButton>
			)}
		</Fragment>
	)
}

export default SaveGameButton
