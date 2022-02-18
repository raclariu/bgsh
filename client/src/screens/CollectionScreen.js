// @ Libraries
import React, { Fragment } from 'react'
import { styled } from '@mui/material/styles'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useHistory } from 'react-router-dom'
import queryString from 'query-string'

// @ Mui
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'

// @ Components
import CollectionGameCard from '../components/CollectionGameCard'
import SearchBox from '../components/SearchBox'
import BackButton from '../components/BackButton'
import CollectionCardSkeleton from '../components/Skeletons/CollectionCardSkeleton'
import CustomAlert from '../components/CustomAlert'
import Paginate from '../components/Paginate'
import LzLoad from '../components/LzLoad'

// @ Others
import {
	useNotiSnackbar,
	useGetListQuery,
	useGetOwnedCollectionQuery,
	useDeleteFromListMutation,
	useAddToListMutation
} from '../hooks/hooks'

// @ Main
const CollectionScreen = () => {
	const history = useHistory()
	const location = useLocation()

	const { search, page = 1 } = queryString.parse(location.search)

	const userList = useGetListQuery()

	const { isFetching, isSuccess, data } = useGetOwnedCollectionQuery(search, page)

	const addMutation = useAddToListMutation()

	const deleteMutation = useDeleteFromListMutation()

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

	const listHandler = (e, game) => {
		const { bggId, title, year, thumbnail, image, version } = game
		if (e.target.checked) {
			addMutation.mutate({ bggId, title, year, thumbnail, image, version })
		} else {
			deleteMutation.mutate({ bggId, title })
		}
	}

	return (
		<Fragment>
			<Box display="flex" width="100%" mb={3} justifyContent="center" alignItems="center">
				<Grid container justifyContent="center" spacing={2}>
					<Grid item xs={12} sm={5} md={4}>
						<SearchBox placeholder="Search collection" handleFilters={handleFilters} />
					</Grid>
				</Grid>
			</Box>

			{isSuccess &&
			search && (
				<Box display="flex" alignItems="center" width="100%" gap={1} mb={2}>
					<BackButton />
					<Box fontSize={14} color="grey.500" fontWeight="fontWeightMedium">
						Found {data.pagination.totalItems || 0} game(s)
					</Box>
				</Box>
			)}

			{isSuccess &&
			data.owned.length === 0 && (
				<CustomAlert severity="warning">{search ? 'No results found' : 'Your collection is empty'}</CustomAlert>
			)}

			{isFetching && (
				<Grid container spacing={3} direction="row">
					{[ ...Array(12).keys() ].map((i, k) => (
						<Grid key={k} item xs={12} sm={6} md={4}>
							<CollectionCardSkeleton page="collection" />
						</Grid>
					))}
				</Grid>
			)}

			{isSuccess &&
			data.owned.length > 0 && (
				<Grid container spacing={3} direction="row">
					{data.owned.map((data) => (
						<Grid item key={data.bggId} xs={12} sm={6} md={4}>
							<LzLoad placeholder={<CollectionCardSkeleton />}>
								<CollectionGameCard
									data={data}
									listHandler={listHandler}
									isChecked={userList.data.list.some((el) => el.bggId === data.bggId)}
									isDisabled={
										userList.data.list.length === 6 ? userList.data.list.some(
											(el) => el.bggId === data.bggId
										) ? (
											false
										) : (
											true
										) : (
											false
										)
									}
								/>
							</LzLoad>
						</Grid>
					))}
				</Grid>
			)}

			{isSuccess &&
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

export default CollectionScreen
