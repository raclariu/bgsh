// @ Libraries
import React, { Fragment } from 'react'
import { styled } from '@mui/material/styles'
import { useHistory, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import queryString from 'query-string'
import LazyLoad from 'react-lazyload'
import { useQuery } from 'react-query'

// @ Mui
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'

// @ Components
import GamesIndexCard from '../components/GameIndexCard'
import SearchBox from '../components/SearchBox'
import BackButton from '../components/BackButton'
import SortGames from '../components/Filters/SortGames'
import Paginate from '../components/Paginate'
import GameIndexCardSkeleton from '../components/Skeletons/GameIndexCardSkeleton'
import DrawerFilter from '../components/Filters/DrawerFilter'

// @ Others
import { fetchGames } from '../api/api'
import { useNotification } from '../hooks/hooks'

// @ Main
const GamesIndexScreen = () => {
	const history = useHistory()
	const dispatch = useDispatch()
	const location = useLocation()
	const currLoc = location.pathname === '/games' ? 'sell' : location.pathname === '/trades' ? 'trade' : 'want'
	const qryKey = currLoc === 'sell' ? 'saleGames' : currLoc === 'trade' ? 'tradeGames' : 'wantedGames'

	const { search, sort = 'new', page = 1 } = queryString.parse(location.search)

	const [ showSnackbar ] = useNotification()

	const { isLoading, data, isSuccess } = useQuery(
		[ qryKey, { sort, search, page } ],
		() => {
			const params = {
				search,
				page,
				sort,
				mode   : currLoc
			}

			return fetchGames(params)
		},
		{
			staleTime : 1000 * 60 * 5,
			onError   : (err) => {
				const text = err.response.data.message || 'Error occured while fetching games'
				showSnackbar.error({ text })
			},
			onSuccess : (data) => {
				data.gamesData.length === 0 && showSnackbar.warning({ text: 'Games not found' })
			}
		}
	)

	const handleFilters = (filter, type) => {
		const options = { sort: false, skipEmptyString: true, skipNull: true }

		let query
		if (type === 'search') {
			query = queryString.stringify({ search: filter, sort, page: 1 }, options)
		}

		if (type === 'sort') {
			query = queryString.stringify({ search, sort: filter, page: 1 }, options)
		}

		if (type === 'page') {
			query = queryString.stringify({ search, sort, page: filter }, options)
		}

		history.push(`${location.pathname}?${query}`)
	}

	return (
		<Fragment>
			<Grid container justifyContent="center" spacing={2}>
				<Grid item xl={4} lg={4} md={4} sm={5} xs={12}>
					<SearchBox placeholder="Enter game title or designer" handleFilters={handleFilters} />
				</Grid>
			</Grid>

			<Box>
				<DrawerFilter />
			</Box>

			<Box display="flex" width="100%" alignItems="center">
				<Box display="flex" justifyContent="flex-start" alignItems="center" width="100%">
					<BackButton />
				</Box>
				<SortGames mode={currLoc} handleFilters={handleFilters} />
			</Box>

			{isLoading && (
				<Grid container spacing={3} direction="row">
					{[ ...Array(12).keys() ].map((i, k) => <GameIndexCardSkeleton key={k} />)}
				</Grid>
			)}

			<Grid container spacing={3}>
				{isSuccess &&
					data.gamesData.map((data) => (
						<Grid item key={data._id} md={4} sm={6} xs={12}>
							<LazyLoad
								offset={200}
								once
								placeholder={
									<Box width="100%">
										<GameIndexCardSkeleton />
									</Box>
								}
							>
								<GamesIndexCard data={data} sort={sort} />
							</LazyLoad>
						</Grid>
					))}
			</Grid>

			{isSuccess &&
			data.pagination && (
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
			)}
		</Fragment>
	)
}

export default GamesIndexScreen
