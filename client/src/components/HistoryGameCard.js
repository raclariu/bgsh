// @ Libraries
import React, { Fragment, useState } from 'react'
import { styled } from '@mui/material/styles'
import { useSelector } from 'react-redux'

// @ Mui
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Chip from '@mui/material/Chip'

// @ Icons
import BlockIcon from '@mui/icons-material/Block'
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

// @ Components
import HistoryGameDetails from './HistoryGameDetails'
import CustomIconBtn from './CustomIconBtn'
import CustomDivider from './CustomDivider'
import CustomAvatar from './CustomAvatar'
import CustomTooltip from './CustomTooltip'

// @ Others
import { calculateTimeAgo, formatDate } from '../helpers/helpers'

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
const HistoryGameCard = ({ data }) => {
	const [ index, setIndex ] = useState(0)

	const cycleIndex = (type) => {
		if (type === 'back') {
			if (index > 0) {
				setIndex(index - 1)
			}
		}
		if (type === 'forward') {
			if (data.games.length > index + 1) {
				setIndex(index + 1)
			}
		}
	}

	return (
		<Card sx={{ position: 'relative' }} elevation={1}>
			<Box display="flex" flexDirection="column" p={1} gap={1}>
				<StyledCardMedia
					component="img"
					image={data.games[index].thumbnail ? data.games[index].thumbnail : '/images/gameImgPlaceholder.jpg'}
					alt={data.games[index].title}
					title={data.games[index].title}
				/>
			</Box>

			{data.games.length > 1 && (
				<Chip
					sx={{
						position : 'absolute',
						top      : '8px',
						left     : '8px'
					}}
					size="small"
					color="secondary"
					label={`${data.games.length} pack`}
				/>
			)}

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
								onClick={() => cycleIndex('back')}
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
								onClick={() => cycleIndex('forward')}
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
				<Box display="flex" alignItems="center" justifyContent="flex-end" width="100%">
					<HistoryGameDetails data={data} cycleIndex={cycleIndex} index={index} />
				</Box>
			</CardActions>
		</Card>
	)
}

export default HistoryGameCard
