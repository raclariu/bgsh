import React, { Fragment, useEffect, useState, useRef } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useDispatch, useSelector } from 'react-redux'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import Divider from '@material-ui/core/Divider'
import Message from '../components/Message'
import Loader from '../components/Loader'
import IconButton from '@material-ui/core/IconButton'
import TextField from '@material-ui/core/TextField'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormLabel from '@material-ui/core/FormLabel'
import FormHelperText from '@material-ui/core/FormHelperText'
import Switch from '@material-ui/core/Switch'
import Checkbox from '@material-ui/core/Checkbox'
import RadioGroup from '@material-ui/core/RadioGroup'
import Radio from '@material-ui/core/Radio'
import Autocomplete from '@material-ui/lab/Autocomplete'
import Chip from '@material-ui/core/Chip'
import InputAdornment from '@material-ui/core/InputAdornment'
import FormGroup from '@material-ui/core/FormGroup'
import Button from '@material-ui/core/Button'
import HighlightOffIcon from '@material-ui/icons/HighlightOff'
import citiesArr from '../constants/cities'
import { bggGetGamesDetails, removeFromSaleList, sellGames } from '../actions/gameActions'
import { BGG_GAMES_DETAILS_RESET } from '../constants/gameConstants'

const useStyles = makeStyles((theme) => ({
	section      : {
		marginTop    : theme.spacing(4),
		marginBottom : theme.spacing(4)
	},
	media        : {
		objectFit      : 'cover',
		height         : '150px',
		objectPosition : 'center 0%'
	},
	autocomplete : {
		margin : theme.spacing(2, 0, 2, 0)
	},
	error        : {
		margin : theme.spacing(2, 0, 2, 0)
	}
}))

const SellGameScreen = () => {
	const cls = useStyles()
	const dispatch = useDispatch()

	const [ shipPost, setShipPost ] = useState(true)
	const [ shipCourier, setShipCourier ] = useState(false)
	const [ shipPostPayer, setShipPostPayer ] = useState('seller')
	const [ shipCourierPayer, setShipCourierPayer ] = useState('seller')
	const [ shipPersonal, setShipPersonal ] = useState(false)
	const [ shipCities, setShipCities ] = useState([])
	const [ sellType, setSellType ] = useState('individual')
	const [ extraInfoTxt, setExtraInfoTxt ] = useState('')

	const ms = useRef(0)

	const saleList = useSelector((state) => state.saleList)

	const [ values, setValues ] = useState(
		saleList.map((el) => {
			return {
				bggId     : el.bggId,
				isSleeved : false,
				version   : null,
				condition : null,
				price     : ''
			}
		})
	)

	const bggGamesDetails = useSelector((state) => state.bggGamesDetails)
	const { loading: detailsLoading, error: detailsError, success: detailsSuccess, games } = bggGamesDetails

	const sell = useSelector((state) => state.sellGames)
	const { loading: sellLoading, error: sellError, success: sellSuccess } = sell

	const shipError = [ shipPost, shipCourier, shipPersonal ].filter((checkbox) => checkbox).length < 1

	useEffect(
		() => {
			const mapped = saleList.map((el) => el.bggId)
			const timer = setTimeout(() => {
				dispatch(bggGetGamesDetails(mapped))
			}, ms.current)
			ms.current = 750
			return () => {
				dispatch({ type: BGG_GAMES_DETAILS_RESET })
				clearTimeout(timer)
			}
		},
		[ dispatch, saleList ]
	)

	const handleUncontrolled = (e, value, game, key) => {
		const index = values.findIndex((el) => el.bggId === game.bggId)
		const copy = [ ...values ]
		copy[index] = { ...copy[index], [key]: value }
		setValues(copy)
	}

	const removeFromSaleListHandler = (id) => {
		ms.current = 0
		dispatch(removeFromSaleList(id))
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
					price     : +val.price,
					condition : val.condition,
					isSleeved : val.isSleeved
				}
			}
		}

		const gamesData = {
			games            : gamesCopy,
			sellType,
			shipPost,
			shipPostPayer    : shipPost ? shipPostPayer : null,
			shipCourier,
			shipCourierPayer : shipCourier ? shipCourierPayer : null,
			shipPersonal,
			shipCities,
			extraInfoTxt,
			totalPrice       : values.map((el) => +el.price).reduce((acc, cv) => acc + cv, 0)
		}
		console.log({ values, gamesData, games, saleList })

		dispatch(sellGames(gamesData))
	}

	return (
		<form onSubmit={handleSubmit}>
			<div className={cls.error}>
				{detailsError && <Message>{detailsError}</Message>}

				{sellError && <Message>{sellError.map((err) => <p>{err}</p>)}</Message>}

				{saleList.length === 0 && <Message severity="warning">Your sale list is empty</Message>}
			</div>

			{detailsLoading && <Loader />}

			{detailsSuccess && (
				<Fragment>
					<Grid container spacing={3} className={cls.section}>
						{games.map((game) => (
							<Grid item key={game.bggId} xl={6} lg={6} md={6} sm={6} xs={12}>
								<Card elevation={2}>
									<CardHeader
										title={game.title}
										subheader={game.year}
										action={
											<IconButton onClick={() => removeFromSaleListHandler(game.bggId)}>
												<HighlightOffIcon />
											</IconButton>
										}
										titleTypographyProps={{
											color   : 'primary',
											variant : 'subtitle2'
										}}
										subheaderTypographyProps={{
											variant : 'caption'
										}}
									/>
									<CardMedia
										className={cls.media}
										component="img"
										image={game.thumbnail ? game.thumbnail : '/images/collCardPlaceholder.jpg'}
										alt={game.title}
										title={game.title}
									/>
									<CardContent>
										<Autocomplete
											className={cls.autocomplete}
											value={values.find((el) => el.bggId === game.bggId).version}
											getOptionSelected={(option, value) => option.title === value.title}
											onChange={(e, selected) => handleUncontrolled(e, selected, game, 'version')}
											options={game.versions}
											getOptionLabel={(option) => `${option.title} (${option.year})`}
											renderInput={(params) => (
												<TextField
													{...params}
													name={`version-${game.bggId}`}
													label="Version"
													placeholder="Select game version"
													variant="outlined"
													size="small"
													required
												/>
											)}
										/>

										<Autocomplete
											className={cls.autocomplete}
											value={values.find((el) => el.bggId === game.bggId).condition}
											getOptionSelected={(option, value) => option === value}
											onChange={(e, selected) =>
												handleUncontrolled(e, selected, game, 'condition')}
											//if options change, don't forget to also change the arr on the server validator
											options={[
												'New',
												'Opened, not played',
												'Like new',
												'Very Good',
												'Good',
												'Acceptable',
												'Poor'
											]}
											renderInput={(params) => (
												<TextField
													{...params}
													name={`condition-${game.bggId}`}
													label="Condition"
													placeholder="Select condition"
													variant="outlined"
													size="small"
													required
												/>
											)}
										/>
										<Grid container>
											<Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
												<FormControlLabel
													control={
														<Switch
															checked={
																values.find((el) => el.bggId === game.bggId).isSleeved
															}
															onChange={(e) =>
																handleUncontrolled(
																	e,
																	e.target.checked,
																	game,
																	'isSleeved'
																)}
														/>
													}
													label="Sleeved?"
												/>
											</Grid>
											<Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
												<TextField
													onChange={(e) =>
														handleUncontrolled(e, e.target.value, game, 'price')}
													value={values.find((el) => el.bggId === game.bggId).price}
													InputProps={{
														startAdornment : (
															<InputAdornment position="start">RON</InputAdornment>
														)
													}}
													inputProps={{
														min : 0,
														max : 10000
													}}
													name={`price-${game.bggId}`}
													variant="outlined"
													label="Price"
													type="number"
													size="small"
													fullWidth
													required
												/>
											</Grid>
										</Grid>
									</CardContent>
								</Card>
							</Grid>
						))}
					</Grid>

					<Divider />

					{/* Shipping Area */}
					<Grid container className={cls.section} direction="row" spacing={2}>
						<Grid item xl={6} lg={6} md={6} sm={6} xs={12}>
							<FormControl required error={shipError} fullWidth>
								{/* Post shipping */}
								<FormLabel>Shipping method</FormLabel>
								<FormGroup>
									<FormControlLabel
										control={
											<Checkbox
												checked={shipPost}
												onChange={(e) => setShipPost(e.target.checked)}
											/>
										}
										label="Romanian Post"
									/>

									<FormControl disabled={!shipPost}>
										<FormLabel>Who pays shipping?</FormLabel>
										<RadioGroup
											row
											value={shipPostPayer}
											onChange={(e) => setShipPostPayer(e.target.value)}
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
												onChange={(e) => setShipCourier(e.target.checked)}
											/>
										}
										label="Courier"
									/>
									<FormControl disabled={!shipCourier}>
										<FormLabel>Who pays shipping?</FormLabel>
										<RadioGroup
											row
											value={shipCourierPayer}
											onChange={(e) => setShipCourierPayer(e.target.value)}
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
													setShipPersonal(e.target.checked)
													setShipCities([])
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
										onChange={(e, cities) => setShipCities(cities)}
										limitTags={2}
										options={citiesArr}
										renderTags={(value, getTagProps) =>
											value.map((option, index) => (
												<Chip size="small" label={option} {...getTagProps({ index })} />
											))}
										renderInput={(params) => (
											<TextField
												{...params}
												required
												inputProps={{
													...params.inputProps,
													required : shipCities.length === 0
												}}
												label="Cities"
												placeholder={shipCities.length > 0 ? 'Cities' : 'Select cities'}
												name="cities"
												variant="outlined"
												size="small"
											/>
										)}
									/>

									{shipError && (
										<FormHelperText error>Select at least one shipping method</FormHelperText>
									)}
								</FormGroup>
							</FormControl>
						</Grid>
						<Grid item xl={6} lg={6} md={6} sm={6} xs={12}>
							<Grid container direction="column">
								<Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
									<FormControl>
										<FormLabel>Sell games individually or as a pack?</FormLabel>
										<RadioGroup row value={sellType} onChange={(e) => setSellType(e.target.value)}>
											<FormControlLabel
												value="individual"
												control={<Radio />}
												label="Individually"
											/>
											<FormControlLabel value="pack" control={<Radio />} label="Pack" />
										</RadioGroup>
									</FormControl>
								</Grid>

								<Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
									<FormLabel>
										Any other details you might want to add ({extraInfoTxt.length}/500)
									</FormLabel>
									<TextField
										onChange={(e) => setExtraInfoTxt(e.target.value)}
										value={extraInfoTxt}
										inputProps={{
											maxLength : 500
										}}
										variant="outlined"
										name="extra-info-txt"
										type="text"
										multiline
										rows={3}
										rowsMax={10}
										size="small"
										fullWidth
									/>
								</Grid>
								<Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
									<Button
										type="submit"
										// disabled={shipError}
										variant="contained"
										color="primary"
										fullWidth
									>
										Sell
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

export default SellGameScreen
