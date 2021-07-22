import React, { Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import IconButton from '@material-ui/core/IconButton'
import BookmarkTwoToneIcon from '@material-ui/icons/BookmarkTwoTone'
import BookmarkIcon from '@material-ui/icons/Bookmark'

import Loader from './Loader'

import { switchSaveGame } from '../actions/gameActions'

const SaveGameButton = ({ altId, sellerId }) => {
	const dispatch = useDispatch()

	const savedGameStatus = useSelector((state) => state.savedGameStatus)
	const { loading, success, error, isSaved } = savedGameStatus

	const userId = useSelector((state) => state.userSignIn.userInfo._id)

	const saveGameHandler = () => {
		dispatch(switchSaveGame(altId))
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
			{loading && (
				<IconButton disabled disableRipple>
					<Loader size={20} />
				</IconButton>
			)}
			{success && (
				// disabled={sellerId === userId}
				<IconButton onClick={saveGameHandler} color="secondary">
					{renderButtonHandler()}
				</IconButton>
			)}
		</Fragment>
	)
}

export default SaveGameButton
