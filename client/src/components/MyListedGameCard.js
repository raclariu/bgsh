// @ Modules
import React, { Fragment, useState } from 'react'
import { styled } from '@mui/material/styles'
import { Link as RouterLink } from 'react-router-dom'
import { useSelector } from 'react-redux'

// @ Mui
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Chip from '@mui/material/Chip'

// @ Icons
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined'
import SwapHorizontalCircleOutlinedIcon from '@mui/icons-material/SwapHorizontalCircleOutlined'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'

// @ Components
import CustomIconBtn from './CustomIconBtn'
import CustomDivider from './CustomDivider'
import ActiveAddHistoryButton from './ActiveAddHistoryButton'
import GameDetailsButton from './GameDetailsButton'
import CustomTooltip from './CustomTooltip'

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
const ListedGameCard = ({ data }) => {
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
					image={data.games[index].thumbnail ? data.games[index].thumbnail : '/images/gameImgPlaceholder.jpg'}
					alt={data.games[index].title}
					title={data.games[index].title}
				/>
			</Box>

			{data.isPack && (
				<Fragment>
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

					{data.mode === 'sell' && (
						<Box
							sx={{
								position : 'absolute',
								top      : '36px',
								left     : '8px'
							}}
						>
							<CustomTooltip title="For sale">
								<MonetizationOnOutlinedIcon color="secondary" />
							</CustomTooltip>
						</Box>
					)}

					{data.mode === 'trade' && (
						<Box
							sx={{
								position : 'absolute',
								top      : '36px',
								left     : '8px'
							}}
						>
							<CustomTooltip title="For trade">
								<SwapHorizontalCircleOutlinedIcon color="secondary" />
							</CustomTooltip>
						</Box>
					)}
				</Fragment>
			)}

			{!data.isPack &&
			data.mode === 'sell' && (
				<Box
					sx={{
						position : 'absolute',
						top      : '8px',
						left     : '8px'
					}}
				>
					<CustomTooltip title="For sale">
						<MonetizationOnOutlinedIcon color="secondary" />
					</CustomTooltip>
				</Box>
			)}

			{!data.isPack &&
			data.mode === 'trade' && (
				<Box
					sx={{
						position : 'absolute',
						top      : '8px',
						left     : '8px'
					}}
				>
					<CustomTooltip title="For trade">
						<SwapHorizontalCircleOutlinedIcon color="secondary" />
					</CustomTooltip>
				</Box>
			)}

			{!data.isPack &&
			data.mode === 'want' && (
				<Box
					sx={{
						position : 'absolute',
						top      : '8px',
						left     : '8px'
					}}
				>
					<CustomTooltip title="Want to buy">
						<AddCircleOutlineIcon color="secondary" />
					</CustomTooltip>
				</Box>
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

			<CardActions>
				<Box display="flex" justifyContent="space-evenly" alignItems="center" width="100%">
					<ActiveAddHistoryButton
						gameId={data._id}
						mode={data.mode}
						isActive={data.isActive}
						display="reactivate"
					/>

					{data.mode !== 'want' && (
						<Fragment>
							<ActiveAddHistoryButton
								games={data.games}
								isActive={data.isActive}
								price={data.totalPrice}
								gameId={data._id}
								mode={data.mode}
								display="add"
							/>

							<GameDetailsButton altId={data.altId} />
						</Fragment>
					)}

					<ActiveAddHistoryButton gameId={data._id} mode={data.mode} display="delete" />
				</Box>
			</CardActions>
		</Card>
	)
}

export default ListedGameCard
