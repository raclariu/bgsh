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
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'

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

const SavedGameCard = ({ data }) => {
	const cls = useStyles()

	const [ index, setIndex ] = useState(0)

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
				<Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
					<Button
						size="small"
						color="primary"
						href={`https://boardgamegeek.com/boardgame/${data.games[index].bggId}`}
						target="_blank"
						rel="noopener"
					>
						BGG
					</Button>

					<Box display="flex" justifyContent="flex-end" alignItems="center">
						<IconButton component={RouterLink} to={{ pathname: `/games/${data.altId}` }} color="primary">
							<CenterFocusWeakTwoToneIcon fontSize="small" />
						</IconButton>
					</Box>
				</Box>
			</CardActions>
		</Card>
	)
}

export default SavedGameCard
