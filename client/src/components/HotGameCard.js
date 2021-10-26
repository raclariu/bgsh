// @ Libraries
import React from 'react'
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

// @ Components
import CustomTooltip from './CustomTooltip'

// @ Styles
const useStyles = makeStyles((theme) => ({
	media : {
		margin    : theme.spacing(1, 0, 1, 0),
		padding   : theme.spacing(0, 1, 0, 1),
		objectFit : 'contain',
		height    : '180px'
	},
	title : {
		display         : '-webkit-box',
		WebkitLineClamp : '2',
		WebkitBoxOrient : 'vertical',
		overflow        : 'hidden',
		width           : '100%',
		textAlign       : 'center'
	}
}))

// @ Main
const HotGameCard = ({ bggId }) => {
	const cls = useStyles()

	const game = useSelector((state) => state.bggHotGames.hotList.find((obj) => obj.bggId === bggId))

	return (
		<Card elevation={2}>
			<CardMedia
				className={cls.media}
				component="img"
				alt={game.title}
				image={game.thumbnail ? game.thumbnail : '/images/collCardPlaceholder.jpg'}
				title={game.title}
			/>

			<Divider />

			<CardContent>
				<Box
					display="flex"
					justifyContent="center"
					alignItems="center"
					fontWeight="fontWeightMedium"
					minHeight="3rem"
				>
					<Box className={cls.title}>
						{game.title} {game.year ? `(${game.year})` : ''}
					</Box>
				</Box>
			</CardContent>

			<Divider />

			<CardActions>
				<CustomTooltip title="Check on BGG">
					<Box display="flex" justifyContent="flex-end" width="100%">
						<Button
							color="primary"
							href={`https://boardgamegeek.com/boardgame/${game.bggId}`}
							target="_blank"
							rel="noopener"
						>
							BGG
						</Button>
					</Box>
				</CustomTooltip>
			</CardActions>
		</Card>
	)
}

export default HotGameCard
