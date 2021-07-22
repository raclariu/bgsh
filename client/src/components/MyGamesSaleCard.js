import React, { Fragment, useState, useEffect } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import { Link as RouterLink } from 'react-router-dom'
import Box from '@material-ui/core/Box'
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Chip from '@material-ui/core/Chip'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'

import CenterFocusWeakTwoToneIcon from '@material-ui/icons/CenterFocusWeakTwoTone'
import MonetizationOnOutlinedIcon from '@material-ui/icons/MonetizationOnOutlined'
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'
import RefreshIcon from '@material-ui/icons/Refresh'

import Loader from '../components/Loader'

import { addGamesToHistory } from '../actions/historyActions'
import { deleteGame } from '../actions/gameActions'

const useStyles = makeStyles((theme) => ({
	root        : {
		position : 'relative'
	},
	media       : {
		objectFit : 'contain',
		height    : '180px'
	},
	overlayChip : {
		position : 'absolute',
		top      : '8px',
		left     : '4px'
	},
	content     : {
		padding   : 0,
		marginTop : theme.spacing(1)
	},
	title       : {
		display         : '-webkit-box',
		WebkitLineClamp : '2',
		WebkitBoxOrient : 'vertical',
		overflow        : 'hidden'
	},
	avatar      : {
		width           : theme.spacing(4),
		height          : theme.spacing(4),
		backgroundColor : theme.palette.primary.main
	},
	input       : {
		minHeight                      : '70px',
		width                          : '50%',
		[theme.breakpoints.down('xs')]: {
			width : '90%'
		}
	},
	button      : {
		width                          : '50%',
		[theme.breakpoints.down('xs')]: {
			width : '90%'
		}
	}
}))

const MyGamesSaleCard = ({ data }) => {
	const cls = useStyles()
	const dispatch = useDispatch()
	const history = useHistory()
	const location = useLocation()

	const [ index, setIndex ] = useState(0)
	const [ openDialog, setOpenDialog ] = useState(false)
	const [ buyerUsername, setBuyerUsername ] = useState('')
	const [ finalPrice, setFinalPrice ] = useState(data.totalPrice)

	const { loading, success, error } = useSelector((state) => state.addToHistory)

	// useEffect(
	// 	() => {
	// 		if (success) {
	// 			setOpenDialog(false)
	// 			history.push('/collection')
	// 		}
	// 	},
	// 	[ history, location, success ]
	// )

	const handleIndex = (type) => {
		if (type === 'minus') {
			if (index > 0) {
				setIndex(index - 1)
			}
		}
		if (type === 'plus') {
			if (data.games.length > index + 1) {
				setIndex(index + 1)
			}
		}
	}

	const handleDialogOpen = () => {
		setOpenDialog(true)
	}

	const handleDialogClose = () => {
		setOpenDialog(false)
	}

	const deleteGameHandler = () => {
		dispatch(deleteGame(data._id))
	}

	const submitHandler = (e) => {
		e.preventDefault()
		dispatch(addGamesToHistory(data.games, buyerUsername, finalPrice, data._id))
	}

	return (
		<Card className={cls.root} elevation={2}>
			<Box py={1}>
				<CardMedia
					className={cls.media}
					component="img"
					image={
						data.games[index].thumbnail ? data.games[index].thumbnail : '/images/collCardPlaceholder.jpg'
					}
					alt={data.games[index].title}
					title={data.games[index].title}
				/>

				{data.sellType === 'pack' && (
					<Chip
						size="small"
						color="secondary"
						className={cls.overlayChip}
						label={`${data.games.length} pack`}
					/>
				)}
			</Box>

			<Divider />

			<CardContent className={cls.content}>
				<Typography component="div">
					<Box
						textAlign="center"
						display="flex"
						justifyContent="space-between"
						alignItems="center"
						fontWeight="fontWeightMedium"
						fontSize={14}
						minHeight={50}
						m={1}
					>
						{data.sellType === 'pack' ? (
							<Fragment>
								<IconButton disabled={index === 0} color="inherit" onClick={() => handleIndex('minus')}>
									<ArrowBackIcon fontSize="small" />
								</IconButton>
								<Box className={cls.title}>{data.games[index].title}</Box>
								<IconButton
									disabled={data.games.length === index + 1}
									onClick={() => handleIndex('plus')}
								>
									<ArrowForwardIcon fontSize="small" />
								</IconButton>
							</Fragment>
						) : (
							<Box width="100%" className={cls.title}>
								{data.games[index].title}
							</Box>
						)}
					</Box>
				</Typography>
			</CardContent>

			<Divider />

			<CardActions>
				<Box display="flex" justifyContent="center" alignItems="center" width="100%">
					<IconButton color="primary">
						<RefreshIcon />
					</IconButton>
					<IconButton onClick={handleDialogOpen} color="primary">
						<MonetizationOnOutlinedIcon />
					</IconButton>
					<IconButton onClick={deleteGameHandler} color="secondary">
						<DeleteOutlinedIcon />
					</IconButton>
				</Box>

				<Dialog open={openDialog} onClose={handleDialogClose} maxWidth="md">
					<DialogTitle disableTypography>
						<Typography variant="h6" align="center">
							For history purposes, type the buyers username and final price
						</Typography>
						<Typography variant="body2" color="textSecondary" align="center">
							Leave the fields blank if you want to skip this feature
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

								<Button
									className={cls.button}
									disabled={loading}
									type="submit"
									variant="contained"
									color="primary"
								>
									{loading ? <Loader color="inherit" size={24} /> : 'Sell'}
								</Button>
							</Box>
						</form>
					</DialogContent>
				</Dialog>
			</CardActions>
		</Card>
	)
}

export default MyGamesSaleCard
