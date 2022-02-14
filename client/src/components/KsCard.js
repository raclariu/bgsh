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
const StyledTitleBox = styled(Box)({
	display         : '-webkit-box',
	WebkitLineClamp : '2',
	WebkitBoxOrient : 'vertical',
	overflow        : 'hidden',
	width           : '100%',
	textAlign       : 'center'
})

// @ Main
const KsCard = ({ data }) => {
	return (
		<Card elevation={2}>
			<CardMedia
				sx={{
					objectFit : 'cover',
					height    : '150px'
				}}
				component="img"
				alt={data.title}
				image={data.image ? data.image : '/images/gameImgPlaceholder.jpg'}
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
					<StyledTitleBox>{data.title}</StyledTitleBox>
				</Box>
			</CardContent>

			<CustomDivider />

			<CardActions>
				<Box display="flex" justifyContent="flex-end" width="100%">
					<CustomTooltip title="See on Kickstarter">
						<CustomButton href={`${data.url}`} target="_blank" rel="noreferrer">
							Page
						</CustomButton>
					</CustomTooltip>

					<CustomTooltip title="Rewards page">
						<CustomButton href={`${data.url}/rewards`} target="_blank" rel="noreferrer">
							Rewards
						</CustomButton>
					</CustomTooltip>
				</Box>
			</CardActions>
		</Card>
	)
}

export default KsCard
