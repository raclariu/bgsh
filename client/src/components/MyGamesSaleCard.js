import React, { Fragment, useState } from 'react'
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

import CenterFocusWeakTwoToneIcon from '@material-ui/icons/CenterFocusWeakTwoTone'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'

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
	}
}))

const MyGamesSaleCard = ({ data }) => {
	const cls = useStyles()

	const [ index, setIndex ] = useState(0)
	const [ openDialog, setOpenDialog ] = useState(false)
	const [ buyerUsername, setBuyerUsername ] = useState('')

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

	const handleSubmit = (e) => {
		console.log(buyerUsername)
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
				<ButtonGroup size="small">
					<Button>Reactivate</Button>
					<Button onClick={handleDialogOpen}>Sold</Button>
				</ButtonGroup>
				<Dialog open={openDialog} onClose={handleDialogClose} maxWidth="md">
					<DialogTitle disableTypography>
						<Typography variant="h6">
							For history purposes, type the username of the person who bought this game
						</Typography>
						<Typography variant="body2" color="textSecondary">
							You may leave the field blank if you do not wish to use this feature
						</Typography>
					</DialogTitle>

					<DialogContent>
						<Box display="flex" justifyContent="center" alignItems="center">
							<TextField
								cls={cls.textfield}
								//error={error && error.emailError ? true : false}
								//helperText={error ? error.emailError : false}
								onChange={(e) => setBuyerUsername(e.target.value)}
								value={buyerUsername}
								variant="outlined"
								id="username"
								name="username"
								label="Username"
								type="text"
								size="small"
								autoFocus
							/>
							<Box ml={1}>
								<Button variant="contained" color="primary" onClick={handleSubmit}>
									Sell
								</Button>
							</Box>
						</Box>
					</DialogContent>
				</Dialog>
			</CardActions>
		</Card>
	)
}

export default MyGamesSaleCard
