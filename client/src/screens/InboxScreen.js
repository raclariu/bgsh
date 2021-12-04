// @ Libraries
import React, { Fragment, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import queryString from 'query-string'
import { useMutation, useQuery, useQueryClient } from 'react-query'

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
import CustomAvatar from '../components/CustomAvatar'
import SearchBox from '../components/SearchBox'

// @ Others
import { calculateTimeAgo, formatDate } from '../helpers/helpers'
import { apiDeleteMessages, apiGetSentMessages, apiGetReceivedMessages, apiUpdateMessageStatus } from '../api/api'

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
	const location = useLocation()
	const queryClient = useQueryClient()

	const { search, page = 1 } = queryString.parse(location.search)

	const { isLoading, isError, error, isSuccess, data } = useQuery(
		[ location.pathname === '/received' ? 'msgReceived' : 'msgSent', { search, page } ],
		() => {
			if (location.pathname === '/received') {
				return apiGetReceivedMessages(search, page)
			}
			if (location.pathname === '/sent') {
				return apiGetSentMessages(search, page)
			}
		}
	)

	const mutation = useMutation(
		({ ids, type }) => {
			return apiDeleteMessages(ids, type)
		},
		{
			onSuccess : () => {
				if (location.pathname === '/received') {
					console.log('invalidatind')
					queryClient.invalidateQueries([ 'msgReceived' ])
				}
				if (location.pathname === '/sent') {
					queryClient.invalidateQueries([ 'msgSent' ])
				}
				setSelected([])
				setIndexClicked(null)
			}
		}
	)

	const statusMutation = useMutation((id) => apiUpdateMessageStatus(id), {
		// onMutate  : async () => {
		// 	await queryClient.cancelQueries([ 'msgReceived' ])
		// 	await queryClient.cancelQueries([ 'msgReceivedCount' ])
		// 	const count = queryClient.getQueryData([ 'msgReceivedCount' ])
		// 	console.log(count)
		// 	queryClient.setQueryData([ 'msgReceivedCount' ], (oldCount) => (oldCount -= 1))

		// 	console.log(queryClient.getQueryData([ 'msgReceivedCount' ]))

		// 	return { count }
		// },
		onSuccess : () => {
			queryClient.invalidateQueries([ 'msgReceived' ])
			queryClient.invalidateQueries([ 'msgReceivedCount' ])
		}
	})

	const [ selected, setSelected ] = useState([])
	const [ isChecked, setIsChecked ] = useState(false)
	const [ indexClicked, setIndexClicked ] = useState(null)

	useEffect(
		() => {
			if (isChecked) {
				if (data) {
					setSelected(data.messages.map((el) => el._id))
				}
			} else {
				setSelected([])
			}
		},
		[ isChecked, data ]
	)

	useEffect(
		() => {
			setIsChecked(false)
			setSelected([])
		},
		[ page ]
	)

	const handleFilters = (filter, type) => {
		const options = { sort: false, skipEmptyString: true, skipNull: true }

		let query
		if (type === 'search') {
			query = queryString.stringify({ search: filter, page: 1 }, options)
		}

		if (type === 'page') {
			query = queryString.stringify({ search, page: filter }, options)
		}

		history.push(`${location.pathname}?${query}`)
	}

	const handleSelect = (e, id) => {
		if (e.target.checked) {
			setSelected((selected) => [ ...selected, id ])
		} else {
			setSelected(selected.filter((selectedId) => selectedId !== id))
		}
	}

	const handleSelectAll = (e) => {
		setIsChecked(e.target.checked)
	}

	const handleClick = (e, i, msg) => {
		if (!msg.read && i !== indexClicked) {
			if (location.pathname === '/received') {
				statusMutation.mutate(msg._id)
			}
		}
		if (i === indexClicked) {
			setIndexClicked(null)
		} else {
			setIndexClicked(i)
		}
	}

	const handleDelete = () => {
		setIsChecked(false)

		if (location.pathname === '/received') {
			mutation.mutate({ ids: selected, type: 'received' })
		}
		if (location.pathname === '/sent') {
			mutation.mutate({ ids: selected, type: 'sent' })
		}
	}

	return (
		<Fragment>
			<Grid container justifyContent="center" spacing={2}>
				<Grid item xl={4} lg={4} md={4} sm={5} xs={12}>
					<SearchBox placeholder="Search users" handleFilters={handleFilters} />
				</Grid>
			</Grid>

			{isError && (
				<Box my={2}>
					<CustomAlert>{error.response.data.message}</CustomAlert>
				</Box>
			)}

			{mutation.isError && (
				<Box my={2}>
					<CustomAlert>{mutation.error.response.data.message}</CustomAlert>
				</Box>
			)}

			{mutation.isSuccess && (
				<Box my={2}>
					<CustomAlert severity="success">Sucessfully deleted</CustomAlert>
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
							disabled={!isSuccess}
							control={
								<Checkbox
									label="Select all"
									indeterminate={isChecked && data && data.messages.length !== selected.length}
									checked={isChecked}
									onChange={(e) => handleSelectAll(e)}
								/>
							}
						/>

						{selected.length > 0 && (
							<IconButton onClick={handleDelete}>
								<DeleteOutlineIcon color="error" />
							</IconButton>
						)}
					</Box>
				</Grid>

				{isLoading && [ ...Array(12).keys() ].map((i, k) => <MessageSkeleton key={k} />)}

				{isSuccess &&
					data.messages.map((msg, i) => (
						<Grid item container key={msg._id} xs={12} sm={9} md={7}>
							<ButtonBase className={cls.buttonBase}>
								<Box
									display="flex"
									boxShadow={selected.some((id) => id === msg._id) ? 6 : 2}
									borderRadius={4}
									bgcolor="background.paper"
									alignItems="center"
									width="100%"
								>
									<Box my={1} mr={1}>
										<Checkbox
											checked={selected.some((el) => el === msg._id)}
											onChange={(e) => handleSelect(e, msg._id, 'received')}
											size="small"
										/>
									</Box>

									<Box mr={1}>
										{location.pathname === '/received' ? (
											<CustomAvatar size="medium" user={msg.sender.username} />
										) : (
											<CustomAvatar size="medium" user={msg.recipient.username} />
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
										onClick={(e) => handleClick(e, i, msg)}
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
											{calculateTimeAgo(msg.createdAt)}
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
										boxShadow={selected.some((id) => id === msg._id) ? 6 : 2}
										my={1}
										p={2}
									>
										<Box alignSelf="flex-end" fontSize={12} my={2} fontStyle="italic">
											{formatDate(msg.createdAt)}
										</Box>

										<Box fontStyle="italic" fontSize={12} mb={1}>
											Subject
										</Box>
										<Box borderRadius={4} boxShadow={2} p={1} style={{ wordWrap: 'break-word' }}>
											{msg.subject}
										</Box>

										<Box mt={2} fontStyle="italic" fontSize={12} mb={1}>
											Message
										</Box>
										<Box borderRadius={4} boxShadow={1} p={1} style={{ wordWrap: 'break-word' }}>
											{msg.message}
										</Box>
										<Divider />
										<Box mt={2} alignSelf="flex-end">
											<SendMessage
												recipientUsername={
													location.pathname === '/received' ? (
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

			{isSuccess &&
				(data.pagination.totalPages > 1 && (
					<Box
						display="flex"
						alignItems="center"
						justifyContent="center"
						height={60}
						width="100%"
						borderRadius={4}
						mt={4}
					>
						<Paginate pagination={data.pagination} handleFilters={handleFilters} />
					</Box>
				))}
		</Fragment>
	)
}

export default InboxScreen
