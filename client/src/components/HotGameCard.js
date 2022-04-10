// @ Modules
import React from 'react'
import { styled } from '@mui/material/styles'

// @ Mui
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Box from '@mui/material/Box'

// @ Components
import ExtLinkIconBtn from './ExtLinkIconBtn'
import CustomDivider from './CustomDivider'

// @ Styles
const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
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
			<Box display="flex" flexDirection="column" p={1} gap={1}>
				<StyledCardMedia
					component="img"
					alt={data.title}
					image={data.thumbnail ? data.thumbnail : '/images/gameImgPlaceholder.jpg'}
					title={data.title}
				/>
			</Box>

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
					<ExtLinkIconBtn url={`https://boardgamegeek.com/boardgame/${data.bggId}`} />
				</Box>
			</CardActions>
		</Card>
	)
}

export default HotGameCard
