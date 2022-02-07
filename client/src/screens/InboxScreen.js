// @ Libraries
import React, { Fragment, useState, useEffect } from 'react'
import { styled } from '@mui/material/styles'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import queryString from 'query-string'
import { useMutation, useQuery, useQueryClient } from 'react-query'

// @ Mui
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Skeleton from '@mui/material/Skeleton'
import Checkbox from '@mui/material/Checkbox'
import Avatar from '@mui/material/Avatar'
import ButtonBase from '@mui/material/ButtonBase'
import IconButton from '@mui/material/IconButton'
import Fade from '@mui/material/Fade'
import Divider from '@mui/material/Divider'
import FormControlLabel from '@mui/material/FormControlLabel'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Collapse from '@mui/material/Collapse'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'

// @ Icons
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import EventIcon from '@mui/icons-material/Event'

// @ Components
import SendMessage from '../components/SendMessage'
import CustomAlert from '../components/CustomAlert'
import Loader from '../components/Loader'
import Paginate from '../components/Paginate'
import CustomAvatar from '../components/CustomAvatar'
import SearchBox from '../components/SearchBox'
import CustomTooltip from '../components/CustomTooltip'
import MessageCard from '../components/MessageCard'
import BackButton from '../components/BackButton'

// @ Others
import { calculateTimeAgo, formatDate } from '../helpers/helpers'
import { apiDeleteMessages, apiGetSentMessages, apiGetReceivedMessages, apiUpdateMessageStatus } from '../api/api'
import {
	useNotiSnackbar,
	useGetMessagesQuery,
	useUpdateMessageStatusMutation,
	useDeleteMessagesMutation
} from '../hooks/hooks'

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
				borderRadius="4px"
				height={68}
			>
				<Box ml={1.5}>
					<Skeleton variant="rectangular" width={20} height={20} />
				</Box>
				<Box ml={2}>
					<Skeleton variant="circular" width={40} height={40} />
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
	const history = useHistory()
	const location = useLocation()
	const queryClient = useQueryClient()

	const { search, page = 1 } = queryString.parse(location.search)
	const currLoc = location.pathname === '/received' ? 'received' : 'sent'

	const [ selected, setSelected ] = useState([])
	const [ isChecked, setIsChecked ] = useState(false)
	const [ expanded, setExpanded ] = useState([])

	const { isLoading, isSuccess, data } = useGetMessagesQuery({ search, page, type: currLoc })
	const deleteMutation = useDeleteMessagesMutation(currLoc)
	const statusMutation = useUpdateMessageStatusMutation({ page, search })

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

	useEffect(
		() => {
			if (deleteMutation.isSuccess) {
				setSelected([])
				deleteMutation.reset()
			}
		},
		[ deleteMutation ]
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

		if (currLoc === 'received') {
			deleteMutation.mutate({ ids: selected, type: 'received' })
		}
		if (currLoc === 'sent') {
			deleteMutation.mutate({ ids: selected, type: 'sent' })
		}
	}

	const handleExpandClick = (id, read) => {
		if (expanded[0] && expanded[0].id === id) {
			setExpanded((expanded) => expanded.filter((obj) => obj.id !== id))
		} else {
			setExpanded([ { id, open: true } ])
			if (!read) {
				if (currLoc === 'received') {
					statusMutation.mutate(id)
				}
			}
		}
	}

	return (
		<Fragment>
			<Box display="flex" width="100%" mt={3} mb={2} justifyContent="center" alignItems="center">
				<Grid container justifyContent="center" spacing={2}>
					<Grid item md={4} sm={5} xs={12}>
						<SearchBox placeholder="Search messages" handleFilters={handleFilters} />
					</Grid>
				</Grid>
			</Box>

			<Box display="flex" alignItems="center" justifyContent="space-between" width="100%" height={50} mb={1}>
				<Box display="flex" alignItems="center" gap={2}>
					{search && <BackButton />}

					<FormControlLabel
						label={selected.length > 0 ? `Select all (${selected.length})` : 'Select all'}
						disabled={!isSuccess}
						control={
							<Checkbox
								sx={{ mr: 1 }}
								label="Select all"
								indeterminate={isChecked && data && data.messages.length !== selected.length}
								checked={isChecked}
								onChange={(e) => handleSelectAll(e)}
							/>
						}
					/>
				</Box>

				{selected.length > 0 && (
					<IconButton onClick={handleDelete} color="error">
						<DeleteOutlineIcon />
					</IconButton>
				)}
			</Box>

			{isSuccess && data.messages.length === 0 && <CustomAlert severity="warning">No messages</CustomAlert>}

			{isLoading && [ ...Array(12).keys() ].map((i, k) => <MessageSkeleton key={k} />)}

			{isSuccess && (
				<Grid container spacing={2}>
					{data.messages.map((msg) => (
						<Grid item key={msg._id} xs={12} md={6}>
							<MessageCard
								msg={msg}
								expanded={expanded.some((obj) => obj.id === msg._id)}
								isChecked={selected.some((el) => el === msg._id)}
								handleExpandClick={handleExpandClick}
								handleSelect={handleSelect}
								path={currLoc}
							/>
						</Grid>
					))}
				</Grid>
			)}

			{isSuccess &&
				data.pagination &&
				(data.pagination.totalPages > 1 && (
					<Box
						display="flex"
						alignItems="center"
						justifyContent="center"
						height={60}
						width="100%"
						borderRadius="4px"
						mt={4}
					>
						<Paginate pagination={data.pagination} handleFilters={handleFilters} />
					</Box>
				))}
		</Fragment>
	)
}

export default InboxScreen
