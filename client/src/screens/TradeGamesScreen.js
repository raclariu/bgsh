// @ Libraries
import React, { Fragment, useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import queryString from 'query-string'

// @ Mui
import Grid from '@material-ui/core/Grid'
import Divider from '@material-ui/core/Divider'
import Button from '@material-ui/core/Button'

// @ Components
import Message from '../components/Message'
import Loader from '../components/Loader'
import PackInfoTextarea from '../components/SellGamesScreen/PackInfoTextarea'
import SellGameCard from '../components/SellGamesScreen/SellGameCard'
import ShippingSection from '../components/SellGamesScreen/ShippingSection'

// @ Others
import { bggGetGamesDetails, removeFromSaleList, tradeGames } from '../actions/gameActions'
import { BGG_GAMES_DETAILS_RESET } from '../constants/gameConstants'

// @ Styles
const useStyles = makeStyles((theme) => ({
	section      : {
		marginTop    : theme.spacing(4),
		marginBottom : theme.spacing(8)
	},
	media        : {
		objectFit      : 'cover',
		height         : '150px',
		objectPosition : 'center 0%'
	},
	autocomplete : {
		marginTop : theme.spacing(2)
	},
	extraInfo    : {
		margin : theme.spacing(2, 0, 2, 0)
	},
	error        : {
		margin : theme.spacing(2, 0, 2, 0)
	}
}))

// @ Main
const TradeGamesScreen = () => {
	const cls = useStyles()
	const dispatch = useDispatch()
	const location = useLocation()
	const history = useHistory()

	const { type = 'individual' } = queryString.parse(location.search)

	const [ shipPost, setShipPost ] = useState(true)
	const [ shipCourier, setShipCourier ] = useState(false)
	const [ shipPersonal, setShipPersonal ] = useState(false)
	const [ shipCities, setShipCities ] = useState([])
	const [ extraInfoPack, setExtraInfoPack ] = useState('')

	const ms = useRef(0)

	const saleList = useSelector((state) => state.saleList)

	if (type !== 'individual' && type !== 'pack') {
		history.push('/trade')
	}

	if (saleList.length === 1 && type === 'pack') {
		history.push('/trade')
	}

	const [ values, setValues ] = useState(
		saleList.map((el) => {
			return {
				bggId     : el.bggId,
				isSleeved : false,
				version   : null,
				condition : null,
				extraInfo : ''
			}
		})
	)

	const bggGamesDetails = useSelector((state) => state.bggGamesDetails)
	const { loading: detailsLoading, error: detailsError, success: detailsSuccess, games } = bggGamesDetails

	const trade = useSelector((state) => state.tradeGames)
	const { loading: tradeLoading, error: tradeError, success: tradeSuccess } = trade

	const shipError = [ shipPost, shipCourier, shipPersonal ].filter((checkbox) => checkbox).length < 1

	useEffect(
		() => {
			const mapped = saleList.map((el) => el.bggId)
			const timer = setTimeout(() => {
				if (mapped.length > 0) {
					dispatch(bggGetGamesDetails(mapped))
				}
			}, ms.current)
			ms.current = 750
			return () => {
				dispatch({ type: BGG_GAMES_DETAILS_RESET })
				clearTimeout(timer)
			}
		},
		[ dispatch, saleList ]
	)

	const removeFromSaleListHandler = (id) => {
		ms.current = 0
		dispatch(removeFromSaleList(id))
	}

	const handleGameInfo = (e, value, game, key) => {
		const index = values.findIndex((el) => el.bggId === game.bggId)
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

	const handleSubmit = (e) => {
		e.preventDefault()

		const gamesCopy = [ ...games ]
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
			type,
			shipPost,
			shipCourier,
			shipPersonal,
			shipCities,
			extraInfoPack : type === 'pack' ? extraInfoPack.trim() : ''
		}
		console.log({ values, gamesData, games, saleList })

		dispatch(tradeGames(gamesData))
	}

	return (
		<form onSubmit={handleSubmit}>
			<div className={cls.error}>
				{detailsError && <Message>{detailsError}</Message>}

				{tradeError && tradeError.map((err, i) => <Message key={i}>{err}</Message>)}

				{saleList.length === 0 && <Message severity="warning">Your trade list is empty</Message>}
			</div>

			{detailsLoading && <Loader />}

			{detailsSuccess && (
				<Fragment>
					<Grid container spacing={3} className={cls.section}>
						{games.map((game) => (
							<Grid item key={game.bggId} xl={6} lg={6} md={6} sm={6} xs={12}>
								<SellGameCard
									game={game}
									type={type}
									mode="trade"
									data={values.find((val) => val.bggId === game.bggId)}
									removeFromSaleListHandler={removeFromSaleListHandler}
									handleGameInfo={handleGameInfo}
								/>
							</Grid>
						))}
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
							{type === 'pack' && (
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
