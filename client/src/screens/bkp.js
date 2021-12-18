// @ Libraries
import React, { Fragment, useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useHistory } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import queryString from 'query-string'

// @ Mui
import Grid from '@material-ui/core/Grid'
import Divider from '@material-ui/core/Divider'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'

// @ Components
import SellGameCard from '../components/SellGamesScreen/SellGameCard'
import ShippingSection from '../components/SellGamesScreen/ShippingSection'
import PackInfoTextarea from '../components/SellGamesScreen/PackInfoTextarea'
import PackTotalPriceInput from '../components/SellGamesScreen/PackTotalPriceInput'
import CustomAlert from '../components/CustomAlert'
import Loader from '../components/Loader'

// @ Others
import { removeFromSaleList } from '../actions/saleListActions'
import { apiFetchGameDetails, apiHistoryBuyGames } from '../api/api'

// @ Styles
const useStyles = makeStyles((theme) => ({
	section : {
		marginTop    : theme.spacing(4),
		marginBottom : theme.spacing(4)
	},
	error   : {
		margin : theme.spacing(2, 0, 2, 0)
	}
}))

// @ Main
const BuyGamesScreen = () => {
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
				isSleeved     : false,
				version       : null,
				extraInfo     : '',
				price         : '',
				otherUsername : ''
			}
		})
	)

	const [ extraInfo, setExtraInfo ] = useState('')
	const [ totalPrice, setTotalPrice ] = useState('')
	const [ otherUsername, setOtherUsername ] = useState('')
	const [ values, setValues ] = useState(slRef.current)

	if (isPack !== false && isPack !== true) {
		history.push('/sell')
	}

	if (saleList.length === 1 && isPack) {
		history.push('/sell')
	}

	const mapped = slRef.current.map((el) => el.bggId)

	const { isLoading, isError, error, data, isSuccess } = useQuery(
		[ 'bggGamesDetails' ],
		() => apiFetchGameDetails(mapped),
		{
			staleTime : Infinity,
			enabled   : saleList.length > 0
		}
	)

	const mutation = useMutation((gamesData) => apiHistoryBuyGames(gamesData))

	useEffect(
		() => {
			if (slRef.current.length !== saleList.length) {
				setValues((val) => val.filter(({ bggId }) => saleList.find((el) => el.bggId === bggId)))
			}
		},
		[ saleList ]
	)

	console.log(values)

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

	const handleGameInfo = (e, value, id, key) => {
		const index = values.findIndex((el) => el.bggId === id)
		const copy = [ ...values ]
		copy[index] = { ...copy[index], [key]: value }
		setValues(copy)
	}

	const handleExtraInfo = (text) => {
		setExtraInfo(text)
	}

	const handleTotalPrice = (price) => {
		setTotalPrice(price)
	}

	const handleOtherUsername = (e) => {
		setOtherUsername(e.target.value)
	}

	const handleSubmit = (e) => {
		e.preventDefault()

		if (saleList.length === 0) return

		const gamesCopy = data.filter(({ bggId }) => values.find((val) => val.bggId === bggId))
		for (let val of values) {
			const index = gamesCopy.findIndex((el) => el.bggId === val.bggId)
			if (index !== -1) {
				gamesCopy[index] = {
					...gamesCopy[index],
					version       : val.version,
					price         : !isPack ? +val.price : null,
					extraInfo     : val.extraInfo.trim().length > 0 ? val.extraInfo.trim() : '',
					isSleeved     : val.isSleeved,
					otherUsername : !isPack ? val.otherUsername : null
				}
			}
		}

		const gamesData = {
			games         : gamesCopy,
			isPack,
			extraInfo     : isPack ? extraInfo.trim() : '',
			totalPrice    : isPack ? +totalPrice : null,
			otherUsername : isPack ? otherUsername : null
		}

		console.log(gamesData)

		mutation.mutate(gamesData)
	}

	return (
		<form onSubmit={handleSubmit}>
			<div className={cls.error}>
				{isError && <CustomAlert>{error.response.data.message}</CustomAlert>}

				{mutation.isError &&
					mutation.error.response.data.map((err, i) => <CustomAlert key={i}>{err}</CustomAlert>)}

				{saleList.length === 0 && <CustomAlert severity="warning">Your sale list is empty</CustomAlert>}
			</div>

			{isLoading && <Loader />}

			{isSuccess &&
			saleList.length > 0 && (
				<Fragment>
					<Grid container spacing={3} className={cls.section}>
						{data.map(
							(game) =>
								// Because we may have 6 fetched games, but values could have only 3 because
								// user deleted 3, we need to only render a list of the ones that are in values
								values.find((val) => val.bggId === game.bggId) && (
									<Grid item key={game.bggId} xs={12} sm={6} md={4}>
										<SellGameCard
											game={game}
											isPack={isPack}
											mode="buy"
											data={values.find((val) => val.bggId === game.bggId)}
											removeFromSaleListHandler={removeFromSaleListHandler}
											handleGameInfo={handleGameInfo}
										/>
									</Grid>
								)
						)}
					</Grid>

					<Divider />

					<Grid item sm={6} xs={12}>
						<Grid container direction="column">
							{isPack && (
								<Fragment>
									<TextField
										value={data.otherUsername}
										onChange={handleOtherUsername}
										inputProps={{
											maxLength : 20
										}}
										variant="outlined"
										id="username"
										name="username"
										label="Username"
										type="text"
										size="small"
										placeholder="Username of the person who sold you this game"
										fullWidth
									/>
									<Grid item>
										<PackTotalPriceInput
											totalPrice={totalPrice}
											handleTotalPrice={handleTotalPrice}
										/>
									</Grid>
									<Grid item>
										<PackInfoTextarea
											extraInfoPack={extraInfo}
											handleExtraInfoPack={handleExtraInfo}
										/>
									</Grid>
								</Fragment>
							)}

							<Grid item>
								<Button type="submit" variant="contained" color="primary" fullWidth>
									Buy
								</Button>
							</Grid>
						</Grid>
					</Grid>
				</Fragment>
			)}
		</form>
	)
}

export default BuyGamesScreen
