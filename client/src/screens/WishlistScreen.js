// @ Modules
import React, { Fragment } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import queryString from 'query-string'

// @ Mui
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'

// @ Components
import CustomAlert from '../components/CustomAlert'
import Paginate from '../components/Paginate'
import CollectionGameCard from '../components/CollectionGameCard'
import SearchBox from '../components/SearchBox'
import BackButton from '../components/BackButton'
import CollectionCardSkeleton from '../components/Skeletons/CollectionCardSkeleton'
import LzLoad from '../components/LzLoad'
import Helmet from '../components/Helmet'

// @ Others
import {
	useGetListQuery,
	useGetWishlistCollectionQuery,
	useDeleteFromListMutation,
	useAddToListMutation
} from '../hooks/hooks'

// @ Main
const WishlistScreen = () => {
	const navigate = useNavigate()
	const location = useLocation()

	const { search, page = 1 } = queryString.parse(location.search)

	const userList = useGetListQuery()

	const { isLoading, isSuccess, data } = useGetWishlistCollectionQuery(search, page)

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

		navigate(`${location.pathname}?${query}`)
	}

	const listHandler = (e, game) => {
		const { bggId, title, year, thumbnail, image } = game
		if (e.target.checked) {
			addMutation.mutate({ bggId, title, year, thumbnail, image })
		} else {
			deleteMutation.mutate({ bggId, title })
		}
	}

	return (
		<Fragment>
			<Helmet title={'My BGG wishlist'} />

			<Box display="flex" width="100%" mb={3} justifyContent="center" alignItems="center">
				<Grid container justifyContent="center" spacing={2}>
					<Grid item md={4} sm={6} xs={12}>
						<SearchBox placeholder="Search wishlist" handleFilters={handleFilters} />
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
			data.wishlist.length === 0 && (
				<CustomAlert severity="warning">{search ? 'No results found' : 'Your wishlist is empty'}</CustomAlert>
			)}

			{isLoading && (
				<Grid container spacing={3} direction="row">
					{[ ...Array(12).keys() ].map((i, k) => (
						<Grid key={k} item xs={12} sm={6} md={4}>
							<CollectionCardSkeleton page="wishlist" />
						</Grid>
					))}
				</Grid>
			)}

			{isSuccess &&
			data.wishlist.length > 0 && (
				<Grid container spacing={3} direction="row">
					{data.wishlist.map((data) => (
						<Grid item key={data.bggId} md={4} sm={6} xs={12}>
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

export default WishlistScreen
