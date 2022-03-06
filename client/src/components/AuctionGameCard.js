// @ Modules
import React, { useEffect, useState, Fragment } from 'react'
import { styled } from '@mui/material/styles'

// @ Mui
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Box from '@mui/material/Box'
import CardHeader from '@mui/material/CardHeader'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import Autocomplete from '@mui/material/Autocomplete'
import InputAdornment from '@mui/material/InputAdornment'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import ButtonBase from '@mui/material/ButtonBase'
import FormControl from '@mui/material/FormControl'
import FormGroup from '@mui/material/FormGroup'
import FormLabel from '@mui/material/FormLabel'
import Checkbox from '@mui/material/Checkbox'
import FormHelperText from '@mui/material/FormHelperText'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Slider from '@mui/material/Slider'

// @ Components
import CustomIconBtn from './CustomIconBtn'
import CustomDivider from './CustomDivider'
import Input from './Input'
import Loader from './Loader'

// @ Icons
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import AddPhotoAlternateTwoToneIcon from '@mui/icons-material/AddPhotoAlternateTwoTone'

// @ Others
import { useNotiSnackbar, useUploadListedGameImageMutation, useDeleteUploadedGameImageMutation } from '../hooks/hooks'

// @ Styles
const StyledImg = styled('img')({
	objectFit    : 'cover',
	width        : '100%',
	height       : '100%',
	borderRadius : '8px'
})

// @ Main
const AuctionGameCard = ({ game, isPack, data, removeFromListHandler, handleGameInfo }) => {
	const matches = useMediaQuery((theme) => theme.breakpoints.up('md'))

	const [ showSnackbar ] = useNotiSnackbar()

	const displayImageHandler = (image, thumbnail) => {
		if (matches) {
			return image ? image : '/images/gameImgPlaceholder.jpg'
		} else {
			return thumbnail ? thumbnail : '/images/gameImgPlaceholder.jpg'
		}
	}

	const uploadImageMutation = useUploadListedGameImageMutation({ title: data.title, handleGameInfo })

	const removeImageMutation = useDeleteUploadedGameImageMutation({ handleGameInfo })

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
		uploadImageMutation.mutate(fd)
	}

	const removeImage = (e) => {
		removeImageMutation.mutate({ fileName: data.userImage.name, bggId: game.bggId, title: game.title })
	}

	const handleImgLoad = (e) => {
		console.log('here')
	}

	return (
		<Card elevation={2}>
			<CardHeader
				title={game.title}
				subheader={`${game.subtype} • ${game.year}`}
				action={
					<CustomIconBtn onClick={() => removeFromListHandler(game.bggId, game.title)} size="large">
						<HighlightOffIcon color="error" />
					</CustomIconBtn>
				}
				titleTypographyProps={{
					color   : 'primary',
					variant : 'subtitle2'
				}}
				subheaderTypographyProps={{
					color   : 'grey.400',
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

				<Input
					sx={{ my: 2 }}
					value={data.extraInfo}
					onChange={(inputVal) => handleGameInfo(inputVal, game.bggId, 'extraInfo')}
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

				<FormControlLabel
					control={
						<Switch
							checked={data.isSleeved}
							onChange={(e) => handleGameInfo(e.target.checked, game.bggId, 'isSleeved')}
						/>
					}
					label={<Typography variant="body2">Sleeved?</Typography>}
				/>

				{!isPack && (
					<Box
						sx={{
							display             : 'grid',
							gridTemplateColumns : 'repeat(2, 1fr)',
							gap                 : 2,
							mt                  : 2
						}}
					>
						<FormControl fullWidth>
							<InputLabel id="end-date-label">End date?</InputLabel>

							<Select
								size="small"
								labelId="end-date-label"
								label="End date?"
								value={data.endDate || '3d'}
								onChange={(e) => handleGameInfo(e.target.value, game.bggId, 'endDate')}
							>
								<MenuItem value="12h">12 hours</MenuItem>
								<MenuItem value="1d">1 day</MenuItem>
								<MenuItem value="2d">2 days</MenuItem>
								<MenuItem value="3d">3 days</MenuItem>
								<MenuItem value="4d">4 days</MenuItem>
								<MenuItem value="5d">5 days</MenuItem>
								<MenuItem value="6d">6 days</MenuItem>
								<MenuItem value="7d">7 days</MenuItem>
							</Select>
						</FormControl>

						<FormControl fullWidth>
							<InputLabel id="snipe-rule-label">Sniping rule?</InputLabel>

							<Select
								size="small"
								labelId="snipe-rule-label"
								label="Sniping rule?"
								value={data.snipeRule || '15m'}
								onChange={(e) => handleGameInfo(e.target.value, game.bggId, 'snipeRule')}
							>
								<MenuItem value="0m">None</MenuItem>
								<MenuItem value="5m">5 minutes</MenuItem>
								<MenuItem value="10m">10 minutes</MenuItem>
								<MenuItem value="15m">15 minutes</MenuItem>
								<MenuItem value="20m">20 minutes</MenuItem>
								<MenuItem value="25m">25 minutes</MenuItem>
								<MenuItem value="30m">30 minutes</MenuItem>
								<MenuItem value="35m">35 minutes</MenuItem>
								<MenuItem value="40m">40 minutes</MenuItem>
								<MenuItem value="45m">45 minutes</MenuItem>
								<MenuItem value="50m">50 minutes</MenuItem>
								<MenuItem value="55m">55 minutes</MenuItem>
								<MenuItem value="60m">60 minutes</MenuItem>
							</Select>
						</FormControl>

						<Input
							onChange={(inputVal) => handleGameInfo(inputVal, game.bggId, 'startingPrice')}
							value={data.startingPrice}
							error={
								+data.startingPrice > 0 &&
								+data.buyNowPrice > 0 &&
								+data.startingPrice >= +data.buyNowPrice
							}
							helperText={
								+data.startingPrice > 0 &&
								+data.buyNowPrice > 0 &&
								+data.startingPrice >= +data.buyNowPrice ? (
									'Buy now price must be higher than starting price'
								) : (
									false
								)
							}
							name={`starting-price-${game.bggId}`}
							label="Starting price"
							type="number"
							fullWidth
							required
							InputProps={{
								startAdornment : <InputAdornment position="start">RON</InputAdornment>
							}}
						/>
						<Input
							onChange={(inputVal) => handleGameInfo(inputVal, game.bggId, 'buyNowPrice')}
							value={data.buyNowPrice}
							name={`buy-now-price-${game.bggId}`}
							label="Buy now price"
							type="number"
							fullWidth
							InputProps={{
								startAdornment : <InputAdornment position="start">RON</InputAdornment>
							}}
						/>
					</Box>
				)}

				<Fragment>
					<CustomDivider textAlign="left" sx={{ mt: 2 }}>
						<Box fontSize={'0.75rem'}>ADD IMAGE</Box>
					</CustomDivider>

					<Box mt={2}>
						{uploadImageMutation.isLoading || removeImageMutation.isLoading ? (
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
								<Loader size={30} />
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

									<CustomIconBtn
										sx={{
											position : 'absolute',

											right    : '-5px',
											top      : '-5px'
										}}
										color="error"
										onClick={removeImage}
									>
										<HighlightOffIcon />
									</CustomIconBtn>
								</Box>
							)
						)}

						{!data.userImage &&
						!uploadImageMutation.isLoading &&
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
				</Fragment>
			</CardContent>
		</Card>
	)
}

export default AuctionGameCard
