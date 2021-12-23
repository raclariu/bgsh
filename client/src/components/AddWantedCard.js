// @ Libraries
import React from 'react'
import { useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'

// @ Mui
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import IconButton from '@material-ui/core/IconButton'
import Autocomplete from '@material-ui/lab/Autocomplete'
import InputAdornment from '@material-ui/core/InputAdornment'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import Typography from '@material-ui/core/Typography'
import Chip from '@material-ui/core/Chip'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import FormControl from '@material-ui/core/FormControl'
import FormGroup from '@material-ui/core/FormGroup'
import FormLabel from '@material-ui/core/FormLabel'
import Checkbox from '@material-ui/core/Checkbox'

// @ Components
import Input from './Input'

// @ Icons
import HighlightOffIcon from '@material-ui/icons/HighlightOff'

// @ Styles
const useStyles = makeStyles((theme) => ({
	media        : {
		objectFit      : 'cover',
		height         : '180px',
		objectPosition : 'center 10%'
	},
	autocomplete : {
		marginTop : theme.spacing(2)
	},
	error        : {
		margin : theme.spacing(2, 0, 2, 0)
	}
}))

// @ Main
const AddWantedCard = ({ game, removeFromSaleListHandler, handleGameInfo, data }) => {
	const cls = useStyles()
	const matches = useMediaQuery((theme) => theme.breakpoints.up('md'))

	const displayImageHandler = (image, thumbnail) => {
		if (matches) {
			return image ? image : '/images/gameImgPlaceholder.jpg'
		} else {
			return thumbnail ? thumbnail : '/images/gameImgPlaceholder.jpg'
		}
	}
	console.log(data)

	return (
		<Card elevation={1}>
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
				{/* <Autocomplete
					value={data.prefLanguage}
					getOptionSelected={(option, value) => option === value}
					onChange={(e, selected) => handleGameInfo(e, selected, game.bggId, 'prefLanguage')}
					options={[ 'Romanian', 'English', 'Any' ]}
					renderInput={(params) => (
						<Input
							{...params}
							name={`prefLanguage-${game.bggId}`}
							label="Preferred language"
							placeholder="Select your preferred language"
							required
						/>
					)}
				/> */}

				<FormControl>
					<FormLabel>Prefer buying or trading for this game?</FormLabel>
					<FormGroup row>
						<FormControlLabel
							control={
								<Checkbox
									onChange={(e) =>
										handleGameInfo(
											{ ...data.prefMode, buy: e.target.checked },
											game.bggId,
											'prefMode'
										)}
									checked={data.prefMode.buy}
								/>
							}
							label="Buy"
						/>
						<FormControlLabel
							control={
								<Checkbox
									onChange={(e) =>
										handleGameInfo(
											{ ...data.prefMode, trade: e.target.checked },
											game.bggId,
											'prefMode'
										)}
									checked={data.prefMode.trade}
								/>
							}
							label="Trade"
						/>
					</FormGroup>
				</FormControl>

				<Autocomplete
					value={data.version}
					getOptionSelected={(option, value) => option.title === value.title}
					onChange={(e, selected) => handleGameInfo(e, selected, game.bggId, 'prefVersion')}
					options={game.versions}
					getOptionLabel={(option) => `${option.title} (${option.year})`}
					renderInput={(params) => (
						<Input
							{...params}
							name={`version-${game.bggId}`}
							label="Preferred version"
							placeholder="Select preferred version"
							required
						/>
					)}
				/>
			</CardContent>
		</Card>
	)
}

export default AddWantedCard
