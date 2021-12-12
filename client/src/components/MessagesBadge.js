// @ Libraries
import React, { Fragment, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link as RouterLink } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import { useQuery } from 'react-query'

// @ Mui
import IconButton from '@material-ui/core/IconButton'
import Badge from '@material-ui/core/Badge'
import EmailTwoToneIcon from '@material-ui/icons/EmailTwoTone'

// @ Others
import { apiGetNewMessagesCount } from '../api/api'

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

	const { isLoading, isError, error, isSuccess, data: count } = useQuery(
		[ 'msgReceivedCount' ],
		apiGetNewMessagesCount,
		{
			refetchInterval      : 1000 * 60 * 2,
			refetchOnWindowFocus : false,
			refetchOnMount       : false,
			refetchOnReconnect   : false
		}
	)

	return (
		<Fragment>
			<IconButton component={RouterLink} to="/received" color="primary">
				<Badge color="secondary" badgeContent={isSuccess ? count : 0}>
					<EmailTwoToneIcon />
				</Badge>
			</IconButton>
		</Fragment>
	)
}

export default MessagesBadge
