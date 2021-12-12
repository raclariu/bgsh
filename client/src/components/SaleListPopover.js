// @ Libraries
import React, { useState, Fragment } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link as RouterLink } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'

// @ Mui
import Grid from '@material-ui/core/Grid'
import Popover from '@material-ui/core/Popover'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import Button from '@material-ui/core/Button'
import Badge from '@material-ui/core/Badge'
import Box from '@material-ui/core/Box'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Avatar from '@material-ui/core/Avatar'

// @ Icons
import FeaturedPlayListTwoToneIcon from '@material-ui/icons/FeaturedPlayListTwoTone'
import HighlightOffIcon from '@material-ui/icons/HighlightOff'

// @ Components
import SaleListPopoverDialog from './SaleListPopoverDialog'

// @ Others
import { removeFromSaleList } from '../actions/saleListActions'
import { saleListLimit } from '../constants/saleListConstants'
import { useNotification } from '../hooks/hooks'

// @ Styles
const useStyles = makeStyles((theme) => ({
	grid      : {
		[theme.breakpoints.up('sm')]: {
			width : 400
		}
	},
	popover   : {
		[theme.breakpoints.down('xs')]: {
			width : '90vw'
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

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget)
	}

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
			<IconButton onClick={handleClick} color="primary">
				<Badge color="secondary" badgeContent={saleList.length} showZero>
					<FeaturedPlayListTwoToneIcon />
				</Badge>
			</IconButton>

			<Popover
				classes={{ paper: cls.popover }}
				open={open}
				anchorEl={anchorEl}
				onClose={handleClose}
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
				{saleList && (
					<Grid container className={cls.grid} justifyContent="flex-end">
						<Grid item xs={12}>
							<List disablePadding>
								<Typography
									className={cls.subheader}
									align="center"
									variant="subtitle2"
									color="textSecondary"
								>
									My list ({saleList.length}/{saleListLimit})
								</Typography>

								{saleList.length === 0 && (
									<Fragment>
										<Typography gutterBottom align="center" variant="body2" color="textSecondary">
											To add games visit your
										</Typography>
										<ButtonGroup className={cls.btnGroup} size="small" color="primary">
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
									</Fragment>
								)}

								{saleList.map((game) => (
									<ListItem divider key={game.bggId}>
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
												onClick={() => removeFromSaleListHandler(game.bggId, game.title)}
											>
												<HighlightOffIcon color="error" />
											</IconButton>
										</ListItemSecondaryAction>
									</ListItem>
								))}
							</List>
						</Grid>
						{saleList.length > 0 && (
							<Grid item>
								<Box m={1}>
									{saleList.length === 1 && (
										<ButtonGroup color="primary">
											<Button component={RouterLink} to="/sell" onClick={handleClose}>
												Sell
											</Button>
											<Button component={RouterLink} to="/trade" onClick={handleClose}>
												Trade
											</Button>
											<Button component={RouterLink} to="/want" onClick={handleClose}>
												Wanted
											</Button>
										</ButtonGroup>
									)}

									{saleList.length > 1 && (
										<ButtonGroup color="primary">
											<Button onClick={() => handleModeClick('sell')}>Sell</Button>
											<Button onClick={() => handleModeClick('trade')}>Trade</Button>
											<Button component={RouterLink} to="/want" onClick={handleClose}>
												Wanted
											</Button>
										</ButtonGroup>
									)}
								</Box>
							</Grid>
						)}

						<SaleListPopoverDialog
							openDialog={openDialog}
							handleCloseDialog={handleCloseDialog}
							mode={mode}
						/>
					</Grid>
				)}
			</Popover>
		</Fragment>
	)
}

export default SaleListPopover
