// @ Modules
import React from 'react'
import { styled } from '@mui/material/styles'
import { Link as RouterLink } from 'react-router-dom'

// @ Mui
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Checkbox from '@mui/material/Checkbox'
import Chip from '@mui/material/Chip'

// @ Components
import ExtLinkIconBtn from './ExtLinkIconBtn'
import CustomIconBtn from './CustomIconBtn'
import CustomDivider from './CustomDivider'
import CustomTooltip from './CustomTooltip'
import StatsBoxes from './StatsBoxes'

// @ Icons
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined'
import SearchIcon from '@mui/icons-material/Search'

// @ Styles
const StyledCardMedia = styled(CardMedia)({
	objectFit : 'contain',
	height    : '180px'
})

const StyledTitleBox = styled(Box)({
	display         : '-webkit-box',
	WebkitLineClamp : '2',
	WebkitBoxOrient : 'vertical',
	overflow        : 'hidden',
	width           : '100%',
	textAlign       : 'center'
})

// @ Main
const CollectionGameCard = ({ data, type, listHandler, isChecked, isDisabled }) => {
	return (
		<Card elevation={2} sx={{ position: 'relative' }}>
			<Box display="flex" flexDirection="column" p={1} gap={1}>
				<StyledCardMedia
					component="img"
					alt={data.title}
					image={data.thumbnail ? data.thumbnail : '/images/gameImgPlaceholder.jpg'}
					title={data.title}
				/>

				{data.stats && (
					<Box display="flex" justifyContent="center" alignItems="center" width="100%" gap={1}>
						{data.stats.userRating && <StatsBoxes stats={data.stats} type="userRating" />}

						<StatsBoxes variant="mini" stats={data.stats} type="rating" />
					</Box>
				)}

				{data.numPlays > 0 && (
					<Chip
						sx={{
							position : 'absolute',
							top      : '8px',
							left     : '8px'
						}}
						size="small"
						color="secondary"
						label={`${data.numPlays} ${data.numPlays === 1 ? 'play' : 'plays'}`}
					/>
				)}
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

					{type === 'wishlist' &&
					data.priority && (
						<Chip size="small" color="primary" variant="outlined" label={`Priority: ${data.priority}`} />
					)}
				</Box>
			</CardContent>

			<CustomDivider />

			<CardActions>
				<Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" width="100%">
					<ExtLinkIconBtn url={`https://boardgamegeek.com/boardgame/${data.bggId}`} />

					<Box display="flex" gap={1} alignItems="center">
						{(type === 'wantToBuy' || type === 'wantToPlay' || type === 'wishlist') && (
							<CustomTooltip title={'Search for this game in listed sales'}>
								<CustomIconBtn
									color="primary"
									size="large"
									component={RouterLink}
									to={`/sales?search=${data.bggId}`}
								>
									<SearchIcon color="primary" />
								</CustomIconBtn>
							</CustomTooltip>
						)}

						{type === 'wantInTrade' && (
							<CustomTooltip title={'Search for this game in listed trades'}>
								<CustomIconBtn
									color="primary"
									size="large"
									component={RouterLink}
									to={`/trades?search=${data.bggId}`}
								>
									<SearchIcon color="primary" />
								</CustomIconBtn>
							</CustomTooltip>
						)}

						<CustomTooltip
							title={isChecked ? `Remove "${data.title}" from list` : `Add "${data.title}" to list`}
						>
							<Checkbox
								sx={{ height: 48, width: 48 }}
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

export default CollectionGameCard
