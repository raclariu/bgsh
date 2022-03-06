// @ Modules
import React, { Fragment, useState, useEffect } from 'react'
import { styled } from '@mui/material/styles'
import { useSelector, useDispatch } from 'react-redux'
import { useDebounce } from 'use-debounce'

// @ Mui
import Box from '@mui/material/Box'
import Autocomplete from '@mui/material/Autocomplete'

// @ Components
import CustomButton from './CustomButton'
import Loader from './Loader'
import Input from './Input'

// @ Others
import { apiBggSearchGames } from '../api/api'
import { useAddToListMutation, useBggSearchGamesMutation } from '../hooks/hooks'

// @ Main
const BggSearchGamesBox = () => {
	const dispatch = useDispatch()

	const [ inputText, setInputText ] = useState('')
	const [ debKeyword ] = useDebounce(inputText, 1500)
	const [ options, setOptions ] = useState([])
	const [ selectedOption, setSelectedOption ] = useState(null)

	const { mutate, data, reset: resetSearch, isLoading, isError, error } = useBggSearchGamesMutation({
		onSuccess : (data) => {
			setOptions(data.filter((v, i, a) => a.findIndex((t) => t.bggId === v.bggId) === i))
		}
	})

	const addToListMutation = useAddToListMutation()

	useEffect(
		() => {
			if (debKeyword) {
				if (debKeyword.length > 2) {
					mutate(debKeyword)
				}
			}

			return () => {
				setOptions([])
				setSelectedOption(null)
			}
		},
		[ dispatch, debKeyword, mutate ]
	)

	const handleInput = (inputVal) => {
		if (options.length === 0) {
			setInputText(inputVal)
		}
	}

	const resetHandler = () => {
		setOptions([])
		setSelectedOption(null)
		resetSearch()
	}

	const addToSaleListHandler = () => {
		if (selectedOption) {
			addToListMutation.mutate(selectedOption)
			resetHandler()
		}
	}

	return (
		<Fragment>
			<Autocomplete
				fullWidth
				value={selectedOption}
				loading={isLoading}
				noOptionsText={isError ? error.response.data.message : 'Board games will show up here'}
				onChange={(e, value) => setSelectedOption(value)}
				getOptionLabel={(option) => `${option.title} (${option.year})`}
				options={options}
				renderOption={(props, option) => {
					return (
						<li {...props} key={option.bggId}>
							{option.title} ({option.year})
						</li>
					)
				}}
				renderInput={(params) => (
					<Input
						{...params}
						onChange={handleInput}
						label="Search games on BoardGameGeek"
						size="medium"
						error={isError || (data && data.length === 0) ? true : false}
						helperText={
							isError ? (
								error.response.data.message
							) : data && data.length === 0 ? (
								'No results found'
							) : (
								false
							)
						}
						placeholder="Enter boardgame title"
						variant="outlined"
						InputProps={{
							...params.InputProps,
							endAdornment : (
								<Fragment>
									{isLoading ? <Loader color="secondary" size={20} /> : null}
									{params.InputProps.endAdornment}
								</Fragment>
							)
						}}
					/>
				)}
			/>

			<Box display="flex" alignItems="center" justifyContent="flex-end" mt={2} gap={1}>
				<CustomButton
					variant="contained"
					onClick={resetHandler}
					disabled={options.length === 0}
					color="secondary"
				>
					Reset
				</CustomButton>
				<CustomButton variant="contained" onClick={addToSaleListHandler} disabled={!selectedOption}>
					Add to my list
				</CustomButton>
			</Box>
		</Fragment>
	)
}

export default BggSearchGamesBox
