// @ Libraries
import React, { Fragment, useState } from 'react'
import { styled } from '@mui/material/styles'
import { useDispatch, useSelector } from 'react-redux'
import { useMutation, useQueryClient } from 'react-query'

// @ Mui
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import ButtonGroup from '@mui/material/ButtonGroup'
import Button from '@mui/material/Button'
import DialogActions from '@mui/material/DialogActions'
import Divider from '@mui/material/Divider'
import InputAdornment from '@mui/material/InputAdornment'

// @ Icons
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import RefreshIcon from '@mui/icons-material/Refresh'

// @ Components
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
import { useNotiSnackbar } from '../hooks/hooks'

// @ Main
const ActiveAddHistoryButton = ({ games, price: listedPrice, mode, gameId, isActive, display }) => {
	const queryClient = useQueryClient()

	const currUsername = useSelector((state) => state.userAuth.userData.username)

	const [ openDialog, setOpenDialog ] = useState(false)
	const [ otherUsername, setOtherUsername ] = useState('')
	const [ finalPrice, setFinalPrice ] = useState(listedPrice ? listedPrice : '')
	const [ extraInfo, setExtraInfo ] = useState('')
	const [ showSnackbar ] = useNotiSnackbar()

	const addGame = useMutation(
		({ games, otherUsername, finalPrice, extraInfo, mode, gameId }) => {
			if (mode === 'sell') {
				return apiAddSoldGamesToHistory({
					games,
					otherUsername : otherUsername.trim() ? otherUsername.trim().toLowerCase() : null,
					finalPrice    : finalPrice,
					extraInfo     : extraInfo.trim() ? extraInfo.trim() : null,
					gameId
				})
			}

			if (mode === 'trade') {
				return apiAddTradedGamesToHistory({
					games,
					otherUsername : otherUsername.trim() ? otherUsername.trim().toLowerCase() : null,
					extraInfo     : extraInfo.trim() ? extraInfo.trim() : null,
					gameId
				})
			}
		},
		{
			onSuccess : () => {
				setOpenDialog(false)
				addGame.reset()
				showSnackbar.success({ text: 'Successfully added to history' })
				invalidate()
			}
		}
	)

	const deleteGame = useMutation((gameId) => apiDeleteListedGame(gameId), {
		onError   : (err) => {
			const text = err.response.data.message || 'Error occured while trying to delete a listing'
			showSnackbar.error({ text })
		},
		onSuccess : () => {
			setOpenDialog(false)
			deleteGame.reset()
			showSnackbar.success({ text: 'Successfully deleted' })
			invalidate()
		}
	})

	const reactivateGame = useMutation((gameId) => apiReactivateListedGame(gameId), {
		onError   : (err) => {
			const text = err.response.data.message || 'Error occured while trying to reactivate a listing'
			showSnackbar.error({ text })
		},
		onSuccess : () => {
			setOpenDialog(false)
			reactivateGame.reset()
			showSnackbar.success({ text: 'Successfully reactivated' })
			invalidate()
		}
	})

	const invalidate = () => {
		queryClient.invalidateQueries('myListedGames')
		if (mode === 'sell') {
			queryClient.invalidateQueries('saleGames')
			queryClient.invalidateQueries('soldHistory')
		}
		if (mode === 'trade') {
			queryClient.invalidateQueries('tradeGames')
			queryClient.invalidateQueries('tradedHistory')
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
		addGame.mutate({ games, otherUsername, finalPrice, extraInfo, gameId, mode })
	}

	const deleteGameHandler = (e) => {
		e.preventDefault()
		deleteGame.mutate(gameId)
	}

	const reactivateGameHandler = (e) => {
		e.preventDefault()
		reactivateGame.mutate(gameId)
	}

	const otherUsernameError = addGame.isError ? addGame.error.response.data.message.otherUsername : false
	const finalPriceError = addGame.isError ? addGame.error.response.data.message.finalPrice : false
	const extraInfoError = addGame.isError ? addGame.error.response.data.message.extraInfo : false

	return (
		<Fragment>
			{display === 'add' && (
				<Fragment>
					<CustomTooltip title={mode === 'sell' ? 'Sold' : 'Traded'}>
						<IconButton disabled={!isActive} onClick={handleOpenDialog} color="primary" size="large">
							<CheckCircleOutlineOutlinedIcon fontSize="small" />
						</IconButton>
					</CustomTooltip>

					<Dialog fullWidth open={openDialog} onClose={handleCloseDialog} maxWidth="sm">
						<form onSubmit={addGameHandler} autoComplete="off">
							<DialogTitle>
								<Box>
									Fill in the form below for history purposes. Username is not required, but it is
									recommended to be filled in.
								</Box>
								<Box color="textSecondary">
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
										onChange={(e) => setOtherUsername(e.target.value)}
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
											onChange={(e) => setFinalPrice(e.target.value)}
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
										onChange={(e) => setExtraInfo(e.target.value)}
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
								<Button disabled={addGame.isLoading} onClick={handleCloseDialog} color="primary">
									Cancel
								</Button>

								<LoadingBtn
									type="submit"
									color="primary"
									loading={addGame.isLoading}
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
						<IconButton onClick={handleOpenDialog} size="large">
							<DeleteOutlineIcon color="error" fontSize="small" />
						</IconButton>
					</CustomTooltip>

					<Dialog fullWidth open={openDialog} onClose={handleCloseDialog} maxWidth="xs">
						<form onSubmit={deleteGameHandler} autoComplete="off">
							<DialogTitle>
								<Box align="center">Are you sure you want to delete this game?</Box>
							</DialogTitle>

							<Divider />

							<DialogActions>
								<Button disabled={deleteGame.isLoading} onClick={handleCloseDialog} color="primary">
									Cancel
								</Button>

								<LoadingBtn
									type="submit"
									variant="contained"
									color="primary"
									loading={deleteGame.isLoading}
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
						<IconButton disabled={isActive} onClick={handleOpenDialog} color="primary" size="large">
							<RefreshIcon fontSize="small" />
						</IconButton>
					</CustomTooltip>

					<Dialog fullWidth open={openDialog} onClose={handleCloseDialog} maxWidth="xs">
						<form onSubmit={reactivateGameHandler} autoComplete="off">
							<DialogTitle>
								<Box align="center">Are you sure you want to reactivate this board game?</Box>
							</DialogTitle>

							<Divider />

							<DialogActions>
								<Button disabled={reactivateGame.isLoading} onClick={handleCloseDialog} color="primary">
									Cancel
								</Button>

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
