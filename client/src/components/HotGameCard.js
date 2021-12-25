// @ Libraries
import React from 'react'
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

// @ Components
import CustomTooltip from './CustomTooltip'

const PREFIX = 'HotGameCard';

const classes = {
    media: `${PREFIX}-media`,
    title: `${PREFIX}-title`
};

const StyledCard = styled(Card)((
    {
        theme
    }
) => ({
    [`& .${classes.media}`]: {
		margin    : theme.spacing(1, 0, 1, 0),
		padding   : theme.spacing(0, 1, 0, 1),
		objectFit : 'contain',
		height    : '180px'
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
const HotGameCard = ({ data }) => {


	return (
        <StyledCard elevation={1}>
			<CardMedia
				className={classes.media}
				component="img"
				alt={data.title}
				image={data.thumbnail ? data.thumbnail : '/images/gameImgPlaceholder.jpg'}
				title={data.title}
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
					<Box className={classes.title}>
						{data.title} ({data.year})
					</Box>
				</Box>
			</CardContent>

			<Divider />

			<CardActions>
				<Box display="flex" justifyContent="flex-end" width="100%">
					<CustomTooltip title="See on BGG">
						<Button
							color="primary"
							href={`https://boardgamegeek.com/boardgame/${data.bggId}`}
							target="_blank"
							rel="noopener"
						>
							BGG
						</Button>
					</CustomTooltip>
				</Box>
			</CardActions>
		</StyledCard>
    );
}

export default HotGameCard
