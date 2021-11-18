// @ Libraries
import React, { Fragment, useState } from 'react'
import { useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'

// @ Mui
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Box from '@material-ui/core/Box'
import Divider from '@material-ui/core/Divider'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import Chip from '@material-ui/core/Chip'

// @ icons
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'

// @ Components
import CustomTooltip from '../CustomTooltip'
import GameDetailsButton from '../GameDetailsButton'

// @ Styles
const useStyles = makeStyles((theme) => ({
	card       : {
		position : 'relative'
	},
	media      : {
		margin    : theme.spacing(1, 0, 1, 0),
		padding   : theme.spacing(0, 1, 0, 1),
		objectFit : 'contain',
		height    : '180px'
	},
	overlayTop : {
		position : 'absolute',
		top      : '8px',
		left     : '8px'
	},
	title      : {
		display         : '-webkit-box',
		WebkitLineClamp : '2',
		WebkitBoxOrient : 'vertical',
		overflow        : 'hidden',
		width           : '100%',
		textAlign       : 'center'
	}
}))

// @ Main
const UserProfileGameCard = ({ gameId, type }) => {
	const cls = useStyles()

	const data = useSelector((state) => {
		if (type === 'sale') {
			return state.userProfileData.saleGames.find((obj) => obj._id === gameId)
		}

		if (type === 'trade') {
			return state.userProfileData.tradeGames.find((obj) => obj._id === gameId)
		}

		if (type === 'wanted') {
			return state.userProfileData.wantedGames.find((obj) => obj._id === gameId)
		}
	})

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
				alt={data.games[index].title}
				image={data.games[index].thumbnail ? data.games[index].thumbnail : '/images/gameImgPlaceholder.jpg'}
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
				</Fragment>
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

export default UserProfileGameCard
