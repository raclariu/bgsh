// @ Modules
import React, { useState, Fragment } from 'react'

// @ Mui
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Autocomplete from '@mui/material/Autocomplete'
import Chip from '@mui/material/Chip'
import Backdrop from '@mui/material/Backdrop'

// @ Icons
import AddCircleTwoToneIcon from '@mui/icons-material/AddCircleTwoTone'

// @ Components
import CustomDivider from '../components/CustomDivider'
import ListGameCard from '../components/ListGameCard'
import CustomAlert from '../components/CustomAlert'
import Loader from '../components/Loader'
import Input from '../components/Input'
import LoadingBtn from '../components/LoadingBtn'
import Helmet from '../components/Helmet'

// @ Others
import {
	useGetBggGamesDetailsQuery,
	useGetListQuery,
	useDeleteFromListMutation,
	useListGamesMutation
} from '../hooks/hooks'

// @ Main
const AddWantedGamesScreen = () => {
	const [ shipPreffered, setShipPreffered ] = useState([])
	const [ values, setValues ] = useState([])

	const userList = useGetListQuery((listData) =>
		setValues((val) => val.filter(({ bggId }) => listData.list.find((el) => el.bggId === bggId)))
	)

	const { isError, error, data, isFetching, isSuccess: isSuccessDetails } = useGetBggGamesDetailsQuery((data) => {
		setValues(
			data.map((game) => {
				return {
					...game,
					prefVersion : null,
					prefMode    : {
						buy   : true,
						trade : false
					},
					extraInfo   : ''
				}
			})
		)
	})

	const deleteMutation = useDeleteFromListMutation()
	const listMutation = useListGamesMutation('want')

	const handleGameInfo = (value, id, key) => {
		setValues((vals) => vals.map((val) => (val.bggId === id ? { ...val, [key]: value } : val)))
	}

	const removeFromListHandler = (bggId, title) => {
		deleteMutation.mutate({ bggId, title })
	}

	const handleSubmit = (e) => {
		e.preventDefault()

		if (userList.data.list.length === 0) return

		const verifiedGames = values.map((val) => {
			return {
				...val,
				extraInfo : val.extraInfo.trim() ? val.extraInfo.trim() : null
			}
		})

		const gamesData = {
			games         : verifiedGames,
			shipPreffered
		}

		listMutation.mutate(gamesData)
	}

	return (
		<form onSubmit={handleSubmit} autoComplete="off">
			<Helmet title="Add wanted boardgames" />

			<Box display="flex" alignItems="center" gap={2}>
				{isFetching ? <Loader size={24} /> : <AddCircleTwoToneIcon color="primary" />}

				<Box fontSize="h5.fontSize">List wanted games</Box>
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
			isSuccessDetails && (
				<Fragment>
					<Grid container spacing={3}>
						{data.map(
							(game) =>
								// Because we may have 6 fetched games, but values could have only 3 because
								// user deleted 3, we need to only render a list of the ones that are in values
								values.find((val) => val.bggId === game.bggId) && (
									<Grid item xs={12} md={6} key={game.bggId}>
										<ListGameCard
											game={game}
											mode="want"
											removeFromListHandler={removeFromListHandler}
											handleGameInfo={handleGameInfo}
											data={values.find((val) => val.bggId === game.bggId)}
										/>
									</Grid>
								)
						)}
					</Grid>

					<CustomDivider sx={{ my: 4 }} />

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
						<Autocomplete
							multiple
							filterSelectedOptions
							value={data.shipPreffered}
							onChange={(e, selected) => setShipPreffered(selected)}
							limitTags={2}
							options={[ 'Romanian Post', 'Courier', 'Personal' ]}
							renderTags={(value, getTagProps) =>
								value.map((option, index) => (
									<Chip size="small" label={option} {...getTagProps({ index })} />
								))}
							renderInput={(params) => (
								<Input
									{...params}
									inputProps={{
										...params.inputProps,
										required : shipPreffered.length === 0
									}}
									label="Preferred shipping methods"
									placeholder={'Select prefered shipping methods'}
									name="pref-shipping"
								/>
							)}
							fullWidth
						/>

						<LoadingBtn
							type="submit"
							size="large"
							disabled={isFetching || listMutation.isSuccess}
							variant="contained"
							color="primary"
							loading={listMutation.isLoading}
							fullWidth
						>
							List wanted games
						</LoadingBtn>
					</Box>
				</Fragment>
			)}

			<Backdrop sx={{ zIndex: 1000 }} open={listMutation.isLoading}>
				<Loader />
			</Backdrop>
		</form>
	)
}

export default AddWantedGamesScreen
