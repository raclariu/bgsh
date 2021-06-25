import React, { Fragment, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useDebounce } from 'use-debounce'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import Button from '@material-ui/core/Button'
import Autocomplete from '@material-ui/lab/Autocomplete'
import Loader from './Loader'
import { bggSearchGames, addToSaleList } from '../actions/gameActions'
import { BGG_GAMES_SEARCH_RESET } from '../constants/gameConstants'

const useStyles = makeStyles((theme) => ({
	btnGroup : {
		display        : 'flex',
		alignItems     : 'center',
		justifyContent : 'flex-end'
	}
}))

const BggSearchGamesBox = () => {
	const cls = useStyles()
	const dispatch = useDispatch()

	const [ inputText, setInputText ] = useState('')
	const [ debKeyword ] = useDebounce(inputText.trim(), 1500)
	const [ options, setOptions ] = useState([])
	const [ selectedOption, setSelectedOption ] = useState(null)

	const bggSearch = useSelector((state) => state.bggSearchGames)
	const { loading, error, success, games } = bggSearch

	useEffect(
		() => {
			if (debKeyword.length > 2) {
				dispatch(bggSearchGames(debKeyword))
			}

			return () => {
				setOptions([])
				setSelectedOption(null)
				dispatch({ type: BGG_GAMES_SEARCH_RESET })
			}
		},
		[ dispatch, debKeyword ]
	)

	useEffect(
		() => {
			if (success) {
				setOptions(games)
			}
		},
		[ games, success, dispatch ]
	)

	const changeInputHandler = (e) => {
		if (options.length === 0) {
			setInputText(e.target.value)
		}
	}

	const resetHandler = () => {
		setOptions([])
		dispatch({ type: BGG_GAMES_SEARCH_RESET })
		setSelectedOption(null)
	}

	const submitHandler = () => {
		if (selectedOption) {
			dispatch(addToSaleList(selectedOption))
			resetHandler()
		}
	}

	return (
		<Fragment>
			<Autocomplete
				fullWidth
				value={selectedOption}
				loading={loading}
				noOptionsText={error ? error : 'No options'}
				onChange={(e, value) => setSelectedOption(value)}
				getOptionLabel={(option) => `${option.title} (${option.year})`}
				options={options}
				renderInput={(params) => (
					<TextField
						{...params}
						onChange={(e) => changeInputHandler(e)}
						label="Search game"
						error={error ? true : false}
						helperText={error ? error : ' '}
						placeholder="Enter game name"
						variant="outlined"
						InputProps={{
							...params.InputProps,
							endAdornment : (
								<Fragment>
									{loading ? <Loader color="inherit" size={20} /> : null}
									{params.InputProps.endAdornment}
								</Fragment>
							)
						}}
					/>
				)}
			/>

			<ButtonGroup className={cls.btnGroup} size="small">
				<Button onClick={resetHandler} disabled={options.length === 0} color="secondary">
					Reset
				</Button>
				<Button onClick={submitHandler} disabled={!selectedOption} color="primary">
					Add to sale list
				</Button>
			</ButtonGroup>
		</Fragment>
	)
}

export default BggSearchGamesBox
