// @ Libraries
import React, { useState, Fragment } from 'react'
import { useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'

// @ Mui
import Avatar from '@material-ui/core/Avatar'
import Box from '@material-ui/core/Box'
import Popover from '@material-ui/core/Popover'
import IconButton from '@material-ui/core/IconButton'

// @ Components
import SendMessage from './SendMessage'

// @ Icons
import AccountCircleTwoToneIcon from '@material-ui/icons/AccountCircleTwoTone'

// @ Styles
const useStyles = makeStyles((theme) => ({
	small         : {
		width           : theme.spacing(3),
		height          : theme.spacing(3),
		backgroundColor : theme.palette.primary.main,
		cursor          : 'pointer'
	},
	medium        : {
		width           : theme.spacing(4),
		height          : theme.spacing(4),
		backgroundColor : theme.palette.primary.main,
		cursor          : 'pointer'
	},
	large         : {
		width           : theme.spacing(5),
		height          : theme.spacing(5),
		backgroundColor : theme.palette.primary.main,
		cursor          : 'pointer'
	},
	popoverAvatar : {
		width           : theme.spacing(4),
		height          : theme.spacing(4),
		backgroundColor : theme.palette.primary.main
	}
}))

// @ Main
const CustomAvatar = ({ size, user }) => {
	const cls = useStyles()

	const userAuth = useSelector((state) => state.userAuth)
	const { userData } = userAuth

	const [ anchorEl, setAnchorEl ] = useState(null)

	const handleClick = (e) => {
		setAnchorEl(e.currentTarget)
	}

	const handleClose = () => {
		setAnchorEl(null)
	}

	return (
		<Fragment>
			<Box display="flex" flexDirection="row" alignItems="center">
				<Avatar
					onClick={handleClick}
					className={size === 'small' ? cls.small : size === 'medium' ? cls.medium : cls.large}
				>
					<Box fontSize={size === 'small' ? 10 : size === 'medium' ? 12 : 14}>
						{user.substring(0, 2).toUpperCase()}
					</Box>
				</Avatar>
			</Box>

			<Popover
				open={Boolean(anchorEl)}
				anchorEl={anchorEl}
				onClose={handleClose}
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
							<Avatar className={cls.popoverAvatar} color="primary">
								<Box fontSize={12}>{user.substring(0, 2).toUpperCase()}</Box>
							</Avatar>
						</Box>
						<Box ml={1} fontWeight="fontWeightMedium">
							{user}
						</Box>
						<Box ml={2}>
							<IconButton color="primary">
								<AccountCircleTwoToneIcon />
							</IconButton>
						</Box>
						<SendMessage recipientUsername={user} />
					</Box>
				</Box>
			</Popover>
		</Fragment>
	)
}

export default CustomAvatar
