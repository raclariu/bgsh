// @ Libraries
import React, { Fragment, useState } from 'react'
import { styled } from '@mui/material/styles'
import { useSelector } from 'react-redux'
import { Link as RouterLink } from 'react-router-dom'

// @ Mui
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'

// @ icons
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined'
import SwapHorizontalCircleOutlinedIcon from '@mui/icons-material/SwapHorizontalCircleOutlined'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

// @ Components
import GameDetailsButton from './GameDetailsButton'
import CustomTooltip from './CustomTooltip'

const PREFIX = 'SavedGameCard'

const classes = {
	card          : `${PREFIX}-card`,
	media         : `${PREFIX}-media`,
	overlayTop    : `${PREFIX}-overlayTop`,
	overlayBottom : `${PREFIX}-overlayBottom`,
	title         : `${PREFIX}-title`,
	avatar        : `${PREFIX}-avatar`
}

const StyledCard = styled(Card)(({ theme }) => ({
	[`&.${classes.card}`]: {
		position : 'relative'
	},

	[`& .${classes.media}`]: {
		margin    : theme.spacing(1, 0, 1, 0),
		padding   : theme.spacing(0, 1, 0, 1),
		objectFit : 'contain',
		height    : '180px'
	},

	[`& .${classes.overlayTop}`]: {
		position : 'absolute',
		top      : '8px',
		left     : '8px'
	},

	[`& .${classes.overlayBottom}`]: {
		position : 'absolute',
		top      : '36px',
		left     : '8px'
	},

	[`& .${classes.title}`]: {
		display         : '-webkit-box',
		WebkitLineClamp : '2',
		WebkitBoxOrient : 'vertical',
		overflow        : 'hidden',
		width           : '100%',
		textAlign       : 'center'
	},

	[`& .${classes.avatar}`]: {
		width           : theme.spacing(4),
		height          : theme.spacing(4),
		backgroundColor : theme.palette.primary.main
	}
}))

// @ Main
const SavedGameCard = ({ data }) => {
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
		<StyledCard className={classes.card} elevation={1}>
			<CardMedia
				className={classes.media}
				component="img"
				image={data.games[index].thumbnail ? data.games[index].thumbnail : '/images/gameImgPlaceholder.jpg'}
				alt={data.games[index].title}
				title={data.games[index].title}
			/>

			{data.isPack && (
				<Fragment>
					<Chip
						size="small"
						color="secondary"
						className={classes.overlayTop}
						label={`${data.games.length} pack`}
					/>

					{data.mode === 'sell' && (
						<CustomTooltip title="For sale">
							<Box className={classes.overlayBottom}>
								<MonetizationOnOutlinedIcon color="secondary" />
							</Box>
						</CustomTooltip>
					)}

					{data.mode === 'trade' && (
						<CustomTooltip title="For trade">
							<Box className={classes.overlayBottom}>
								<SwapHorizontalCircleOutlinedIcon color="secondary" />
							</Box>
						</CustomTooltip>
					)}
				</Fragment>
			)}

			{!data.isPack &&
			data.mode === 'sell' && (
				<CustomTooltip title="For sale">
					<Box className={classes.overlayTop}>
						<MonetizationOnOutlinedIcon color="secondary" />
					</Box>
				</CustomTooltip>
			)}

			{!data.isPack &&
			data.mode === 'trade' && (
				<CustomTooltip title="For trade">
					<Box className={classes.overlayTop}>
						<SwapHorizontalCircleOutlinedIcon color="secondary" />
					</Box>
				</CustomTooltip>
			)}

			<Divider />

			<CardContent>
				<Box
					display="flex"
					justifyContent={data.isPack ? 'space-between' : 'center'}
					alignItems="center"
					fontWeight="fontWeightMedium"
					minHeight="3rem"
				>
					{data.isPack ? (
						<Fragment>
							<IconButton
								color="primary"
								disabled={index === 0}
								onClick={() => handleIndex('minus')}
								size="large"
							>
								<ArrowBackIcon fontSize="small" />
							</IconButton>
							<Box className={classes.title}>
								{data.games[index].title} ({data.games[index].year})
							</Box>
							<IconButton
								color="primary"
								disabled={data.games.length === index + 1}
								onClick={() => handleIndex('plus')}
								size="large"
							>
								<ArrowForwardIcon fontSize="small" />
							</IconButton>
						</Fragment>
					) : (
						<Box className={classes.title}>
							{data.games[index].title} ({data.games[index].year})
						</Box>
					)}
				</Box>
			</CardContent>

			<Divider />

			<CardActions>
				<Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
					<CustomTooltip title="See on BGG">
						<Button
							color="primary"
							href={`https://boardgamegeek.com/boardgame/${data.games[index].bggId}`}
							target="_blank"
							rel="noopener"
						>
							BGG
						</Button>
					</CustomTooltip>

					<GameDetailsButton altId={data.altId} />
				</Box>
			</CardActions>
		</StyledCard>
	)
}

export default SavedGameCard
