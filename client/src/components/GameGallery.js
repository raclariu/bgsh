// @ Modules
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'
import { useInView } from 'react-intersection-observer'

// @ Mui
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Slide from '@mui/material/Slide'
import Paper from '@mui/material/Paper'

// @ Icons
import ImageTwoToneIcon from '@mui/icons-material/ImageTwoTone'
import CloseIcon from '@mui/icons-material/Close'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

// @ Components
import ExtLinkIconBtn from './ExtLinkIconBtn'
import CustomTooltip from './CustomTooltip'
import CustomIconBtn from './CustomIconBtn'
import Loader from './Loader'
import LzLoad from './LzLoad'
import CustomAlert from './CustomAlert'
import CustomSkeleton from './Skeletons/CustomSkeleton'

// @ Others
import { useGetGameGalleryQuery } from '../hooks/hooks'

// @ Styles
const StyledMasonryImg = styled('img')({
	verticalAlign : 'middle',
	maxHeight     : '100%',
	width         : '100%',
	objectFit     : 'contain',
	cursor        : 'zoom-in',
	borderRadius  : '4px'
})

const StyledDialogImg = styled('img')({
	maxHeight : '100%',
	width     : '100%',
	objectFit : 'contain'
})

// @ Gallery skeleton
const GallerySkeleton = () => {
	return (
		<Box
			component={Paper}
			borderRadius="4px"
			boxShadow={1}
			p={1}
			width="100%"
			height={Math.floor(Math.random() * (270 - 100 + 1) + 100)}
		>
			<CustomSkeleton variant="rectangular" width="100%" height="100%" sx={{ borderRadius: '4px' }} />
		</Box>
	)
}

const GameGallery = ({ idx }) => {
	const { altId } = useParams()

	const { ref: galleryRef, inView: galleryInView } = useInView({
		threshold   : 0,
		triggerOnce : true
	})

	const [ imgIdx, setImgIdx ] = useState(0)
	const [ openGalleryDialog, setOpenGalleryDialog ] = useState(false)
	const [ imgLoaded, setImgLoaded ] = useState(false)

	const {
		isLoading  : isLoadingGallery,
		isFetching : isFetchingGallery,
		isError    : isErrorGallery,
		error      : errorGallery,
		data       : galleryData,
		isSuccess  : isSuccessGallery
	} = useGetGameGalleryQuery({ altId, galleryInView, idx })

	const handleOpenGalleryImageDialog = (imgIdxClicked) => {
		setImgIdx(imgIdxClicked)
		setOpenGalleryDialog(true)
	}

	const handleCloseGalleryImageDialog = () => {
		setOpenGalleryDialog(false)
		setImgLoaded(false)
	}

	const onImgLoad = () => {
		setImgLoaded(true)
	}

	const cycleImages = (type) => {
		if (type === 'back') {
			if (imgIdx > 0) {
				setImgLoaded(false)
				setImgIdx(imgIdx - 1)
			}
		}
		if (type === 'forward') {
			if (galleryData.length > imgIdx + 1) {
				setImgLoaded(false)
				setImgIdx(imgIdx + 1)
			}
		}
	}

	return (
		<Box ref={galleryRef} id="gallery" my={2} display="flex" flexDirection="column" gap={2}>
			<Box display="flex" alignItems="center" gap={1}>
				{isFetchingGallery ? <Loader size={20} /> : <ImageTwoToneIcon color="primary" />}

				<Box fontSize="1.3rem" fontWeight="fontWeightMedium">
					Gallery
				</Box>
			</Box>

			{isErrorGallery && <CustomAlert severity="warning">{errorGallery.response.data.message}</CustomAlert>}

			{isLoadingGallery && (
				<ResponsiveMasonry columnsCountBreakPoints={{ 0: 2, 600: 3, 900: 4 }}>
					<Masonry gutter="8px">{[ ...Array(12).keys() ].map((i, k) => <GallerySkeleton key={k} />)}</Masonry>
				</ResponsiveMasonry>
			)}

			{isSuccessGallery &&
			galleryData.length > 0 && (
				<Box id="gallery-list">
					<ResponsiveMasonry columnsCountBreakPoints={{ 0: 2, 600: 3, 900: 4 }}>
						<Masonry gutter="8px">
							{galleryData.map((obj, i) => (
								<LzLoad key={obj.imageid}>
									<Box component={Paper} borderRadius="4px" boxShadow={1} p={1}>
										<StyledMasonryImg
											onClick={() => handleOpenGalleryImageDialog(i)}
											src={obj.thumbnail}
											alt={obj.caption}
										/>
									</Box>
								</LzLoad>
							))}
						</Masonry>
					</ResponsiveMasonry>

					{galleryData[imgIdx] && (
						<Dialog
							fullScreen
							open={openGalleryDialog}
							TransitionComponent={Slide}
							transitionDuration={350}
							TransitionProps={{ direction: 'up' }}
						>
							<DialogTitle>
								<Box display="flex" alignItems="flex-start" justifyContent="space-between" gap={3}>
									<Box display="flex" flexDirection="column" gap={0.5}>
										<Box fontSize="1rem">{galleryData[imgIdx].caption}</Box>
										<Box fontStyle="italic" fontSize="caption.fontSize" color="grey.500">
											{`uploaded by ${galleryData[imgIdx].postedBy}`}
										</Box>
									</Box>
									<CustomIconBtn
										onClick={handleCloseGalleryImageDialog}
										size="large"
										edge="end"
										color="error"
									>
										<CloseIcon />
									</CustomIconBtn>
								</Box>
							</DialogTitle>

							<DialogContent
								dividers
								sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
							>
								<StyledDialogImg
									alt={galleryData[imgIdx].caption}
									src={galleryData[imgIdx].image}
									hidden={!imgLoaded}
									onLoad={onImgLoad}
								/>

								{!imgLoaded && (
									<Box display="flex" justifyContent="center" alignItems="center">
										<Loader />
									</Box>
								)}
							</DialogContent>

							<DialogActions>
								<Box width="100%" display="flex" justifyContent="space-between" alignItems="center">
									<Box display="flex" gap={2} alignItems="center">
										<CustomTooltip title="Previous image">
											<CustomIconBtn
												disabled={imgIdx === 0}
												color="primary"
												onClick={() => cycleImages('back')}
												size="large"
											>
												<ArrowBackIcon />
											</CustomIconBtn>
										</CustomTooltip>
										<CustomTooltip title="Next image">
											<CustomIconBtn
												disabled={galleryData.length === imgIdx + 1}
												color="primary"
												onClick={() => cycleImages('forward')}
												size="large"
											>
												<ArrowForwardIcon />
											</CustomIconBtn>
										</CustomTooltip>
									</Box>

									<ExtLinkIconBtn url={`https://boardgamegeek.com${galleryData[imgIdx].extLink}`} />
								</Box>
							</DialogActions>
						</Dialog>
					)}
				</Box>
			)}

			{isSuccessGallery &&
			galleryData.length === 0 && <CustomAlert severity="warning">No images found</CustomAlert>}
		</Box>
	)
}

export default GameGallery
