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
import Input from '../components/Input'

// @ Others
import { removeFromSaleList } from '../actions/saleListActions'
import { apiFetchGameDetails, apiAddGameToHistory } from '../api/api'

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

	const [ extraInfoPack, setExtraInfoPack ] = useState('')
	const [ finalPrice, setFinalPrice ] = useState('')
	const [ otherUsername, setOtherUsername ] = useState('')
	const [ values, setValues ] = useState([])

	console.log(values)

	if (isPack !== false && isPack !== true) {
		history.push('/sell')
	}

	if (saleList.length === 1 && isPack) {
		history.push('/sell')
	}

	const { isLoading, isError, error, data, isSuccess } = useQuery(
		[ 'bggGamesDetails' ],
		() => apiFetchGameDetails(saleList.map((el) => el.bggId)),
		{
			staleTime : Infinity,
			enabled   : !!saleList.length,
			onSuccess : (data) => {
				setValues(
					data.map((game) => {
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
			}
		}
	)

	const mutation = useMutation((gamesData) => apiAddGameToHistory(gamesData))

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

	const removeFromSaleListHandler = (id) => {
		dispatch(removeFromSaleList(id))
	}

	const handleGameInfo = (e, value, id, key) => {
		setValues((vals) => vals.map((val) => (val.bggId === id ? { ...val, [key]: value } : val)))
	}

	const handleExtraInfoPack = (text) => {
		setExtraInfoPack(text)
	}

	const handleFinalPrice = (price) => {
		setFinalPrice(price)
	}

	const handleOtherUsername = (e) => {
		setOtherUsername(e.target.value)
	}

	const handleSubmit = (e) => {
		e.preventDefault()

		if (saleList.length === 0) return

		const verifiedGames = values.map((val) => {
			if (isPack) {
				return {
					...val,
					price         : null,
					otherUsername : null
				}
			} else {
				return {
					...val
				}
			}
		})

		const gamesData = {
			games         : verifiedGames,
			isPack,
			mode          : 'buy',
			extraInfoPack : extraInfoPack.trim() ? extraInfoPack.trim() : null,
			finalPrice    : finalPrice ? finalPrice : null,
			otherUsername : otherUsername ? otherUsername : null
		}

		console.log(gamesData)

		mutation.mutate(gamesData)
	}

	return (
		<form onSubmit={handleSubmit}>
			{saleList.length === 0 && <CustomAlert severity="warning">Your sale list is empty</CustomAlert>}

			{isLoading && <Loader />}

			{isSuccess &&
			saleList.length > 0 && (
				<Fragment>
					<Grid container spacing={3} className={cls.section}>
						{values.map((game) => (
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
						))}
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
										<Input
											type="number"
											value={finalPrice}
											handler={handleFinalPrice}
											label="Price"
											name="final-price"
										/>
									</Grid>
									<Grid item>
										<PackInfoTextarea
											extraInfoPack={extraInfoPack}
											handleExtraInfoPack={handleExtraInfoPack}
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
