// @ Libraries
import React, { Fragment, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import { useMutation, useQueryClient } from 'react-query'

// @ Mui
import Box from '@material-ui/core/Box'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import Button from '@material-ui/core/Button'
import DialogActions from '@material-ui/core/DialogActions'
import Divider from '@material-ui/core/Divider'

// @ Icons
import CheckCircleOutlineOutlinedIcon from '@material-ui/icons/CheckCircleOutlineOutlined'
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline'
import RefreshIcon from '@material-ui/icons/Refresh'

// @ Components
import Loader from './Loader'
import CustomTooltip from './CustomTooltip'
import CustomAlert from './CustomAlert'
import Input from './Input'

// @ Others
import { apiAddGameToHistory, apiDeleteListedGame, apiReactivateListedGame } from '../api/api'
import { useNotification } from '../hooks/hooks'

// @ Styles
const useStyles = makeStyles((theme) => ({
	input    : {
		minHeight                      : '70px',
		width                          : '70%',
		[theme.breakpoints.down('xs')]: {
			width : '100%'
		}
	},
	textarea : {
		width                          : '70%',
		[theme.breakpoints.down('xs')]: {
			width : '100%'
		}
	}
}))

// @ Main
const ActiveAddHistoryButton = ({ games, price: listedPrice, mode, gameId, isActive, display }) => {
	const cls = useStyles()
	const dispatch = useDispatch()
	const queryClient = useQueryClient()

	const [ openDialog, setOpenDialog ] = useState(false)
	const [ otherUsername, setOtherUsername ] = useState('')
	const [ finalPrice, setFinalPrice ] = useState(listedPrice ? listedPrice : '')
	const [ extraInfo, setExtraInfo ] = useState('')
	const [ showSnackbar ] = useNotification()

	const addGame = useMutation(
		({ games, otherUsername, finalPrice, extraInfo, mode, gameId }) =>
			apiAddGameToHistory({
				games,
				mode,
				otherUsername : otherUsername ? otherUsername.trim().toLowerCase() : null,
				finalPrice    : finalPrice ? finalPrice : null,
				extraInfo     : extraInfo.trim() ? extraInfo.trim() : null,
				gameId
			}),
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

	const addGameHandler = () => {
		addGame.mutate({ games, otherUsername, finalPrice, extraInfo, gameId, mode })
	}

	const deleteGameHandler = () => {
		deleteGame.mutate(gameId)
	}

	const reactivateGameHandler = () => {
		reactivateGame.mutate(gameId)
	}

	const handleOtherUsername = (value) => {
		setOtherUsername(value)
	}

	const handleFinalPrice = (value) => {
		setFinalPrice(value)
	}

	const handleExtraInfo = (value) => {
		setExtraInfo(value)
	}

	const otherUsernameError = addGame.isError ? addGame.error.response.data.message.otherUsernameError : false
	const finalPriceError = addGame.isError ? addGame.error.response.data.message.finalPriceError : false
	const extraInfoError = addGame.isError ? addGame.error.response.data.message.extraInfoError : false

	return (
		<Fragment>
			{display === 'add' && (
				<Fragment>
					<CustomTooltip title={mode === 'sell' ? 'Sold' : 'Traded'}>
						<IconButton disabled={!isActive} onClick={handleOpenDialog} color="primary">
							<CheckCircleOutlineOutlinedIcon fontSize="small" />
						</IconButton>
					</CustomTooltip>

					<Dialog fullWidth open={openDialog} onClose={handleCloseDialog} maxWidth="sm">
						<DialogTitle disableTypography>
							<Typography variant="body2">
								Fill in the form below for history purposes. Username is not required, but it is
								recommended to be filled in.
							</Typography>
							<Typography variant="caption" color="textSecondary">
								Note: once you press the button below, this listing will be deleted and added to your
								history.
							</Typography>
						</DialogTitle>

						<DialogContent dividers>
							<Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
								<Input
									className={cls.input}
									error={!!otherUsernameError}
									helperText={otherUsernameError}
									onChange={handleOtherUsername}
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
										className={cls.input}
										error={!!finalPriceError}
										helperText={finalPriceError}
										onChange={handleFinalPrice}
										value={finalPrice}
										name="final-price"
										label="Final price"
										type="number"
									/>
								)}

								<Input
									className={cls.textarea}
									error={!!extraInfoError}
									helperText={extraInfoError}
									value={extraInfo}
									onChange={handleExtraInfo}
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
							<Button onClick={handleCloseDialog} color="primary">
								Cancel
							</Button>
							<Button
								onClick={addGameHandler}
								disabled={addGame.isLoading}
								variant="contained"
								color="primary"
							>
								{addGame.isLoading ? (
									<Loader color="inherit" size={24} />
								) : mode === 'sell' ? (
									'Sell'
								) : (
									'Trade'
								)}
							</Button>
						</DialogActions>
					</Dialog>
				</Fragment>
			)}

			{display === 'delete' && (
				<Fragment>
					<CustomTooltip title="Delete">
						<IconButton onClick={handleOpenDialog}>
							<DeleteOutlineIcon color="error" fontSize="small" />
						</IconButton>
					</CustomTooltip>

					<Dialog fullWidth open={openDialog} onClose={handleCloseDialog} maxWidth="xs">
						<DialogTitle disableTypography>
							<Typography variant="subtitle2" align="center">
								Are you sure you want to delete this game?
							</Typography>
						</DialogTitle>

						<Divider />

						<DialogActions>
							<Button onClick={handleCloseDialog} color="primary">
								Cancel
							</Button>
							<Button
								disabled={deleteGame.isLoading}
								onClick={deleteGameHandler}
								variant="contained"
								color="primary"
							>
								{deleteGame.isLoading ? <Loader color="inherit" size={24} /> : 'Delete'}
							</Button>
						</DialogActions>
					</Dialog>
				</Fragment>
			)}

			{display === 'reactivate' && (
				<Fragment>
					<CustomTooltip title="Reactivate">
						<IconButton disabled={isActive} onClick={handleOpenDialog} color="primary">
							<RefreshIcon fontSize="small" />
						</IconButton>
					</CustomTooltip>

					<Dialog fullWidth open={openDialog} onClose={handleCloseDialog} maxWidth="xs">
						<DialogTitle disableTypography>
							<Typography variant="subtitle2" align="center">
								Are you sure you want to reactivate this board game?
							</Typography>
						</DialogTitle>

						<Divider />

						<DialogActions>
							<Button onClick={handleCloseDialog} color="primary">
								Cancel
							</Button>
							<Button
								disabled={reactivateGame.isLoading}
								onClick={reactivateGameHandler}
								variant="contained"
								color="primary"
							>
								{reactivateGame.isLoading ? <Loader color="inherit" size={24} /> : 'Reactivate'}
							</Button>
						</DialogActions>
					</Dialog>
				</Fragment>
			)}
		</Fragment>
	)
}

export default ActiveAddHistoryButton
