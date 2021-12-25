// @ Libraries
import React, { Fragment, useState } from 'react'
import { styled } from '@mui/material/styles';
import { useSelector } from 'react-redux'

// @ Mui
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'

// @ Components
import CustomAvatar from './CustomAvatar'
import CustomTooltip from './CustomTooltip'

// @ Icons
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

// @ Others
import { calculateTimeAgo, formatDate } from '../helpers/helpers'

const PREFIX = 'HistoryGameCard';

const classes = {
    card: `${PREFIX}-card`,
    media: `${PREFIX}-media`,
    overlayChip: `${PREFIX}-overlayChip`,
    title: `${PREFIX}-title`,
    avatar: `${PREFIX}-avatar`
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

    [`& .${classes.overlayChip}`]: {
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
	},

    [`& .${classes.avatar}`]: {
		width           : theme.spacing(4),
		height          : theme.spacing(4),
		backgroundColor : theme.palette.primary.main
	}
}));

// @ Main
const HistoryGameCard = ({ data }) => {


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
				image={data.games[index].thumbnail ? data.games[index].thumbnail : '/images/gameImgPlaceholder.jpg'}
				alt={data.games[index].title}
				title={data.games[index].title}
			/>

			{data.games.length > 1 && (
				<Chip
					size="small"
					color="secondary"
					className={classes.overlayChip}
					label={`${data.games.length} pack`}
				/>
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
							<IconButton
								color="primary"
								disabled={index === 0}
								onClick={() => handleIndex('minus')}
								size="large"
							>
								<ArrowBackIcon fontSize="small" />
							</IconButton>
							<Box className={classes.title}>
								{data.games[index].title} ({data.games[index].year})
							</Box>
							<IconButton
								color="primary"
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

			<CardContent>
				<Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
					{data.mode === 'sell' && (
						<Box fontWeight="fontWeightMedium">
							<Chip color="primary" label={data.finalPrice ? data.finalPrice + ' RON' : 'N/A'} />
						</Box>
					)}

					{data.buyer ? (
						<Box my={1} display="flex" alignItems="center">
							<CustomAvatar size="medium" user={data.buyer} />
							<Box ml={1}>{data.buyer}</Box>
						</Box>
					) : (
						'N/A'
					)}

					<Box display="flex" alignItems="center">
						<CustomTooltip title={formatDate(data.createdAt)}>
							<EventAvailableOutlinedIcon fontSize="small" />
						</CustomTooltip>

						<Box textAlign="center" ml={0.5}>
							{calculateTimeAgo(data.createdAt)}
						</Box>
					</Box>
				</Box>
			</CardContent>
		</StyledCard>
    );
}

export default HistoryGameCard
