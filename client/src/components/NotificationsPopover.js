// @ Libraries
import React, { Fragment, useState } from 'react'

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

// @ Components
import CustomIconBtn from './CustomIconBtn'
import CustomDivider from './CustomDivider'
import CustomButton from './CustomButton'

// @ Icons
import NotificationsNoneTwoToneIcon from '@mui/icons-material/NotificationsNoneTwoTone'
import FavoriteIcon from '@mui/icons-material/Favorite'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import NotificationsActiveTwoToneIcon from '@mui/icons-material/NotificationsActiveTwoTone'

// @ Others
import { useGetNotificationsQuery } from '../hooks/hooks'
import { calculateTimeAgo } from '../helpers/helpers'

// @ Main
const NotificationsPopover = () => {
	const [ anchorEl, setAnchorEl ] = useState(null)
	const open = Boolean(anchorEl)

	const { data, isSuccess } = useGetNotificationsQuery()

	return (
		<Fragment>
			<CustomIconBtn onClick={(e) => setAnchorEl(e.currentTarget)} color="primary" size="large">
				<Badge color="secondary" badgeContent={isSuccess ? data.notifications.length : 0}>
					{isSuccess && data.notifications.length > 0 ? (
						<NotificationsActiveTwoToneIcon />
					) : (
						<NotificationsNoneTwoToneIcon />
					)}
				</Badge>
			</CustomIconBtn>

			<Popover
				PaperProps={{
					sx : {
						width     : {
							sm : 350,
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
				<Box textAlign="center" p={2} color="primary.main">
					{isSuccess && data.notifications.length > 0 ? 'Notifications' : 'No notifications'}
				</Box>
				<CustomDivider />

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
									<CustomIconBtn edge="end" size="large">
										<HighlightOffIcon color="error" />
									</CustomIconBtn>
								</ListItemSecondaryAction>
							</ListItem>
						))}
					</List>
				)}

				{isSuccess &&
				data.notifications.length > 0 && (
					<Box textAlign="center" p={1}>
						<CustomButton startIcon={<HighlightOffIcon />} color="secondary" size="small">
							Clear all
						</CustomButton>
					</Box>
				)}
			</Popover>
		</Fragment>
	)
}

export default NotificationsPopover
