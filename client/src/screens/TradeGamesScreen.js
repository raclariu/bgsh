// @ Libraries
import React, { Fragment, useEffect, useState, useRef } from 'react'
import { styled } from '@mui/material/styles'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'
import { useQuery, useQueryClient, useMutation } from 'react-query'
import queryString from 'query-string'

// @ Mui
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'

// @ Components
import CustomAlert from '../components/CustomAlert'
import Loader from '../components/Loader'
import SellGameCard from '../components/SellGamesScreen/SellGameCard'
import ShippingSection from '../components/SellGamesScreen/ShippingSection'
import Input from '../components/Input'

// @ Others
import { removeFromSaleList } from '../actions/saleListActions'
import { apiFetchGameDetails, apiListGamesForTrade } from '../api/api'

// @ Main
const TradeGamesScreen = () => {
	const dispatch = useDispatch()
	const location = useLocation()
	const history = useHistory()
	const queryClient = useQueryClient()

	let { pack: isPack = false } = queryString.parse(location.search)
	isPack = !!isPack

	const saleList = useSelector((state) => state.saleList)

	const [ shipPost, setShipPost ] = useState(true)
	const [ shipCourier, setShipCourier ] = useState(false)
	const [ shipPersonal, setShipPersonal ] = useState(false)
	const [ shipCities, setShipCities ] = useState([])
	const [ extraInfoPack, setExtraInfoPack ] = useState('')
	const [ values, setValues ] = useState([])

	const { isLoading, isError, error, data, isSuccess } = useQuery(
		[ 'bggGamesDetails' ],
		() => apiFetchGameDetails(saleList.map((el) => el.bggId)),
		{
			staleTime : 1000 * 60 * 60,
			enabled   : !!saleList.length,
			onSuccess : (data) => {
				setValues(
					data.map((game) => {
						return {
							...game,
							isSleeved : false,
							version   : null,
							condition : null,
							extraInfo : ''
						}
					})
				)
			}
		}
	)

	const mutation = useMutation((gamesData) => apiListGamesForTrade(gamesData), {
		onSuccess : () => {
			queryClient.invalidateQueries('tradeGames')
			queryClient.invalidateQueries('myListedGames')
		}
	})

	if (isPack !== false && isPack !== true) {
		mutation.reset()
		history.push('/trade')
	}

	if (saleList.length === 1 && isPack) {
		mutation.reset()
		history.push('/trade')
	}

	useEffect(
		() => {
			return () => {
				queryClient.invalidateQueries([ 'bggGamesDetails' ])
			}
		},
		[ queryClient ]
	)

	// When saleList changes, usually as a result of removing a saleList item, set values accordingly to the new saleList
	useEffect(
		() => {
			setValues((val) => val.filter(({ bggId }) => saleList.find((el) => el.bggId === bggId)))
		},
		[ saleList ]
	)

	const shipError = [ shipPost, shipCourier, shipPersonal ].filter((checkbox) => checkbox).length < 1

	const removeFromSaleListHandler = (id) => {
		dispatch(removeFromSaleList(id))
	}

	const handleGameInfo = (value, id, key) => {
		setValues((vals) => vals.map((val) => (val.bggId === id ? { ...val, [key]: value } : val)))
	}

	const handleExtraInfoPack = (e) => {
		setExtraInfoPack(e.target.value)
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

	const handleSubmit = (e) => {
		e.preventDefault()

		if (saleList.length === 0) return

		const verifiedGames = values.map((val) => {
			return {
				...val,
				extraInfo : val.extraInfo.trim() ? val.extraInfo.trim() : null
			}
		})

		const gamesData = {
			games         : verifiedGames,
			isPack,
			shipPost,
			shipCourier,
			shipPersonal,
			shipCities,
			extraInfoPack : isPack ? extraInfoPack.trim() : null
		}

		mutation.mutate(gamesData)
	}

	return (
		<form onSubmit={handleSubmit}>
			<div>
				{isError && <CustomAlert>{error.response.data.message}</CustomAlert>}

				{mutation.isError &&
					Object.values(mutation.error.response.data.message).map((err, i) => (
						<CustomAlert key={i}>{err}</CustomAlert>
					))}

				{saleList.length === 0 && <CustomAlert severity="warning">Your trade list is empty</CustomAlert>}
			</div>

			{isLoading && <Loader />}

			{isSuccess && (
				<Fragment>
					<Grid container spacing={3}>
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
					<Grid container direction="row" spacing={2}>
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
										<Input
											onChange={handleExtraInfoPack}
											value={extraInfoPack}
											name="extra-info-pack"
											label={`Extra info ${extraInfoPack.length}/500`}
											type="text"
											size="medium"
											multiline
											minRows={3}
											maxRows={10}
											inputProps={{
												maxLength   : 500,
												placeholder :
													'Any other info regarding the pack goes in here (500 characters limit)'
											}}
											fullWidth
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
