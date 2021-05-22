import React, { Fragment, useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
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
import Fade from '@material-ui/core/Fade'
import Button from '@material-ui/core/Button'
import HighlightOffIcon from '@material-ui/icons/HighlightOff'
import { bggGetGamesDetails } from '../actions/gameActions'
import { removeFromSaleList } from '../actions/gameActions'

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
	}
}))

const SellGameScreen = () => {
	const cls = useStyles()
	const dispatch = useDispatch()
	const history = useHistory()

	const [ shipPost, setShipPost ] = useState(true)
	const [ shipCourier, setShipCourier ] = useState(false)
	const [ shipPersonal, setShipPersonal ] = useState(false)
	const [ shipCourierPayer, setShipCourerPayer ] = useState('seller')
	const [ shipPostPayer, setShipPostPayer ] = useState('seller')
	const [ shipCities, setShipCities ] = useState([])
	const [ sellType, setSellType ] = useState('individual')
	const [ extraInfoTxt, setExtraInfoTxt ] = useState('')

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

	console.log(values)

	const bggGamesDetails = useSelector((state) => state.bggGamesDetails)
	const { loading, error, success, games } = bggGamesDetails

	const shipError = [ shipPost, shipCourier, shipPersonal ].filter((checkbox) => checkbox).length < 1

	useEffect(
		() => {
			const mapIds = saleList.map((el) => el.bggId)
			dispatch(bggGetGamesDetails(mapIds))
		},
		[ dispatch, saleList ]
	)

	useEffect(
		() => {
			if (saleList.length !== values.length) {
				const removedId = values.filter(
					({ bggId: valId }) => !saleList.some(({ bggId: slId }) => valId === slId)
				)[0].bggId
				const newValues = [ ...values ].filter((el) => el.bggId !== removedId)
				setValues(newValues)
			}
		},
		[ saleList, values ]
	)

	const handleUncontrolled = (e, value, game, key) => {
		const index = values.findIndex((el) => el.bggId === game.bggId)
		const copy = [ ...values ]
		copy[index] = { ...copy[index], [key]: value }
		setValues(copy)
	}

	const handleCities = (e, cities) => {
		setShipCities(cities)
	}

	const removeFromSaleListHandler = (id) => {
		dispatch(removeFromSaleList(id))
	}

	const handleSubmit = (e) => {
		e.preventDefault()
		console.log({
			games,
			shipPost,
			shipCourier,
			shipPersonal,
			shipCourierPayer,
			shipPostPayer,
			shipCities       : shipPersonal ? shipCities : null,
			sellType,
			extraInfoTxt,
			price            : values.map((el) => +el.price).reduce((acc, cv) => acc + cv, 0),
			individualData   : values
		})
	}

	return (
		<form onSubmit={handleSubmit}>
			{error && <Message>{error}</Message>}
			{saleList.length === 0 && <Message>Your sale list is empty</Message>}

			{loading && <Loader />}

			{success && (
				<Fragment>
					<Grid container spacing={3} className={cls.section}>
						{games.map((game) => (
							<Grid item key={game.bggId} xl={6} lg={6} md={6} sm={6} xs={12}>
								<Card elevation={4}>
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
										image={game.image ? game.image : '/images/collCardPlaceholder.jpg'}
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
													label="Versions"
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
													label="Condition"
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
													variant="outlined"
													id={`price-${game.bggId}`}
													name={`price-${game.bggId}`}
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
					<Grid container className={cls.section} direction="row">
						<Grid item xl={6} lg={6} md={6} sm={6} xs={12}>
							<FormControl required error={shipError} fullWidth>
								{/* Post shipping */}
								<FormLabel>Shipping method</FormLabel>
								<FormGroup required>
									<FormControlLabel
										control={
											<Checkbox
												checked={shipPost}
												onChange={(e) => setShipPost(e.target.checked)}
											/>
										}
										label="Romanian Post"
									/>
									{shipPost && (
										<Fade in={shipPost}>
											<FormControl>
												<FormLabel>Who pays shipping?</FormLabel>
												<RadioGroup
													row
													value={shipPostPayer}
													onChange={(e) => setShipPostPayer(e.target.value)}
												>
													<FormControlLabel
														value="seller"
														control={<Radio />}
														label="Seller"
													/>
													<FormControlLabel value="buyer" control={<Radio />} label="Buyer" />
												</RadioGroup>
											</FormControl>
										</Fade>
									)}

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
									{shipCourier && (
										<Fade in={shipCourier}>
											<FormControl>
												<FormLabel>Who pays shipping?</FormLabel>
												<RadioGroup
													row
													value={shipCourierPayer}
													onChange={(e) => setShipCourerPayer(e.target.value)}
												>
													<FormControlLabel
														value="seller"
														control={<Radio />}
														label="Seller"
													/>
													<FormControlLabel value="buyer" control={<Radio />} label="Buyer" />
												</RadioGroup>
											</FormControl>
										</Fade>
									)}

									{/* Personal delivery */}
									<FormControlLabel
										control={
											<Checkbox
												checked={shipPersonal}
												onChange={(e) => setShipPersonal(e.target.checked)}
											/>
										}
										label="Personal delivery"
									/>
									{shipPersonal && (
										<Fade in={shipPersonal}>
											<Autocomplete
												onChange={(e, val) => handleCities(e, val)}
												value={shipCities}
												filterSelectedOptions
												multiple
												limitTags={2}
												options={[
													'Bucuresti',
													'Bucuresti S1',
													'Bucuresti S2',
													'Bucuresti S3',
													'Bucuresti S4',
													'Bucuresti S5',
													'Bucuresti S6',
													'Timisoara',
													'Cluj-Napoca',
													'Constanta',
													'Dalga'
												]}
												renderInput={(params) => (
													<TextField
														{...params}
														label="Select Cities"
														placeholder="Cities"
														variant="outlined"
														size="small"
														required
													/>
												)}
												renderTags={(value, getTagProps) =>
													value.map((option, index) => (
														<Chip size="small" label={option} {...getTagProps({ index })} />
													))}
											/>
										</Fade>
									)}

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
												label="Each game individually"
											/>
											<FormControlLabel value="pack" control={<Radio />} label="Sell as a pack" />
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
										id="extra-info-txt"
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
									<Button type="submit" fullWidth variant="contained" color="primary">
										Sell for {values.map((el) => +el.price).reduce((acc, cv) => acc + cv, 0)} RON
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
