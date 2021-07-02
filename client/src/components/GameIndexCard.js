import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Link as RouterLink } from 'react-router-dom'
import { formatDistance, parseISO } from 'date-fns'
import Box from '@material-ui/core/Box'
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Chip from '@material-ui/core/Chip'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Avatar from '@material-ui/core/Avatar'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import BookmarkTwoToneIcon from '@material-ui/icons/BookmarkTwoTone'
import CenterFocusWeakTwoToneIcon from '@material-ui/icons/CenterFocusWeakTwoTone'
import ArrowRightIcon from '@material-ui/icons/ArrowRight'
import LocalOfferTwoToneIcon from '@material-ui/icons/LocalOfferTwoTone'

const useStyles = makeStyles((theme) => ({
	media   : {
		objectFit : 'contain',
		height    : '180px'
		//objectPosition : 'center 10%'
		//width          : '75%'
	},
	// overlayChip : {
	// 	position        : 'absolute',
	// 	top             : '8px',
	// 	left            : '2px',
	// 	backgroundColor : theme.palette.primary.main,
	// 	color           : '#fff'
	// 	// backgroundColor : 'white',
	// 	// width    : '20%',
	// 	// height   : '40px'
	// 	//textAlign       : 'center'
	// },
	content : {
		padding   : 0,
		marginTop : theme.spacing(1)
	},
	avatar  : {
		width           : theme.spacing(4),
		height          : theme.spacing(4),
		backgroundColor : theme.palette.primary.main
	}
}))

const SingleSellGameCard = ({ data }) => {
	const cls = useStyles()

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

	return (
		<Card className={cls.root}>
			<Box bgcolor="grey.300" py={1}>
				<CardMedia
					className={cls.media}
					component="img"
					image={data.games[0].thumbnail ? data.games[0].thumbnail : '/images/collCardPlaceholder.jpg'}
					alt={data.games[0].title}
					title={data.games[0].title}
				/>
				<Typography component="div" variant="caption">
					<Box display="flex" justifyContent="center" alignItems="center" width="100%" mt={1}>
						<Box
							color="#fff"
							p={1}
							textAlign="center"
							fontWeight="fontWeightMedium"
							minWidth={45}
							boxShadow={2}
							borderRadius={4}
							bgcolor={handleRatingBgColor(data.games[0].stats)}
						>
							{data.games[0].stats.avgRating}
						</Box>

						<Box
							color="#fff"
							p={1}
							ml={1}
							textAlign="center"
							fontWeight="fontWeightMedium"
							minWidth={45}
							boxShadow={2}
							borderRadius={4}
							bgcolor={data.games[0].stats.rank <= 100 ? '#d4b215' : '#666e75'}
						>
							{data.games[0].stats.rank}
						</Box>

						<Box
							color="#fff"
							p={1}
							textAlign="center"
							fontWeight="fontWeightMedium"
							minWidth={45}
							ml={1}
							boxShadow={2}
							borderRadius={4}
							bgcolor={handleComplexityBgColor(data.games[0].complexity)}
						>
							{data.games[0].complexity.weight}
						</Box>
					</Box>
				</Typography>
			</Box>

			<CardContent className={cls.content}>
				<Typography component="div">
					<Box
						textAlign="center"
						display="flex"
						justifyContent="center"
						alignItems="center"
						fontWeight="fontWeightMedium"
						fontSize={15}
						minHeight={50}
						m={1}
					>
						{data.games[0].title}
					</Box>

					<Divider />

					<Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" my={1}>
						<Box>
							<Chip
								size="small"
								variant="outlined"
								label={`${data.games[0].type} • ${data.games[0].condition}`}
							/>
						</Box>

						<Box mt={0.5}>
							<Chip
								size="small"
								variant="outlined"
								label={`${data.games[0].version.title} • ${data.games[0].version.year}`}
							/>
						</Box>
						<Box fontWeight="fontWeightMedium" mt={0.5}>
							<Chip color="primary" label={`${data.totalPrice} RON`} />
						</Box>
					</Box>
				</Typography>
			</CardContent>

			<Divider />

			<CardActions>
				<Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
					<Box display="flex" justifyContent="flex-start" alignItems="center">
						<Avatar className={cls.avatar} color="primary">
							<Box fontSize={12}>JO</Box>
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

export default SingleSellGameCard
