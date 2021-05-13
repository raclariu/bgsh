import React, { useEffect, useState, Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import FormGroup from '@material-ui/core/FormGroup'
import TextField from '@material-ui/core/TextField'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormLabel from '@material-ui/core/FormLabel'
import FormHelperText from '@material-ui/core/FormHelperText'
import Switch from '@material-ui/core/Switch'
import Checkbox from '@material-ui/core/Checkbox'
import RadioGroup from '@material-ui/core/RadioGroup'
import Radio from '@material-ui/core/Radio'
import Typography from '@material-ui/core/Typography'
import Fade from '@material-ui/core/Fade'
import Autocomplete from '@material-ui/lab/Autocomplete'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { bggGetGameDetails } from '../actions/gameActions'

const useStyles = makeStyles((theme) => ({
	paper : {
		padding : theme.spacing(4)
	}
}))

const SellGameScreen = () => {
	const cls = useStyles()
	const dispatch = useDispatch()
	const { bggId } = useParams()

	const [ isSleeved, setIsSleeved ] = useState(false)
	const [ shipPost, setShipPost ] = useState(true)
	const [ shipCourier, setShipCourier ] = useState(false)
	const [ shipPersonal, setShipPersonal ] = useState(false)
	const [ shipCourierPayer, setShipCourerPayer ] = useState('seller')
	const [ shipPostPayer, setShipPostPayer ] = useState('seller')

	const bggGameDetails = useSelector((state) => state.bggGameDetails)
	const { loading, error, success, game } = bggGameDetails

	const shipError = [ shipPost, shipCourier, shipPersonal ].filter((checkbox) => checkbox).length < 1

	useEffect(
		() => {
			dispatch(bggGetGameDetails(bggId))
		},
		[ dispatch, bggId ]
	)

	return (
		<Fragment>
			{loading && <Loader />}

			{error && <Message>{error}</Message>}

			{success && (
				<form>
					<TextField
						InputProps={{
							readOnly : true
						}}
						defaultValue={game.type === 'boardgame' ? 'Boardgame' : 'Expansion'}
					/>
					<TextField
						InputProps={{
							readOnly : true
						}}
						defaultValue={game.title}
					/>
					<TextField
						InputProps={{
							readOnly : true
						}}
						defaultValue={game.bggId}
					/>
					<img src={game.thumbnail} alt={game.title} />
					<p>Year: {game.year}</p>
					<p>
						Players: {game.minPlayers}-{game.maxPlayers}
					</p>
					<p>SuggestedPlayers: {game.suggestedPlayers}</p>
					<p>Language Dependence: {game.languageDependence}</p>

					<Paper className={cls.paper} elevation={5}>
						{game.categories.map((ctg) => (
							<div>
								<p>{ctg}</p>
							</div>
						))}

						{game.mechanics.map((mec) => (
							<div>
								<p>{mec}</p>
							</div>
						))}
					</Paper>

					<Autocomplete
						id="version"
						options={game.versions}
						getOptionLabel={(option) => `${option.title} (${option.year})`}
						style={{ width: 300 }}
						renderInput={(params) => <TextField {...params} label="Versions" variant="outlined" />}
					/>

					<Autocomplete
						id="quality"
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
						style={{ width: 300 }}
						renderInput={(params) => <TextField {...params} label="Quality" variant="outlined" />}
					/>

					{/* Shipping Area */}
					<Paper className={cls.paper} elevation={5}>
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
										options={[ 'Bucharest', 'Cluj-Napoca', 'Constanta', 'Dalga' ]}
										style={{ width: 300 }}
										renderInput={(params) => (
											<TextField
												{...params}
												label="In what cities are you able to ship?"
												variant="outlined"
											/>
										)}
									/>
								</Fade>
							)}

							{shipError && <FormHelperText error>Select at least one shipping method</FormHelperText>}
						</FormControl>
					</Paper>

					<FormControlLabel
						control={<Switch onChange={(e) => setIsSleeved(e.target.checked)} id="sleeved" />}
						label="Sleeved?"
					/>

					<p>#ratings: {game.stats.numRatings}</p>
					<p>avgRating: {game.stats.avgRating}</p>
					<p>rank: {game.stats.rank}</p>

					<TextField type="number" id="price" name="price" variant="outlined" label="Price" required />

					<TextField
						type="text"
						id="info"
						name="info"
						variant="outlined"
						label="Extra info"
						rows={3}
						multiline
					/>
				</form>
			)}
		</Fragment>
	)
}

export default SellGameScreen
