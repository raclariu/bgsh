import React, { Fragment, useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Link as RouterLink } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Chip from '@material-ui/core/Chip';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';

import MonetizationOnOutlinedIcon from '@material-ui/icons/MonetizationOnOutlined';
import SwapHorizontalCircleOutlinedIcon from '@material-ui/icons/SwapHorizontalCircleOutlined';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import CenterFocusWeakTwoToneIcon from '@material-ui/icons/CenterFocusWeakTwoTone';
import RefreshIcon from '@material-ui/icons/Refresh';

import ActiveAddHistoryButton from './ActiveAddHistoryButton';

const useStyles = makeStyles((theme) => ({
	card: {
		position: 'relative'
	},
	media: {
		margin: theme.spacing(1, 0, 1, 0),
		objectFit: 'contain',
		height: '180px'
	},
	overlayTop: {
		position: 'absolute',
		top: '8px',
		left: '8px'
	},
	overlayBottom: {
		position: 'absolute',
		top: '36px',
		left: '8px'
	},
	title: {
		display: '-webkit-box',
		WebkitLineClamp: '2',
		WebkitBoxOrient: 'vertical',
		overflow: 'hidden',
		width: '100%',
		textAlign: 'center'
	},
	avatar: {
		width: theme.spacing(4),
		height: theme.spacing(4),
		backgroundColor: theme.palette.primary.main
	},
	input: {
		minHeight: '70px',
		width: '50%',
		[theme.breakpoints.down('xs')]: {
			width: '90%'
		}
	},
	button: {
		width: '50%',
		[theme.breakpoints.down('xs')]: {
			width: '90%'
		}
	}
}));

const ActiveGameCard = ({ data }) => {
	const cls = useStyles();

	const [ index, setIndex ] = useState(0);

	const handleIndex = (type) => {
		if (type === 'minus') {
			if (index > 0) {
				setIndex(index - 1);
			}
		}
		if (type === 'plus') {
			if (data.games.length > index + 1) {
				setIndex(index + 1);
			}
		}
	};

	return (
		<Card className={cls.card} elevation={2}>
			<CardMedia
				className={cls.media}
				component="img"
				image={data.games[index].thumbnail ? data.games[index].thumbnail : '/images/collCardPlaceholder.jpg'}
				alt={data.games[index].title}
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

					{data.mode === 'sell' && (
						<Box className={cls.overlayBottom}>
							<MonetizationOnOutlinedIcon color="secondary" />
						</Box>
					)}

					{data.mode === 'trade' && (
						<Box className={cls.overlayBottom}>
							<SwapHorizontalCircleOutlinedIcon color="secondary" />
						</Box>
					)}
				</Fragment>
			)}

			{data.type === 'individual' &&
			data.mode === 'sell' && (
				<Box className={cls.overlayTop}>
					<MonetizationOnOutlinedIcon color="secondary" />
				</Box>
			)}

			{data.type === 'individual' &&
			data.mode === 'trade' && (
				<Box className={cls.overlayTop}>
					<SwapHorizontalCircleOutlinedIcon color="secondary" />
				</Box>
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
				<Box display="flex" justifyContent="center" alignItems="center" width="100%">
					<ActiveAddHistoryButton gameId={data._id} isActive={data.isActive} display="reactivate" />
					<ActiveAddHistoryButton
						games={data.games}
						totalPrice={data.totalPrice}
						gameId={data._id}
						mode={data.mode}
						display="add"
					/>

					<IconButton component={RouterLink} to={{ pathname: `/games/${data.altId}` }} color="primary">
						<CenterFocusWeakTwoToneIcon fontSize="small" />
					</IconButton>

					<ActiveAddHistoryButton gameId={data._id} display="delete" />
				</Box>
			</CardActions>
		</Card>
	);
};

export default ActiveGameCard;
