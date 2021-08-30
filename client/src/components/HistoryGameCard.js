// @ Libraries
import React, { Fragment, useState } from 'react'
import { useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import { format, formatDistance, parseISO } from 'date-fns'

// @ Mui
import Box from '@material-ui/core/Box'
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import Chip from '@material-ui/core/Chip'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'

// @ Icons
import EventAvailableOutlinedIcon from '@material-ui/icons/EventAvailableOutlined'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'

// @ Styles
const useStyles = makeStyles((theme) => ({
	card        : {
		position : 'relative'
	},
	media       : {
		margin    : theme.spacing(1, 0, 1, 0),
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
const HistoryGameCard = ({ gameId, page }) => {
	const cls = useStyles()

	const [ index, setIndex ] = useState(0)

	const data = useSelector((state) => {
		if (page === 'sold') {
			return state.soldHistory.soldList.find((obj) => obj._id === gameId)
		}

		if (page === 'traded') {
			return state.tradedHistory.tradedList.find((obj) => obj._id === gameId)
		}
	})

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

			{data.games.length > 1 && (
				<Chip size="small" color="secondary" className={cls.overlayChip} label={`${data.games.length} pack`} />
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
							<Box className={cls.title}>{data.games[index].title}</Box>
							<IconButton disabled={data.games.length === index + 1} onClick={() => handleIndex('plus')}>
								<ArrowForwardIcon fontSize="small" />
							</IconButton>
						</Fragment>
					) : (
						<Box className={cls.title}>{data.games[index].title}</Box>
					)}
				</Box>
			</CardContent>

			<Divider />

			<CardContent>
				<Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
					{data.mode === 'sell' && <Box textAlign="center">Bought by: {data.buyer ? data.buyer : 'N/A'}</Box>}

					{data.mode === 'trade' && (
						<Box textAlign="center">Traded to: {data.buyer ? data.buyer : 'N/A'}</Box>
					)}

					{data.mode === 'sell' && (
						<Box textAlign="center">RON {data.finalPrice ? data.finalPrice : 'N/A'}</Box>
					)}

					<Box display="flex" alignItems="center">
						<Tooltip
							disableFocusListener
							title={format(parseISO(data.createdAt), 'iiii i MMMM y, H:mm', {
								weekStartsOn : 1
							})}
						>
							<EventAvailableOutlinedIcon fontSize="small" />
						</Tooltip>
						<Box textAlign="center" ml={0.5}>
							{formatDistance(parseISO(data.createdAt), new Date(), { addSuffix: true })}
						</Box>
					</Box>
				</Box>
			</CardContent>
		</Card>
	)
}

export default HistoryGameCard
