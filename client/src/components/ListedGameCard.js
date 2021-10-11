// @ Libraries
import React, { Fragment, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'

// @ Mui
import Box from '@material-ui/core/Box'
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Chip from '@material-ui/core/Chip'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'

// @ Icons
import MonetizationOnOutlinedIcon from '@material-ui/icons/MonetizationOnOutlined'
import SwapHorizontalCircleOutlinedIcon from '@material-ui/icons/SwapHorizontalCircleOutlined'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'

// @ Components
import ActiveAddHistoryButton from './ActiveAddHistoryButton'
import GameDetailsButton from './GameDetailsButton'

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
	}
}))

// @ Main
const ListedGameCard = ({ data }) => {
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
		<Card className={cls.card} elevation={2}>
			<CardMedia
				className={cls.media}
				component="img"
				image={data.games[index].thumbnail ? data.games[index].thumbnail : '/images/collCardPlaceholder.jpg'}
				alt={data.games[index].title}
				title={data.games[index].title}
			/>

			{data.type === 'pack' && (
				<Fragment>
					<Chip
						size="small"
						color="secondary"
						className={cls.overlayTop}
						label={`${data.games.length} pack`}
					/>

					{data.mode === 'sell' && (
						<Tooltip title="For sale">
							<Box className={cls.overlayBottom}>
								<MonetizationOnOutlinedIcon color="secondary" />
							</Box>
						</Tooltip>
					)}

					{data.mode === 'trade' && (
						<Tooltip title="For trade">
							<Box className={cls.overlayBottom}>
								<SwapHorizontalCircleOutlinedIcon color="secondary" />
							</Box>
						</Tooltip>
					)}
				</Fragment>
			)}

			{data.type === 'individual' &&
			data.mode === 'sell' && (
				<Tooltip title="For sale">
					<Box className={cls.overlayTop}>
						<MonetizationOnOutlinedIcon color="secondary" />
					</Box>
				</Tooltip>
			)}

			{data.type === 'individual' &&
			data.mode === 'trade' && (
				<Tooltip title="For trade">
					<Box className={cls.overlayTop}>
						<SwapHorizontalCircleOutlinedIcon color="secondary" />
					</Box>
				</Tooltip>
			)}

			<Divider />

			<CardContent>
				<Box
					display="flex"
					justifyContent={data.type === 'pack' ? 'space-between' : 'center'}
					alignItems="center"
					fontWeight="fontWeightMedium"
					minHeight="3rem"
				>
					{data.type === 'pack' ? (
						<Fragment>
							<IconButton disabled={index === 0} onClick={() => handleIndex('minus')}>
								<ArrowBackIcon fontSize="small" />
							</IconButton>
							<Box className={cls.title}>
								{data.games[index].title} ({data.games[index].year})
							</Box>
							<IconButton disabled={data.games.length === index + 1} onClick={() => handleIndex('plus')}>
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
				<Box display="flex" justifyContent="center" alignItems="center" width="100%">
					<ActiveAddHistoryButton gameId={data._id} isActive={data.isActive} display="reactivate" />
					<ActiveAddHistoryButton
						games={data.games}
						price={data.totalPrice}
						gameId={data._id}
						mode={data.mode}
						display="add"
					/>

					<GameDetailsButton altId={data.altId} />

					<ActiveAddHistoryButton gameId={data._id} display="delete" />
				</Box>
			</CardActions>
		</Card>
	)
}

export default ListedGameCard
