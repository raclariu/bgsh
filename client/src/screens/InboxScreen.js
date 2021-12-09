// @ Libraries
import React, { Fragment, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'
import { useSnackbar } from 'notistack'
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
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Collapse from '@material-ui/core/Collapse'
import Typography from '@material-ui/core/Typography'
import Chip from '@material-ui/core/Chip'

// @ Icons
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import EventIcon from '@material-ui/icons/Event'

// @ Components
import SendMessage from '../components/SendMessage'
import CustomAlert from '../components/CustomAlert'
import Loader from '../components/Loader'
import Paginate from '../components/Paginate'
import CustomAvatar from '../components/CustomAvatar'
import SearchBox from '../components/SearchBox'
import CustomTooltip from '../components/CustomTooltip'
import MessageCard from '../components/MessageCard'

// @ Others
import { calculateTimeAgo, formatDate } from '../helpers/helpers'
import { apiDeleteMessages, apiGetSentMessages, apiGetReceivedMessages, apiUpdateMessageStatus } from '../api/api'
import { useNotification } from '../hooks/hooks'

// @ Styles
const useStyles = makeStyles((theme) => ({
	grid       : {
		marginTop    : theme.spacing(4),
		marginBottom : theme.spacing(4)
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
	const history = useHistory()
	const location = useLocation()
	const queryClient = useQueryClient()

	const { search, page = 1 } = queryString.parse(location.search)

	const [ selected, setSelected ] = useState([])
	const [ isChecked, setIsChecked ] = useState(false)
	const [ expanded, setExpanded ] = useState([])
	const [ showSnackbar ] = useNotification()

	const { isLoading, isSuccess, data } = useQuery(
		[ location.pathname === '/received' ? 'msgReceived' : 'msgSent', { search, page } ],
		() => {
			if (location.pathname === '/received') {
				return apiGetReceivedMessages(search, page)
			}
			if (location.pathname === '/sent') {
				return apiGetSentMessages(search, page)
			}
		},
		{
			refetchOnWindowFocus : false,
			onError              : (err) => {
				const text = err.response.data.message || 'Error occured when fetching messages'
				showSnackbar.error({ text })
			},
			onSuccess            : (data) => {
				data.messages.length === 0 && showSnackbar.warning({ text: 'No messages found' })
			}
		}
	)

	const deleteMutation = useMutation(
		({ ids, type }) => {
			return apiDeleteMessages(ids, type)
		},
		{
			onError   : (err) => {
				const text = err.response.data.message || 'Message could not be deleted'
				showSnackbar.error({ text })
			},
			onSuccess : () => {
				if (location.pathname === '/received') {
					queryClient.invalidateQueries([ 'msgReceived' ])
					queryClient.invalidateQueries([ 'msgReceivedCount' ])
				}
				if (location.pathname === '/sent') {
					queryClient.invalidateQueries([ 'msgSent' ])
				}
				const text = selected.length > 1 ? 'Messages deleted successfully' : 'Message deleted successfully'
				showSnackbar.success({ text })
				setSelected([])
			}
		}
	)

	const statusMutation = useMutation((id) => apiUpdateMessageStatus(id), {
		onMutate  : async (id) => {
			await queryClient.cancelQueries([ 'msgReceived', { page, search } ])
			const data = queryClient.getQueryData([ 'msgReceived', { page, search } ])
			queryClient.setQueryData([ 'msgReceived', { page, search } ], (oldMsg) => {
				const index = oldMsg.messages.findIndex((msg) => msg._id === id)
				oldMsg.messages[index].read = true
				oldMsg.messages[index].readAt = new Date().toISOString()
				return oldMsg
			})

			return { data }
		},
		onError   : (err, id, context) => {
			const text = err.response.data.message || 'Message could not be updated'
			showSnackbar.error({ text })
			queryClient.setQueryData([ 'msgReceived', { page } ], context.data)
		},
		onSuccess : () => {
			showSnackbar.info({ text: 'Message has been read' })
			queryClient.invalidateQueries([ 'msgReceived', { page } ])
			queryClient.invalidateQueries([ 'msgReceivedCount' ])
		}
	})

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
			setSelected((selected) => selected.filter((selectedId) => selectedId !== id))
		}
	}

	const handleSelectAll = (e) => {
		setIsChecked(e.target.checked)
	}

	const handleDelete = () => {
		setIsChecked(false)

		if (location.pathname === '/received') {
			deleteMutation.mutate({ ids: selected, type: 'received' })
		}
		if (location.pathname === '/sent') {
			deleteMutation.mutate({ ids: selected, type: 'sent' })
		}
	}

	const handleExpandClick = (id, read) => {
		if (expanded[0] && expanded[0].id === id) {
			setExpanded((expanded) => expanded.filter((obj) => obj.id !== id))
		} else {
			setExpanded([ { id, open: true } ])
			if (!read) {
				if (location.pathname === '/received') {
					statusMutation.mutate(id)
				}
			}
		}
	}

	return (
		<Grid container spacing={2} justifyContent="center" className={cls.grid}>
			<Grid container justifyContent="center">
				<Grid item xs={12} sm={5} md={4}>
					<SearchBox placeholder="Search users" handleFilters={handleFilters} />
				</Grid>
			</Grid>

			<Grid item xs={12} sm={9} md={7}>
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
				data.messages.map((msg) => (
					<Grid item key={msg._id} xs={12} sm={9} md={7}>
						<MessageCard
							msg={msg}
							expanded={expanded.some((obj) => obj.id === msg._id)}
							isChecked={selected.some((el) => el === msg._id)}
							handleExpandClick={handleExpandClick}
							handleSelect={handleSelect}
							path={location.pathname === '/received' ? 'received' : 'sent'}
						/>
					</Grid>
				))}

			{isSuccess &&
				data.pagination &&
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
		</Grid>
	)
}

export default InboxScreen
