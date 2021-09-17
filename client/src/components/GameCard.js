// @ Libraries
import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'

// @ Mui
import Box from '@material-ui/core/Box'
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import Checkbox from '@material-ui/core/Checkbox'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'

// @ Icons
import AddBoxOutlinedIcon from '@material-ui/icons/AddBoxOutlined'
import SearchIcon from '@material-ui/icons/Search'

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
const GameCard = ({ bggId, saleListHandler, isChecked, isDisabled, page }) => {
	const cls = useStyles()

	const game = useSelector((state) => {
		if (page === 'collection') {
			return state.dbCollection.collection.find((obj) => obj.bggId === bggId)
		}

		if (page === 'wishlist') {
			return state.wishlist.wishlist.find((obj) => obj.bggId === bggId)
		}
	})

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
						{game.title} ({game.year})
					</Box>
				</Box>
			</CardContent>

			<Divider />

			<CardActions>
				<Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" width="100%">
					<Tooltip disableFocusListener title="Check on BGG">
						<Button
							color="primary"
							href={`https://boardgamegeek.com/boardgame/${game.bggId}`}
							target="_blank"
							rel="noopener"
						>
							BGG
						</Button>
					</Tooltip>

					{page === 'collection' && (
						<Tooltip disableFocusListener title={isChecked ? 'Remove from list' : 'Add to list'}>
							<Checkbox
								checked={isChecked}
								disabled={isDisabled}
								onChange={(e) => saleListHandler(e, game.bggId)}
								icon={<AddBoxOutlinedIcon />}
							/>
						</Tooltip>
					)}
					{page === 'wishlist' && (
						<Tooltip disableFocusListener title="Search this game on market">
							<IconButton
								color="primary"
								component={RouterLink}
								to={`/games?search=${game.title.toLowerCase()}`}
							>
								<SearchIcon fontSize="small" />
							</IconButton>
						</Tooltip>
					)}
				</Box>
			</CardActions>
		</Card>
	)
}

export default GameCard
