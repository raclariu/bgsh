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

// @ Icons
import CheckCircleOutlineOutlinedIcon from '@material-ui/icons/CheckCircleOutlineOutlined'
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline'
import RefreshIcon from '@material-ui/icons/Refresh'

// @ Components
import Loader from './Loader'
import CustomTooltip from './CustomTooltip'
import CustomAlert from '../components/CustomAlert'

// @ Others
import { deleteGame, reactivateGame, deleteWantedGame } from '../actions/gameActions'
import { addGamesToHistory } from '../actions/historyActions'
import { apiAddGameToHistory, apiDeleteListedGame, apiReactivateListedGame } from '../api/api'

// @ Styles
const useStyles = makeStyles((theme) => ({
	input  : {
		minHeight                      : '70px',
		width                          : '50%',
		[theme.breakpoints.down('xs')]: {
			width : '90%'
		}
	},
	button : {
		width                          : '50%',
		[theme.breakpoints.down('xs')]: {
			width : '90%'
		}
	},
	ml     : {
		marginLeft : theme.spacing(2)
	}
}))

// @ Main
const ActiveAddHistoryButton = ({ games, price, mode, gameId, isActive, display }) => {
	const cls = useStyles()
	const dispatch = useDispatch()
	const queryClient = useQueryClient()

	const [ openDialog, setOpenDialog ] = useState(false)
	const [ buyerUsername, setBuyerUsername ] = useState('')
	const [ finalPrice, setFinalPrice ] = useState(price ? price : '')

	// const addGame = useSelector((state) => state.addToHistory)
	// const { loading, success, error } = addGame

	// const delGame = useSelector((state) => state.deleteGame)
	// const { loading: loadingDelete, success: successDelete, error: errorDelete } = delGame

	// const reactivateGame = useSelector((state) => state.reactivateGame)
	// const { loading: loadingReactivate, success: successReactivate, error: errorReactivate } = reactivateGame

	const addGame = useMutation(
		({ games, buyerUsername, finalPrice, gameId }) =>
			apiAddGameToHistory(games, buyerUsername.trim().toLowerCase(), finalPrice, gameId)
		// {
		// 	onSuccess : () => {
		// 		queryClient.invalidateQueries('listedGames')
		// 	}
		// }
	)

	const deleteGame = useMutation(
		(gameId) => apiDeleteListedGame(gameId)
		// {
		// 	onSuccess : () => {
		// 		queryClient.invalidateQueries('listedGames')
		// 	}
		// }
	)

	const reactivateGame = useMutation(
		(gameId) => apiReactivateListedGame(gameId)
		// {
		// 	onSuccess : () => {
		// 		queryClient.invalidateQueries('listedGames')
		// 	}
		// }
	)

	const handleOpenDialog = () => {
		setOpenDialog(true)
	}

	const handleCloseDialog = () => {
		setOpenDialog(false)
		if (addGame.isSuccess || deleteGame.isSuccess || reactivateGame.isSuccess) {
			queryClient.invalidateQueries('listedGames')
			addGame.reset()
			deleteGame.reset()
			reactivateGame.reset()
		}
	}

	const deleteGameHandler = () => {
		if (mode === 'wanted') {
			dispatch(deleteWantedGame(gameId))
		} else {
			deleteGame.mutate(gameId)
		}
	}

	const reactivateGameHandler = () => {
		reactivateGame.mutate(gameId)
	}

	const submitHandler = (e) => {
		e.preventDefault()

		addGame.mutate({ games, buyerUsername, finalPrice, gameId })
	}

	return (
		<Fragment>
			{display === 'add' && (
				<Fragment>
					<CustomTooltip title={mode === 'sell' ? 'Sold' : 'Traded'}>
						<span>
							<IconButton disabled={!isActive} onClick={handleOpenDialog} color="primary">
								<CheckCircleOutlineOutlinedIcon fontSize="small" />
							</IconButton>
						</span>
					</CustomTooltip>

					<Dialog fullWidth open={openDialog} onClose={handleCloseDialog} maxWidth="sm">
						<DialogTitle disableTypography>
							<Typography variant="subtitle2" align="center">
								{mode === 'sell' && 'For history purposes, type the buyers username and final price'}
								{mode === 'trade' && 'For history purposes, type the other traders username'}
							</Typography>
							<Typography variant="body2" color="textSecondary" align="center">
								Username is not required, but it is recommended
							</Typography>
						</DialogTitle>

						<DialogContent>
							<form onSubmit={submitHandler} autoComplete="off">
								{addGame.isSuccess && (
									<Box mb={2}>
										<CustomAlert severity="success">
											Success. You can now close this window.
										</CustomAlert>
									</Box>
								)}
								<Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
									<TextField
										className={cls.input}
										error={addGame.isError ? true : false}
										helperText={
											addGame.isError ? addGame.error.response.data.message.usernameError : false
										}
										onChange={(e) => setBuyerUsername(e.target.value)}
										value={buyerUsername}
										inputProps={{
											maxLength : 20
										}}
										variant="outlined"
										id="username"
										name="username"
										label="Username"
										type="text"
										size="small"
										autoFocus
									/>

									{mode === 'sell' && (
										<TextField
											className={cls.input}
											onChange={(e) => setFinalPrice(e.target.value)}
											value={finalPrice}
											InputProps={{
												startAdornment : <InputAdornment position="start">RON</InputAdornment>
											}}
											inputProps={{
												min : 0,
												max : 10000
											}}
											variant="outlined"
											name="price"
											label="Final Price"
											type="number"
											size="small"
										/>
									)}

									{!addGame.isSuccess && (
										<Button
											className={cls.button}
											disabled={addGame.isLoading}
											type="submit"
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
									)}
								</Box>
							</form>
						</DialogContent>
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
						<span>
							<IconButton disabled={isActive} onClick={handleOpenDialog} color="primary">
								<RefreshIcon fontSize="small" />
							</IconButton>
						</span>
					</CustomTooltip>

					<Dialog fullWidth open={openDialog} onClose={handleCloseDialog} maxWidth="xs">
						<DialogTitle disableTypography>
							<Typography variant="subtitle2" align="center">
								Are you sure you want to reactivate this board game?
							</Typography>
						</DialogTitle>

						<DialogContent>
							<Box display="flex" justifyContent="center" alignItems="center">
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
