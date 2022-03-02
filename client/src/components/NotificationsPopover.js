// @ Libraries
import React, { Fragment, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { TransitionGroup } from 'react-transition-group'

// @ Mui
import Popover from '@mui/material/Popover'
import Box from '@mui/material/Box'
import Grow from '@mui/material/Grow'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction'
import Badge from '@mui/material/Badge'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import Collapse from '@mui/material/Collapse'

// @ Components
import CustomIconBtn from './CustomIconBtn'
import CustomDivider from './CustomDivider'
import CustomButton from './CustomButton'

// @ Icons
import NotificationsOffTwoToneIcon from '@mui/icons-material/NotificationsOffTwoTone'
import NotificationsNoneTwoToneIcon from '@mui/icons-material/NotificationsNoneTwoTone'
import FavoriteIcon from '@mui/icons-material/Favorite'
import CloseIcon from '@mui/icons-material/Close'
import NotificationsActiveTwoToneIcon from '@mui/icons-material/NotificationsActiveTwoTone'

// @ Others
import { useGetNotificationsQuery, useDeleteNotificationMutation } from '../hooks/hooks'
import { calculateTimeAgo } from '../helpers/helpers'

// @ Main
const NotificationsPopover = () => {
	const history = useHistory()

	const [ anchorEl, setAnchorEl ] = useState(null)
	const open = Boolean(anchorEl)

	const { data, isSuccess, isFetching } = useGetNotificationsQuery()
	const deleteMutation = useDeleteNotificationMutation()

	const handleThumbClick = (altId) => {
		setAnchorEl(null)
		history.push(`/games/${altId}`)
	}

	const deleteNotificationHandler = (ntfId) => {
		deleteMutation.mutate(ntfId)
	}

	return (
		<Fragment>
			<CustomIconBtn
				disabled={isFetching}
				onClick={(e) => setAnchorEl(e.currentTarget)}
				color="primary"
				size="large"
			>
				<Badge color="secondary" badgeContent={isSuccess ? data.notifications.length : 0}>
					{isSuccess && data.notifications.length > 0 ? (
						<NotificationsActiveTwoToneIcon />
					) : (
						<NotificationsOffTwoToneIcon />
					)}
				</Badge>
			</CustomIconBtn>

			<Popover
				PaperProps={{
					sx : {
						width     : {
							sm : 400,
							xs : '100%'
						},
						maxHeight : '50%'
					}
				}}
				open={open}
				anchorEl={anchorEl}
				onClose={() => setAnchorEl(null)}
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
				<Box textAlign="center" p={2} fontWeight="fontWeightMedium" color="primary.main">
					{isSuccess && data.notifications.length > 0 ? 'Notifications' : 'No notifications'}
				</Box>
				<CustomDivider />

				{isSuccess && (
					<List dense disablePadding>
						<TransitionGroup>
							{data.notifications.map((ntf, i) => (
								<Collapse key={ntf._id}>
									<ListItem alignItems="flex-start" divider>
										<ListItemAvatar>
											<Avatar
												sx={{ cursor: 'pointer' }}
												onClick={() => handleThumbClick(ntf.meta.altId)}
												variant="rounded"
												src={ntf.meta.thumbnail}
												alt={ntf.text}
											>
												{ntf.text.substring(0, 2).toUpperCase()}
											</Avatar>
										</ListItemAvatar>

										<ListItemText
											primary={ntf.text}
											secondary={calculateTimeAgo(ntf.createdAt)}
											primaryTypographyProps={{
												variant : 'body2'
											}}
											secondaryTypographyProps={{
												color   : 'grey.500',
												variant : 'caption'
											}}
										/>
										<ListItemSecondaryAction>
											<CustomIconBtn
												disabled={deleteMutation.isLoading}
												onClick={() => deleteNotificationHandler(ntf._id)}
												edge="end"
												size="large"
												color="error"
											>
												<CloseIcon color="error" />
											</CustomIconBtn>
										</ListItemSecondaryAction>
									</ListItem>
								</Collapse>
							))}
						</TransitionGroup>
					</List>
				)}
			</Popover>
		</Fragment>
	)
}

export default NotificationsPopover
