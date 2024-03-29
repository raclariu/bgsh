// @ Modules
import React, { Fragment, useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import queryString from 'query-string'

// @ Mui
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'

// @ Icons
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'

// @ Components

import LzLoad from '../components/LzLoad'
import MessageCardSkeleton from '../components/Skeletons/MessageCardSkeleton'
import CustomIconBtn from '../components/CustomIconBtn'
import CustomAlert from '../components/CustomAlert'
import Paginate from '../components/Paginate'
import SearchBox from '../components/SearchBox'
import MessageCard from '../components/MessageCard'
import BackButton from '../components/BackButton'
import Helmet from '../components/Helmet'

// @ Others
import { useGetMessagesQuery, useUpdateMessageStatusMutation, useDeleteMessagesMutation } from '../hooks/hooks'

// @ Main
const MessagesScreen = ({ type }) => {
	const navigate = useNavigate()
	const location = useLocation()

	const { search, page = 1 } = queryString.parse(location.search)

	const [ selected, setSelected ] = useState([])
	const [ isChecked, setIsChecked ] = useState(false)
	const [ expanded, setExpanded ] = useState([])

	const { isLoading, isSuccess, data } = useGetMessagesQuery({ search, page, type })
	const deleteMutation = useDeleteMessagesMutation(type)
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

		navigate(`${location.pathname}?${query}`)
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

		if (type === 'received') {
			deleteMutation.mutate({ ids: selected, type: 'received' })
		}
		if (type === 'sent') {
			deleteMutation.mutate({ ids: selected, type: 'sent' })
		}
	}

	const handleExpandClick = (id, read) => {
		if (expanded[0] && expanded[0].id === id) {
			setExpanded((expanded) => expanded.filter((obj) => obj.id !== id))
		} else {
			setExpanded([ { id, open: true } ])
			if (!read) {
				if (type === 'received') {
					statusMutation.mutate(id)
				}
			}
		}
	}

	return (
		<Fragment>
			<Helmet title={type === 'received' ? 'Received messages' : 'Sent messages'} />

			<Box display="flex" width="100%" mb={3} justifyContent="center" alignItems="center">
				<Grid container justifyContent="center" spacing={2}>
					<Grid item xs={12} sm={6} md={4}>
						<SearchBox placeholder="Search messages" handleFilters={handleFilters} />
					</Grid>
				</Grid>
			</Box>

			<Grid container justifyContent="center" sx={{ mb: 2 }}>
				<Grid item xs={12} md={8}>
					<Box display="flex" width="100%" justifyContent="space-between" alignItems="center">
						<Box display="flex" alignItems="center" gap={2}>
							{search && <BackButton />}

							<FormControlLabel
								label={isChecked ? `Select all (${selected.length})` : 'Select all'}
								disabled={!isSuccess}
								control={
									<Checkbox
										sx={{ height: 48, width: 48, mr: 1 }}
										label="Select all"
										indeterminate={isChecked && data && data.messages.length !== selected.length}
										checked={isChecked}
										onChange={(e) => handleSelectAll(e)}
									/>
								}
							/>
						</Box>

						{selected.length > 0 && (
							<CustomIconBtn onClick={handleDelete} color="error" size="large" edge="end">
								<DeleteOutlineIcon />
							</CustomIconBtn>
						)}
					</Box>
				</Grid>
			</Grid>

			{isSuccess &&
			data.messages.length === 0 && (
				<Grid container justifyContent="center" sx={{ mb: 2 }}>
					<Grid item xs={12} md={8}>
						<CustomAlert severity="warning">No messages</CustomAlert>
					</Grid>
				</Grid>
			)}

			{isLoading && (
				<Grid container spacing={2} justifyContent="center">
					{[ ...Array(12).keys() ].map((i, k) => (
						<Grid key={k} item xs={12} md={8}>
							<MessageCardSkeleton />
						</Grid>
					))}
				</Grid>
			)}

			{isSuccess && (
				<Grid container spacing={2} justifyContent="center">
					{data.messages.map((msg) => (
						<Grid item key={msg._id} xs={12} md={8}>
							<LzLoad placeholder={<MessageCardSkeleton />}>
								<MessageCard
									msg={msg}
									expanded={expanded.some((obj) => obj.id === msg._id)}
									isChecked={selected.some((el) => el === msg._id)}
									handleExpandClick={handleExpandClick}
									handleSelect={handleSelect}
									path={type}
								/>
							</LzLoad>
						</Grid>
					))}
				</Grid>
			)}

			{isSuccess &&
			data.pagination.totalPages > 1 && <Paginate pagination={data.pagination} handleFilters={handleFilters} />}
		</Fragment>
	)
}

export default MessagesScreen
