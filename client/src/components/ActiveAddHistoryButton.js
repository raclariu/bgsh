import React, { Fragment, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import Box from '@material-ui/core/Box'
import TextField from '@material-ui/core/TextField'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import Button from '@material-ui/core/Button'
import InputAdornment from '@material-ui/core/InputAdornment'
import CheckCircleOutlineOutlinedIcon from '@material-ui/icons/CheckCircleOutlineOutlined'
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined'
import RefreshIcon from '@material-ui/icons/Refresh'

import Loader from './Loader'

import { deleteGame, reactivateGame } from '../actions/gameActions'
import { addGamesToHistory } from '../actions/historyActions'

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
	}
}))

const ActiveAddHistoryButton = ({ games, price, mode, gameId, isActive, display }) => {
	const cls = useStyles()
	const dispatch = useDispatch()

	const [ openDialog, setOpenDialog ] = useState(false)
	const [ buyerUsername, setBuyerUsername ] = useState('')
	const [ finalPrice, setFinalPrice ] = useState(price ? price : '')

	const { loading, success, error } = useSelector((state) => state.addToHistory)

	const { loading: loadingDelete, success: successDelete, error: errorDelete } = useSelector(
		(state) => state.deleteGame
	)

	const { loading: loadingReactivate, success: successReactivate, error: errorReactivate } = useSelector(
		(state) => state.reactivateGame
	)

	const handleOpenDialog = () => {
		setOpenDialog(true)
	}

	const handleCloseDialog = () => {
		setOpenDialog(false)
	}

	const deleteGameHandler = () => {
		dispatch(deleteGame(gameId))
	}

	const reactivateGameHandler = () => {
		dispatch(reactivateGame(gameId))
	}

	const submitHandler = (e) => {
		e.preventDefault()

		dispatch(addGamesToHistory(games, buyerUsername.trim().toLowerCase(), finalPrice, gameId))
	}

	return (
		<Fragment>
			{display === 'add' && (
				<Fragment>
					<IconButton onClick={handleOpenDialog} color="primary">
						<CheckCircleOutlineOutlinedIcon fontSize="small" />
					</IconButton>

					<Dialog fullWidth open={openDialog} onClose={handleCloseDialog} maxWidth="sm">
						<DialogTitle disableTypography>
							<Typography variant="subtitle2" align="center">
								{mode === 'sell' && 'For history purposes, type the buyers username and final price'}
								{mode === 'trade' && 'For history purposes, type the other traders username'}
							</Typography>
							<Typography variant="body2" color="textSecondary" align="center">
								You can skip this feature by just clicking on the button below
							</Typography>
						</DialogTitle>

						<DialogContent>
							<form onSubmit={submitHandler} autoComplete="off">
								<Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
									<TextField
										className={cls.input}
										error={error && error.usernameError ? true : false}
										helperText={error ? error.usernameError : false}
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

									<Button
										className={cls.button}
										disabled={loading}
										type="submit"
										variant="contained"
										color="primary"
									>
										{loading ? (
											<Loader color="inherit" size={24} />
										) : mode === 'sell' ? (
											'Sell'
										) : (
											'Trade'
										)}
									</Button>
								</Box>
							</form>
						</DialogContent>
					</Dialog>
				</Fragment>
			)}

			{display === 'delete' && (
				<Fragment>
					<IconButton onClick={handleOpenDialog}>
						<DeleteOutlinedIcon color="error" fontSize="small" />
					</IconButton>

					<Dialog fullWidth open={openDialog} onClose={handleCloseDialog} maxWidth="xs">
						<DialogTitle disableTypography>
							<Typography variant="subtitle2" align="center">
								Are you sure?
							</Typography>
						</DialogTitle>

						<DialogContent>
							<Box display="flex" justifyContent="center" alignItems="center">
								<ButtonGroup color="primary">
									<Button disabled={loadingDelete} onClick={deleteGameHandler}>
										{loadingDelete ? <Loader color="inherit" size={24} /> : 'Yes'}
									</Button>
									<Button onClick={handleCloseDialog}>Go back</Button>
								</ButtonGroup>
							</Box>
						</DialogContent>
					</Dialog>
				</Fragment>
			)}

			{display === 'reactivate' && (
				<Fragment>
					<IconButton disabled={isActive} onClick={handleOpenDialog} color="primary">
						<RefreshIcon fontSize="small" />
					</IconButton>

					<Dialog fullWidth open={openDialog} onClose={handleCloseDialog} maxWidth="xs">
						<DialogTitle disableTypography>
							<Typography variant="subtitle2" align="center">
								Are you sure?
							</Typography>
						</DialogTitle>

						<DialogContent>
							<Box display="flex" justifyContent="center" alignItems="center">
								<ButtonGroup color="primary">
									<Button disabled={loadingReactivate} onClick={reactivateGameHandler}>
										{loadingReactivate ? <Loader color="inherit" size={24} /> : 'Yes'}
									</Button>
									<Button onClick={handleCloseDialog}>Go back</Button>
								</ButtonGroup>
							</Box>
						</DialogContent>
					</Dialog>
				</Fragment>
			)}
		</Fragment>
	)
}

export default ActiveAddHistoryButton