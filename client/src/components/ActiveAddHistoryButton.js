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

// @ Others
import { apiAddGameToHistory, apiDeleteListedGame, apiReactivateListedGame } from '../api/api'
import { useNotification } from '../hooks/hooks'

const PREFIX = 'ActiveAddHistoryButton'

const classes = {
	input    : `${PREFIX}-input`,
	textarea : `${PREFIX}-textarea`
}

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled('div')(({ theme }) => ({
	[`& .${classes.input}`]: {
		minHeight                      : '70px',
		width                          : '70%',
		[theme.breakpoints.down('sm')]: {
			width : '100%'
		}
	},

	[`& .${classes.textarea}`]: {
		width                          : '70%',
		[theme.breakpoints.down('sm')]: {
			width : '100%'
		}
	}
}))

// @ Main
const ActiveAddHistoryButton = ({ games, price: listedPrice, mode, gameId, isActive, display }) => {
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

	const otherUsernameError = addGame.isError ? addGame.error.response.data.message.otherUsername : false
	const finalPriceError = addGame.isError ? addGame.error.response.data.message.finalPrice : false
	const extraInfoError = addGame.isError ? addGame.error.response.data.message.extraInfo : false

	return (
		<Root>
			{display === 'add' && (
				<Fragment>
					<CustomTooltip title={mode === 'sell' ? 'Sold' : 'Traded'}>
						<IconButton disabled={!isActive} onClick={handleOpenDialog} color="primary" size="large">
							<CheckCircleOutlineOutlinedIcon fontSize="small" />
						</IconButton>
					</CustomTooltip>

					<Dialog fullWidth open={openDialog} onClose={handleCloseDialog} maxWidth="sm">
						<DialogTitle>
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
									className={classes.input}
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
										className={classes.input}
										error={!!finalPriceError}
										helperText={finalPriceError}
										onChange={(e) => setFinalPrice(e.target.value)}
										value={finalPrice}
										name="final-price"
										label="Final price"
										type="number"
										InputProps={{
											startAdornment : <InputAdornment position="start">RON</InputAdornment>
										}}
										required
									/>
								)}

								<Input
									className={classes.textarea}
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
						<IconButton onClick={handleOpenDialog} size="large">
							<DeleteOutlineIcon color="error" fontSize="small" />
						</IconButton>
					</CustomTooltip>

					<Dialog fullWidth open={openDialog} onClose={handleCloseDialog} maxWidth="xs">
						<DialogTitle>
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
						<IconButton disabled={isActive} onClick={handleOpenDialog} color="primary" size="large">
							<RefreshIcon fontSize="small" />
						</IconButton>
					</CustomTooltip>

					<Dialog fullWidth open={openDialog} onClose={handleCloseDialog} maxWidth="xs">
						<DialogTitle>
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
		</Root>
	)
}

export default ActiveAddHistoryButton
