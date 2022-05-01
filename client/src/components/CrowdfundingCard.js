// @ Modules
import React from 'react'
import getSymbolFromCurrency from 'currency-symbol-map'
import approx from 'approximate-number'

// @ Mui
import { styled } from '@mui/material/styles'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'

// @ Components
import CustomDivider from './CustomDivider'

// @ Others
import { dateDiff } from '../helpers/helpers'

// @ Styles
const StyledTitleBox = styled(Box)({
	display         : '-webkit-box',
	WebkitLineClamp : '1',
	WebkitBoxOrient : 'vertical',
	overflow        : 'hidden',
	width           : '100%',
	textAlign       : 'left'
})

// @ Main
const CrowdfundingCard = ({ data }) => {
	return (
		<Card elevation={2}>
			<CardHeader
				title={<StyledTitleBox>{data.title}</StyledTitleBox>}
				subheader={data.from}
				titleTypographyProps={{
					color   : 'primary',
					variant : 'subtitle2'
				}}
				subheaderTypographyProps={{
					color   : 'text.secondary',
					variant : 'caption'
				}}
			/>

			<CustomDivider />

			<Box component="a" href={data.url} target="_blank" rel="noreferrer">
				<CardMedia
					sx={{
						objectFit : 'cover',
						height    : '162px'
					}}
					component="img"
					alt={data.title}
					image={data.image ? data.image : '/images/gameImgPlaceholder.jpg'}
					title={data.title}
				/>
			</Box>

			<CustomDivider />

			<CardContent>
				<Box display="flex" flexDirection="column" gap={0.5}>
					<Box display="flex" alignItems="center" justifyContent="space-between">
						<Box fontSize="caption.fontSize">{`${data.progress}% funded`}</Box>
						<Box fontSize="caption.fontSize">{`${getSymbolFromCurrency(
							data.currency
						)}${approx(data.pledged, { precision: 3 })} pledged`}</Box>
					</Box>
					<LinearProgress
						sx={{ height: 8, borderRadius: '4px', mb: 1 }}
						color="success"
						variant="determinate"
						value={data.progress > 100 ? 100 : data.progress}
					/>

					<Box display="flex" alignItems="center" justifyContent="space-between">
						<Box display="flex" flexDirection="column">
							<Box fontWeight="fontWeightMedium" fontSize="h5.fontSize">
								{data.backers}
							</Box>
							<Box fontSize="caption.fontSize">backers</Box>
						</Box>

						<Box display="flex" flexDirection="column">
							<Box fontWeight="fontWeightMedium" fontSize="h5.fontSize">
								{dateDiff(data.deadline, 'm') <= 60 ? (
									dateDiff(data.deadline, 'm')
								) : dateDiff(data.deadline, 'h') > 48 ? (
									dateDiff(data.deadline, 'd')
								) : (
									dateDiff(data.deadline, 'h')
								)}
							</Box>
							<Box fontSize="caption.fontSize">
								{dateDiff(data.deadline, 'm') <= 60 ? (
									'minutes to go'
								) : dateDiff(data.deadline, 'h') > 48 ? (
									'days to go'
								) : (
									'hours to go'
								)}
							</Box>
						</Box>
					</Box>
				</Box>
			</CardContent>
		</Card>
	)
}

export default CrowdfundingCard
