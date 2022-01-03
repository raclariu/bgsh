// @ Libraries
import React, { Fragment } from 'react'
import { styled } from '@mui/material/styles'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'
import queryString from 'query-string'
import LazyLoad from 'react-lazyload'
import { useQuery } from 'react-query'

// @ Mui
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'

// @ Components
import CustomAlert from '../components/CustomAlert'
import Paginate from '../components/Paginate'
import GameCard from '../components/GameCard'
import SearchBox from '../components/SearchBox'
import BackButton from '../components/BackButton'
import GameCardSkeleton from '../components/Skeletons/GameCardSkeleton'
import Hero from '../components/Hero'

// @ Others
import { addToSaleList, removeFromSaleList } from '../actions/saleListActions'
import { saleListLimit } from '../constants/saleListConstants'
import { apiFetchWishlistCollection } from '../api/api'
import { useNotification } from '../hooks/hooks'

// @ Main
const WishlistScreen = () => {
	const history = useHistory()
	const dispatch = useDispatch()
	const location = useLocation()

	const { search, page = 1 } = queryString.parse(location.search)

	const [ showSnackbar ] = useNotification()

	const { isLoading, isError, error, isSuccess, data } = useQuery(
		[ 'wishlist', { search, page } ],
		() => apiFetchWishlistCollection(search, page),
		{
			staleTime : Infinity,
			onError   : (err) => {
				const text = err.response.data.message || 'Error occured while fetching wishlist'
				showSnackbar.error({ text })
			},
			onSuccess : (data) => {
				data.wishlist.length === 0 && showSnackbar.warning({ text: 'Wishlist not found' })
			}
		}
	)

	const saleList = useSelector((state) => state.saleList)

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

	const saleListHandler = (e, id) => {
		const { bggId, title, year, thumbnail, image } = data.wishlist.find((el) => el.bggId === id)
		if (e.target.checked) {
			dispatch(addToSaleList({ bggId, title, year, thumbnail, image }))
			showSnackbar.info({ text: `${title} added to list` })
		} else {
			dispatch(removeFromSaleList(id))
			showSnackbar.info({ text: `${title} removed from list` })
		}
	}

	return (
		<Fragment>
			<Hero>
				<Grid container justifyContent="center" spacing={2}>
					<Grid item xl={4} lg={4} md={4} sm={5} xs={12}>
						<SearchBox placeholder="Search collection" handleFilters={handleFilters} />
					</Grid>
				</Grid>
				{search && (
					<Box display="flex" alignItems="center" width="100%">
						<BackButton />
						{isSuccess && <Box fontSize={12}>Found {data.pagination.totalItems} games</Box>}
					</Box>
				)}
			</Hero>

			{isLoading && (
				<Grid container spacing={3} direction="row">
					{[ ...Array(12).keys() ].map((i, k) => <GameCardSkeleton key={k} />)}
				</Grid>
			)}

			{isSuccess && (
				<Grid container spacing={3} direction="row">
					{data.wishlist.map((data) => (
						<Grid item key={data.bggId} md={4} sm={6} xs={12}>
							<LazyLoad offset={200} once placeholder={<GameCardSkeleton />}>
								<GameCard
									data={data}
									saleListHandler={saleListHandler}
									isChecked={saleList.some((el) => el.bggId === data.bggId)}
									isDisabled={
										saleList.length === saleListLimit ? saleList.some(
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
							</LazyLoad>
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
