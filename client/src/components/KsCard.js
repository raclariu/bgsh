// @ Modules
import React, { useState, Fragment } from 'react'
import approx from 'approximate-number'
import { differenceInHours, differenceInDays } from 'date-fns'

// @ Mui
import { styled } from '@mui/material/styles'
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import LinearProgress from '@mui/material/LinearProgress'

// @ Icons
import CenterFocusWeakTwoToneIcon from '@mui/icons-material/CenterFocusWeakTwoTone'
import CloseIcon from '@mui/icons-material/Close'
import LocationOnTwoToneIcon from '@mui/icons-material/LocationOnTwoTone'

// @ Components
import ExtLinkIconBtn from './ExtLinkIconBtn'
import CustomDivider from './CustomDivider'
import CustomTooltip from './CustomTooltip'
import CustomIconBtn from './CustomIconBtn'

// @ Others
import { calculateTimeAgoStrict } from '../helpers/helpers'

// @ Styles
const StyledImg = styled('img')({
	objectFit : 'cover',
	width     : '100%'
})

const StyledTitleBox = styled(Box)({
	display         : '-webkit-box',
	WebkitLineClamp : '2',
	WebkitBoxOrient : 'vertical',
	overflow        : 'hidden',
	width           : '100%',
	textAlign       : 'center'
})

// @ Details
const KsDetails = ({ data }) => {
	const [ openDialog, setOpenDialog ] = useState(false)

	const handleOpenDialog = () => {
		setOpenDialog(true)
	}

	const handleCloseDialog = () => {
		setOpenDialog(false)
	}

	return (
		<Fragment>
			<CustomTooltip title="Details">
				<CustomIconBtn onClick={handleOpenDialog} color="primary" size="large">
					<CenterFocusWeakTwoToneIcon />
				</CustomIconBtn>
			</CustomTooltip>

			<Dialog fullWidth maxWidth="xs" open={openDialog} onClose={handleCloseDialog}>
				<Box width="100%" position="relative">
					<StyledImg src={data.image} alt={data.title} title={data.title} />

					<CustomIconBtn
						sx={{ position: 'absolute', top: '8px', right: '8px' }}
						onClick={handleCloseDialog}
						size="large"
						color="error"
					>
						<CloseIcon color="error" />
					</CustomIconBtn>
				</Box>

				<DialogContent>
					<Box display="flex" flexDirection="column" width="100%">
						<Box
							display="flex"
							justifyContent="space-between"
							alignItems="center"
							gap={1}
							width="100%"
							mb={2}
						>
							<Box fontSize="caption.fontSize">{`by ${data.creator}`}</Box>
							<Box display="flex" alignItems="center">
								<LocationOnTwoToneIcon color="primary" fontSize="small" />
								<Box fontSize="caption.fontSize">{data.location}</Box>
							</Box>
						</Box>

						<Box fontWeight="fontWeightMedium" fontSize="h6.fontSize" sx={{ lineHeight: 'normal' }} mb={1}>
							{data.title}
						</Box>

						<Box mb={2} fontSize="caption.fontSize">
							{data.shortDescription}
						</Box>

						<Box alignSelf="flex-end" fontSize="caption.fontSize">
							{`${data.percentFunded.toFixed(0)}% funded`}
						</Box>

						<LinearProgress
							sx={{ height: 10, borderRadius: '4px' }}
							color="success"
							variant="determinate"
							value={data.percentFunded > 100 ? 100 : data.percentFunded}
						/>

						<Box display="flex" flexDirection="column" mb={2}>
							<Box
								fontWeight="fontWeightMedium"
								fontSize="h5.fontSize"
								color="success.main"
							>{`$${approx(data.pledged, { precision: 3 })}`}</Box>
							<Box fontSize="caption.fontSize">{`pledged of $${(data.goal * data.exchangeRate).toFixed(
								0
							)} goal`}</Box>
						</Box>

						<Box display="flex" flexDirection="column" mb={2}>
							<Box fontWeight="fontWeightMedium" fontSize="h5.fontSize">
								{data.backers}
							</Box>
							<Box fontSize="caption.fontSize">backers</Box>
						</Box>

						<Box display="flex" flexDirection="column">
							<Box fontWeight="fontWeightMedium" fontSize="h5.fontSize">
								{differenceInHours(new Date(data.deadline * 1000), new Date()) > 48 ? (
									differenceInDays(new Date(data.deadline * 1000), new Date())
								) : (
									differenceInHours(new Date(data.deadline * 1000), new Date())
								)}
							</Box>
							<Box fontSize="caption.fontSize">
								{differenceInHours(new Date(data.deadline * 1000), new Date()) > 48 ? (
									'days to go'
								) : (
									'hours to go'
								)}
							</Box>
						</Box>
					</Box>
				</DialogContent>

				<CustomDivider />

				<DialogActions>
					<Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
						<Box
							fontStyle="italic"
							color="grey.500"
							fontSize="caption.fontSize"
							ml={2}
						>{`updated ${calculateTimeAgoStrict(data.createdAt)}`}</Box>
						<ExtLinkIconBtn url={data.url} tooltip="See on Kickstarter" />
					</Box>
				</DialogActions>
			</Dialog>
		</Fragment>
	)
}

// @ Main
const KsCard = ({ data }) => {
	return (
		<Card elevation={2}>
			<CardMedia
				sx={{
					objectFit : 'cover',
					height    : '150px'
				}}
				component="img"
				alt={data.title}
				image={data.image ? data.image : '/images/gameImgPlaceholder.jpg'}
				title={data.title}
			/>

			<CustomDivider />

			<CardContent>
				<Box
					display="flex"
					justifyContent="center"
					alignItems="center"
					fontWeight="fontWeightMedium"
					minHeight="3rem"
				>
					<StyledTitleBox>{data.title}</StyledTitleBox>
				</Box>
			</CardContent>

			<CustomDivider />

			<CardActions>
				<Box display="flex" alignItems="center" justifyContent="flex-end" width="100%">
					<KsDetails data={data} />
				</Box>
			</CardActions>
		</Card>
	)
}

export default KsCard
