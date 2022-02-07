// @ Libraries
import React, { Fragment } from 'react'
import { styled } from '@mui/material/styles'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'
import queryString from 'query-string'
import { useQuery, useMutation, useQueryClient } from 'react-query'

// @ Mui
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'

// @ Components
import CustomAlert from '../components/CustomAlert'
import Paginate from '../components/Paginate'
import CollectionGameCard from '../components/CollectionGameCard'
import SearchBox from '../components/SearchBox'
import BackButton from '../components/BackButton'
import GameCardSkeleton from '../components/Skeletons/GameCardSkeleton'
import LzLoad from '../components/LzLoad'

// @ Others
import { apiAddOneToList, apiDeleteOneFromList } from '../api/api'
import {
	useNotiSnackbar,
	useGetListQuery,
	useGetWishlistCollectionQuery,
	useDeleteFromListMutation,
	useAddToListMutation
} from '../hooks/hooks'

// @ Main
const WishlistScreen = () => {
	const history = useHistory()
	const location = useLocation()
	const queryClient = useQueryClient()
	const [ showSnackbar ] = useNotiSnackbar()

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

		history.push(`${location.pathname}?${query}`)
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
			<Box display="flex" width="100%" mt={3} mb={2} justifyContent="center" alignItems="center">
				<Grid container justifyContent="center" spacing={2}>
					<Grid item md={4} sm={5} xs={12}>
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
			data.wishlist.length === 0 &&
			!search && <CustomAlert severity="warning">Your wishlist is empty</CustomAlert>}

			{isLoading && (
				<Grid container spacing={3} direction="row">
					{[ ...Array(12).keys() ].map((i, k) => <GameCardSkeleton key={k} />)}
				</Grid>
			)}

			{isSuccess &&
			data.wishlist.length > 0 && (
				<Grid container spacing={3} direction="row">
					{data.wishlist.map((data) => (
						<Grid item key={data.bggId} md={4} sm={6} xs={12}>
							<LzLoad placeholder={<GameCardSkeleton />}>
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
