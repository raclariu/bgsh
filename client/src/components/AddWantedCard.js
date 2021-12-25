// @ Libraries
import React from 'react'
import { useSelector } from 'react-redux'
import makeStyles from '@mui/styles/makeStyles';

// @ Mui
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import IconButton from '@mui/material/IconButton'
import Autocomplete from '@mui/material/Autocomplete'
import InputAdornment from '@mui/material/InputAdornment'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import useMediaQuery from '@mui/material/useMediaQuery'
import FormControl from '@mui/material/FormControl'
import FormGroup from '@mui/material/FormGroup'
import FormLabel from '@mui/material/FormLabel'
import Checkbox from '@mui/material/Checkbox'

// @ Components
import Input from './Input'

// @ Icons
import HighlightOffIcon from '@mui/icons-material/HighlightOff'

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
					<IconButton onClick={() => removeFromSaleListHandler(game.bggId)} size="large">
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
					isOptionEqualToValue={(option, value) => option.title === value.title}
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
    );
}

export default AddWantedCard
