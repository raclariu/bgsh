import React, { useEffect, useState, Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
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
import Divider from '@material-ui/core/Divider'
import Fade from '@material-ui/core/Fade'
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined'
import CategoryOutlinedIcon from '@material-ui/icons/CategoryOutlined'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { bggGetGameDetails } from '../actions/gameActions'

const useStyles = makeStyles((theme) => ({
	chipsBox : {
		padding        : theme.spacing(1),
		margin         : theme.spacing(1, 0, 4, 0),
		display        : 'flex',
		justifyContent : 'center',
		flexWrap       : 'wrap',
		'& > *'        : {
			margin : theme.spacing(0.5)
		}
	},
	section  : {
		padding : theme.spacing(3, 3, 3, 3)
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
						Players:{' '}
						{game.minPlayers !== game.maxPlayers ? (
							`${game.minPlayers}-${game.maxPlayers}`
						) : (
							game.maxPlayers
						)}
					</p>
					<p>Designer:{game.designers.map((designer) => designer)}</p>
					<p>SuggestedPlayers: {game.suggestedPlayers}</p>
					<p>Language Dependence: {game.languageDependence}</p>

					<Autocomplete
						id="version"
						options={game.versions}
						getOptionLabel={(option) => `${option.title} (${option.year})`}
						style={{ width: 300 }}
						renderInput={(params) => <TextField {...params} label="Versions" variant="outlined" />}
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
						style={{ width: 300 }}
						renderInput={(params) => <TextField {...params} label="Condition" variant="outlined" />}
					/>

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

					<FormControlLabel
						control={<Switch onChange={(e) => setIsSleeved(e.target.checked)} id="sleeved" />}
						label="Sleeved?"
					/>

					<p>#ratings: {game.stats.ratings}</p>
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

					<Divider light />

					<Box className={cls.chipsBox}>
						{game.categories.map((ctg) => (
							<Chip
								icon={<CategoryOutlinedIcon />}
								label={ctg.name}
								variant="outlined"
								color="secondary"
								size="small"
							/>
						))}

						{game.mechanics.map((mec) => (
							<Chip
								icon={<SettingsOutlinedIcon />}
								label={mec.name}
								variant="outlined"
								color="primary"
								size="small"
							/>
						))}
					</Box>
				</form>
			)}
		</Fragment>
	)
}

export default SellGameScreen
