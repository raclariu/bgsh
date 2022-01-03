// @ Libraries
import React, { Fragment } from 'react'
import { styled } from '@mui/material/styles'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useHistory } from 'react-router-dom'
import queryString from 'query-string'
import LazyLoad from 'react-lazyload'
import { useQuery } from 'react-query'

// @ Mui
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'

// @ Components
import GameCard from '../components/GameCard'
import SearchBox from '../components/SearchBox'
import BackButton from '../components/BackButton'
import GameCardSkeleton from '../components/Skeletons/GameCardSkeleton'
import CustomAlert from '../components/CustomAlert'
import Paginate from '../components/Paginate'
import Hero from '../components/Hero'

// @ Others
import { addToSaleList, removeFromSaleList } from '../actions/saleListActions'
import { saleListLimit } from '../constants/saleListConstants'
import { apiFetchOwnedCollection } from '../api/api'
import { useNotification } from '../hooks/hooks'

// @ Main
const CollectionScreen = () => {
	const dispatch = useDispatch()
	const history = useHistory()
	const location = useLocation()

	const { search, page = 1 } = queryString.parse(location.search)

	const saleList = useSelector((state) => state.saleList)

	const [ showSnackbar ] = useNotification()

	const { isLoading, isSuccess, data } = useQuery(
		[ 'collection', { search, page } ],
		() => apiFetchOwnedCollection(search, page),
		{
			staleTime : Infinity,
			onError   : (err) => {
				const text = err.response.data.message || 'Error occured while fetching collection'
				showSnackbar.error({ text })
			},
			onSuccess : (data) => {
				data.owned.length === 0 && showSnackbar.warning({ text: 'Collection not found' })
			}
		}
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

	const saleListHandler = (e, id) => {
		const { bggId, title, year, thumbnail, image } = data.owned.find((el) => el.bggId === id)
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
					<Grid item md={4} sm={5} xs={12}>
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
					{data.owned.map((data) => (
						<Grid item key={data.bggId} xs={12} sm={6} md={4}>
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

export default CollectionScreen
