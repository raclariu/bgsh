// @ Libraries
import React, { Fragment, useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import { useQuery, useQueryClient, useMutation } from 'react-query'
import queryString from 'query-string'

// @ Mui
import Grid from '@material-ui/core/Grid'
import Divider from '@material-ui/core/Divider'
import Button from '@material-ui/core/Button'

// @ Components
import CustomAlert from '../components/CustomAlert'
import Loader from '../components/Loader'
import PackInfoTextarea from '../components/SellGamesScreen/PackInfoTextarea'
import SellGameCard from '../components/SellGamesScreen/SellGameCard'
import ShippingSection from '../components/SellGamesScreen/ShippingSection'

// @ Others
import { bggGetGamesDetails, removeFromSaleList, tradeGames } from '../actions/gameActions'
import { BGG_GAMES_DETAILS_RESET } from '../constants/gameConstants'
import { apiFetchGameDetails, apiListGamesForTrade } from '../api/api'

// @ Styles
const useStyles = makeStyles((theme) => ({
	section : {
		marginTop    : theme.spacing(4),
		marginBottom : theme.spacing(8)
	},
	error   : {
		margin : theme.spacing(2, 0, 2, 0)
	}
}))

// @ Main
const TradeGamesScreen = () => {
	const cls = useStyles()
	const dispatch = useDispatch()
	const location = useLocation()
	const history = useHistory()
	const queryClient = useQueryClient()

	let { pack: isPack = false } = queryString.parse(location.search)
	isPack = !!isPack

	const saleList = useSelector((state) => state.saleList)
	const slRef = useRef(
		saleList.map((game) => {
			return {
				...game,
				isSleeved : false,
				version   : null,
				condition : null,
				extraInfo : ''
			}
		})
	)

	const [ shipPost, setShipPost ] = useState(true)
	const [ shipCourier, setShipCourier ] = useState(false)
	const [ shipPersonal, setShipPersonal ] = useState(false)
	const [ shipCities, setShipCities ] = useState([])
	const [ extraInfoPack, setExtraInfoPack ] = useState('')
	const [ values, setValues ] = useState(slRef.current)

	if (isPack !== false && isPack !== true) {
		history.push('/sell')
	}

	if (saleList.length === 1 && isPack) {
		history.push('/trade')
	}

	const shipError = [ shipPost, shipCourier, shipPersonal ].filter((checkbox) => checkbox).length < 1
	const mapped = slRef.current.map((el) => el.bggId)

	const { isLoading, isError, error, data, isSuccess } = useQuery(
		[ 'bggGamesDetails' ],
		() => apiFetchGameDetails(mapped),
		{
			staleTime : 1000 * 60 * 60
		}
	)

	const mutation = useMutation((gamesData) => apiListGamesForTrade(gamesData), {
		onSuccess : () => {
			queryClient.invalidateQueries('saleGames')
			queryClient.invalidateQueries('myListedGames')
		}
	})

	useEffect(
		() => {
			if (slRef.current.length !== saleList.length) {
				setValues((val) => val.filter(({ bggId }) => saleList.find((el) => el.bggId === bggId)))
			}
		},
		[ saleList ]
	)

	useEffect(
		() => {
			return () => {
				queryClient.invalidateQueries('bggGamesDetails')
			}
		},
		[ queryClient ]
	)

	const removeFromSaleListHandler = (id) => {
		dispatch(removeFromSaleList(id))
	}

	const handleGameInfo = (e, value, bggId, key) => {
		const index = values.findIndex((el) => el.bggId === bggId)
		const copy = [ ...values ]
		copy[index] = { ...copy[index], [key]: value }
		setValues(copy)
	}

	const handleExtraInfoPack = (text) => {
		setExtraInfoPack(text)
	}

	const handleShippingInfo = (data, type) => {
		if (type === 'post') {
			setShipPost(data)
		}

		if (type === 'courier') {
			setShipCourier(data)
		}

		if (type === 'personal') {
			setShipPersonal(data)
			setShipCities([])
		}

		if (type === 'cities') {
			setShipCities(data)
		}
	}

	console.log({ values, data, saleList })

	const handleSubmit = (e) => {
		e.preventDefault()

		const gamesCopy = data.filter(({ bggId }) => values.find((val) => val.bggId === bggId))
		for (let val of values) {
			const index = gamesCopy.findIndex((el) => el.bggId === val.bggId)
			if (index !== -1) {
				gamesCopy[index] = {
					...gamesCopy[index],
					version   : val.version,
					condition : val.condition,
					extraInfo : val.extraInfo.trim().length > 0 ? val.extraInfo.trim() : '',
					isSleeved : val.isSleeved
				}
			}
		}

		const gamesData = {
			games         : gamesCopy,
			isPack,
			shipPost,
			shipCourier,
			shipPersonal,
			shipCities,
			extraInfoPack : isPack ? extraInfoPack.trim() : ''
		}
		console.log({ values, gamesCopy, gamesData, data, saleList })

		mutation.mutate(gamesData)
	}

	return (
		<form onSubmit={handleSubmit}>
			<div className={cls.error}>
				{isError && <CustomAlert>{error.response.data.message}</CustomAlert>}

				{mutation.isError &&
					mutation.error.response.data.map((err, i) => <CustomAlert key={i}>{err}</CustomAlert>)}

				{saleList.length === 0 && <CustomAlert severity="warning">Your trade list is empty</CustomAlert>}
			</div>

			{isLoading && <Loader />}

			{isSuccess && (
				<Fragment>
					<Grid container spacing={3} className={cls.section}>
						{data.map(
							(game) =>
								values.find((val) => val.bggId === game.bggId) && (
									<Grid item key={game.bggId} md={6} xs={12}>
										<SellGameCard
											game={game}
											isPack={isPack}
											mode="trade"
											data={values.find((val) => val.bggId === game.bggId)}
											removeFromSaleListHandler={removeFromSaleListHandler}
											handleGameInfo={handleGameInfo}
										/>
									</Grid>
								)
						)}
					</Grid>

					<Divider />

					{/* Shipping Area */}
					<Grid container className={cls.section} direction="row" spacing={2}>
						<Grid item xl={6} lg={6} md={6} sm={6} xs={12}>
							<ShippingSection
								handleShippingInfo={handleShippingInfo}
								mode="trade"
								shipError={shipError}
								shipData={{ shipPost, shipCourier, shipPersonal, shipCities }}
							/>
						</Grid>
						<Grid item xl={6} lg={6} md={6} sm={6} xs={12}>
							{isPack && (
								<Fragment>
									<Grid item>
										<PackInfoTextarea
											extraInfoPack={extraInfoPack}
											handleExtraInfoPack={handleExtraInfoPack}
										/>
									</Grid>
								</Fragment>
							)}

							<Grid container direction="column">
								<Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
									<Button
										type="submit"
										disabled={shipError}
										variant="contained"
										color="primary"
										fullWidth
									>
										Trade
									</Button>
								</Grid>
							</Grid>
						</Grid>
					</Grid>
				</Fragment>
			)}
		</form>
	)
}

export default TradeGamesScreen
