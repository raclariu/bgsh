// @ Libraries
import React, { Fragment, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { makeStyles } from '@material-ui/core/styles'

// @ Mui
import Popover from '@material-ui/core/Popover'
import IconButton from '@material-ui/core/IconButton'
import Box from '@material-ui/core/Box'
import Grow from '@material-ui/core/Grow'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Divider from '@material-ui/core/Divider'
import Badge from '@material-ui/core/Badge'
import Button from '@material-ui/core/Button'
import Avatar from '@material-ui/core/Avatar'
import Chip from '@material-ui/core/Chip'

// @ Icons
import NotificationsNoneTwoToneIcon from '@material-ui/icons/NotificationsNoneTwoTone'
import FavoriteIcon from '@material-ui/icons/Favorite'
import HighlightOffIcon from '@material-ui/icons/HighlightOff'
import NotificationsActiveTwoToneIcon from '@material-ui/icons/NotificationsActiveTwoTone'

// @ Others
import { apiGetNotifications } from '../api/api'
import { calculateTimeAgo } from '../helpers/helpers'

// @ Styles
const useStyles = makeStyles((theme) => ({
	popover   : {
		[theme.breakpoints.down('xs')]: {
			width : '100vw'
		},
		[theme.breakpoints.up('sm')]: {
			width : 400
		},
		maxHeight                      : '40vh'
	},
	subheader : {
		margin : theme.spacing(2, 0, 2, 0)
	},
	btnGroup  : {
		display        : 'flex',
		alignItems     : 'center',
		justifyContent : 'center',
		marginBottom   : theme.spacing(2)
	},
	inline    : {
		display : 'inline'
	}
}))

// @ Main
const NotificationsPopper = () => {
	const cls = useStyles()

	const [ anchorEl, setAnchorEl ] = useState(null)
	const open = Boolean(anchorEl)

	const { isLoading, data, isSuccess } = useQuery([ 'notifications' ], apiGetNotifications, {
		staleTime : 1000 * 60 * 60
	})

	const handleClick = (e) => {
		setAnchorEl(e.currentTarget)
	}

	const handleClose = () => {
		setAnchorEl(null)
	}

	return (
		<Fragment>
			{console.count('renders:')}

			<IconButton onClick={handleClick} color="primary">
				<Badge color="secondary" badgeContent={isSuccess ? data.notifications.length : 0}>
					{isSuccess && data.notifications.length > 0 ? (
						<NotificationsActiveTwoToneIcon />
					) : (
						<NotificationsNoneTwoToneIcon />
					)}
				</Badge>
			</IconButton>

			<Popover
				classes={{ paper: cls.popover }}
				open={open}
				anchorEl={anchorEl}
				onClose={handleClose}
				transitionDuration={350}
				anchorOrigin={{
					vertical   : 'bottom',
					horizontal : 'center'
				}}
				transformOrigin={{
					vertical   : 'top',
					horizontal : 'center'
				}}
			>
				<Box textAlign="center" p={2} color="primary.main">
					{isSuccess && data.notifications.length > 0 ? 'Notifications' : 'No notifications'}
				</Box>
				<Divider />

				{isSuccess && (
					<List dense disablePadding>
						{data.notifications.map((ntf, i) => (
							<ListItem key={ntf._id} alignItems="flex-start" divider>
								<ListItemIcon style={{ minWidth: 30 }}>
									<FavoriteIcon color="primary" fontSize="small" />
								</ListItemIcon>
								<ListItemText
									primary={
										<Box display="flex" justifyContent="space-between">
											<Box>{ntf.type}</Box>
											<Box>{calculateTimeAgo(ntf.createdAt)}</Box>
										</Box>
									}
									secondary={
										ntf.text +
										'asd asd asd asd asd asd asd as asd as dad asdas dasd asdas asda asd asdasd '
									}
									primaryTypographyProps={{
										color   : 'primary',
										variant : 'caption'
									}}
									secondaryTypographyProps={{
										variant : 'caption'
									}}
								/>
								<ListItemSecondaryAction>
									<IconButton edge="end">
										<HighlightOffIcon color="error" />
									</IconButton>
								</ListItemSecondaryAction>
							</ListItem>
						))}
					</List>
				)}

				{isSuccess &&
				data.notifications.length > 0 && (
					<Box textAlign="center" p={1}>
						<Button startIcon={<HighlightOffIcon />} color="secondary" size="small">
							Clear all
						</Button>
					</Box>
				)}
			</Popover>
		</Fragment>
	)
}

export default NotificationsPopper
