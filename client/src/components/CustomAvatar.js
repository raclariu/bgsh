// @ Libraries
import React, { useState, Fragment } from 'react'
import { styled } from '@mui/material/styles'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

// @ Mui
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Popover from '@mui/material/Popover'

// @ Components
import CustomIconBtn from './CustomIconBtn'
import CustomDivider from './CustomDivider'
import SendMessage from './SendMessage'
import CustomTooltip from './CustomTooltip'

// @ Icons
import AccountCircleTwoToneIcon from '@mui/icons-material/AccountCircleTwoTone'

// @ Others
import { apiGetOwnAvatar } from '../api/api'

// @ Styles
const StyledAvatar = styled(Avatar)(({ theme }) => ({
	backgroundColor : theme.palette.primary.main,
	imageRendering  : '-webkit-optimize-contrast',
	cursor          : 'pointer'
}))

// @ Main
const CustomAvatar = ({ size, username, src, noClick = false }) => {
	const history = useHistory()
	const [ anchorEl, setAnchorEl ] = useState(null)

	const handleProfileClick = () => {
		history.push(`/profile/${username}`)
	}

	return (
		<Fragment>
			{/* <Box fontSize={12} fontWeight="fontWeightMedium">
					{username ? username.substring(0, 2).toUpperCase() : 'N/A'}
				</Box> */}

			{noClick && (
				<StyledAvatar
					sx={{
						width  : (theme) => theme.spacing(size),
						height : (theme) => theme.spacing(size),
						cursor : 'default'
					}}
					imgProps={{ alt: 'avatar' }}
					src={src}
				/>
			)}

			{!noClick && (
				<StyledAvatar
					sx={{
						width  : (theme) => theme.spacing(size),
						height : (theme) => theme.spacing(size)
					}}
					imgProps={{ alt: 'avatar' }}
					src={src}
					onClick={(e) => setAnchorEl(e.currentTarget)}
				/>
			)}

			<Popover
				open={Boolean(anchorEl)}
				anchorEl={anchorEl}
				onClose={() => setAnchorEl(null)}
				anchorOrigin={{
					vertical   : 'bottom',
					horizontal : 'center'
				}}
				transformOrigin={{
					vertical   : 'top',
					horizontal : 'center'
				}}
			>
				<Box p={1} display="flex" flexDirection="column">
					<Box display="flex" alignItems="center" justifyContent="space-between">
						<StyledAvatar
							sx={{
								width  : (theme) => theme.spacing(size + 4),
								height : (theme) => theme.spacing(size + 4),
								cursor : 'default'
							}}
							src={src}
						/>

						{/* <Box>{username.substring(0, 2).toUpperCase()}</Box> */}

						<CustomDivider sx={{ ml: 2, mr: 1 }} orientation="vertical" variant="middle" flexItem />

						<Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
							<Box fontWeight="fontWeightMedium">{username}</Box>

							<Box display="flex" justifyContent="center" alignItems="center" gap={1} mt={0.5}>
								<CustomTooltip title="View profile">
									<CustomIconBtn color="primary" onClick={handleProfileClick} size="large">
										<AccountCircleTwoToneIcon fontSize="small" />
									</CustomIconBtn>
								</CustomTooltip>

								<SendMessage recipientUsername={username} />
							</Box>
						</Box>
					</Box>
				</Box>
			</Popover>
		</Fragment>
	)
}

export default CustomAvatar
