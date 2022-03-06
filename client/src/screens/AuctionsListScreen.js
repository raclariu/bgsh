// @ Modules
import React, { Fragment, useEffect, useState, useRef } from 'react'
import { styled } from '@mui/material/styles'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useHistory } from 'react-router-dom'
import queryString from 'query-string'

// @ Mui
import Grid from '@mui/material/Grid'
import InputAdornment from '@mui/material/InputAdornment'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import FormGroup from '@mui/material/FormGroup'
import FormLabel from '@mui/material/FormLabel'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import RadioGroup from '@mui/material/RadioGroup'
import Autocomplete from '@mui/material/Autocomplete'
import Chip from '@mui/material/Chip'
import Radio from '@mui/material/Radio'
import FormHelperText from '@mui/material/FormHelperText'
import Backdrop from '@mui/material/Backdrop'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'

// @ Components
import CustomDivider from '../components/CustomDivider'
import AuctionGameCard from '../components/AuctionGameCard'
import Input from '../components/Input'
import CustomAlert from '../components/CustomAlert'
import Loader from '../components/Loader'
import LoadingBtn from '../components/LoadingBtn'
import Helmet from '../components/Helmet'

// @ Others
import { apiFetchGameDetails, apiListGamesForSale } from '../api/api'
import {
	useDeleteFromListMutation,
	useGetListQuery,
	useGetBggGamesDetailsQuery,
	useNotiSnackbar,
	useClearListMutation,
	useListGamesMutation
} from '../hooks/hooks'
import citiesArr from '../constants/cities'

// @ Main
const AuctionsListScreen = () => {
	const dispatch = useDispatch()
	const location = useLocation()
	const history = useHistory()

	let { pack: isPack = false } = queryString.parse(location.search)
	isPack = !!isPack

	const [ shipPost, setShipPost ] = useState(true)
	const [ shipPostPayer, setShipPostPayer ] = useState('seller')
	const [ shipCourier, setShipCourier ] = useState(false)
	const [ shipCourierPayer, setShipCourierPayer ] = useState(null)
	const [ shipPersonal, setShipPersonal ] = useState(false)
	const [ shipCities, setShipCities ] = useState([])
	const [ extraInfoPack, setExtraInfoPack ] = useState('')
	const [ startingPrice, setStartingPrice ] = useState('')
	const [ buyNowPrice, setBuyNowPrice ] = useState('')
	const [ endDate, setEndDate ] = useState('3d')
	const [ snipeRule, setSnipeRule ] = useState('15m')
	const [ values, setValues ] = useState([])

	const userList = useGetListQuery((listData) =>
		setValues((val) => val.filter(({ bggId }) => listData.list.find((el) => el.bggId === bggId)))
	)

	const { isError, error, data, isFetching, isSuccess: isSuccessDetails } = useGetBggGamesDetailsQuery((data) =>
		setValues(
			data.map((game) => {
				return {
					...game,
					isSleeved     : false,
					version       : userList.data.list.find((el) => el.bggId === game.bggId).version,
					condition     : null,
					extraInfo     : '',
					userImage     : userList.data.list.find((el) => el.bggId === game.bggId).userImage,
					startingPrice : '',
					buyNowPrice   : '',
					endDate       : '3d',
					snipeRule     : '15m'
				}
			})
		)
	)

	const deleteMutation = useDeleteFromListMutation()
	const auctionMutation = useListGamesMutation('auction')

	if (isPack !== false && isPack !== true) {
		auctionMutation.reset()
		history.push('/auction')
	}

	if (userList.isSuccess && userList.data.list.length === 1 && isPack) {
		auctionMutation.reset()
		history.push('/auction')
	}

	const shipError = [ shipPost, shipCourier, shipPersonal ].filter((checkbox) => checkbox).length < 1

	const removeFromListHandler = (bggId, title) => {
		deleteMutation.mutate({ bggId, title })
	}

	const handleGameInfo = (value, bggId, key) =>
		setValues((vals) => vals.map((val) => (val.bggId === bggId ? { ...val, [key]: value } : val)))

	const handleShippingInfo = (data, type) => {
		if (type === 'post') {
			setShipPost(data)
			if (data === false) {
				setShipPostPayer(null)
			} else {
				setShipPostPayer('seller')
			}
		}

		if (type === 'postPayer') {
			setShipPostPayer(data)
		}

		if (type === 'courier') {
			setShipCourier(data)
			if (data === false) {
				setShipCourierPayer(null)
			} else {
				setShipCourierPayer('buyer')
			}
		}

		if (type === 'courierPayer') {
			setShipCourierPayer(data)
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

		if (userList.data.list.length === 0) return

		const verifiedGames = values.map((val) => {
			if (isPack) {
				return {
					...val,
					startingPrice : null,
					buyNowPrice   : null,
					endDate       : null,
					snipeRule     : null,
					extraInfo     : val.extraInfo.trim() ? val.extraInfo.trim() : null
				}
			} else {
				return {
					...val,
					extraInfo : val.extraInfo.trim() ? val.extraInfo.trim() : null
				}
			}
		})

		const gamesData = {
			games            : verifiedGames,
			isPack,
			shipPost,
			shipPostPayer,
			shipCourier,
			shipCourierPayer,
			shipPersonal,
			shipCities,
			extraInfoPack    : isPack && extraInfoPack.trim() ? extraInfoPack.trim() : null,
			startingPrice    : isPack ? startingPrice : null,
			buyNowPrice      : isPack ? buyNowPrice : null,
			endDate          : isPack ? endDate : null,
			snipeRule        : isPack ? snipeRule : null
		}
		console.log(gamesData)
		auctionMutation.mutate(gamesData)
	}

	return (
		<form onSubmit={handleSubmit} autoComplete="off">
			<Helmet title="Create auction" />

			<Box display="flex" alignItems="center" gap={2} mb={2}>
				{isFetching && <Loader size={20} />}

				<Box fontSize="h6.fontSize">Put games up for auction</Box>
			</Box>

			{isError && <CustomAlert>{error.response.data.message}</CustomAlert>}

			{auctionMutation.isError && (
				<Box display="flex" flexDirection="column" gap={1} my={2}>
					{Object.values(auctionMutation.error.response.data.message).map((err, i) => (
						<CustomAlert key={i}>{err}</CustomAlert>
					))}
				</Box>
			)}

			{userList.isSuccess &&
			userList.data.list.length === 0 && (
				<Box my={2}>
					<CustomAlert severity="warning">Your list is empty</CustomAlert>
				</Box>
			)}

			{userList.isSuccess &&
				userList.data.list.length > 0 &&
				(isSuccessDetails && (
					<Fragment>
						<Grid container spacing={3}>
							{data.map(
								(game) =>
									// Because we may have 6 fetched games, but values could have only 3 because
									// user deleted 3, we need to only render a list of the ones that are in values
									values.find((val) => val.bggId === game.bggId) && (
										<Grid item key={game.bggId} md={6} xs={12}>
											<AuctionGameCard
												game={game}
												isPack={isPack}
												data={values.find((val) => val.bggId === game.bggId)}
												removeFromListHandler={removeFromListHandler}
												handleGameInfo={handleGameInfo}
											/>
										</Grid>
									)
							)}
						</Grid>

						<CustomDivider sx={{ my: 2 }} />

						{/* Shipping Area */}

						<Box
							display="flex"
							flexDirection="column"
							justifyContent="center"
							alignItems="center"
							gap={3}
							sx={{
								width : {
									xs : '100%',
									md : '50%'
								}
							}}
						>
							<FormControl required error={shipError} fullWidth>
								{/* Post shipping */}
								<FormLabel>Shipping method</FormLabel>

								<FormGroup>
									<FormControlLabel
										control={
											<Checkbox
												checked={shipPost}
												onChange={(e) => handleShippingInfo(e.target.checked, 'post')}
											/>
										}
										label="Romanian Post"
									/>

									<FormControl disabled={!shipPost}>
										<FormLabel>Who will pay post shipping fees?</FormLabel>
										<RadioGroup
											row
											value={shipPostPayer}
											onChange={(e) => handleShippingInfo(e.target.value, 'postPayer')}
										>
											<FormControlLabel value="seller" control={<Radio />} label="Seller" />
											<FormControlLabel value="buyer" control={<Radio />} label="Buyer" />
										</RadioGroup>
									</FormControl>

									{/* Courier shipping */}
									<FormControlLabel
										control={
											<Checkbox
												checked={shipCourier}
												onChange={(e) => handleShippingInfo(e.target.checked, 'courier')}
											/>
										}
										label="Courier"
									/>

									<FormControl disabled={!shipCourier}>
										<FormLabel>Who will pay courier shipping fees?</FormLabel>
										<RadioGroup
											row
											value={shipCourierPayer}
											onChange={(e) => handleShippingInfo(e.target.value, 'courierPayer')}
										>
											<FormControlLabel value="seller" control={<Radio />} label="Seller" />
											<FormControlLabel value="buyer" control={<Radio />} label="Buyer" />
										</RadioGroup>
									</FormControl>

									{/* Personal delivery */}
									<FormControlLabel
										control={
											<Checkbox
												checked={shipPersonal}
												onChange={(e) => {
													handleShippingInfo(e.target.checked, 'personal')
												}}
											/>
										}
										label="Personal"
									/>

									<Autocomplete
										disabled={!shipPersonal}
										multiple
										filterSelectedOptions
										value={shipCities}
										onChange={(e, cities) => handleShippingInfo(cities, 'cities')}
										limitTags={2}
										options={citiesArr}
										renderTags={(value, getTagProps) =>
											value.map((option, index) => (
												<Chip size="small" label={option} {...getTagProps({ index })} />
											))}
										renderInput={(params) => (
											<Input
												{...params}
												inputProps={{
													...params.inputProps,
													required : shipCities.length === 0
												}}
												label="Cities"
												placeholder={shipCities.length > 0 ? 'Cities' : 'Select cities'}
												name="cities"
											/>
										)}
									/>

									{shipError && (
										<FormHelperText error>Choose at least one shipping method</FormHelperText>
									)}
								</FormGroup>
							</FormControl>

							{isPack && (
								<Fragment>
									<Box
										sx={{
											display             : 'grid',
											gridTemplateColumns : 'repeat(2, 1fr)',
											gap                 : 2
										}}
									>
										<FormControl fullWidth>
											<InputLabel id="end-date-pack-label">End date?</InputLabel>

											<Select
												size="small"
												labelId="end-date-pack-label"
												label="End date?"
												value={endDate}
												onChange={(e) => setEndDate(e.target.value)}
											>
												<MenuItem value="12h">12 hours</MenuItem>
												<MenuItem value="1d">1 day</MenuItem>
												<MenuItem value="2d">2 days</MenuItem>
												<MenuItem value="3d">3 days</MenuItem>
												<MenuItem value="4d">4 days</MenuItem>
												<MenuItem value="5d">5 days</MenuItem>
												<MenuItem value="6d">6 days</MenuItem>
												<MenuItem value="7d">7 days</MenuItem>
											</Select>
										</FormControl>

										<FormControl fullWidth>
											<InputLabel id="snipe-rule-pack-label">Sniping rule?</InputLabel>

											<Select
												size="small"
												labelId="snipe-rule-pack-label"
												label="Sniping rule?"
												value={snipeRule}
												onChange={(e) => setSnipeRule(e.target.value)}
											>
												<MenuItem value="none">None</MenuItem>
												<MenuItem value="5m">5 minutes</MenuItem>
												<MenuItem value="10m">10 minutes</MenuItem>
												<MenuItem value="15m">15 minutes</MenuItem>
												<MenuItem value="20m">20 minutes</MenuItem>
												<MenuItem value="25m">25 minutes</MenuItem>
												<MenuItem value="30m">30 minutes</MenuItem>
												<MenuItem value="35m">35 minutes</MenuItem>
												<MenuItem value="40m">40 minutes</MenuItem>
												<MenuItem value="45m">45 minutes</MenuItem>
												<MenuItem value="50m">50 minutes</MenuItem>
												<MenuItem value="55m">55 minutes</MenuItem>
												<MenuItem value="60m">60 minutes</MenuItem>
											</Select>
										</FormControl>

										<Input
											onChange={(inputVal) => setStartingPrice(inputVal)}
											value={startingPrice}
											error={
												+startingPrice > 0 && +buyNowPrice > 0 && +startingPrice >= +buyNowPrice
											}
											helperText={
												+startingPrice > 0 &&
												+buyNowPrice > 0 &&
												+startingPrice >= +buyNowPrice ? (
													'Buy now price for the pack must be higher than starting price'
												) : (
													false
												)
											}
											name="starting-pack-price"
											label="Starting price"
											type="number"
											fullWidth
											required
											InputProps={{
												startAdornment : <InputAdornment position="start">RON</InputAdornment>
											}}
										/>
										<Input
											onChange={(inputVal) => setBuyNowPrice(inputVal)}
											value={buyNowPrice}
											name="buy-now-pack-price"
											label="Buy now price"
											type="number"
											fullWidth
											InputProps={{
												startAdornment : <InputAdornment position="start">RON</InputAdornment>
											}}
										/>
									</Box>

									<Input
										onChange={(inputVal) => setExtraInfoPack(inputVal)}
										value={extraInfoPack}
										name="extra-info-pack"
										label={`Extra info ${extraInfoPack.length}/500`}
										size="medium"
										multiline
										minRows={3}
										maxRows={10}
										type="text"
										inputProps={{
											maxLength   : 500,
											placeholder :
												'Any other info regarding the pack goes in here (500 characters limit)'
										}}
										fullWidth
									/>
								</Fragment>
							)}

							<LoadingBtn
								type="submit"
								disabled={shipError || isFetching || auctionMutation.isSuccess}
								variant="contained"
								size="large"
								color="primary"
								loading={auctionMutation.isLoading}
								fullWidth
							>
								Auction
							</LoadingBtn>
						</Box>
					</Fragment>
				))}

			<Backdrop sx={{ zIndex: 1000 }} open={auctionMutation.isLoading}>
				<Loader />
			</Backdrop>
		</form>
	)
}

export default AuctionsListScreen
