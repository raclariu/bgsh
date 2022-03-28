// @ Modules
import React, { Fragment, useEffect, useState, useRef } from 'react'
import { styled } from '@mui/material/styles'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useHistory } from 'react-router-dom'
import queryString from 'query-string'

// @ Mui
import Grid from '@mui/material/Grid'
import InputAdornment from '@mui/material/InputAdornment'
import Box from '@mui/material/Box'
import Backdrop from '@mui/material/Backdrop'

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
	useGetListQuery,
	useGetBggGamesDetailsQuery,
	useDeleteFromListMutation,
	useListGamesMutation
} from '../hooks/hooks'

// @ Main
const BuyGamesScreen = () => {
	const dispatch = useDispatch()
	const location = useLocation()
	const history = useHistory()

	let { pack: isPack = false } = queryString.parse(location.search)
	isPack = !!isPack

	const userList = useGetListQuery((listData) =>
		setValues((val) => val.filter(({ bggId }) => listData.list.find((el) => el.bggId === bggId)))
	)

	const [ extraInfoPack, setExtraInfoPack ] = useState('')
	const [ finalPrice, setFinalPrice ] = useState('')
	const [ otherUsername, setOtherUsername ] = useState('')
	const [ values, setValues ] = useState([])

	const { isError, error, data, isFetching, isSuccess: isSuccessDetails } = useGetBggGamesDetailsQuery((data) => {
		setValues(
			data.map((game) => {
				return {
					...game,
					isSleeved     : false,
					version       : null,
					extraInfo     : '',
					price         : '',
					otherUsername : ''
				}
			})
		)
	})

	const deleteMutation = useDeleteFromListMutation()
	const addMutation = useListGamesMutation('buy')

	if (isPack !== false && isPack !== true) {
		addMutation.reset()
		history.push('/sell')
	}

	if (userList.isSuccess && userList.data.list.length === 1 && isPack) {
		addMutation.reset()
		history.push('/sell')
	}

	const removeFromListHandler = (bggId, title) => {
		deleteMutation.mutate({ bggId, title })
	}

	const handleGameInfo = (value, id, key) => {
		setValues((vals) => vals.map((val) => (val.bggId === id ? { ...val, [key]: value } : val)))
	}

	const handleSubmit = (e) => {
		e.preventDefault()

		if (userList.data.list.length === 0) return

		const verifiedGames = values.map((val) => {
			if (isPack) {
				return {
					...val,
					price         : null,
					otherUsername : null,
					extraInfo     : val.extraInfo.trim() ? val.extraInfo.trim() : null
				}
			} else {
				return {
					...val,
					extraInfo : val.extraInfo.trim() ? val.extraInfo.trim() : null
				}
			}
		})

		const gamesData = {
			games         : verifiedGames,
			isPack,
			extraInfoPack : extraInfoPack.trim() ? extraInfoPack.trim() : null,
			finalPrice    : finalPrice,
			otherUsername : otherUsername.trim() ? otherUsername.trim().toLowerCase() : null
		}

		addMutation.mutate(gamesData)
	}

	return (
		<form onSubmit={handleSubmit} autoComplete="off">
			<Helmet title="Buy boardgames" />

			<Box display="flex" alignItems="center" gap={2} mb={2}>
				{isFetching && <Loader size={20} />}

				<Box fontSize="h6.fontSize">Add bought games</Box>
			</Box>

			{isError && <CustomAlert>{error.response.data.message}</CustomAlert>}

			{addMutation.isError && (
				<Box display="flex" flexDirection="column" gap={1} my={2}>
					{Object.values(addMutation.error.response.data.message).map((err, i) => (
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
						{values.map((game) => (
							<Grid item key={game.bggId} md={6} xs={12}>
								<ListGameCard
									game={game}
									isPack={isPack}
									mode="buy"
									data={values.find((val) => val.bggId === game.bggId)}
									removeFromListHandler={removeFromListHandler}
									handleGameInfo={handleGameInfo}
								/>
							</Grid>
						))}
					</Grid>

					<CustomDivider sx={{ my: 2 }} />

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
						{isPack && (
							<Fragment>
								<Input
									value={data.otherUsername}
									onChange={(inputVal) => setOtherUsername(inputVal)}
									inputProps={{
										minLength : 4,
										maxLength : 20
									}}
									id="username"
									name="username"
									label="Username"
									type="text"
									placeholder="Username of the person who sold you this game"
									fullWidth
								/>

								<Input
									value={finalPrice}
									onChange={(inputVal) => setFinalPrice(inputVal)}
									type="number"
									label="Pack price"
									name="final-price"
									InputProps={{
										startAdornment : <InputAdornment position="start">RON</InputAdornment>
									}}
									required
									fullWidth
								/>

								<Input
									value={extraInfoPack}
									onChange={(inputVal) => setExtraInfoPack(inputVal)}
									name="extra-info-pack"
									label={`Extra info ${extraInfoPack.length}/500`}
									type="text"
									size="medium"
									multiline
									minRows={3}
									maxRows={10}
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
							size="large"
							disabled={isFetching || addMutation.isSuccess}
							variant="contained"
							color="primary"
							loading={addMutation.isLoading}
							fullWidth
						>
							Buy
						</LoadingBtn>
					</Box>
				</Fragment>
			)}
			<Backdrop sx={{ zIndex: 1000 }} open={addMutation.isLoading}>
				<Loader />
			</Backdrop>
		</form>
	)
}

export default BuyGamesScreen
