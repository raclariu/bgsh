// @ Libraries
import React, { Fragment, useState } from 'react'
import { styled } from '@mui/material/styles';
import { useSelector } from 'react-redux'

// @ Mui
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Chip from '@mui/material/Chip'

// @ icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

// @ Components
import CustomTooltip from '../CustomTooltip'
import GameDetailsButton from '../GameDetailsButton'

const PREFIX = 'UserProfileGameCard';

const classes = {
    card: `${PREFIX}-card`,
    media: `${PREFIX}-media`,
    overlayTop: `${PREFIX}-overlayTop`,
    title: `${PREFIX}-title`
};

const StyledCard = styled(Card)((
    {
        theme
    }
) => ({
    [`&.${classes.card}`]: {
		position : 'relative'
	},

    [`& .${classes.media}`]: {
		margin    : theme.spacing(1, 0, 1, 0),
		padding   : theme.spacing(0, 1, 0, 1),
		objectFit : 'contain',
		height    : '180px'
	},

    [`& .${classes.overlayTop}`]: {
		position : 'absolute',
		top      : '8px',
		left     : '8px'
	},

    [`& .${classes.title}`]: {
		display         : '-webkit-box',
		WebkitLineClamp : '2',
		WebkitBoxOrient : 'vertical',
		overflow        : 'hidden',
		width           : '100%',
		textAlign       : 'center'
	}
}));

// @ Main
const UserProfileGameCard = ({ data }) => {


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
        <StyledCard className={classes.card} elevation={1}>
			<CardMedia
				className={classes.media}
				component="img"
				alt={data.games[index].title}
				image={data.games[index].thumbnail ? data.games[index].thumbnail : '/images/gameImgPlaceholder.jpg'}
				title={data.games[index].title}
			/>

			{data.isPack && (
				<Fragment>
					<Chip
						size="small"
						color="secondary"
						className={classes.overlayTop}
						label={`${data.games.length} pack`}
					/>
				</Fragment>
			)}

			<Divider />

			<CardContent>
				<Box
					display="flex"
					justifyContent={data.isPack ? 'space-between' : 'center'}
					alignItems="center"
					fontWeight="fontWeightMedium"
					minHeight="3rem"
				>
					{data.isPack ? (
						<Fragment>
							<IconButton disabled={index === 0} onClick={() => handleIndex('minus')} size="large">
								<ArrowBackIcon fontSize="small" />
							</IconButton>
							<Box className={classes.title}>
								{data.games[index].title} ({data.games[index].year})
							</Box>
							<IconButton
								disabled={data.games.length === index + 1}
								onClick={() => handleIndex('plus')}
								size="large"
							>
								<ArrowForwardIcon fontSize="small" />
							</IconButton>
						</Fragment>
					) : (
						<Box className={classes.title}>
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
		</StyledCard>
    );
}

export default UserProfileGameCard
