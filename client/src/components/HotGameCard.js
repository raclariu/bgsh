// @ Libraries
import React from 'react'
import { styled } from '@mui/material/styles'
import { useSelector } from 'react-redux'

// @ Mui
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Box from '@mui/material/Box'

// @ Components
import CustomDivider from './CustomDivider'
import CustomButton from './CustomButton'
import CustomTooltip from './CustomTooltip'

// @ Styles
const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
	margin    : theme.spacing(1, 0, 1, 0),
	padding   : theme.spacing(0, 1, 0, 1),
	objectFit : 'contain',
	height    : '180px'
}))

const StyledTitleBox = styled(Box)({
	display         : '-webkit-box',
	WebkitLineClamp : '2',
	WebkitBoxOrient : 'vertical',
	overflow        : 'hidden',
	width           : '100%',
	textAlign       : 'center'
})

// @ Main
const HotGameCard = ({ data }) => {
	return (
		<Card elevation={2}>
			<StyledCardMedia
				component="img"
				alt={data.title}
				image={data.thumbnail ? data.thumbnail : '/images/gameImgPlaceholder.jpg'}
				title={data.title}
			/>

			<CustomDivider />

			<CardContent>
				<Box
					display="flex"
					justifyContent="center"
					alignItems="center"
					fontWeight="fontWeightMedium"
					minHeight="3rem"
				>
					<StyledTitleBox>
						{data.title} ({data.year})
					</StyledTitleBox>
				</Box>
			</CardContent>

			<CustomDivider />

			<CardActions>
				<Box display="flex" justifyContent="flex-end" width="100%">
					<CustomTooltip title="See on BGG">
						<CustomButton
							href={`https://boardgamegeek.com/boardgame/${data.bggId}`}
							target="_blank"
							rel="noreferrer"
						>
							BGG
						</CustomButton>
					</CustomTooltip>
				</Box>
			</CardActions>
		</Card>
	)
}

export default HotGameCard
