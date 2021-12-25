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

const PREFIX = 'TradeGamesScreen'

const classes = {
	section : `${PREFIX}-section`,
	error   : `${PREFIX}-error`
}

const Root = styled('form')(({ theme }) => ({
	[`& .${classes.section}`]: {
		marginTop    : theme.spacing(4),
		marginBottom : theme.spacing(8)
	},

	[`& .${classes.error}`]: {
		margin : theme.spacing(2, 0, 2, 0)
	}
}))

// @ Main
const TradeGamesScreen = () => {
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

	const handleGameInfo = (value, bggId, key) => {
		const index = values.findIndex((el) => el.bggId === bggId)
		const copy = [ ...values ]
		copy[index] = { ...copy[index], [key]: value }
		setValues(copy)
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
					extraInfo : val.extraInfo.trim().length > 0 ? val.extraInfo.trim() : null,
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
			extraInfoPack : isPack ? extraInfoPack.trim() : null
		}
		console.log({ values, gamesCopy, gamesData, data, saleList })

		mutation.mutate(gamesData)
	}

	return (
		<Root onSubmit={handleSubmit}>
			<div className={classes.error}>
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
					<Grid container spacing={3} className={classes.section}>
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
					<Grid container className={classes.section} direction="row" spacing={2}>
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
		</Root>
	)
}

export default TradeGamesScreen
