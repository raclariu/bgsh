import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Link as RouterLink } from 'react-router-dom'
import { formatDistance, parseISO } from 'date-fns'
import Box from '@material-ui/core/Box'
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Chip from '@material-ui/core/Chip'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Avatar from '@material-ui/core/Avatar'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import BookmarkTwoToneIcon from '@material-ui/icons/BookmarkTwoTone'
import CenterFocusWeakTwoToneIcon from '@material-ui/icons/CenterFocusWeakTwoTone'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'
import StatsBoxes from './SingleGameScreen/StatsBoxes'

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

const GameIndexCardPack = ({ data }) => {
	const cls = useStyles()

	const [ index, setIndex ] = useState(0)

	const handleRatingBgColor = (stats) => {
		const { ratings, avgRating } = stats
		if (ratings > 30) {
			if (avgRating >= 9) {
				return '#186b40'
			} else if (avgRating >= 8) {
				return '#1d804c'
			} else if (avgRating >= 7) {
				return '#1978b3'
			} else if (avgRating >= 5) {
				return '#5369a2'
			} else if (avgRating >= 4) {
				return '#d71925'
			} else {
				return '#666e75'
			}
		} else {
			return '#666e75'
		}
	}

	const handleComplexityBgColor = (complexity) => {
		if (complexity.votes > 10) {
			if (complexity.weight > 3.01) {
				return '#f06524'
			} else if (complexity.weight > 0) {
				return '#3ec781'
			}
		} else {
			return '#666e75'
		}
	}

	const handleIndex = (type) => {
		if (type === 'minus') {
			if (index > 0) {
				setIndex(index - 1)
			}
			// else {
			// 	setIndex(data.games.length - 1)
			// }
		}
		if (type === 'plus') {
			if (data.games.length > index + 1) {
				setIndex(index + 1)
			}
			// } else if (data.games.length === index + 1) {
			// 	setIndex(0)
			// }
		}
	}

	return (
		<Card className={cls.root}>
			<Box bgcolor="grey.300" py={1}>
				<CardMedia
					className={cls.media}
					component="img"
					image={
						data.games[index].thumbnail ? data.games[index].thumbnail : '/images/collCardPlaceholder.jpg'
					}
					alt={data.games[index].title}
					title={data.games[index].title}
				/>

				<Typography component="div" variant="caption">
					<Box mt={1}>
						<StatsBoxes
							variant="mini"
							complexity={data.games[index].complexity}
							stats={data.games[index].stats}
						/>
					</Box>
				</Typography>

				{data.sellType === 'pack' && (
					<Chip
						size="small"
						color="secondary"
						className={cls.overlayChip}
						label={`${data.games.length} pack`}
					/>
				)}
			</Box>

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
						<IconButton disabled={index === 0} color="inherit" onClick={() => handleIndex('minus')}>
							<ArrowBackIcon fontSize="small" />
						</IconButton>
						<Box className={cls.title}>{data.games[index].title}</Box>
						<IconButton disabled={data.games.length === index + 1} onClick={() => handleIndex('plus')}>
							<ArrowForwardIcon fontSize="small" />
						</IconButton>
					</Box>

					<Divider />

					<Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" my={1}>
						<Box fontSize={12}>
							<Chip
								size="small"
								variant="outlined"
								label={`${data.games[index].type} • ${data.games[index].condition}`}
							/>
						</Box>

						<Box mt={0.5} fontSize={12}>
							<Chip
								size="small"
								variant="outlined"
								label={`${data.games[index].version.title} • ${data.games[index].version.year}`}
							/>
						</Box>
						<Box fontWeight="fontWeightMedium" mt={0.5}>
							<Chip color="primary" label={`${data.totalPrice} RON / ${data.games.length} games`} />
						</Box>
					</Box>
				</Typography>
			</CardContent>

			<Divider />

			<CardActions>
				<Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
					<Box display="flex" justifyContent="flex-start" alignItems="center">
						<Avatar className={cls.avatar} color="primary">
							<Box fontSize={12}>{data.seller.username.substring(0, 2).toUpperCase()}</Box>
						</Avatar>
						<Typography component="div">
							<Box fontSize={12} ml={1}>
								{formatDistance(parseISO(data.createdAt), new Date(), { addSuffix: true })}
							</Box>
						</Typography>
					</Box>

					<Box display="flex" justifyContent="flex-end" alignItems="center">
						<IconButton component={RouterLink} to={{ pathname: `/games/${data.altId}` }} color="primary">
							<CenterFocusWeakTwoToneIcon fontSize="small" />
						</IconButton>

						<IconButton color="secondary">
							<BookmarkTwoToneIcon fontSize="small" />
						</IconButton>
					</Box>
				</Box>
			</CardActions>
		</Card>
	)
}

export default GameIndexCardPack
