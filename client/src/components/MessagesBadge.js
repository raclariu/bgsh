// @ Libraries
import React, { Fragment, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link as RouterLink } from 'react-router-dom'
import { useQuery } from 'react-query'

// @ Mui
import IconButton from '@mui/material/IconButton'
import Badge from '@mui/material/Badge'
import EmailTwoToneIcon from '@mui/icons-material/EmailTwoTone'

// @ Others
import { apiGetNewMessagesCount } from '../api/api'

// @ Main
const MessagesBadge = () => {
	const { isSuccess, data: count } = useQuery([ 'msgReceivedCount' ], apiGetNewMessagesCount, {
		refetchInterval : 1000 * 60 * 2,
		refetchOnMount  : false
	})

	return (
		<Fragment>
			<IconButton component={RouterLink} to="/received" color="primary" size="large">
				<Badge color="secondary" badgeContent={isSuccess ? count : 0}>
					<EmailTwoToneIcon />
				</Badge>
			</IconButton>
		</Fragment>
	)
}

export default MessagesBadge
