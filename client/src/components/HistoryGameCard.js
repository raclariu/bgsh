// @ Libraries
import React, { Fragment, useState } from 'react'
import { useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'

// @ Mui
import Box from '@material-ui/core/Box'
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import Chip from '@material-ui/core/Chip'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'

// @ Components
import CustomAvatar from './CustomAvatar'
import CustomTooltip from './CustomTooltip'

// @ Icons
import EventAvailableOutlinedIcon from '@material-ui/icons/EventAvailableOutlined'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'

// @ Others
import { calculateTimeAgo, formatDate } from '../helpers/helpers'

// @ Styles
const useStyles = makeStyles((theme) => ({
	card        : {
		position : 'relative'
	},
	media       : {
		margin    : theme.spacing(1, 0, 1, 0),
		padding   : theme.spacing(0, 1, 0, 1),
		objectFit : 'contain',
		height    : '180px'
	},
	overlayChip : {
		position : 'absolute',
		top      : '8px',
		left     : '8px'
	},
	title       : {
		display         : '-webkit-box',
		WebkitLineClamp : '2',
		WebkitBoxOrient : 'vertical',
		overflow        : 'hidden',
		width           : '100%',
		textAlign       : 'center'
	},
	avatar      : {
		width           : theme.spacing(4),
		height          : theme.spacing(4),
		backgroundColor : theme.palette.primary.main
	}
}))

// @ Main
const HistoryGameCard = ({ data }) => {
	const cls = useStyles()

	const [ index, setIndex ] = useState(0)

	// const data = useSelector((state) => {
	// 	if (page === 'sold') {
	// 		return state.soldHistory.soldList.find((obj) => obj._id === gameId)
	// 	}

	// 	if (page === 'traded') {
	// 		return state.tradedHistory.tradedList.find((obj) => obj._id === gameId)
	// 	}
	// })

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

			{data.games.length > 1 && (
				<Chip size="small" color="secondary" className={cls.overlayChip} label={`${data.games.length} pack`} />
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

			<CardContent>
				<Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
					{data.mode === 'sell' && (
						<Box fontWeight="fontWeightMedium">
							<Chip color="primary" label={data.finalPrice ? data.finalPrice + ' RON' : 'N/A'} />
						</Box>
					)}

					{data.buyer ? (
						<Box my={1} display="flex" alignItems="center">
							<CustomAvatar size="medium" user={data.buyer} />
							<Box ml={1}>{data.buyer}</Box>
						</Box>
					) : (
						'N/A'
					)}

					<Box display="flex" alignItems="center">
						<CustomTooltip title={formatDate(data.createdAt)}>
							<EventAvailableOutlinedIcon fontSize="small" />
						</CustomTooltip>

						<Box textAlign="center" ml={0.5}>
							{calculateTimeAgo(data.createdAt)}
						</Box>
					</Box>
				</Box>
			</CardContent>
		</Card>
	)
}

export default HistoryGameCard
