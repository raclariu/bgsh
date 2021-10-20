// @ Libraries
import React, { useState, Fragment } from 'react'
import { useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'

// @ Mui
import Avatar from '@material-ui/core/Avatar'
import Box from '@material-ui/core/Box'
import Popover from '@material-ui/core/Popover'

// @ Styles
const useStyles = makeStyles((theme) => ({
	small  : {
		width           : theme.spacing(3),
		height          : theme.spacing(3),
		backgroundColor : theme.palette.primary.main,
		cursor          : 'pointer'
	},
	medium : {
		width           : theme.spacing(4),
		height          : theme.spacing(4),
		backgroundColor : theme.palette.primary.main,
		cursor          : 'pointer'
	},
	large  : {
		width           : theme.spacing(5),
		height          : theme.spacing(5),
		backgroundColor : theme.palette.primary.main,
		cursor          : 'pointer'
	}
}))

// @ Main
const CustomAvatar = ({ size, user }) => {
	const cls = useStyles()

	const userSignIn = useSelector((state) => state.userSignIn)
	const { userInfo } = userSignIn

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
					color="primary"
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
					Posted by {user}
				</Box>
			</Popover>
		</Fragment>
	)
}

export default CustomAvatar
