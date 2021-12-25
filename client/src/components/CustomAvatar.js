// @ Libraries
import React, { useState, Fragment } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import makeStyles from '@mui/styles/makeStyles';

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
	const history = useHistory()

	const [ anchorEl, setAnchorEl ] = useState(null)

	const handleProfileClick = () => {
		history.push(`/profile/${user}`)
	}

	return (
        <Fragment>
			<Box display="flex" flexDirection="row" alignItems="center">
				<Avatar
					onClick={(e) => setAnchorEl(e.currentTarget)}
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
							<Avatar className={cls.popoverAvatar} color="primary">
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
		</Fragment>
    );
}

export default CustomAvatar
