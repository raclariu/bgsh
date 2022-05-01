// @ Modules
import React, { Fragment, useState } from 'react'
import { styled } from '@mui/material/styles'
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
import StatsBoxes from './StatsBoxes'
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

const StyledCardMedia = styled(CardMedia)({
	objectFit : 'contain',
	height    : '180px'
})

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
		<Card elevation={2} sx={{ position: 'relative' }}>
			<Box display="flex" flexDirection="column" p={1} gap={1}>
				<Box component={RouterLink} to={data.slug}>
					<StyledCardMedia
						sx={{ cursor: 'pointer' }}
						component="img"
						image={
							data.games[index].thumbnail ? data.games[index].thumbnail : '/images/gameImgPlaceholder.jpg'
						}
						alt={data.games[index].title}
						title={data.games[index].title}
					/>
				</Box>

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
								edge="start"
							>
								<ArrowBackIcon />
							</CustomIconBtn>
							<StyledTitleBox>{`${data.games[index].title} (${data.games[index].year})`}</StyledTitleBox>
							<CustomIconBtn
								color="primary"
								disabled={data.games.length === index + 1}
								onClick={() => handleIndex('plus')}
								edge="end"
							>
								<ArrowForwardIcon />
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
					{data.mode === 'want' && (
						<Fragment>
							<Chip
								sx={{ maxWidth: '100%' }}
								size="small"
								color={data.games[index].subtype === 'boardgame' ? 'primary' : 'secondary'}
								variant="outlined"
								label={`${data.games[index].subtype}`}
							/>

							<Chip
								sx={{ maxWidth: '100%' }}
								size="small"
								color="primary"
								variant="outlined"
								label={`${data.games[index].prefVersion.title} • ${data.games[index].prefVersion.year}`}
							/>

							<Box
								display="flex"
								gap={0.5}
								alignItems="center"
								flexWrap="wrap"
								fontWeight="fontWeightMedium"
							>
								{data.games[index].prefMode.buy && <Chip color="success" label="buy" />}

								{data.games[index].prefMode.trade && <Chip color="success" label="trade" />}
							</Box>
						</Fragment>
					)}

					{(data.mode === 'sell' || data.mode === 'trade') && (
						<Fragment>
							<Chip
								sx={{ maxWidth: '100%' }}
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

							{data.mode === 'sell' && (
								<Box fontWeight="fontWeightMedium">
									<Chip color="success" label={`${data.totalPrice} RON`} />
								</Box>
							)}
						</Fragment>
					)}
				</Box>
			</CardContent>

			<CustomDivider />

			<CardActions>
				<Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
					<Box display="flex" justifyContent="center" alignItems="center" gap={1}>
						<CustomAvatar size={5} username={data.addedBy.username} src={data.addedBy.avatar} />

						<Box fontSize="caption.fontSize">{calculateTimeAgo(data.createdAt)}</Box>
					</Box>

					<GameDetailsButton slug={data.slug} />
				</Box>
			</CardActions>
		</Card>
	)
}

export default GameIndexCard
