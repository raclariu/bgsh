// @ Libraries
import React, { Fragment } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

// @ Mui
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import Avatar from '@material-ui/core/Avatar'

// @ Main
const ReadMessageScreen = () => {
	const params = useParams()
	const { msgId } = params

	const msg = useSelector((state) => state.messages.received.find((obj) => obj._id === msgId))

	return (
		<Fragment>
			<Box display="flex" alignItems="center">
				<Avatar>asd</Avatar>
				<Box>{msg.sender.username}</Box>
			</Box>
			<Box>{msg.subject}</Box>
			<Box>{msg.message}</Box>
		</Fragment>
	)
}

export default ReadMessageScreen
