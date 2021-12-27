// @ Libraries
import React, { useState, Fragment } from 'react'
import { styled } from '@mui/material/styles'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

// @ Mui
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Popover from '@mui/material/Popover'
import IconButton from '@mui/material/IconButton'

// @ Components
import SendMessage from './SendMessage'

// @ Icons
import AccountCircleTwoToneIcon from '@mui/icons-material/AccountCircleTwoTone'

// @ Styles
const SmallAvatar = styled(Avatar)(({ theme }) => ({
	width           : theme.spacing(3),
	height          : theme.spacing(3),
	backgroundColor : theme.palette.primary.main,
	cursor          : 'pointer'
}))
const MediumAvatar = styled(Avatar)(({ theme }) => ({
	width           : theme.spacing(4),
	height          : theme.spacing(4),
	backgroundColor : theme.palette.primary.main,
	cursor          : 'pointer'
}))
const LargeAvatar = styled(Avatar)(({ theme }) => ({
	width           : theme.spacing(5),
	height          : theme.spacing(5),
	backgroundColor : theme.palette.primary.main,
	cursor          : 'pointer'
}))

const InactiveAvatar = styled(Avatar)(({ theme }) => ({
	width           : theme.spacing(5),
	height          : theme.spacing(5),
	backgroundColor : theme.palette.primary.main
}))

// @ Main
const CustomAvatar = ({ size, user }) => {
	const history = useHistory()

	const [ anchorEl, setAnchorEl ] = useState(null)

	const handleProfileClick = () => {
		history.push(`/profile/${user}`)
	}

	return (
		<Fragment>
			<Box display="flex" flexDirection="row" alignItems="center">
				{size === 'small' && (
					<SmallAvatar onClick={(e) => setAnchorEl(e.currentTarget)}>
						<Box fontSize={10}>{user.substring(0, 2).toUpperCase()}</Box>
					</SmallAvatar>
				)}

				{size === 'medium' && (
					<MediumAvatar onClick={(e) => setAnchorEl(e.currentTarget)}>
						<Box fontSize={12}>{user.substring(0, 2).toUpperCase()}</Box>
					</MediumAvatar>
				)}

				{size === 'large' && (
					<LargeAvatar onClick={(e) => setAnchorEl(e.currentTarget)}>
						<Box fontSize={14}>{user.substring(0, 2).toUpperCase()}</Box>
					</LargeAvatar>
				)}
			</Box>

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
						<InactiveAvatar>
							<Box fontSize={size === 'small' ? 10 : size === 'medium' ? 12 : 14}>
								{user.substring(0, 2).toUpperCase()}
							</Box>
						</InactiveAvatar>

						<Box ml={1} fontWeight="fontWeightMedium">
							{user}
						</Box>

						<IconButton color="primary" onClick={handleProfileClick} size="large" sx={{ ml: 2 }}>
							<AccountCircleTwoToneIcon />
						</IconButton>

						<SendMessage recipientUsername={user} />
					</Box>
				</Box>
			</Popover>
		</Fragment>
	)
}

export default CustomAvatar
