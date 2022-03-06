// @ Modules
import React, { Fragment, useState } from 'react'
import { styled } from '@mui/material/styles'
import { useDispatch, useSelector } from 'react-redux'
import { useMutation, useQueryClient } from 'react-query'

// @ Mui
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import ButtonGroup from '@mui/material/ButtonGroup'
import Button from '@mui/material/Button'
import DialogActions from '@mui/material/DialogActions'
import InputAdornment from '@mui/material/InputAdornment'

// @ Icons
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import RefreshIcon from '@mui/icons-material/Refresh'

// @ Components
import CustomIconBtn from './CustomIconBtn'
import CustomDivider from './CustomDivider'
import CustomButton from './CustomButton'
import Loader from './Loader'
import CustomTooltip from './CustomTooltip'
import CustomAlert from './CustomAlert'
import Input from './Input'
import LoadingBtn from './LoadingBtn'

// @ Others
import {
	apiAddSoldGamesToHistory,
	apiDeleteListedGame,
	apiReactivateListedGame,
	apiAddTradedGamesToHistory
} from '../api/api'
import {
	useNotiSnackbar,
	useHistoryAddGameMutation,
	useDeleteListedGameMutation,
	useReactivateListedGameMutation
} from '../hooks/hooks'

// @ Main
const ActiveAddHistoryButton = ({ games, price: listedPrice, mode, gameId, isActive, display }) => {
	const queryClient = useQueryClient()

	const currUsername = useSelector((state) => state.userAuth.userData.username)

	const [ openDialog, setOpenDialog ] = useState(false)
	const [ otherUsername, setOtherUsername ] = useState('')
	const [ finalPrice, setFinalPrice ] = useState(listedPrice ? listedPrice : '')
	const [ extraInfo, setExtraInfo ] = useState('')
	const [ showSnackbar ] = useNotiSnackbar()

	const historyAddGame = useHistoryAddGameMutation({
		onSuccess : () => {
			showSnackbar.success({ text: 'Successfully added to history' })
			setOpenDialog(false)
			invalidate()
		}
	})

	const deleteListing = useDeleteListedGameMutation({
		onSuccess : () => {
			setOpenDialog(false)
			showSnackbar.success({ text: 'Successfully deleted' })
			invalidate()
		}
	})

	const reactivateGame = useReactivateListedGameMutation({
		onSuccess : () => {
			setOpenDialog(false)
			showSnackbar.success({ text: 'Successfully reactivated' })
			invalidate()
		}
	})

	const invalidate = () => {
		queryClient.invalidateQueries([ 'myListedGames' ])
		if (mode === 'sell') {
			queryClient.invalidateQueries([ 'index', 'sell' ])
			queryClient.invalidateQueries([ 'history', 'sell' ])
		}
		if (mode === 'trade') {
			queryClient.invalidateQueries([ 'index', 'trade' ])
			queryClient.invalidateQueries([ 'history', 'trade' ])
		}
	}

	const handleOpenDialog = () => {
		setOpenDialog(true)
	}

	const handleCloseDialog = () => {
		setOpenDialog(false)
	}

	const addGameHandler = (e) => {
		e.preventDefault()
		console.log({ games, otherUsername, finalPrice, extraInfo, gameId, mode })
		historyAddGame.mutate({ games, otherUsername, finalPrice, extraInfo, gameId, mode })
	}

	const deleteGameHandler = (e) => {
		e.preventDefault()
		deleteListing.mutate(gameId)
	}

	const reactivateGameHandler = (e) => {
		e.preventDefault()
		reactivateGame.mutate(gameId)
	}

	const otherUsernameError = historyAddGame.isError ? historyAddGame.error.response.data.message.otherUsername : false
	const finalPriceError = historyAddGame.isError ? historyAddGame.error.response.data.message.finalPrice : false
	const extraInfoError = historyAddGame.isError ? historyAddGame.error.response.data.message.extraInfo : false

	return (
		<Fragment>
			{display === 'add' && (
				<Fragment>
					<CustomTooltip title={mode === 'sell' ? 'Sold' : 'Traded'}>
						<CustomIconBtn disabled={!isActive} onClick={handleOpenDialog} color="primary" size="large">
							<CheckCircleOutlineOutlinedIcon fontSize="small" />
						</CustomIconBtn>
					</CustomTooltip>

					<Dialog fullWidth open={openDialog} onClose={handleCloseDialog} maxWidth="sm">
						<form onSubmit={addGameHandler} autoComplete="off">
							<DialogTitle>
								<Box textAlign="center">
									Fill in the form below for history purposes. Username is not required, but it is
									recommended to be filled in.
								</Box>
								<Box textAlign="center" mt={1} color="text.secondary" fontSize="subtitle2.fontSize">
									Note: once you press the button below, this listing will be deleted and added to
									your history.
								</Box>
							</DialogTitle>

							<DialogContent dividers>
								<Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
									<Input
										sx={{
											minHeight : '70px',
											width     : {
												sm : '70%',
												xs : '100%'
											}
										}}
										error={!!otherUsernameError}
										helperText={otherUsernameError}
										onChange={(inputVal) => setOtherUsername(inputVal)}
										value={otherUsername}
										inputProps={{
											maxLength : 20
										}}
										id="username"
										name="username"
										label="Username"
										type="text"
										placeholder="Username of the other person"
										autoFocus
									/>

									{mode === 'sell' && (
										<Input
											sx={{
												minHeight : '70px',
												width     : {
													sm : '70%',
													xs : '100%'
												}
											}}
											error={!!finalPriceError}
											helperText={finalPriceError}
											onChange={(inputVal) => setFinalPrice(inputVal)}
											value={finalPrice}
											name="final-price"
											label="Final price"
											type="number"
											required
											InputProps={{
												startAdornment : <InputAdornment position="start">RON</InputAdornment>
											}}
										/>
									)}

									<Input
										sx={{
											width : {
												sm : '70%',
												xs : '100%'
											}
										}}
										error={!!extraInfoError}
										helperText={extraInfoError}
										value={extraInfo}
										onChange={(inputVal) => setExtraInfo(inputVal)}
										size="medium"
										multiline
										minRows={3}
										maxRows={10}
										inputProps={{
											maxLength   : 500,
											placeholder : 'Any other info goes in here (500 characters limit)'
										}}
										name="extra-info"
										type="text"
										label={`Extra info ${extraInfo.length}/500`}
									/>
								</Box>
							</DialogContent>
							<DialogActions>
								<CustomButton disabled={historyAddGame.isLoading} onClick={handleCloseDialog}>
									Cancel
								</CustomButton>

								<LoadingBtn
									type="submit"
									variant="contained"
									color="primary"
									loading={historyAddGame.isLoading}
									disabled={currUsername.trim().toLowerCase() === otherUsername.trim().toLowerCase()}
								>
									{mode === 'sell' ? 'Sell' : 'Trade'}
								</LoadingBtn>
							</DialogActions>
						</form>
					</Dialog>
				</Fragment>
			)}

			{display === 'delete' && (
				<Fragment>
					<CustomTooltip title="Delete">
						<CustomIconBtn onClick={handleOpenDialog} size="large">
							<DeleteOutlineIcon color="error" fontSize="small" />
						</CustomIconBtn>
					</CustomTooltip>

					<Dialog fullWidth open={openDialog} onClose={handleCloseDialog} maxWidth="xs">
						<form onSubmit={deleteGameHandler} autoComplete="off">
							<DialogTitle>
								<Box textAlign="center">Are you sure you want to delete this game?</Box>
							</DialogTitle>

							<CustomDivider />

							<DialogActions>
								<CustomButton disabled={deleteListing.isLoading} onClick={handleCloseDialog}>
									Cancel
								</CustomButton>

								<LoadingBtn
									type="submit"
									variant="contained"
									color="primary"
									loading={deleteListing.isLoading}
								>
									Delete
								</LoadingBtn>
							</DialogActions>
						</form>
					</Dialog>
				</Fragment>
			)}

			{display === 'reactivate' && (
				<Fragment>
					<CustomTooltip title="Reactivate">
						<CustomIconBtn disabled={isActive} onClick={handleOpenDialog} color="primary" size="large">
							<RefreshIcon fontSize="small" />
						</CustomIconBtn>
					</CustomTooltip>

					<Dialog fullWidth open={openDialog} onClose={handleCloseDialog} maxWidth="xs">
						<form onSubmit={reactivateGameHandler} autoComplete="off">
							<DialogTitle>
								<Box textAlign="center">Are you sure you want to reactivate this board game?</Box>
							</DialogTitle>

							<CustomDivider />

							<DialogActions>
								<CustomButton disabled={reactivateGame.isLoading} onClick={handleCloseDialog}>
									Cancel
								</CustomButton>

								<LoadingBtn
									type="submit"
									variant="contained"
									color="primary"
									loading={reactivateGame.isLoading}
								>
									Reactivate
								</LoadingBtn>
							</DialogActions>
						</form>
					</Dialog>
				</Fragment>
			)}
		</Fragment>
	)
}

export default ActiveAddHistoryButton
