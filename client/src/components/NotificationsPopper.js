// @ Libraries
import React, { Fragment, useState } from 'react'

// @ Mui
import Popper from '@material-ui/core/Popper'
import IconButton from '@material-ui/core/IconButton'
import Box from '@material-ui/core/Box'
import Grow from '@material-ui/core/Grow'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'

// @ Icons
import NotificationsNoneTwoToneIcon from '@material-ui/icons/NotificationsNoneTwoTone'

// @ Main
const NotificationsPopper = () => {
	const [ anchorEl, setAnchorEl ] = useState(null)

	const open = Boolean(anchorEl)

	const handleClick = (event) => {
		setAnchorEl(anchorEl ? null : event.currentTarget)
	}

	const handleClickAway = (event) => {
		setAnchorEl(anchorEl ? null : event.currentTarget)
	}

	return (
		<Fragment>
			<IconButton onClick={handleClick} color="primary">
				<NotificationsNoneTwoToneIcon />
			</IconButton>

			<Popper open={open} anchorEl={anchorEl} transition>
				{({ TransitionProps }) => (
					<ClickAwayListener onClickAway={handleClickAway}>
						<Grow {...TransitionProps} timeout="auto">
							<Box p={1} bgcolor="background.paper" borderRadius={4} boxShadow={8}>
								The content of the Popper.
							</Box>
						</Grow>
					</ClickAwayListener>
				)}
			</Popper>
		</Fragment>
	)
}

export default NotificationsPopper
