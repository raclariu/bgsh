// @ Modules
import React, { Fragment, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
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

// @ Icons
import MonetizationOnTwoToneIcon from '@mui/icons-material/MonetizationOnTwoTone'

// @ Components
import CustomDivider from '../components/CustomDivider'
import ListGameCard from '../components/ListGameCard'
import Input from '../components/Input'
import CustomAlert from '../components/CustomAlert'
import Loader from '../components/Loader'
import LoadingBtn from '../components/LoadingBtn'
import Helmet from '../components/Helmet'

// @ Others
import {
	useDeleteFromListMutation,
	useGetListQuery,
	useGetBggGamesDetailsQuery,
	useListGamesMutation
} from '../hooks/hooks'
import citiesArr from '../constants/cities'

// @ Main
const SellGamesScreen = () => {
	const location = useLocation()
	const navigate = useNavigate()

	let { pack: isPack = false } = queryString.parse(location.search)
	isPack = !!isPack

	const [ shipPost, setShipPost ] = useState(true)
	const [ shipCourier, setShipCourier ] = useState(false)
	const [ shipPostPayer, setShipPostPayer ] = useState('seller')
	const [ shipCourierPayer, setShipCourierPayer ] = useState(null)
	const [ shipPersonal, setShipPersonal ] = useState(false)
	const [ shipCities, setShipCities ] = useState([])
	const [ extraInfoPack, setExtraInfoPack ] = useState('')
	const [ totalPrice, setTotalPrice ] = useState('')
	const [ values, setValues ] = useState([])

	const userList = useGetListQuery((listData) =>
		setValues((val) => val.filter(({ bggId }) => listData.list.find((el) => el.bggId === bggId)))
	)

	const { isError, error, data, isFetching, isSuccess: isSuccessDetails } = useGetBggGamesDetailsQuery((data) =>
		setValues(
			data.map((game) => {
				return {
					...game,
					isSleeved : false,
					version   : userList.data.list.find((el) => el.bggId === game.bggId).version,
					condition : null,
					extraInfo : '',
					price     : '',
					userImage : userList.data.list.find((el) => el.bggId === game.bggId).userImage
				}
			})
		)
	)

	const deleteMutation = useDeleteFromListMutation()
	const listMutation = useListGamesMutation('sell')

	if (isPack !== false && isPack !== true) {
		listMutation.reset()
		navigate('/sell')
	}

	if (userList.isSuccess && userList.data.list.length === 1 && isPack) {
		listMutation.reset()
		navigate('/sell')
	}

	const shipError = [ shipPost, shipCourier, shipPersonal ].filter((checkbox) => checkbox).length < 1

	const removeFromListHandler = (bggId, title) => {
		deleteMutation.mutate({ bggId, title })
	}

	const handleGameInfo = (value, bggId, key) =>
		// let items = [ ...values ]
		// // 2. Make a shallow copy of the item you want to mutate
		// const idx = items.findIndex((obj) => obj.bggId === bggId)
		// let item = { ...items[idx] }
		// // 3. Replace the property you're intested in
		// item[key] = value
		// // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
		// items[idx] = item
		// // 5. Set the state to our new copy
		// setValues(items)
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
					price     : null,
					extraInfo : val.extraInfo.trim() ? val.extraInfo.trim() : null
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
			totalPrice       : isPack ? totalPrice : null
		}

		listMutation.mutate(gamesData)
	}

	return (
		<form onSubmit={handleSubmit} autoComplete="off">
			<Helmet title="Sell your boardgames" />

			<Box display="flex" alignItems="center" gap={2}>
				{isFetching ? <Loader size={24} /> : <MonetizationOnTwoToneIcon color="primary" />}

				<Box fontSize="h5.fontSize">List for sale</Box>
			</Box>

			<CustomDivider sx={{ my: 4 }} />

			{isError && <CustomAlert>{error.response.data.message}</CustomAlert>}

			{listMutation.isError && (
				<Box display="flex" flexDirection="column" gap={1} my={2}>
					{Object.values(listMutation.error.response.data.message).map((err, i) => (
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
											<ListGameCard
												game={game}
												isPack={isPack}
												mode="sell"
												data={values.find((val) => val.bggId === game.bggId)}
												removeFromListHandler={removeFromListHandler}
												handleGameInfo={handleGameInfo}
											/>
										</Grid>
									)
							)}
						</Grid>

						<CustomDivider sx={{ my: 4 }} />

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
									<Input
										onChange={(inputVal) => setTotalPrice(inputVal)}
										value={totalPrice}
										error={
											listMutation.isError && listMutation.error.response.data.message.totalPrice
										}
										helperText={
											listMutation.isError && listMutation.error.response.data.message.totalPrice
										}
										name="total-price"
										label="Pack price"
										type="number"
										InputProps={{
											startAdornment : <InputAdornment position="start">RON</InputAdornment>
										}}
										fullWidth
										required
									/>

									<Input
										onChange={(inputVal) => setExtraInfoPack(inputVal)}
										value={extraInfoPack}
										name="extra-info-pack"
										label={`Extra pack info ${extraInfoPack.length}/500`}
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
								disabled={shipError || isFetching || listMutation.isSuccess}
								variant="contained"
								size="large"
								color="primary"
								loading={listMutation.isLoading}
								fullWidth
							>
								Sell
							</LoadingBtn>
						</Box>
					</Fragment>
				))}

			<Backdrop sx={{ zIndex: 1000 }} open={listMutation.isLoading}>
				<Loader />
			</Backdrop>
		</form>
	)
}

export default SellGamesScreen
