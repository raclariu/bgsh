// @ Libraries
import React from 'react'
import { styled } from '@mui/material/styles'
import { Link as RouterLink, useLocation } from 'react-router-dom'
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
import Chip from '@mui/material/Chip'

// @ Components
import CustomTooltip from './CustomTooltip'
import StatsBoxes from './SingleGameScreen/StatsBoxes'

// @ Icons
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined'
import SearchIcon from '@mui/icons-material/Search'

// @ Styles
const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
	padding   : theme.spacing(1, 1, 1, 1),
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
const GameCard = ({ data, listHandler, isChecked, isDisabled }) => {
	const location = useLocation()
	const currLoc = location.pathname === '/collection' ? 'collection' : 'wishlist'

	return (
		<Card raised={isChecked}>
			<StyledCardMedia
				component="img"
				alt={data.title}
				image={data.thumbnail ? data.thumbnail : '/images/gameImgPlaceholder.jpg'}
				title={data.title}
			/>

			{data.stats && (
				<Box display="flex" justifyContent="center" alignItems="center" width="100%" gap={1} mb={1}>
					{data.stats.userRating && <StatsBoxes stats={data.stats} type="userRating" />}

					<StatsBoxes variant="mini" stats={data.stats} type="rating" />
				</Box>
			)}

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

			<CardContent>
				<Box
					display="flex"
					justifyContent="center"
					alignItems="center"
					flexDirection="column"
					gap={0.5}
					minHeight="4rem"
				>
					<Chip
						size="small"
						color={data.subtype === 'boardgame' ? 'primary' : 'secondary'}
						variant="outlined"
						label={data.subtype}
					/>

					{data.version && (
						<Chip
							sx={{ maxWidth: '100%' }}
							size="small"
							color="primary"
							variant="outlined"
							label={`${data.version.title} • ${data.version.year}`}
						/>
					)}

					{data.priority && (
						<Chip size="small" color="primary" variant="outlined" label={`Priority: ${data.priority}`} />
					)}
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
							rel="noreferrer"
						>
							BGG
						</Button>
					</CustomTooltip>

					<Box display="flex" gap={1} alignItems="center">
						{currLoc === 'wishlist' && (
							<CustomTooltip title={'Search for this game'}>
								<IconButton component={RouterLink} to={`/games?search=${data.bggId}`}>
									<SearchIcon />
								</IconButton>
							</CustomTooltip>
						)}

						<CustomTooltip
							title={isChecked ? `Remove "${data.title}" from list` : `Add "${data.title}" to list`}
						>
							<Checkbox
								checked={isChecked}
								disabled={isDisabled}
								onChange={(e) => listHandler(e, data)}
								icon={<AddBoxOutlinedIcon />}
							/>
						</CustomTooltip>
					</Box>
				</Box>
			</CardActions>
		</Card>
	)
}

export default GameCard
