import React, { useState, Fragment } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link as RouterLink } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
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
import FeaturedPlayListTwoToneIcon from '@material-ui/icons/FeaturedPlayListTwoTone'
import HighlightOffIcon from '@material-ui/icons/HighlightOff'
import SaleListPopoverDialog from './SaleListPopoverDialog'
import { removeFromSaleList } from '../actions/gameActions'
import { saleListLimit } from '../constants/gameConstants'

const useStyles = makeStyles((theme) => ({
	badge     : {
		margin : theme.spacing(0, 1, 0, 0)
	},
	popover   : {
		width : '350px'
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

const SaleListPopover = () => {
	const cls = useStyles()

	const dispatch = useDispatch()

	const [ anchorEl, setAnchorEl ] = useState(null)
	const [ openDialog, setOpenDialog ] = useState(false)
	const [ mode, setMode ] = useState('')

	const saleList = useSelector((state) => state.saleList)

	const open = Boolean(anchorEl)
	const id = open ? 'simple-popover' : undefined

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget)
	}

	const handleClose = () => {
		setAnchorEl(null)
	}

	const removeFromSaleListHandler = (id) => {
		dispatch(removeFromSaleList(id))
	}

	const handleCloseDialog = () => {
		setOpenDialog(false)
		setAnchorEl(null)
	}

	const handleModeClick = (clicked) => {
		setMode(clicked)
		setOpenDialog(true)
	}

	return (
		<div>
			<IconButton className={cls.badge} onClick={handleClick} color="primary">
				<Badge color="secondary" badgeContent={saleList.length} showZero>
					<FeaturedPlayListTwoToneIcon />
				</Badge>
			</IconButton>

			<Popover
				id={id}
				open={open}
				anchorEl={anchorEl}
				onClose={handleClose}
				anchorOrigin={{
					vertical   : 'bottom',
					horizontal : 'center'
				}}
				transformOrigin={{
					vertical   : 'top',
					horizontal : 'right'
				}}
			>
				{/* Content */}
				{saleList && (
					<Grid container className={cls.popover} justify="flex-end">
						<Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
							<List disablePadding>
								<Typography
									className={cls.subheader}
									align="center"
									variant="subtitle2"
									color="textSecondary"
								>
									My sale list ({saleList.length}/{saleListLimit})
								</Typography>

								{saleList.length === 0 && (
									<Fragment>
										<Typography gutterBottom align="center" variant="body2" color="textSecondary">
											To add games visit your
										</Typography>
										<ButtonGroup className={cls.btnGroup} size="small" color="primary">
											<Button
												component={RouterLink}
												to="/profile"
												onClick={(e) => setAnchorEl(null)}
											>
												Profile
											</Button>
											<Button
												component={RouterLink}
												to="/collection"
												onClick={(e) => setAnchorEl(null)}
											>
												Collection
											</Button>
										</ButtonGroup>
									</Fragment>
								)}

								{saleList.map((game) => (
									<ListItem divider key={game.bggId}>
										<ListItemAvatar>
											<Avatar variant="rounded" src={game.thumbnail} alt={game.title}>
												{game.title[0] + game.title[1]}
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
												onClick={() => removeFromSaleListHandler(game.bggId)}
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
									<ButtonGroup color="primary">
										{/* <Button component={RouterLink} to="/trade" onClick={(e) => setAnchorEl(null)}>
											Trade
										</Button>
										<Button component={RouterLink} to="/sell" onClick={(e) => setAnchorEl(null)}>
											Sell
										</Button> */}
										<Button onClick={() => handleModeClick('sell')}>Sell</Button>
										<Button onClick={() => handleModeClick('trade')}>Trade</Button>
									</ButtonGroup>
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
		</div>
	)
}

export default SaleListPopover
