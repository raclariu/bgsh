// @ Libraries
import React, { Fragment, useState } from 'react'
import { styled } from '@mui/material/styles'
import { useSelector } from 'react-redux'

// @ Mui
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'

// @ Icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

// @ Components
import ExtLinkIconBtn from './ExtLinkIconBtn'
import CustomIconBtn from './CustomIconBtn'
import CustomDivider from './CustomDivider'
import CustomButton from './CustomButton'
import CustomTooltip from './CustomTooltip'
import GameDetailsButton from './GameDetailsButton'

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
const UserProfileGameCard = ({ data }) => {
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
		<Card sx={{ position: 'relative' }} elevation={2}>
			<Box display="flex" flexDirection="column" p={1} gap={1}>
				<StyledCardMedia
					component="img"
					alt={data.games[index].title}
					image={data.games[index].thumbnail ? data.games[index].thumbnail : '/images/gameImgPlaceholder.jpg'}
					title={data.games[index].title}
				/>

				{data.isPack && (
					<Fragment>
						<Chip
							size="small"
							color="secondary"
							sx={{
								position : 'absolute',
								top      : '8px',
								left     : '8px'
							}}
							label={`${data.games.length} pack`}
						/>
					</Fragment>
				)}
			</Box>

			<CustomDivider />

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
							<CustomIconBtn
								color="primary"
								disabled={index === 0}
								onClick={() => handleIndex('minus')}
								size="large"
								edge="start"
							>
								<ArrowBackIcon fontSize="small" />
							</CustomIconBtn>
							<StyledTitleBox>
								{data.games[index].title} ({data.games[index].year})
							</StyledTitleBox>
							<CustomIconBtn
								color="primary"
								disabled={data.games.length === index + 1}
								onClick={() => handleIndex('plus')}
								size="large"
								edge="end"
							>
								<ArrowForwardIcon fontSize="small" />
							</CustomIconBtn>
						</Fragment>
					) : (
						<StyledTitleBox>
							{data.games[index].title} ({data.games[index].year})
						</StyledTitleBox>
					)}
				</Box>
			</CardContent>

			<CustomDivider />

			<CardActions>
				<Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
					<ExtLinkIconBtn url={`https://boardgamegeek.com/boardgame/${data.games[index].bggId}`} />

					<GameDetailsButton altId={data.altId} />
				</Box>
			</CardActions>
		</Card>
	)
}

export default UserProfileGameCard
