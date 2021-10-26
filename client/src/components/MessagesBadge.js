// @ Libraries
import React, { Fragment, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link as RouterLink } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'

// @ Mui
import IconButton from '@material-ui/core/IconButton'
import Badge from '@material-ui/core/Badge'
import EmailTwoToneIcon from '@material-ui/icons/EmailTwoTone'

// @ Others
import { getNewMessagesCount } from '../actions/messageActions'

// @ Styles
const useStyles = makeStyles((theme) => ({
	badge : {
		margin : theme.spacing(0, 1, 0, 0)
	}
}))

// @ Main
const MessagesBadge = () => {
	const cls = useStyles()
	const dispatch = useDispatch()

	const newMessagesCount = useSelector((state) => state.newMessagesCount)
	const { success, error, count } = newMessagesCount

	useEffect(
		() => {
			const intervalId = setInterval(() => {
				dispatch(getNewMessagesCount())
			}, 120000)

			return () => {
				clearInterval(intervalId)
			}
		},
		[ dispatch ]
	)

	useEffect(
		() => {
			dispatch(getNewMessagesCount())
		},
		[ dispatch ]
	)

	return (
		<Fragment>
			<IconButton component={RouterLink} to="/received" color="primary">
				<Badge color="secondary" badgeContent={success ? count : 0}>
					<EmailTwoToneIcon />
				</Badge>
			</IconButton>
		</Fragment>
	)
}

export default MessagesBadge
