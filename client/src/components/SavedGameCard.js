// @ Libraries
import React, { Fragment, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link as RouterLink } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'

// @ Mui
import Box from '@material-ui/core/Box'
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Chip from '@material-ui/core/Chip'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'

// @ icons
import MonetizationOnOutlinedIcon from '@material-ui/icons/MonetizationOnOutlined'
import SwapHorizontalCircleOutlinedIcon from '@material-ui/icons/SwapHorizontalCircleOutlined'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'

// @ Components
import GameDetailsButton from './GameDetailsButton'
import CustomTooltip from './CustomTooltip'

// @ Styles
const useStyles = makeStyles((theme) => ({
	card          : {
		position : 'relative'
	},
	media         : {
		margin    : theme.spacing(1, 0, 1, 0),
		padding   : theme.spacing(0, 1, 0, 1),
		objectFit : 'contain',
		height    : '180px'
	},
	overlayTop    : {
		position : 'absolute',
		top      : '8px',
		left     : '8px'
	},
	overlayBottom : {
		position : 'absolute',
		top      : '36px',
		left     : '8px'
	},
	title         : {
		display         : '-webkit-box',
		WebkitLineClamp : '2',
		WebkitBoxOrient : 'vertical',
		overflow        : 'hidden',
		width           : '100%',
		textAlign       : 'center'
	},
	avatar        : {
		width           : theme.spacing(4),
		height          : theme.spacing(4),
		backgroundColor : theme.palette.primary.main
	}
}))

// @ Main
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
		<Card className={cls.card} elevation={1}>
			<CardMedia
				className={cls.media}
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
						className={cls.overlayTop}
						label={`${data.games.length} pack`}
					/>

					{data.mode === 'sell' && (
						<CustomTooltip title="For sale">
							<Box className={cls.overlayBottom}>
								<MonetizationOnOutlinedIcon color="secondary" />
							</Box>
						</CustomTooltip>
					)}

					{data.mode === 'trade' && (
						<CustomTooltip title="For trade">
							<Box className={cls.overlayBottom}>
								<SwapHorizontalCircleOutlinedIcon color="secondary" />
							</Box>
						</CustomTooltip>
					)}
				</Fragment>
			)}

			{!data.isPack &&
			data.mode === 'sell' && (
				<CustomTooltip title="For sale">
					<Box className={cls.overlayTop}>
						<MonetizationOnOutlinedIcon color="secondary" />
					</Box>
				</CustomTooltip>
			)}

			{!data.isPack &&
			data.mode === 'trade' && (
				<CustomTooltip title="For trade">
					<Box className={cls.overlayTop}>
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
							<IconButton color="primary" disabled={index === 0} onClick={() => handleIndex('minus')}>
								<ArrowBackIcon fontSize="small" />
							</IconButton>
							<Box className={cls.title}>
								{data.games[index].title} ({data.games[index].year})
							</Box>
							<IconButton
								color="primary"
								disabled={data.games.length === index + 1}
								onClick={() => handleIndex('plus')}
							>
								<ArrowForwardIcon fontSize="small" />
							</IconButton>
						</Fragment>
					) : (
						<Box className={cls.title}>
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
		</Card>
	)
}

export default SavedGameCard
