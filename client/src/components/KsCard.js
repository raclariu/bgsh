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
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'

// @ Components
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
		<Card elevation={1}>
			<CardMedia
				sx={{
					objectFit      : 'fill',
					height         : '180px',
					objectPosition : 'center 10%'
				}}
				component="img"
				alt={data.title}
				image={data.image ? data.image : '/images/gameImgPlaceholder.jpg'}
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
					<StyledTitleBox>{data.title}</StyledTitleBox>
				</Box>
			</CardContent>

			<Divider />

			<CardActions>
				<Box display="flex" justifyContent="flex-end" width="100%">
					<CustomTooltip title="See on Kickstarter">
						<Button color="primary" href={`${data.url}`} target="_blank" rel="noreferrer">
							Page
						</Button>
					</CustomTooltip>

					<CustomTooltip title="Rewards page">
						<Button color="primary" href={`${data.url}/rewards`} target="_blank" rel="noreferrer">
							Rewards
						</Button>
					</CustomTooltip>
				</Box>
			</CardActions>
		</Card>
	)
}

export default KsCard
