// @ Libraries
import React, { useState, Fragment } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link as RouterLink } from 'react-router-dom'
import makeStyles from '@mui/styles/makeStyles';

// @ Mui
import Grid from '@mui/material/Grid'
import Popover from '@mui/material/Popover'
import ButtonGroup from '@mui/material/ButtonGroup'
import Button from '@mui/material/Button'
import Badge from '@mui/material/Badge'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction'
import ListItemText from '@mui/material/ListItemText'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'

// @ Icons
import FeaturedPlayListTwoToneIcon from '@mui/icons-material/FeaturedPlayListTwoTone'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'

// @ Components
import SaleListPopoverDialog from './SaleListPopoverDialog'

// @ Others
import { removeFromSaleList } from '../actions/saleListActions'
import { saleListLimit } from '../constants/saleListConstants'
import { useNotification } from '../hooks/hooks'

// @ Styles
const useStyles = makeStyles((theme) => ({
	popover   : {
		[theme.breakpoints.down('sm')]: {
			width : '100vw'
		},
		[theme.breakpoints.up('sm')]: {
			width : 400
		}
	},
	subheader : {
		margin : theme.spacing(2, 0, 2, 0)
	},
	btnGroup  : {
		display        : 'flex',
		alignItems     : 'center',
		justifyContent : 'center',
		marginBottom   : theme.spacing(2)
	}
}))

// @ Main
const SaleListPopover = () => {
	const cls = useStyles()

	const dispatch = useDispatch()

	const [ anchorEl, setAnchorEl ] = useState(null)
	const [ openDialog, setOpenDialog ] = useState(false)
	const [ mode, setMode ] = useState('')
	const [ showSnackbar ] = useNotification()

	const saleList = useSelector((state) => state.saleList)

	const open = Boolean(anchorEl)

	const handleClose = () => {
		setAnchorEl(null)
	}

	const removeFromSaleListHandler = (id, title) => {
		dispatch(removeFromSaleList(id))
		showSnackbar.info({ text: `${title} removed from list` })
	}

	const handleCloseDialog = () => {
		setOpenDialog(false)
		setAnchorEl(null)
	}

	const handleModeClick = (mode) => {
		setMode(mode)
		setOpenDialog(true)
	}

	return (
        <Fragment>
			<IconButton
                onClick={(e) => setAnchorEl(e.currentTarget)}
                color="primary"
                size="large">
				<Badge color="secondary" badgeContent={saleList.length} showZero>
					<FeaturedPlayListTwoToneIcon />
				</Badge>
			</IconButton>

			<Popover
				classes={{ paper: cls.popover }}
				open={open}
				anchorEl={anchorEl}
				onClose={handleClose}
				transitionDuration={350}
				anchorOrigin={{
					vertical   : 'bottom',
					horizontal : 'center'
				}}
				transformOrigin={{
					vertical   : 'top',
					horizontal : 'center'
				}}
			>
				{/* Content */}
				<Box my={2} textAlign="center" fontWeight="fontWeightMedium">
					My list ({saleList.length}/{saleListLimit})
				</Box>
				<Divider />

				{saleList.length === 0 && (
					<Fragment>
						<Box my={2} textAlign="center" fontWeight="fontWeightMedium">
							Add games
						</Box>

						<Box display="flex" justifyContent="center" my={1} color="primary">
							<ButtonGroup color="primary" size="small">
								<Button component={RouterLink} to="/profile" onClick={handleClose}>
									Profile
								</Button>
								<Button component={RouterLink} to="/collection" onClick={handleClose}>
									Collection
								</Button>
								<Button component={RouterLink} to="/wishlist" onClick={handleClose}>
									Wishlist
								</Button>
							</ButtonGroup>
						</Box>
					</Fragment>
				)}

				<List disablePadding>
					{saleList.map((game) => (
						<ListItem key={game.bggId} divider>
							<ListItemAvatar>
								<Avatar variant="rounded" src={game.thumbnail} alt={game.title}>
									{game.title.substring(0, 2).toUpperCase()}
								</Avatar>
							</ListItemAvatar>
							<ListItemText
								primary={game.title}
								secondary={game.year}
								primaryTypographyProps={{
									color   : 'primary',
									variant : 'subtitle2'
								}}
								secondaryTypographyProps={{
									variant : 'caption'
								}}
							/>
							<ListItemSecondaryAction>
								<IconButton
                                    edge="end"
                                    onClick={() => removeFromSaleListHandler(game.bggId, game.title)}
                                    size="large">
									<HighlightOffIcon color="error" />
								</IconButton>
							</ListItemSecondaryAction>
						</ListItem>
					))}
				</List>

				<Divider />

				{saleList.length > 0 && (
					<Box display="flex" justifyContent="flex-end" m={1}>
						{saleList.length === 1 && (
							<ButtonGroup color="primary" size="small">
								<Button component={RouterLink} to="/sell" onClick={handleClose}>
									Sell
								</Button>
								<Button component={RouterLink} to="/trade" onClick={handleClose}>
									Trade
								</Button>
								<Button component={RouterLink} to="/buy" onClick={handleClose}>
									Buy
								</Button>
								<Button component={RouterLink} to="/want" onClick={handleClose}>
									Wanted
								</Button>
							</ButtonGroup>
						)}

						{saleList.length > 1 && (
							<ButtonGroup color="primary" size="small">
								<Button onClick={() => handleModeClick('sell')}>Sell</Button>
								<Button onClick={() => handleModeClick('trade')}>Trade</Button>
								<Button onClick={() => handleModeClick('buy')}>Buy</Button>
								<Button component={RouterLink} to="/want" onClick={handleClose}>
									Wanted
								</Button>
							</ButtonGroup>
						)}
					</Box>
				)}

				<SaleListPopoverDialog openDialog={openDialog} handleCloseDialog={handleCloseDialog} mode={mode} />
			</Popover>
		</Fragment>
    );
}

export default SaleListPopover
