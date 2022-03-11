// @ Modules
import React from 'react'
import { useParams } from 'react-router-dom'
import { useInView } from 'react-intersection-observer'

// @ Mui
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'

// @ Components
import LzLoad from './LzLoad'
import CustomSkeleton from './Skeletons/CustomSkeleton'
import Loader from './Loader'
import CustomAlert from './CustomAlert'

// @ Icons
import OndemandVideoTwoToneIcon from '@mui/icons-material/OndemandVideoTwoTone'

// @ Others
import { useGetGameVideosQuery } from '../hooks/hooks'

// @ Styles
const StyledYtImg = styled('img')({
	imageRendering : '-webkit-optimize-contrast',
	verticalAlign  : 'middle',
	minWidth       : '120px',
	maxHeight      : '90px',
	objectFit      : 'cover',
	cursor         : 'pointer',
	borderRadius   : '4px'
})

// @ Vids skeleton
const VidsSkeleton = () => {
	return (
		<Box
			p={1}
			display="flex"
			boxShadow={1}
			borderRadius="4px"
			bgcolor="background.paper"
			gap={1}
			width="100%"
			height={106}
		>
			<Box>
				<CustomSkeleton variant="rectangular" width={120} height={90} sx={{ borderRadius: '4px' }} />
			</Box>
			<Box display="flex" flexDirection="column" width="100%" justifyContent="flex-start">
				<CustomSkeleton variant="text" width="70%" />
				<CustomSkeleton variant="text" width="45%" />
			</Box>
		</Box>
	)
}

// @ Main
const GameVids = ({ idx }) => {
	const { altId } = useParams()

	const { ref: vidsRef, inView: vidsInView } = useInView({
		threshold   : 0,
		triggerOnce : true
	})

	const {
		isLoading  : isLoadingVids,
		isFetching : isFetchingVids,
		data       : vidsData,
		isSuccess  : isSuccessVids
	} = useGetGameVideosQuery({ altId, vidsInView, idx })

	return (
		<Box ref={vidsRef} id="videos" my={2} display="flex" flexDirection="column" gap={2}>
			<Box display="flex" alignItems="center" gap={1}>
				{isFetchingVids ? <Loader size={20} /> : <OndemandVideoTwoToneIcon color="primary" />}

				<Box fontSize="1.3rem" fontWeight="fontWeightMedium">
					Videos
				</Box>
			</Box>

			{isLoadingVids && (
				<Box
					sx={{
						display             : 'grid',
						gridTemplateColumns : {
							xs : '100%',
							sm : 'repeat(2, 1fr)' // auto min-content sau auto-auto sau auto 1fr
						},
						gap                 : 1
					}}
				>
					{[ ...Array(4).keys() ].map((i, k) => <VidsSkeleton key={k} />)}
				</Box>
			)}

			{isSuccessVids &&
			vidsData.length > 0 && (
				<Box
					id="video-list"
					sx={{
						display             : 'grid',
						gridTemplateColumns : {
							xs : '100%',
							sm : 'repeat(2, 1fr)' // auto min-content sau auto-auto sau auto 1fr
						},
						gap                 : 1
					}}
				>
					{vidsData.map((video) => (
						<LzLoad key={video.ytId} placeholder={<VidsSkeleton />}>
							<Box
								display="flex"
								gap={1}
								alignItems="flex-start"
								boxShadow={1}
								borderRadius="4px"
								width="100%"
								bgcolor="background.paper"
								p={1}
							>
								<Box boxShadow={1} borderRadius="4px">
									<LzLoad>
										<a
											href={`https://boardgamegeek.com${video.extLink}`}
											target="_blank"
											rel="noreferrer"
										>
											<StyledYtImg src={video.thumbnail} alt={video.title} title={video.title} />
										</a>
									</LzLoad>
								</Box>
								<Box
									display="flex"
									flexDirection="column"
									alignItems="flex-start"
									justifyContent="flex-start"
									gap={0.5}
								>
									<Box
										fontSize="0.875rem"
										fontWeight="fontWeightMedium"
										sx={{ wordBreak: 'break-word' }}
									>
										{video.title}
									</Box>
									<Box fontSize="0.75rem" color="grey.500" fontStyle="italic">
										{video.user} • {video.type}
									</Box>
								</Box>
							</Box>
						</LzLoad>
					))}
				</Box>
			)}

			{isSuccessVids && vidsData.length === 0 && <CustomAlert severity="warning">No videos found</CustomAlert>}
		</Box>
	)
}

export default GameVids
