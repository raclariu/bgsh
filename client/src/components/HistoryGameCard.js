// @ Libraries
import React, { Fragment, useState } from 'react'
import { styled } from '@mui/material/styles'
import { useSelector } from 'react-redux'

// @ Mui
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'

// @ Components
import CustomIconBtn from './CustomIconBtn'
import CustomDivider from './CustomDivider'
import CustomAvatar from './CustomAvatar'
import CustomTooltip from './CustomTooltip'

// @ Icons
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

// @ Others
import { calculateTimeAgo, formatDate } from '../helpers/helpers'

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
const HistoryGameCard = ({ data }) => {
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
			<StyledCardMedia
				component="img"
				image={data.games[index].thumbnail ? data.games[index].thumbnail : '/images/gameImgPlaceholder.jpg'}
				alt={data.games[index].title}
				title={data.games[index].title}
			/>

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

			<CardContent>
				<Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
					{data.mode === 'sell' && (
						<Box fontWeight="fontWeightMedium">
							<Chip color="primary" label={data.finalPrice ? data.finalPrice + ' RON' : 'N/A'} />
						</Box>
					)}

					{data.otherUser ? (
						<Box my={1} display="flex" alignItems="center">
							<CustomAvatar size={5} username={data.otherUser.username} src={data.otherUser.avatar} />
							<Box ml={1}>{data.otherUser.username}</Box>
						</Box>
					) : (
						'N/A'
					)}

					<Box display="flex" alignItems="center">
						<CustomTooltip title={formatDate(data.createdAt)}>
							<EventAvailableOutlinedIcon />
						</CustomTooltip>

						<Box textAlign="center" ml={0.5}>
							{calculateTimeAgo(data.createdAt)}
						</Box>
					</Box>
					<CustomDivider orientation="vertical" flexItem />
				</Box>

				<Box display="flex" justifyContent="center" alignItems="center" width="100%" gap={1}>
					<Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" width="100%">
						{data.otherUser ? (
							<Box my={1} display="flex" alignItems="center">
								<CustomAvatar size={5} username={data.otherUser.username} src={data.otherUser.avatar} />
								<Box ml={1}>{data.otherUser.username}</Box>
							</Box>
						) : (
							'N/A'
						)}
					</Box>
					<CustomDivider orientation="vertical" flexItem />
					<Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" width="100%">
						<Box>
							{data.finalPrice ? (
								<Box fontWeight="fontWeightMedium">
									<Chip color="primary" label={data.finalPrice ? data.finalPrice + ' RON' : 'N/A'} />
								</Box>
							) : (
								'N/A'
							)}
						</Box>
					</Box>
				</Box>
				<Box display="flex" alignItems="center">
					<CustomTooltip title={formatDate(data.createdAt)}>
						<EventAvailableOutlinedIcon />
					</CustomTooltip>

					<Box textAlign="center" ml={0.5}>
						{calculateTimeAgo(data.createdAt)}
					</Box>
				</Box>
			</CardContent>
		</Card>
	)
}

export default HistoryGameCard
