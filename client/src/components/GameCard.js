// @ Libraries
import React from 'react'
import { styled } from '@mui/material/styles'
import { Link as RouterLink } from 'react-router-dom'
import { useSelector } from 'react-redux'

// @ Mui
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'

// @ Components
import CustomTooltip from './CustomTooltip'

// @ Icons
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined'
import SearchIcon from '@mui/icons-material/Search'

// @ Styles
const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
	margin    : theme.spacing(1, 0, 1, 0),
	padding   : theme.spacing(0, 1, 0, 1),
	objectFit : 'contain',
	height    : '180px'
}))

const StyledTitleBox = styled(Box)(() => ({
	display         : '-webkit-box',
	WebkitLineClamp : '2',
	WebkitBoxOrient : 'vertical',
	overflow        : 'hidden',
	width           : '100%',
	textAlign       : 'center'
}))

// @ Main
const GameCard = ({ data, saleListHandler, isChecked, isDisabled }) => {
	return (
		<Card elevation={1}>
			<StyledCardMedia
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
					<StyledTitleBox>
						{data.title} ({data.year})
					</StyledTitleBox>
				</Box>
			</CardContent>

			<Divider />

			<CardActions>
				<Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" width="100%">
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

					<CustomTooltip
						title={isChecked ? `Remove "${data.title}" from list` : `Add "${data.title}" to list`}
					>
						<Checkbox
							checked={isChecked}
							disabled={isDisabled}
							onChange={(e) => saleListHandler(e, data.bggId)}
							icon={<AddBoxOutlinedIcon />}
						/>
					</CustomTooltip>
				</Box>
			</CardActions>
		</Card>
	)
}

export default GameCard
