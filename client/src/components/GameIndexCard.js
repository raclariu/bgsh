// @ Libraries
import React, { Fragment, useState } from 'react'
import { styled } from '@mui/material/styles'
import { useSelector } from 'react-redux'
import { Link as RouterLink } from 'react-router-dom'

// @ Mui
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Chip from '@mui/material/Chip'

// @ Icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

// @ Components
import CustomIconBtn from './CustomIconBtn'
import CustomDivider from './CustomDivider'
import StatsBoxes from './SingleGameScreen/StatsBoxes'
import GameDetailsButton from './GameDetailsButton'
import CustomAvatar from './CustomAvatar'

// @ Other
import { calculateTimeAgo } from '../helpers/helpers'

// @ Styles
const StyledTitleBox = styled(Box)({
	display         : '-webkit-box',
	WebkitLineClamp : '2',
	WebkitBoxOrient : 'vertical',
	overflow        : 'hidden',
	width           : '100%',
	textAlign       : 'center'
})

const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
	// padding   : theme.spacing(1, 1, 1, 1),
	objectFit : 'contain',
	height    : '180px'
}))

// @ Main
const GameIndexCard = ({ data }) => {
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

				<Box display="flex" justifyContent="center" alignItems="center" width="100%" gap={1}>
					<StatsBoxes variant="mini" stats={data.games[index].stats} type="rating" />

					<StatsBoxes variant="mini" stats={data.games[index].stats} type="rank" />

					<StatsBoxes variant="mini" complexity={data.games[index].complexity} type="complexity" />
				</Box>

				{data.isPack && (
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
							<StyledTitleBox>{`${data.games[index].title} (${data.games[index].year})`}</StyledTitleBox>
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
						<StyledTitleBox>{`${data.games[index].title} (${data.games[index].year})`}</StyledTitleBox>
					)}
				</Box>
			</CardContent>

			<CustomDivider />

			<CardContent>
				<Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" gap={0.5}>
					{data.mode !== 'want' ? (
						<Fragment>
							<Chip
								size="small"
								color={data.games[index].subtype === 'boardgame' ? 'primary' : 'secondary'}
								variant="outlined"
								label={`${data.games[index].subtype} • ${data.games[index].condition}`}
							/>

							<Chip
								sx={{ maxWidth: '100%' }}
								size="small"
								color="primary"
								variant="outlined"
								label={`${data.games[index].version.title} • ${data.games[index].version.year}`}
							/>
						</Fragment>
					) : (
						<Fragment>
							<Chip
								size="small"
								color={data.games[index].subtype === 'boardgame' ? 'primary' : 'secondary'}
								variant="outlined"
								label={data.games[index].subtype}
							/>

							<Chip
								size="small"
								color="primary"
								variant="outlined"
								label={`${data.games[index].prefVersion.title} • ${data.games[index].prefVersion.year}`}
							/>

							<Chip
								color="primary"
								size="small"
								variant="outlined"
								label={`${data.shipping.shipPreffered}`}
							/>
						</Fragment>
					)}

					{data.mode === 'sell' && (
						<Box fontWeight="fontWeightMedium">
							<Chip color="success" label={`${data.totalPrice} RON`} />
						</Box>
					)}
				</Box>
			</CardContent>

			<CustomDivider />

			<CardActions>
				<Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
					<Box display="flex" justifyContent="center" alignItems="center" gap={1}>
						<CustomAvatar size={5} username={data.addedBy.username} src={data.addedBy.avatar} />

						<Box fontSize={12}>{calculateTimeAgo(data.createdAt)}</Box>
					</Box>

					{data.mode !== 'want' && <GameDetailsButton altId={data.altId} />}
				</Box>
			</CardActions>
		</Card>
	)
}

export default GameIndexCard
