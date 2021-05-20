import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import Checkbox from '@material-ui/core/Checkbox'
import Grow from '@material-ui/core/Grow'
import AddBoxOutlinedIcon from '@material-ui/icons/AddBoxOutlined'

const useStyles = makeStyles((theme) => ({
	media       : {
		margin    : theme.spacing(2, 0, 2, 0),
		objectFit : 'contain',
		height    : '150px'
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

const CollectionGameCard = ({ game, saleListHandler, id, isChecked, isDisabled }) => {
	const cls = useStyles()

	return (
		<Grow in>
			<Card elevation={2}>
				<CardMedia
					className={cls.media}
					component="img"
					alt={game.title}
					image={game.thumbnail ? game.thumbnail : '/images/collCardPlaceholder.jpg'}
					title={game.title}
				/>

				<Divider />

				<CardContent className={cls.cardContent}>
					<Typography className={cls.title} align="center" variant="body2" component="p">
						{game.title} ({game.year})
					</Typography>
				</CardContent>

				<CardActions>
					<Grid container direction="row" justify="space-between" alignItems="center">
						<Grid item>
							<Button
								size="small"
								color="primary"
								href={`https://boardgamegeek.com/boardgame/${game.bggId}`}
								target="_blank"
								rel="noopener"
							>
								BGG
							</Button>
						</Grid>
						<Checkbox
							checked={isChecked}
							disabled={isDisabled}
							onChange={(e) => saleListHandler(e, id)}
							icon={<AddBoxOutlinedIcon />}
							size="small"
						/>
					</Grid>
				</CardActions>
			</Card>
		</Grow>
	)
}

export default CollectionGameCard
