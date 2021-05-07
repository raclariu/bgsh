import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'

const useStyles = makeStyles((theme) => ({
	media       : {
		margin    : theme.spacing(2, 0, 2, 0),
		objectFit : 'contain'
	},
	cardContent : {
		padding : '0px'
	},
	title       : {
		margin     : theme.spacing(2, 0, 1, 0),
		padding    : theme.spacing(0, 2, 0, 2),
		minHeight  : '40px',
		fontWeight : '500'
	}
}))

const CollectionGameCard = ({ game }) => {
	const cls = useStyles()

	return (
		<Card elevation={3}>
			<CardMedia
				className={cls.media}
				component="img"
				height="150"
				alt={game.title}
				image={game.thumbnail}
				title={game.title}
			/>

			<Divider />

			<CardContent className={cls.cardContent}>
				<Typography className={cls.title} align="center" variant="body2" component="p">
					{game.title} ({game.year})
				</Typography>
			</CardContent>

			<CardActions>
				<ButtonGroup size="small" color="primary" fullWidth>
					<Button href={`https://boardgamegeek.com/boardgame/${game.bggId}`} target="_blank" rel="noopener">
						BGG
					</Button>
					<Button>Sell</Button>
				</ButtonGroup>
			</CardActions>
		</Card>
	)
}

export default CollectionGameCard
