// @ Modules
import React, { Fragment, useState } from 'react'
import { useSelector } from 'react-redux'

// @ Mui
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
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
import CustomTooltip from './CustomTooltip'
import Input from './Input'
import LoadingBtn from './LoadingBtn'

// @ Others
import { useHistoryAddGameMutation, useDeleteListedGameMutation, useReactivateListedGameMutation } from '../hooks/hooks'

// @ Main
const ActiveAddHistoryButton = ({ games, price: listedPrice, mode, gameId, isActive, display }) => {
	const currUsername = useSelector((state) => state.userData.username)

	const [ openDialog, setOpenDialog ] = useState(false)
	const [ otherUsername, setOtherUsername ] = useState('')
	const [ finalPrice, setFinalPrice ] = useState(listedPrice ? listedPrice : '')
	const [ extraInfo, setExtraInfo ] = useState('')

	const historyAddGame = useHistoryAddGameMutation({
		handleCleanup : () => {
			setOpenDialog(false)
		},
		mode
	})

	const deleteListing = useDeleteListedGameMutation({
		handleCleanup : () => {
			setOpenDialog(false)
		},
		mode
	})

	const reactivateGame = useReactivateListedGameMutation({
		handleCleanup : () => {
			setOpenDialog(false)
		},
		mode
	})

	const handleOpenDialog = () => {
		setOpenDialog(true)
	}

	const handleCloseDialog = () => {
		setOpenDialog(false)
	}

	const addGameHandler = (e) => {
		e.preventDefault()
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
							<CheckCircleOutlineOutlinedIcon />
						</CustomIconBtn>
					</CustomTooltip>

					<Dialog fullWidth open={openDialog} onClose={handleCloseDialog} maxWidth="sm">
						<form onSubmit={addGameHandler} autoComplete="off">
							<DialogTitle>
								<Box textAlign="center">{`Add listing to ${mode === 'sell'
									? 'sale'
									: 'trade'} history`}</Box>
								<Box textAlign="center" mt={1} color="grey.500" fontSize="caption.fontSize">
									Note: once you submit the form, this listing will be deleted and added to your
									history.
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
											minLength : 4,
											maxLength : 20
										}}
										id="username"
										name="username"
										label="Username"
										type="text"
										placeholder="Username of the other user"
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
						<CustomIconBtn color="error" onClick={handleOpenDialog} size="large">
							<DeleteOutlineIcon />
						</CustomIconBtn>
					</CustomTooltip>

					<Dialog fullWidth open={openDialog} onClose={handleCloseDialog} maxWidth="xs">
						<form onSubmit={deleteGameHandler} autoComplete="off">
							<DialogTitle>
								<Box textAlign="center">Are you sure you want to delete this listing?</Box>
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
							<RefreshIcon />
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
