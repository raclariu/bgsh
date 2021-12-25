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

const PREFIX = 'CustomAvatar'

const classes = {
	small         : `${PREFIX}-small`,
	medium        : `${PREFIX}-medium`,
	large         : `${PREFIX}-large`,
	popoverAvatar : `${PREFIX}-popoverAvatar`
}

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled('div')(({ theme }) => ({
	[`& .${classes.small}`]: {
		width           : theme.spacing(3),
		height          : theme.spacing(3),
		backgroundColor : theme.palette.primary.main,
		cursor          : 'pointer'
	},

	[`& .${classes.medium}`]: {
		width           : theme.spacing(4),
		height          : theme.spacing(4),
		backgroundColor : theme.palette.primary.main,
		cursor          : 'pointer'
	},

	[`& .${classes.large}`]: {
		width           : theme.spacing(5),
		height          : theme.spacing(5),
		backgroundColor : theme.palette.primary.main,
		cursor          : 'pointer'
	},

	[`& .${classes.popoverAvatar}`]: {
		width           : theme.spacing(4),
		height          : theme.spacing(4),
		backgroundColor : theme.palette.primary.main
	}
}))

// @ Main
const CustomAvatar = ({ size, user }) => {
	const history = useHistory()

	const [ anchorEl, setAnchorEl ] = useState(null)

	const handleProfileClick = () => {
		history.push(`/profile/${user}`)
	}

	return (
		<Root>
			<Box display="flex" flexDirection="row" alignItems="center">
				<Avatar
					onClick={(e) => setAnchorEl(e.currentTarget)}
					className={size === 'small' ? classes.small : size === 'medium' ? classes.medium : classes.large}
				>
					<Box fontSize={size === 'small' ? 10 : size === 'medium' ? 12 : 14}>
						{user.substring(0, 2).toUpperCase()}
					</Box>
				</Avatar>
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
						<Box ml={1}>
							<Avatar className={classes.popoverAvatar} color="primary">
								<Box fontSize={12}>{user.substring(0, 2).toUpperCase()}</Box>
							</Avatar>
						</Box>
						<Box ml={1} fontWeight="fontWeightMedium">
							{user}
						</Box>
						<Box ml={2}>
							<IconButton color="primary" onClick={handleProfileClick} size="large">
								<AccountCircleTwoToneIcon />
							</IconButton>
						</Box>
						<SendMessage recipientUsername={user} />
					</Box>
				</Box>
			</Popover>
		</Root>
	)
}

export default CustomAvatar
