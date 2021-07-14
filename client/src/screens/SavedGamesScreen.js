import React, { Fragment, useEffect } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import Box from '@material-ui/core/Box'
import IconButton from '@material-ui/core/IconButton'
import CenterFocusWeakTwoToneIcon from '@material-ui/icons/CenterFocusWeakTwoTone'

import { getSavedGames } from '../actions/gameActions'
import { SAVED_GAMES_RESET } from '../constants/gameConstants'

const useStyles = makeStyles((theme) => ({
	root        : {
		height : '300px'
	},
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

const SavedGamesScreen = () => {
	const cls = useStyles()
	const dispatch = useDispatch()

	const savedGamesList = useSelector((state) => state.savedGamesList)
	const { loading, success, error, list } = savedGamesList

	useEffect(
		() => {
			dispatch(getSavedGames())

			return () => {
				dispatch({ type: SAVED_GAMES_RESET })
			}
		},
		[ dispatch ]
	)

	return (
		<Fragment>
			{success && (
				<Grid container spacing={2}>
					{list.map((game) => (
						<Grid item xs={12} sm={4}>
							<Card elevation={2} className={cls.root}>
								<CardMedia
									className={cls.media}
									component="img"
									alt={game.games[0].title}
									image={
										game.games[0].thumbnail ? (
											game.games[0].thumbnail
										) : (
											'/images/collCardPlaceholder.jpg'
										)
									}
									title={game.games[0].title}
								/>

								<Divider />

								<CardContent className={cls.cardContent}>
									<Typography className={cls.title} align="center" variant="body2" component="p">
										{game.games[0].title} ({game.games[0].year})
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
										<Box display="flex" justifyContent="flex-end" alignItems="center">
											<IconButton
												component={RouterLink}
												to={{ pathname: `/games/${game.altId}` }}
												color="primary"
											>
												<CenterFocusWeakTwoToneIcon fontSize="small" />
											</IconButton>
										</Box>
									</Grid>
								</CardActions>
							</Card>
						</Grid>
					))}
				</Grid>
			)}
		</Fragment>
	)
}

export default SavedGamesScreen
