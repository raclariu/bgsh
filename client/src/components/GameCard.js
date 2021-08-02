import React from 'react';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Checkbox from '@material-ui/core/Checkbox';
import AddBoxOutlinedIcon from '@material-ui/icons/AddBoxOutlined';

const useStyles = makeStyles((theme) => ({
	media: {
		margin: theme.spacing(1, 0, 1, 0),
		objectFit: 'contain',
		height: '180px'
	},
	title: {
		display: '-webkit-box',
		WebkitLineClamp: '2',
		WebkitBoxOrient: 'vertical',
		overflow: 'hidden',
		width: '100%',
		textAlign: 'center'
	}
}));

const GameCard = ({ game, saleListHandler, isChecked, isDisabled }) => {
	const cls = useStyles();
	const location = useLocation();

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
				<Grid container direction="row" justify="space-between" alignItems="center">
					<Grid item>
						<Button
							color="secondary"
							href={`https://boardgamegeek.com/boardgame/${game.bggId}`}
							target="_blank"
							rel="noopener"
						>
							BGG
						</Button>
					</Grid>
					{location.pathname === '/collection' && (
						<Checkbox
							checked={isChecked}
							disabled={isDisabled}
							onChange={(e) => saleListHandler(e, game.bggId)}
							icon={<AddBoxOutlinedIcon />}
						/>
					)}
					{location.pathname === '/wishlist' && (
						<Button color="primary" component={RouterLink} to={`/games?search=${game.title.toLowerCase()}`}>
							Search
						</Button>
					)}
				</Grid>
			</CardActions>
		</Card>
	);
};

export default GameCard;
