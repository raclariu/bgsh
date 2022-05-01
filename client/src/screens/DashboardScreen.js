// @ Modules
import React, { Fragment } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useInView } from 'react-intersection-observer'
import { useNavigate } from 'react-router-dom'

// @ Mui
import { styled } from '@mui/material/styles'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'

// @ Icons
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment'
import MoreTwoToneIcon from '@mui/icons-material/MoreTwoTone'

// @ Components
import MyAvatar from '../components/MyAvatar'
import CustomSkeleton from '../components/Skeletons/CustomSkeleton'
import HotGamesCardSkeleton from '../components/Skeletons/HotGamesCardSkeleton'
import CrowdfundingCardSkeleton from '../components/Skeletons/CrowdfundingCardSkeleton'
import CrowdfundingCard from '../components/CrowdfundingCard'
import CustomTooltip from '../components/CustomTooltip'
import CustomIconBtn from '../components/CustomIconBtn'
import ReportForm from '../components/ReportForm'
import HotGameCard from '../components/HotGameCard'
import CustomAlert from '../components/CustomAlert'
import LzLoad from '../components/LzLoad'
import ExtLinkIconBtn from '../components/ExtLinkIconBtn'
import CollectionFetchBox from '../components/CollectionFetchBox'
import BggSearchGamesBox from '../components/BggSearchGamesBox'
import SendMessage from '../components/SendMessage'
import Helmet from '../components/Helmet'
import CustomDivider from '../components/CustomDivider'

// @ Others
import {
	useGetBggHotGamesQuery,
	useGetBggNewReleasesQuery,
	useGetBggCrowdfundingQuery,
	useGetRedditPostsQuery
} from '../hooks/hooks'
import { dateDiff } from '../helpers/helpers'

// @ Styles
const StyledDescriptionBox = styled(Box)({
	display         : '-webkit-box',
	WebkitLineClamp : '2',
	WebkitBoxOrient : 'vertical',
	overflow        : 'hidden',
	width           : '100%'
})

const StyledImg = styled('img')({
	verticalAlign  : 'bottom',
	objectFit      : 'cover',
	width          : 120,
	height         : 81,
	borderRadius   : '4px',
	imageRendering : '-webkit-optimize-contrast'
})

// @ New releases skeleton
const NewReleasesSkeleton = () => {
	return (
		<Paper
			sx={{
				display      : 'flex',
				alignItems   : 'flex-start',
				boxShadow    : 1,
				borderRadius : 1,
				p            : 1,
				gap          : 2,
				width        : '100%'
			}}
		>
			<CustomSkeleton sx={{ borderRadius: '4px' }} variant="rectangle" height={81} width={120} />
			<Box display="flex" flexDirection="column">
				<CustomSkeleton width={220} />
				<CustomSkeleton width={120} />
				<CustomSkeleton width={240} />
			</Box>
		</Paper>
	)
}

// @ RedditSkeleton
const RedditSkeleton = () => {
	return (
		<Paper
			sx={{
				display      : 'flex',
				boxShadow    : 1,
				borderRadius : 1,
				p            : 1,
				width        : '100%',
				height       : '116px',
				gap          : 1
			}}
		>
			<CustomSkeleton variant="rectangle" width={180} height={100} sx={{ borderRadius: 1 }} />
			<Box display="flex" flexDirection="column" width="100%" ml={1}>
				<CustomSkeleton variant="text" width="90%" />
				<CustomSkeleton variant="text" width="75%" />
				<CustomSkeleton variant="text" width="60%" />
			</Box>
		</Paper>
	)
}

// @ Main
const DashboardScreen = () => {
	const navigate = useNavigate()

	const currUsername = useSelector((state) => state.userData.username)

	const { ref: redditRef, inView: redditInView } = useInView({
		threshold   : 0,
		triggerOnce : true
	})

	const { ref: newRelRef, inView: newRelInView } = useInView({
		threshold   : 0,
		triggerOnce : true
	})

	const { ref: crowdfundingRef, inView: crowdfundingInView } = useInView({
		threshold   : 0,
		triggerOnce : true
	})

	const {
		isFetching : isFetchingHotGames,
		error      : errorHotGames,
		data       : hotGamesList,
		isSuccess  : isSuccessHotGames
	} = useGetBggHotGamesQuery()

	const {
		isFetching : isFetchingNewRel,
		error      : errorNewRel,
		data       : newReleases,
		isSuccess  : isSuccessNewRel
	} = useGetBggNewReleasesQuery({
		inView : newRelInView
	})

	const {
		isFetching : isFetchingCrowdfunding,
		error      : errorCrowdfunding,
		data       : crowdfundingCampaigns,
		isSuccess  : isSuccessCrowdfunding
	} = useGetBggCrowdfundingQuery({ inView: crowdfundingInView })

	const {
		isFetching : isFetchingRedditPosts,
		error      : errorRedditPosts,
		data       : redditPosts,
		isSuccess  : isSuccessRedditPosts
	} = useGetRedditPostsQuery({ inView: redditInView })

	return (
		<Fragment>
			<Helmet title={`${currUsername}'s dashboard`} />

			<Box display="flex" alignItems="flex-start" gap={2}>
				<Box
					sx={{ cursor: 'pointer', borderRadius: '50%' }}
					onClick={() => navigate(`/profile/${currUsername}`)}
				>
					<MyAvatar size={10} />
				</Box>
				<Box display="flex" flexDirection="column" alignItems="center" gap={1}>
					<Box sx={{ lineHeight: 1.2 }} fontSize="h5.fontSize" fontWeight="fontWeightMedium">
						{currUsername}
					</Box>
					<Box display="flex" alignItems="center" gap={1}>
						<SendMessage />
						<ReportForm />
					</Box>
				</Box>
			</Box>

			<CustomDivider sx={{ my: 2 }} />

			<Box
				sx={{
					display             : 'grid',
					gridTemplateColumns : {
						xs : '100%',
						md : '1fr 1fr' // auto min-content sau auto-auto sau auto 1fr
					},
					gap                 : 2,
					mb                  : 6
				}}
			>
				<Box
					component={Paper}
					p={2}
					borderRadius="4px"
					boxShadow={2}
					id="collection-fetch-box"
					display="flex"
					flexDirection="column"
					gap={2}
				>
					<Box fontSize="h6.fontSize" fontWeight="fontWeightMedium">
						Import your BGG collection
					</Box>
					<CollectionFetchBox />
				</Box>

				<Box
					component={Paper}
					p={2}
					borderRadius="4px"
					boxShadow={2}
					id="bgg-search-box"
					display="flex"
					flexDirection="column"
					gap={2}
				>
					<Box fontSize="h6.fontSize" fontWeight="fontWeightMedium">
						Search BGG titles
					</Box>
					<BggSearchGamesBox />
				</Box>
			</Box>

			<Box id="hot-games" mb={6}>
				<Box
					component={Paper}
					display="flex"
					justifyContent="space-between"
					alignItems="center"
					width="100%"
					p={2}
					borderRadius="4px"
					boxShadow={2}
					my={2}
				>
					<Box fontSize="h5.fontSize" fontWeight="fontWeightMedium">
						Hot games
					</Box>

					{!errorHotGames && (
						<CustomTooltip title="See more hot games">
							<CustomIconBtn component={RouterLink} to="/hot" color="primary" size="large">
								<LocalFireDepartmentIcon />
							</CustomIconBtn>
						</CustomTooltip>
					)}
				</Box>

				{errorHotGames && <CustomAlert>{errorHotGames.response.data.message}</CustomAlert>}

				{isFetchingHotGames && (
					<Grid container spacing={3} direction="row">
						{[ ...Array(12).keys() ].map((i, k) => (
							<Grid item key={k} xs={12} sm={6} md={4}>
								<HotGamesCardSkeleton />
							</Grid>
						))}
					</Grid>
				)}

				{isSuccessHotGames && (
					<Grid container spacing={3}>
						{hotGamesList.slice(0, 6).map((data) => (
							<Grid key={data.bggId} item xs={12} sm={6} md={4}>
								<LzLoad offset={200} once placeholder={<HotGamesCardSkeleton />}>
									<HotGameCard data={data} />
								</LzLoad>
							</Grid>
						))}
					</Grid>
				)}
			</Box>

			<Box ref={newRelRef} id="new-releases" mb={6}>
				<Box
					component={Paper}
					display="flex"
					justifyContent="space-between"
					alignItems="center"
					width="100%"
					p={2}
					borderRadius="4px"
					boxShadow={2}
					my={2}
				>
					<Box fontSize="h5.fontSize" fontWeight="fontWeightMedium">
						New releases
					</Box>
					<ExtLinkIconBtn url={`https://boardgamegeek.com/newreleases`} tooltip="See new releases" />
				</Box>

				{errorNewRel && <CustomAlert>{errorNewRel.response.data.message}</CustomAlert>}

				{isFetchingNewRel && (
					<Box
						sx={{
							display             : 'grid',
							gridTemplateColumns : {
								xs : '100%',
								sm : 'repeat(2, 1fr)' // auto min-content sau auto-auto sau auto 1fr
							},
							gap                 : 2
						}}
					>
						{[ ...Array(10).keys() ].map((i, k) => <NewReleasesSkeleton key={k} />)}
					</Box>
				)}

				{isSuccessNewRel && (
					<Box
						sx={{
							display             : 'grid',
							gridTemplateColumns : {
								xs : '100%',
								sm : 'repeat(2, 1fr)' // auto min-content sau auto-auto sau auto 1fr
							},
							gap                 : 2
						}}
					>
						{newReleases.map((rel) => (
							<LzLoad key={rel.bggId} placeholder={<NewReleasesSkeleton />}>
								<Paper
									key={rel.bggId}
									sx={{
										display      : 'flex',
										alignItems   : 'flex-start',
										boxShadow    : 1,
										borderRadius : 1,
										p            : 1,
										gap          : 2,
										width        : '100%',
										height       : '100%'
									}}
								>
									<a
										href={`https://boardgamegeek.com/boardgame/${rel.bggId}`}
										target="_blank"
										rel="noreferrer"
									>
										<StyledImg src={rel.thumbnail} alt={rel.title} title={rel.title} />
									</a>

									<Box display="flex" flexDirection="column" sx={{ wordBreak: 'break-word' }}>
										<Box fontWeight="fontWeightMedium">{rel.title}</Box>
										<Box
											display="flex"
											flexDirection="column"
											justifyContent="flex-start"
											alignItems="flex-start"
											gap={0.5}
										>
											<Box fontSize="caption.fontSize" color="text.disabled">
												{rel.publisher}
											</Box>
											<StyledDescriptionBox
												sx={{ color: 'text.secondary', fontSize: 'caption.fontSize' }}
											>
												{rel.description}
											</StyledDescriptionBox>
										</Box>
									</Box>
								</Paper>
							</LzLoad>
						))}
					</Box>
				)}
			</Box>

			<Box ref={crowdfundingRef} id="crowdfunding" mb={6}>
				<Box
					component={Paper}
					display="flex"
					justifyContent="space-between"
					alignItems="center"
					width="100%"
					p={2}
					borderRadius="4px"
					boxShadow={2}
					my={2}
				>
					<Box fontSize="h5.fontSize" fontWeight="fontWeightMedium">
						Crowdfunding countdown
					</Box>

					{!errorCrowdfunding && (
						<CustomTooltip title="See more projects">
							<CustomIconBtn component={RouterLink} to="/crowdfunding" color="primary" size="large">
								<MoreTwoToneIcon />
							</CustomIconBtn>
						</CustomTooltip>
					)}
				</Box>

				{errorCrowdfunding && <CustomAlert>{errorCrowdfunding.response.data.message}</CustomAlert>}

				{isFetchingCrowdfunding && (
					<Grid container spacing={3} direction="row">
						{[ ...Array(12).keys() ].map((i, k) => (
							<Grid item key={k} xs={12} sm={6} md={4}>
								<CrowdfundingCardSkeleton />
							</Grid>
						))}
					</Grid>
				)}

				{isSuccessCrowdfunding && (
					<Grid container spacing={3}>
						{crowdfundingCampaigns.slice(0, 12).map(
							(data) =>
								dateDiff(data.deadline, 'm') > 0 && (
									<Grid key={data.bggId} item xs={12} sm={6} md={4}>
										<LzLoad placeholder={<CrowdfundingCardSkeleton />}>
											<CrowdfundingCard data={data} />
										</LzLoad>
									</Grid>
								)
						)}
					</Grid>
				)}
			</Box>

			<Box ref={redditRef} id="reddit-posts">
				<Box
					component={Paper}
					display="flex"
					justifyContent="space-between"
					alignItems="center"
					width="100%"
					p={2}
					borderRadius="4px"
					boxShadow={2}
					my={2}
				>
					<Box fontSize="h5.fontSize" fontWeight="fontWeightMedium">
						r/boardgames posts
					</Box>
					<ExtLinkIconBtn url={`https://reddit.com/r/boardgames`} tooltip="See more reddit posts" />
				</Box>

				{errorRedditPosts && <CustomAlert>Error while fetching Reddit posts</CustomAlert>}

				{isFetchingRedditPosts && (
					<Box display="flex" flexDirection="column" gap={1}>
						{[ ...Array(10).keys() ].map((i, k) => <RedditSkeleton key={k} />)}
					</Box>
				)}

				{isSuccessRedditPosts && (
					<Box display="flex" flexDirection="column" gap={2}>
						{redditPosts.map(
							({ data }) =>
								!data.stickied && (
									<Paper
										key={data.id}
										sx={{
											display      : 'flex',

											boxShadow    : 1,
											borderRadius : 1,
											p            : 1,
											gap          : 2,
											width        : '100%'
										}}
									>
										{data.is_gallery && (
											<Box
												alignSelf="flex-start"
												component="a"
												href={`https://reddit.com${data.permalink}`}
												target="_blank"
												rel="noreferrer"
											>
												<StyledImg src={data.thumbnail} alt={data.title} />
											</Box>
										)}

										<Box
											display="flex"
											flexDirection="column"
											width="100%"
											justifyContent="space-between"
										>
											<Box sx={{ wordBreak: 'break-word' }} fontWeight="fontWeightMedium">
												{data.title}
											</Box>
											<Box display="flex" justifyContent="flex-end" alignItems="center" gap={1}>
												<Box fontSize="caption.fontSize" color="text.disabled">
													by {data.author}
												</Box>
												<ExtLinkIconBtn
													url={`https://reddit.com${data.permalink}`}
													tooltip="See on Reddit"
												/>
											</Box>
										</Box>
									</Paper>
								)
						)}
					</Box>
				)}
			</Box>
		</Fragment>
	)
}

export default DashboardScreen
