import React, { Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import IconButton from '@material-ui/core/IconButton'
import BookmarkTwoToneIcon from '@material-ui/icons/BookmarkTwoTone'
import BookmarkIcon from '@material-ui/icons/Bookmark'

import Loader from '../components/Loader'

import { saveGame } from '../actions/gameActions'

const SaveGameButton = ({ altId }) => {
	const dispatch = useDispatch()

	const savedGameStatus = useSelector((state) => state.savedGameStatus)
	const { loading, success, error, isSaved } = savedGameStatus

	const saveGameHandler = (altId) => {
		console.log(altId)
		dispatch(saveGame(altId))
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
				<IconButton onClick={() => saveGameHandler(altId)} color="secondary">
					{renderButtonHandler()}
				</IconButton>
			)}
		</Fragment>
	)
}

export default SaveGameButton
