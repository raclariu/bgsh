import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

// Mui
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import IconButton from '@material-ui/core/IconButton'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import InputAdornment from '@material-ui/core/InputAdornment'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import Typography from '@material-ui/core/Typography'

// Icons
import HighlightOffIcon from '@material-ui/icons/HighlightOff'

// Styles
const useStyles = makeStyles((theme) => ({
	media        : {
		objectFit      : 'cover',
		height         : '180px',
		objectPosition : 'center 10%'
	},
	autocomplete : {
		marginTop : theme.spacing(2)
	},
	extraInfo    : {
		margin : theme.spacing(2, 0, 2, 0)
	},
	error        : {
		margin : theme.spacing(2, 0, 2, 0)
	}
}))

const SellGameCard = ({ game, type, data, removeFromSaleListHandler, handleGameInfo }) => {
	const cls = useStyles()
	const matches = useMediaQuery((theme) => theme.breakpoints.up('md'))

	const displayImageHandler = (image, thumbnail) => {
		if (matches) {
			return image ? image : '/images/gameImgPlaceholder.jpg'
		} else {
			return thumbnail ? thumbnail : '/images/gameImgPlaceholder.jpg'
		}
	}

	return (
		<Card elevation={2}>
			<CardHeader
				title={game.title}
				subheader={`${game.type} • ${game.year}`}
				action={
					<IconButton onClick={() => removeFromSaleListHandler(game.bggId)}>
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
				className={cls.media}
				component="img"
				image={displayImageHandler(game.image, game.thumbnail)}
				alt={game.title}
				title={game.title}
			/>
			<CardContent>
				<Autocomplete
					value={data.version}
					getOptionSelected={(option, value) => option.title === value.title}
					onChange={(e, selected) => handleGameInfo(e, selected, game, 'version')}
					options={game.versions}
					getOptionLabel={(option) => `${option.title} (${option.year})`}
					renderInput={(params) => (
						<TextField
							{...params}
							name={`version-${game.bggId}`}
							label="Version"
							placeholder="Select game version"
							variant="outlined"
							size="small"
							required
						/>
					)}
				/>

				<Autocomplete
					className={cls.autocomplete}
					value={data.condition}
					getOptionSelected={(option, value) => option === value}
					onChange={(e, selected) => handleGameInfo(e, selected, game, 'condition')}
					// if options change, don't forget to also change the arr on the server validator
					options={[ 'New', 'Opened, not played', 'Like new', 'Very Good', 'Good', 'Acceptable', 'Poor' ]}
					renderInput={(params) => (
						<TextField
							{...params}
							name={`condition-${game.bggId}`}
							label="Condition"
							placeholder="Select condition"
							variant="outlined"
							size="small"
							required
						/>
					)}
				/>

				<TextField
					className={cls.extraInfo}
					value={data.extraInfo}
					onChange={(e) => handleGameInfo(e, e.target.value, game, 'extraInfo')}
					inputProps={{
						maxLength   : 500,
						placeholder : 'Any other info goes in here (500 characters limit)'
					}}
					variant="outlined"
					name="extra-info-txt"
					type="text"
					multiline
					rows={3}
					rowsMax={10}
					size="small"
					fullWidth
				/>

				<Grid container>
					<Grid item xs={6}>
						<FormControlLabel
							control={
								<Switch
									checked={data.isSleeved}
									onChange={(e) => handleGameInfo(e, e.target.checked, game, 'isSleeved')}
								/>
							}
							label={<Typography variant="body2">Sleeved?</Typography>}
						/>
					</Grid>
					{type === 'individual' && (
						<Grid item xs={6}>
							<TextField
								onChange={(e) => handleGameInfo(e, e.target.value, game, 'price')}
								value={data.price}
								InputProps={{
									startAdornment : <InputAdornment position="start">RON</InputAdornment>
								}}
								inputProps={{
									min : 0,
									max : 10000
								}}
								name={`price-${game.bggId}`}
								variant="outlined"
								label="Price"
								type="number"
								size="small"
								fullWidth
								required
							/>
						</Grid>
					)}
				</Grid>
			</CardContent>
		</Card>
	)
}

export default SellGameCard
