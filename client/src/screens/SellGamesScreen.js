import React, { Fragment, useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { bggGetGamesDetails } from '../actions/gameActions'

import Box from '@material-ui/core/Box'
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
import Fade from '@material-ui/core/Fade'

const useStyles = makeStyles((theme) => ({
	media       : {
		objectFit      : 'cover',
		height         : '150px',
		objectPosition : 'center 0%'
	},
	cardContent : {
		padding : '0px'
	},
	title       : {
		margin     : theme.spacing(2, 0, 1, 0),
		padding    : theme.spacing(0, 2, 0, 2),
		minHeight  : '40px',
		fontWeight : '500'
	}
}))

const SellGameScreen = () => {
	const cls = useStyles()
	const dispatch = useDispatch()
	const history = useHistory()

	const [ isSleeved, setIsSleeved ] = useState(false)
	const [ shipPost, setShipPost ] = useState(true)
	const [ shipCourier, setShipCourier ] = useState(false)
	const [ shipPersonal, setShipPersonal ] = useState(false)
	const [ shipCourierPayer, setShipCourerPayer ] = useState('seller')
	const [ shipPostPayer, setShipPostPayer ] = useState('seller')

	const saleList = useSelector((state) => state.saleList)

	const bggGamesDetails = useSelector((state) => state.bggGamesDetails)
	const { loading, error, success, games } = bggGamesDetails

	const shipError = [ shipPost, shipCourier, shipPersonal ].filter((checkbox) => checkbox).length < 1

	useEffect(
		() => {
			const mapped = saleList.map((el) => el.bggId)
			dispatch(bggGetGamesDetails(mapped))
		},
		[ dispatch, saleList ]
	)

	return (
		<Fragment>
			{error && <Message>{error}</Message>}
			{saleList.length === 0 && <Message>Your sale list is empty</Message>}

			{loading && <Loader />}

			{success && (
				<Fragment>
					<Grid container spacing={3}>
						{games.map((game) => (
							<Grid item key={game.id} xl={4} lg={4} md={4} sm={6} xs={12}>
								<Card key={game.id} elevation={4}>
									<CardMedia
										className={cls.media}
										component="img"
										image={game.image ? game.image : '/images/collCardPlaceholder.jpg'}
										alt={game.title}
										title={game.title}
									/>
									<CardContent>
										<Autocomplete
											id="version"
											options={game.versions}
											getOptionLabel={(option) => `${option.title} (${option.year})`}
											renderInput={(params) => (
												<TextField {...params} label="Versions" variant="outlined" />
											)}
										/>

										<Autocomplete
											id="condition"
											options={[
												'New, in shrink',
												'New, opened',
												'New, punched components',
												'Very Good',
												'Good',
												'Average',
												'Poor',
												'Very Poor',
												'Damaged',
												'Heavily Damaged'
											]}
											renderInput={(params) => (
												<TextField {...params} label="Condition" variant="outlined" />
											)}
										/>

										<FormControlLabel
											control={
												<Switch onChange={(e) => setIsSleeved(e.target.checked)} id="sleeved" />
											}
											label="Sleeved?"
										/>
									</CardContent>
								</Card>
							</Grid>
						))}
					</Grid>
					{/* Shipping Area */}
					<Box className={cls.section}>
						<FormControl required error={shipError}>
							<FormLabel>Shipping method</FormLabel>

							{/* Post shipping */}
							<FormControlLabel
								control={
									<Checkbox checked={shipPost} onChange={(e) => setShipPost(e.target.checked)} />
								}
								label="Romanian Post"
							/>
							{shipPost && (
								<Fade in={shipPost}>
									<FormControl required>
										<FormLabel component="label">Post: Who will pay for shipping?</FormLabel>
										<RadioGroup
											row
											value={shipPostPayer}
											onChange={(e) => setShipPostPayer(e.target.value)}
										>
											<FormControlLabel value="seller" control={<Radio />} label="Seller" />
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
									<FormControl required>
										<FormLabel>Courier: Who will pay for shipping?</FormLabel>
										<RadioGroup
											row
											value={shipCourierPayer}
											onChange={(e) => setShipCourerPayer(e.target.value)}
										>
											<FormControlLabel value="seller" control={<Radio />} label="Seller" />
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
										id="shipping"
										filterSelectedOptions
										multiple
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
										style={{ width: 300 }}
										renderInput={(params) => (
											<TextField
												{...params}
												label="In what cities are you able to ship?"
												variant="standard"
											/>
										)}
										renderTags={(value, getTagProps) =>
											value.map((option, index) => (
												<Chip
													variant="outlined"
													label={option}
													size="small"
													{...getTagProps({ index })}
												/>
											))}
									/>
								</Fade>
							)}

							{shipError && <FormHelperText error>Select at least one shipping method</FormHelperText>}
						</FormControl>
					</Box>
				</Fragment>
			)}
		</Fragment>
	)
}

export default SellGameScreen
