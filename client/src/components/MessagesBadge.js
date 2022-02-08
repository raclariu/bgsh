// @ Libraries
import React, { Fragment, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link as RouterLink } from 'react-router-dom'
import { useQuery } from 'react-query'

// @ Mui
import Badge from '@mui/material/Badge'
import EmailTwoToneIcon from '@mui/icons-material/EmailTwoTone'

// @ Components
import CustomIconBtn from './CustomIconBtn'

// @ Others
import { apiGetNewMessagesCount } from '../api/api'

// @ Main
const MessagesBadge = () => {
	const { isSuccess, data: count } = useQuery([ 'inbox', 'count' ], apiGetNewMessagesCount, {
		refetchInterval : 1000 * 60 * 2,
		refetchOnMount  : false
	})

	return (
		<Fragment>
			<CustomIconBtn component={RouterLink} to="/received" color="primary" size="large">
				<Badge color="secondary" badgeContent={isSuccess ? count : 0}>
					<EmailTwoToneIcon />
				</Badge>
			</CustomIconBtn>
		</Fragment>
	)
}

export default MessagesBadge
