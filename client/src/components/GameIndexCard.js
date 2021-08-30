// @ Libraries
import React, { Fragment, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link as RouterLink } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import { formatDistance, parseISO } from 'date-fns'

// @ Mui
import Box from '@material-ui/core/Box'
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Chip from '@material-ui/core/Chip'
import Avatar from '@material-ui/core/Avatar'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'

// @ Icons
import CenterFocusWeakTwoToneIcon from '@material-ui/icons/CenterFocusWeakTwoTone'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'

// @ Components
import StatsBoxes from './SingleGameScreen/StatsBoxes'

// @ Styles
const useStyles = makeStyles((theme) => ({
	card        : {
		position : 'relative'
	},
	media       : {
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
const GameIndexCard = ({ gameId }) => {
	const cls = useStyles()

	const [ index, setIndex ] = useState(0)

	const data = useSelector((state) => state.gamesIndex.gamesData.find((obj) => obj._id === gameId))

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

				<Box display="flex" justifyContent="center" alignItems="center" width="100%" mt={1}>
					<Box>
						<StatsBoxes
							variant="mini"
							complexity={data.games[index].complexity}
							stats={data.games[index].stats}
							type="rating"
						/>
					</Box>
					<Box ml={1}>
						<StatsBoxes
							variant="mini"
							complexity={data.games[index].complexity}
							stats={data.games[index].stats}
							type="rank"
						/>
					</Box>
					<Box ml={1}>
						<StatsBoxes
							variant="mini"
							complexity={data.games[index].complexity}
							stats={data.games[index].stats}
							type="complexity"
						/>
					</Box>
				</Box>
			</Box>

			{data.type === 'pack' && (
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
							<IconButton disabled={index === 0} color="inherit" onClick={() => handleIndex('minus')}>
								<ArrowBackIcon fontSize="small" />
							</IconButton>
							<Box className={cls.title}>{data.games[index].title}</Box>
							<IconButton disabled={data.games.length === index + 1} onClick={() => handleIndex('plus')}>
								<ArrowForwardIcon fontSize="small" />
							</IconButton>
						</Fragment>
					) : (
						<Box width="100%" className={cls.title}>
							{data.games[index].title}
						</Box>
					)}
				</Box>
			</CardContent>
			<Divider />

			<CardContent>
				<Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
					<Chip
						size="small"
						variant="outlined"
						label={`${data.games[index].type} • ${data.games[index].condition}`}
					/>

					<Box mt={0.5}>
						<Chip
							size="small"
							variant="outlined"
							label={`${data.games[index].version.title} • ${data.games[index].version.year}`}
						/>
					</Box>

					{data.mode === 'sell' && (
						<Box fontWeight="fontWeightMedium" mt={0.5}>
							<Chip color="primary" label={`${data.totalPrice} RON`} />
						</Box>
					)}
				</Box>
			</CardContent>

			<Divider />

			<CardActions>
				<Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
					<Box display="flex" justifyContent="center" alignItems="center">
						<Avatar className={cls.avatar} color="primary">
							<Box fontSize={12}>{data.seller.username.substring(0, 2).toUpperCase()}</Box>
						</Avatar>

						<Box fontSize={12} ml={1}>
							{formatDistance(parseISO(data.createdAt), new Date(), { addSuffix: true })}
						</Box>
					</Box>

					<Box display="flex" justifyContent="center" alignItems="center">
						<IconButton component={RouterLink} to={{ pathname: `/games/${data.altId}` }} color="primary">
							<CenterFocusWeakTwoToneIcon fontSize="small" />
						</IconButton>
					</Box>
				</Box>
			</CardActions>
		</Card>
	)
}

export default GameIndexCard
