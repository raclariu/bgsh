import React, { useEffect, Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { bggGetGameDetails } from '../actions/gameActions'

const SellGameScreen = () => {
	const dispatch = useDispatch()
	const { bggId } = useParams()

	const bggGameDetails = useSelector((state) => state.bggGameDetails)
	const { loading, error, success, game } = bggGameDetails

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

					<Autocomplete
						id="combo-box-demo"
						options={game.categories}
						getOptionLabel={(option) => option}
						style={{ width: 300 }}
						renderInput={(params) => <TextField {...params} label="Combo box" variant="outlined" />}
					/>

					<Autocomplete
						id="combo-box-demo"
						options={game.mechanics}
						getOptionLabel={(option) => option}
						style={{ width: 300 }}
						renderInput={(params) => <TextField {...params} label="Combo box" variant="outlined" />}
					/>

					<Autocomplete
						id="combo-box-demo"
						options={game.versions}
						getOptionLabel={(option) => `${option.title} (${option.year})`}
						style={{ width: 300 }}
						renderInput={(params) => <TextField {...params} label="Combo box" variant="outlined" />}
					/>

					<p>#ratings: {game.stats.numRatings}</p>
					<p>avgRating: {game.stats.avgRating}</p>
					<p>rank: {game.stats.rank}</p>
				</form>
			)}
		</Fragment>
	)
}

export default SellGameScreen
