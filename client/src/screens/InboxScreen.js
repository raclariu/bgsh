// @ Libraries
import React, { Fragment, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import { format, formatDistance, parseISO } from 'date-fns'
import queryString from 'query-string'

// @ Mui
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import Skeleton from '@material-ui/lab/Skeleton'
import Checkbox from '@material-ui/core/Checkbox'
import Avatar from '@material-ui/core/Avatar'
import ButtonBase from '@material-ui/core/ButtonBase'
import IconButton from '@material-ui/core/IconButton'
import Fade from '@material-ui/core/Fade'
import Divider from '@material-ui/core/Divider'
import FormControlLabel from '@material-ui/core/FormControlLabel'

// @ Icons
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline'

// @ Components
import SendMessage from '../components/SendMessage'
import CustomAlert from '../components/CustomAlert'
import Loader from '../components/Loader'
import Paginate from '../components/Paginate'

// @ Others
import { getReceivedMessages, getSentMessages, deleteMessages } from '../actions/messageActions'

// @ Styles
const useStyles = makeStyles((theme) => ({
	grid       : {
		marginTop : theme.spacing(4)
	},
	buttonBase : {
		width : '100%'
	},
	subject    : {
		whiteSpace   : 'nowrap',
		textOverflow : 'ellipsis',
		overflow     : 'hidden',
		width        : '95%'
	}
}))

// @ Skeleton
const MessageSkeleton = () => {
	return (
		<Grid item container xs={12} sm={9} md={7}>
			<Box
				display="flex"
				alignItems="center"
				bgcolor="background.paper"
				width="100%"
				boxShadow={2}
				borderRadius={4}
				height={68}
			>
				<Box ml={1.5}>
					<Skeleton variant="rect" width={20} height={20} />
				</Box>
				<Box ml={2}>
					<Skeleton variant="circle" width={40} height={40} />
				</Box>

				<Box display="flex" flexDirection="column" width="100%" mx={2}>
					<Box width="100%">
						<Skeleton variant="text" width="75%" />
					</Box>
					<Box width="100%">
						<Skeleton variant="text" width="20%" />
					</Box>
				</Box>
			</Box>
		</Grid>
	)
}

// @ Main
const InboxScreen = () => {
	const cls = useStyles()
	const dispatch = useDispatch()
	const history = useHistory()
	const { pathname, search } = useLocation()

	const { page = 1 } = queryString.parse(search)

	console.log(page)

	const [ checked, setChecked ] = useState([])
	const [ indexClicked, setIndexClicked ] = useState(null)

	const { loading, success, error, messages, pagination } = useSelector((state) => {
		if (pathname === '/received') {
			return state.messagesReceived
		}
		if (pathname === '/sent') {
			return state.messagesSent
		}
	})

	const { loading: loadingDelete, success: successDelete, error: errorDelete } = useSelector(
		(state) => state.deleteMessages
	)

	const sendMessageSelector = useSelector((state) => state.sendMessage)
	const { success: successSend } = sendMessageSelector

	useEffect(
		() => {
			if (pathname === '/received') {
				dispatch(getReceivedMessages(page))
			}
			if (pathname === '/sent') {
				dispatch(getSentMessages(page))
			}

			return () => {
				setIndexClicked(null)
			}
		},
		[ dispatch, pathname, page ]
	)

	useEffect(
		() => {
			if (successDelete) {
				if (pathname === '/received') {
					dispatch(getReceivedMessages(page))
				}
				if (pathname === '/sent') {
					dispatch(getSentMessages(page))
				}
			}

			return () => {
				setChecked([])
				setIndexClicked(null)
			}
		},
		[ dispatch, pathname, successDelete, page ]
	)

	useEffect(
		() => {
			if (successSend) {
				if (pathname === '/sent') {
					dispatch(getSentMessages(page))
				}
			}
		},
		[ dispatch, pathname, successSend, page ]
	)

	const handleFilters = (filter, type) => {
		const options = { sort: false, skipEmptyString: true, skipNull: true }

		let query

		if (type === 'page') {
			query = queryString.stringify({ page: filter }, options)
		}

		history.push(`${pathname}?${query}`)
	}

	const handleChecked = (e, id) => {
		if (e.target.checked) {
			setChecked([ ...checked, id ])
		} else {
			setChecked(checked.filter((chk) => chk !== id))
		}
	}

	const handleSelectAll = (e) => {
		if (e.target.checked) {
			setChecked(messages.map((el) => el._id))
		} else {
			setChecked([])
		}
	}

	const handleClick = (e, i) => {
		if (i === indexClicked) {
			setIndexClicked(null)
		} else {
			setIndexClicked(i)
		}
	}

	const handleDelete = () => {
		dispatch(deleteMessages(checked))
	}

	return (
		<Fragment>
			{error && (
				<Box my={2}>
					<CustomAlert>{error}</CustomAlert>
				</Box>
			)}

			{errorDelete && (
				<Box my={2}>
					<CustomAlert>{errorDelete}</CustomAlert>
				</Box>
			)}

			{loadingDelete && (
				<Box mt={2} display="flex" width="100%" justifyContent="center">
					<Loader />
				</Box>
			)}

			<Grid
				container
				direction="column"
				justifyContent="center"
				alignItems="center"
				className={cls.grid}
				spacing={1}
			>
				<Grid item container xs={12} sm={9} md={7}>
					<Box display="flex" alignItems="center" justifyContent="space-between" width="100%" height={60}>
						<FormControlLabel
							label="Select all"
							disabled={!success}
							control={<Checkbox label="Select all" onChange={(e) => handleSelectAll(e)} />}
						/>

						{checked.length > 0 && (
							<IconButton onClick={handleDelete}>
								<DeleteOutlineIcon color="error" />
							</IconButton>
						)}
					</Box>
				</Grid>

				{loading && [ ...Array(4).keys() ].map((i, k) => <MessageSkeleton key={k} />)}

				{success &&
					messages.map((msg, i) => (
						<Grid item container key={msg._id} xs={12} sm={9} md={7}>
							<ButtonBase className={cls.buttonBase}>
								<Box
									display="flex"
									boxShadow={checked.some((id) => id === msg._id) ? 6 : 2}
									borderRadius={4}
									bgcolor="background.paper"
									alignItems="center"
									width="100%"
								>
									<Box my={1} mr={1}>
										<Checkbox
											checked={checked.some((el) => el === msg._id)}
											onChange={(e) => handleChecked(e, msg._id, 'received')}
											size="small"
										/>
									</Box>

									<Box mr={1}>
										{pathname === '/received' ? (
											<Avatar>
												<Box fontSize={14}>
													{msg.sender.username.substring(0, 2).toUpperCase()}
												</Box>
											</Avatar>
										) : (
											<Avatar>
												<Box fontSize={14}>
													{msg.recipient.username.substring(0, 2).toUpperCase()}
												</Box>
											</Avatar>
										)}
									</Box>

									<Divider orientation="vertical" flexItem />

									<Box
										display="flex"
										flexDirection="column"
										justifyContent="center"
										alignItems="flex-start"
										minWidth={0}
										pl={1}
										py={2}
										onClick={(e) => handleClick(e, i)}
										width="100%"
									>
										<Box
											className={cls.subject}
											width="100%"
											textAlign="left"
											color={msg.read ? 'inherit' : 'primary.main'}
											fontWeight={msg.read ? 'fontWeightRegular' : 'fontWeightBold'}
											fontSize="subtitle2.fontSize"
										>
											{msg.subject}
										</Box>

										<Box mt={1} fontSize={11} color="grey.500" fontStyle="italic" textAlign="left">
											{formatDistance(parseISO(msg.createdAt), new Date(), {
												addSuffix : true
											})}
										</Box>
									</Box>
								</Box>
							</ButtonBase>

							{indexClicked === i && (
								<Fade in={indexClicked >= 0}>
									<Box
										width="100%"
										display="flex"
										flexDirection="column"
										justifyContent="center"
										borderRadius={4}
										bgcolor="background.paper"
										boxShadow={checked.some((id) => id === msg._id) ? 6 : 2}
										my={1}
										p={2}
									>
										<Box fontStyle="italic" fontWeight="fontWeightMedium">
											Subject
										</Box>
										<Box borderRadius={4} boxShadow={2} p={1} style={{ wordWrap: 'break-word' }}>
											{msg.subject}
										</Box>

										<Box mt={2} fontStyle="italic" fontWeight="fontWeightMedium">
											Message
										</Box>
										<Box borderRadius={4} boxShadow={1} p={1} style={{ wordWrap: 'break-word' }}>
											{msg.message}
										</Box>
										<Divider />
										<Box width="100%" mt={2} display="flex" alignItems="center">
											<Box flexGrow={1} fontStyle="italic" fontWeight="fontWeightMedium">
												{format(parseISO(msg.createdAt), 'iiii i MMMM y, H:mm', {
													weekStartsOn : 1
												})}
											</Box>

											<SendMessage
												recipientUsername={
													pathname === '/received' ? (
														msg.sender.username
													) : (
														msg.recipient.username
													)
												}
											/>
										</Box>
									</Box>
								</Fade>
							)}
						</Grid>
					))}
			</Grid>

			{success &&
				(pagination.totalPages > 1 && (
					<Box
						display="flex"
						alignItems="center"
						justifyContent="center"
						height={60}
						width="100%"
						borderRadius={4}
						mt={4}
					>
						<Paginate pagination={pagination} handleFilters={handleFilters} />
					</Box>
				))}
		</Fragment>
	)
}

export default InboxScreen
