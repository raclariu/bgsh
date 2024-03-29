// @ Modules
import React, { Fragment, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TransitionGroup } from 'react-transition-group'

// @ Mui
import Popover from '@mui/material/Popover'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction'
import Badge from '@mui/material/Badge'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import Collapse from '@mui/material/Collapse'

// @ Components
import CustomIconBtn from './CustomIconBtn'
import CustomDivider from './CustomDivider'
import LoadingBtn from './LoadingBtn'

// @ Icons
import NotificationsOffTwoToneIcon from '@mui/icons-material/NotificationsOffTwoTone'
import CloseIcon from '@mui/icons-material/Close'
import NotificationsActiveTwoToneIcon from '@mui/icons-material/NotificationsActiveTwoTone'

// @ Others
import {
	useGetNotificationsQuery,
	useDeleteNotificationMutation,
	useClearAllNotificationsMutation
} from '../hooks/hooks'
import { calculateTimeAgo } from '../helpers/helpers'

// @ Main
const NotificationsPopover = () => {
	const navigate = useNavigate()

	const [ anchorEl, setAnchorEl ] = useState(null)
	const open = Boolean(anchorEl)

	const { data, isSuccess, isFetching } = useGetNotificationsQuery()
	const deleteMutation = useDeleteNotificationMutation()
	const clearAllMutation = useClearAllNotificationsMutation()

	const handleThumbClick = ({ slug }) => {
		setAnchorEl(null)
		navigate(slug)
	}

	const deleteNotificationHandler = (ntfId) => {
		deleteMutation.mutate(ntfId)
	}

	const clearAllNotifications = () => {
		clearAllMutation.mutate()
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
					<Fragment>
						<List dense disablePadding>
							<TransitionGroup>
								{data.notifications.map((ntf, i) => (
									<Collapse key={ntf._id}>
										<ListItem alignItems="flex-start" divider>
											<ListItemAvatar>
												{ntf.meta.slug ? (
													<Avatar
														sx={{ cursor: 'pointer', height: '48px', width: '48px' }}
														onClick={() => handleThumbClick(ntf.meta)}
														variant="rounded"
														src={ntf.meta.thumbnail}
														alt={ntf.text}
													>
														{ntf.text.substring(0, 2).toUpperCase()}
													</Avatar>
												) : (
													<Avatar
														sx={{ height: '48px', width: '48px' }}
														variant="rounded"
														src={ntf.meta.thumbnail}
														alt={ntf.text}
													>
														{ntf.text.substring(0, 2).toUpperCase()}
													</Avatar>
												)}
											</ListItemAvatar>

											<ListItemText
												sx={{ mr: 1, ml: 0.5 }}
												primary={ntf.text}
												secondary={calculateTimeAgo(ntf.createdAt)}
												primaryTypographyProps={{
													variant : 'body2',
													color   : 'primary.light'
												}}
												secondaryTypographyProps={{
													color   : 'text.disabled',
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
													<CloseIcon />
												</CustomIconBtn>
											</ListItemSecondaryAction>
										</ListItem>
									</Collapse>
								))}
							</TransitionGroup>
						</List>
						{data.notifications.length > 0 && (
							<Box p={1} display="flex" justifyContent="flex-end">
								<LoadingBtn
									loading={clearAllNotifications.isLoading}
									onClick={clearAllNotifications}
									startIcon={<CloseIcon />}
									color="error"
								>
									Clear all
								</LoadingBtn>
							</Box>
						)}
					</Fragment>
				)}
			</Popover>
		</Fragment>
	)
}

export default NotificationsPopover
