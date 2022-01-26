// @ Libraries
import React, { useEffect, useState } from 'react'
import { styled } from '@mui/material/styles'
import { useMutation } from 'react-query'

// @ Mui
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Box from '@mui/material/Box'
import CardHeader from '@mui/material/CardHeader'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import IconButton from '@mui/material/IconButton'
import Autocomplete from '@mui/material/Autocomplete'
import InputAdornment from '@mui/material/InputAdornment'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import Button from '@mui/material/Button'
import ButtonBase from '@mui/material/ButtonBase'
import Divider from '@mui/material/Divider'

// @ Components
import Input from '../Input'
import Loader from '../Loader'

// @ Icons
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import AddPhotoAlternateTwoToneIcon from '@mui/icons-material/AddPhotoAlternateTwoTone'

// @ Others
import { apiUploadImage, apiDeleteImage } from '../../api/api'
import { useNotiSnackbar } from '../../hooks/hooks'

// @ Styles
const StyledImg = styled('img')({
	objectFit    : 'cover',
	width        : '100%',
	height       : '100%',
	borderRadius : '8px'
})

// @ Main
const SellGameCard = ({ game, isPack, mode, data, removeFromSaleListHandler, handleGameInfo }) => {
	const matches = useMediaQuery((theme) => theme.breakpoints.up('md'))

	const [ showSnackbar ] = useNotiSnackbar()

	const displayImageHandler = (image, thumbnail) => {
		if (matches) {
			return image ? image : '/images/gameImgPlaceholder.jpg'
		} else {
			return thumbnail ? thumbnail : '/images/gameImgPlaceholder.jpg'
		}
	}

	const mutation = useMutation((imgFile) => apiUploadImage(imgFile), {
		onSuccess : (imgData) => {
			console.log(imgData)
			handleGameInfo(imgData, game.bggId, 'userImage')
			showSnackbar.success({ text: `Image for "${data.title}" uploaded successfully` })
		},
		onError   : (error) => {
			showSnackbar.error({ text: error.response.data.message })
		}
	})

	const removeImageMutation = useMutation((url) => apiDeleteImage(url), {
		onSuccess : () => {
			handleGameInfo(null, game.bggId, 'userImage')
			showSnackbar.info({ text: `Image for "${data.title}" deleted successfully` })
		},
		onError   : (error) => {
			showSnackbar.error({ text: error.response.data.message })
		}
	})

	const handleImages = (e) => {
		const uploadedImg = e.target.files[0]
		if (!uploadedImg) return

		if (uploadedImg.type !== 'image/jpeg' && uploadedImg.type !== 'image/png') {
			showSnackbar.error({ text: 'Only .jpg and .png images are allowed' })

			return
		}

		if (uploadedImg.size > 5 * 1024 * 1024) {
			showSnackbar.error({ text: 'Image too large. Maximum size is 5MB' })

			return
		}

		const fd = new FormData()
		fd.append('userImage', uploadedImg, uploadedImg.name)
		fd.append('bggId', game.bggId)
		mutation.mutate(fd)
	}

	const removeImage = (e) => {
		removeImageMutation.mutate(data.userImage.name)
	}

	const handleImgLoad = (e) => {
		console.log('here')
	}

	return (
		<Card elevation={1}>
			<CardHeader
				title={game.title}
				subheader={`${game.type} • ${game.year}`}
				action={
					<IconButton onClick={() => removeFromSaleListHandler(game.bggId, game.title)} size="large">
						<HighlightOffIcon color="error" />
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
				sx={{
					objectFit      : 'cover',
					height         : '180px',
					objectPosition : 'center 10%'
				}}
				component="img"
				image={displayImageHandler(game.image, game.thumbnail)}
				alt={game.title}
				title={game.title}
			/>

			<CardContent>
				{mode === 'buy' &&
				!isPack && (
					<Input
						value={data.otherUsername}
						onChange={(e) => handleGameInfo(e.target.value, game.bggId, 'otherUsername')}
						inputProps={{
							maxLength : 20
						}}
						id="username"
						name="username"
						label="Username"
						type="text"
						placeholder="Username of the person who sold you this game"
						fullWidth
					/>
				)}

				<Autocomplete
					value={data.version}
					isOptionEqualToValue={(option, value) => option.title === value.title}
					onChange={(e, selected) => handleGameInfo(selected, game.bggId, 'version')}
					options={[ ...game.versions, { title: 'TEST FOR ERROR', year: 1999 } ]}
					getOptionLabel={(option) => `${option.title} (${option.year})`}
					renderInput={(params) => (
						<Input
							{...params}
							name={`version-${game.bggId}`}
							label="Version"
							placeholder="Select game version"
							required
						/>
					)}
				/>

				{mode !== 'buy' && (
					<Autocomplete
						sx={{ mt: 2 }}
						value={data.condition}
						isOptionEqualToValue={(option, value) => option === value}
						onChange={(e, selected) => handleGameInfo(selected, game.bggId, 'condition')}
						// if options change, don't forget to also change the arr on the server validator
						options={[
							'New',
							'asd',
							'Opened, not played',
							'Like new',
							'Very Good',
							'Good',
							'Acceptable',
							'Poor'
						]}
						renderInput={(params) => (
							<Input
								{...params}
								name={`condition-${game.bggId}`}
								label="Condition"
								placeholder="Select condition"
								required
							/>
						)}
					/>
				)}

				<Input
					sx={{ margin: (theme) => theme.spacing(2, 0, 2, 0) }}
					value={data.extraInfo}
					onChange={(e) => handleGameInfo(e.target.value, game.bggId, 'extraInfo')}
					inputProps={{
						maxLength   : 500,
						placeholder : 'Any other info goes in here (500 characters limit)'
					}}
					label={`Extra info ${data.extraInfo.length}/500`}
					name="extra-info-txt"
					type="text"
					size="medium"
					multiline
					minRows={3}
					maxRows={10}
					fullWidth
				/>

				<Grid container sx={{ marginBottom: 2 }}>
					<Grid item xs={6}>
						<FormControlLabel
							control={
								<Switch
									checked={data.isSleeved}
									onChange={(e) => handleGameInfo(e.target.checked, game.bggId, 'isSleeved')}
								/>
							}
							label={<Typography variant="body2">Sleeved?</Typography>}
						/>
					</Grid>

					{(mode === 'sell' || mode === 'buy') &&
					!isPack && (
						<Grid item xs={6}>
							<Input
								onChange={(e) => handleGameInfo(e.target.value, game.bggId, 'price')}
								value={data.price}
								name={`price-${game.bggId}`}
								label="Price"
								type="number"
								fullWidth
								required
								InputProps={{
									startAdornment : <InputAdornment position="start">RON</InputAdornment>
								}}
							/>
						</Grid>
					)}
				</Grid>

				<Divider textAlign="left">
					<Box fontSize={'0.75rem'}>ADD IMAGE</Box>
				</Divider>

				<Box mt={2}>
					{mutation.isLoading || removeImageMutation.isLoading ? (
						<Box
							sx={{
								borderStyle    : 'dashed',
								borderColor    : 'primary.main',
								cursor         : 'pointer',
								width          : 150,
								height         : 100,
								display        : 'flex',
								justifyContent : 'center',
								alignItems     : 'center',
								borderRadius   : '8px'
							}}
						>
							<Loader size={35} />
						</Box>
					) : (
						data.userImage && (
							<Box
								sx={{
									width    : 150,
									height   : 100,
									position : 'relative'
								}}
							>
								<StyledImg
									src={data.userImage.thumbnail}
									alt={data.title}
									title={data.title}
									onLoad={handleImgLoad}
								/>

								<IconButton
									sx={{
										position : 'absolute',

										right    : '-5px',
										top      : '-5px'
									}}
									color="error"
									onClick={removeImage}
								>
									<HighlightOffIcon />
								</IconButton>
							</Box>
						)
					)}

					{!data.userImage &&
					!mutation.isLoading &&
					!removeImageMutation.isLoading && (
						<label htmlFor={`${data.bggId}-image`}>
							<input
								accept="image/jpeg, image/png"
								id={`${data.bggId}-image`}
								name="image"
								type="file"
								hidden
								onChange={handleImages}
								onClick={(e) => (e.target.value = null)}
							/>

							<ButtonBase component="div">
								<Box
									sx={{
										borderStyle    : 'dashed',
										borderColor    : 'primary.main',
										cursor         : 'pointer',
										width          : 150,
										height         : 100,
										display        : 'flex',
										justifyContent : 'center',
										alignItems     : 'center',
										borderRadius   : '8px'
									}}
								>
									<AddPhotoAlternateTwoToneIcon fontSize="large" color="primary" />
								</Box>
							</ButtonBase>
						</label>
					)}
				</Box>
			</CardContent>
		</Card>
	)
}

export default SellGameCard
