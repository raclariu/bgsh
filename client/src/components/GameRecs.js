// @ Modules
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import approx from 'approximate-number'
import { useInView } from 'react-intersection-observer'

// @ Mui
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'
import Collapse from '@mui/material/Collapse'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'

// @ Components
import LzLoad from './LzLoad'
import Loader from './Loader'
import CustomSkeleton from './Skeletons/CustomSkeleton'
import CustomButton from './CustomButton'
import CustomAlert from './CustomAlert'

// @ Icons
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech'
import RecommendTwoToneIcon from '@mui/icons-material/RecommendTwoTone'
import StarIcon from '@mui/icons-material/Star'

// @ Others
import { useGetGameRecommendationsQuery } from '../hooks/hooks'

// @ Styles
const StyledRecImg = styled('img')({
	verticalAlign : 'bottom',
	objectFit     : 'cover',
	width         : 64,
	height        : 64,
	borderRadius  : '4px'
})

const StyledTitleBox = styled(Box)({
	display         : '-webkit-box',
	WebkitLineClamp : '2',
	WebkitBoxOrient : 'vertical',
	overflow        : 'hidden',
	width           : '100%',
	fontSize        : '0.875rem'
})

// @ Recs skeleton
const RecsSkeleton = () => {
	return (
		<Box component={Paper} p={1} display="flex" boxShadow={1} borderRadius="4px" gap={1} width="100%" height={80}>
			<Box>
				<CustomSkeleton variant="rectangular" width={64} height={64} sx={{ borderRadius: '4px' }} />
			</Box>
			<Box display="flex" flexDirection="column" width="100%" justifyContent="space-between">
				<CustomSkeleton variant="text" width="70%" />
				<CustomSkeleton variant="text" width="45%" />
			</Box>
		</Box>
	)
}

// @ Main
const GameRecs = ({ idx }) => {
	const [ expanded, setExpanded ] = useState(false)
	const { altId } = useParams()
	const matches = useMediaQuery((theme) => theme.breakpoints.up('md'))

	const { ref: recsRef, inView: recsInView } = useInView({
		threshold   : 0,
		triggerOnce : true
	})

	const {
		isLoading  : isLoadingRecs,
		isFetching : isFetchingRecs,
		data       : recData,
		isSuccess  : isSuccessRec
	} = useGetGameRecommendationsQuery({ altId, recsInView, idx })

	return (
		<Box ref={recsRef} id="recommendations" my={2} display="flex" flexDirection="column" gap={2}>
			<Box display="flex" alignItems="center" gap={1}>
				{isFetchingRecs ? <Loader size={20} /> : <RecommendTwoToneIcon color="primary" />}

				<Box fontSize="1.3rem" fontWeight="fontWeightMedium">
					Recommendations
				</Box>
			</Box>

			{isLoadingRecs && (
				<Grid container spacing={1}>
					{[ ...Array(matches ? 12 : 4).keys() ].map((i, k) => (
						<Grid key={k} item xs={12} sm={6} md={4}>
							<RecsSkeleton key={k} />
						</Grid>
					))}
				</Grid>
			)}

			{isSuccessRec &&
			recData.length > 0 && (
				<Box id="recommendations-list">
					<Collapse in={expanded} timeout="auto" collapsedSize="345px">
						<Grid container spacing={1}>
							{isSuccessRec &&
								recData.map((rec) => (
									<Grid key={rec.bggId} item xs={12} sm={6} md={4}>
										<LzLoad placeholder={<RecsSkeleton />}>
											<Box
												component={Paper}
												display="flex"
												p={1}
												boxShadow={1}
												borderRadius="4px"
												gap={1}
											>
												<a
													href={`https://boardgamegeek.com/boardgame/${rec.bggId}`}
													target="_blank"
													rel="noreferrer"
												>
													<StyledRecImg
														src={rec.thumbnail}
														alt={rec.title}
														title={rec.title}
													/>
												</a>

												<Box
													display="flex"
													flexDirection="column"
													justifyContent="space-between"
													width="100%"
												>
													<StyledTitleBox fontWeight="fontWeightMedium">
														{rec.title}
													</StyledTitleBox>
													<Box display="flex" gap={1}>
														<Box
															display="flex"
															gap={0.25}
															fontWeight="fontWeightMedium"
															fontSize="body2.fontSize"
															color="text.secondary"
														>
															<StarIcon color="primary" fontSize="small" />
															{approx(rec.stats.avgRating)}
														</Box>

														<Box
															display="flex"
															alignItems="center"
															gap={0.25}
															fontWeight="fontWeightMedium"
															fontSize="body2.fontSize"
															color="text.secondary"
														>
															<MilitaryTechIcon color="primary" fontSize="small" />
															{rec.stats.rank}
														</Box>
													</Box>
												</Box>
											</Box>
										</LzLoad>
									</Grid>
								))}
						</Grid>
					</Collapse>

					<Box display="flex" justifyContent="flex-end" mt={1}>
						<CustomButton onClick={() => setExpanded((expanded) => !expanded)}>
							{expanded ? 'Show less' : 'Show more'}
						</CustomButton>
					</Box>
				</Box>
			)}
			{isSuccessRec &&
			recData.length === 0 && <CustomAlert severity="warning">No recommendations found</CustomAlert>}
		</Box>
	)
}

export default GameRecs
