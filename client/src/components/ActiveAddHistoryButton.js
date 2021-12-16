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
import TextField from '@material-ui/core/TextField'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import Button from '@material-ui/core/Button'
import InputAdornment from '@material-ui/core/InputAdornment'
import DialogActions from '@material-ui/core/DialogActions'

// @ Icons
import CheckCircleOutlineOutlinedIcon from '@material-ui/icons/CheckCircleOutlineOutlined'
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline'
import RefreshIcon from '@material-ui/icons/Refresh'

// @ Components
import Loader from './Loader'
import CustomTooltip from './CustomTooltip'
import CustomAlert from '../components/CustomAlert'

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
	},
	button   : {
		// width                          : '50%',
		// [theme.breakpoints.down('xs')]: {
		// 	width : '90%'
		// }
	},
	ml       : {
		marginLeft : theme.spacing(2)
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
		({ games, otherUsername, finalPrice, extraInfo, gameId }) =>
			apiAddGameToHistory({
				games,
				username   : otherUsername.trim().toLowerCase(),
				finalPrice,
				extraInfo  : extraInfo.trim(),
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
		onSuccess : () => {
			setOpenDialog(false)
			deleteGame.reset()
			showSnackbar.success({ text: 'Successfully deleted' })
			invalidate()
		}
	})

	const reactivateGame = useMutation((gameId) => apiReactivateListedGame(gameId), {
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
		addGame.mutate({ games, otherUsername, finalPrice, extraInfo, gameId })
	}

	const deleteGameHandler = () => {
		deleteGame.mutate(gameId)
	}

	const reactivateGameHandler = () => {
		reactivateGame.mutate(gameId)
	}

	const handleFinalPrice = (e) => {
		setFinalPrice(e.target.value)
	}

	const handleExtraInfo = (e) => {
		setExtraInfo(e.target.value)
	}

	const otherUsernameError = addGame.isError ? addGame.error.response.data.message.usernameError : false
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
								<TextField
									className={cls.input}
									error={!!otherUsernameError}
									helperText={otherUsernameError}
									onChange={(e) => setOtherUsername(e.target.value)}
									value={otherUsername}
									inputProps={{
										maxLength : 20
									}}
									variant="outlined"
									id="username"
									name="username"
									label="Username"
									type="text"
									size="small"
									placeholder="Username of the other person"
									autoFocus
								/>

								{mode === 'sell' && (
									<TextField
										className={cls.input}
										error={!!finalPriceError}
										helperText={finalPriceError}
										onChange={handleFinalPrice}
										value={finalPrice}
										InputProps={{
											startAdornment : <InputAdornment position="start">RON</InputAdornment>
										}}
										variant="outlined"
										name="final-price"
										label="Final price"
										type="number"
										size="small"
									/>
								)}

								<TextField
									className={cls.textarea}
									error={!!extraInfoError}
									helperText={extraInfoError}
									value={extraInfo}
									onChange={handleExtraInfo}
									inputProps={{
										maxLength   : 500,
										placeholder : 'Any other info goes in here (500 characters limit)'
									}}
									variant="outlined"
									name="extra-info"
									type="text"
									label={`Extra info ${extraInfo.length}/500`}
									multiline
									minRows={3}
									maxRows={10}
									size="small"
								/>
							</Box>
						</DialogContent>
						<DialogActions>
							<Button
								className={cls.button}
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

						<DialogContent>
							<Box display="flex" justifyContent="center" alignItems="center">
								{deleteGame.isError && (
									<Box mb={2}>
										<CustomAlert>{deleteGame.error.response.data.message}</CustomAlert>
									</Box>
								)}

								{deleteGame.isSuccess ? (
									<Box mb={2}>
										<CustomAlert severity="success">
											Success. You can now close this window.
										</CustomAlert>
									</Box>
								) : (
									<Fragment>
										<Button
											disabled={deleteGame.isLoading}
											onClick={deleteGameHandler}
											variant="contained"
											color="primary"
										>
											{deleteGame.isLoading ? <Loader color="inherit" size={24} /> : 'Delete'}
										</Button>
										<Button className={cls.ml} onClick={handleCloseDialog} color="primary">
											Go back
										</Button>
									</Fragment>
								)}
							</Box>
						</DialogContent>
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

						<DialogContent>
							<Box display="flex" justifyContent="center" alignItems="center">
								{reactivateGame.isError && (
									<Box mb={2}>
										<CustomAlert>{reactivateGame.error.response.data.message}</CustomAlert>
									</Box>
								)}

								{reactivateGame.isSuccess ? (
									<Box mb={2}>
										<CustomAlert severity="success">
											Success. You can now close this window.
										</CustomAlert>
									</Box>
								) : (
									<Fragment>
										<Button
											disabled={reactivateGame.isLoading}
											onClick={reactivateGameHandler}
											variant="contained"
											color="primary"
										>
											{reactivateGame.isLoading ? <Loader color="inherit" size={24} /> : 'Yes'}
										</Button>
										<Button className={cls.ml} onClick={handleCloseDialog} color="primary">
											Go back
										</Button>
									</Fragment>
								)}
							</Box>
						</DialogContent>
					</Dialog>
				</Fragment>
			)}
		</Fragment>
	)
}

export default ActiveAddHistoryButton
