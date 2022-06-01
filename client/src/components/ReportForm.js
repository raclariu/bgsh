// @ Modules
import React, { useState, Fragment } from 'react'
import { useSelector } from 'react-redux'
import { Link as RouterLink } from 'react-router-dom'

// @ Mui
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import FormHelperText from '@mui/material/FormHelperText'

// @ Component
import Input from './Input'
import LoadingBtn from './LoadingBtn'
import CustomBtn from './CustomBtn'
import CustomIconBtn from './CustomIconBtn'
import CustomTooltip from './CustomTooltip'
import CustomDivider from './CustomDivider'

// @ Icons
import ReportTwoToneIcon from '@mui/icons-material/ReportTwoTone'

// @ Others
import { useSubmitReportMutation } from '../hooks/hooks'

// @ Main
const ReportForm = ({ type, username, altId, ...other }) => {
    const currUsername = useSelector((state) => state.userData.username)

    const [open, setOpen] = useState(false)
    const [selected, setSelected] = useState(type || 'other')
    const [typedUsername, setTypedUsername] = useState(username || '')
    const [typedAltId, setTypedAltId] = useState(altId || '')
    const [reportText, setReportText] = useState('')

    const handleCloseDialog = (e) => {
        setOpen(false)
    }

    const resetForm = () => {
        if (selected === 'user') {
            if (username) {
                setOpen(false)
                setReportText('')
            } else {
                setOpen(false)
                setTypedUsername('')
                setReportText('')
            }
        } else if (selected === 'game') {
            if (altId) {
                setOpen(false)
                setReportText('')
            } else {
                setOpen(false)
                setTypedAltId('')
                setReportText('')
            }
        } else {
            setOpen(false)
            setReportText('')
        }
    }

    const { mutate, isError, error, isLoading } = useSubmitReportMutation({ resetForm })

    const submitReport = (e) => {
        e.preventDefault()
        if (selected === 'other' || selected === 'bug' || selected === 'suggestion') {
            mutate({ type: selected, username: null, altId: null, reportText })
        } else if (selected === 'user') {
            mutate({ type: selected, username: typedUsername, altId: null, reportText })
        } else if (selected === 'game') {
            mutate({ type: selected, username: null, altId: typedAltId, reportText })
        }
    }

    return (
        <Fragment>
            <CustomTooltip title='Report'>
                <CustomIconBtn onClick={() => setOpen(true)} color='error' size='large' {...other}>
                    <ReportTwoToneIcon />
                </CustomIconBtn>
            </CustomTooltip>

            {currUsername ? (
                <Dialog open={open} onClose={handleCloseDialog} maxWidth='xs' fullWidth>
                    <form onSubmit={submitReport} autoComplete='off'>
                        <DialogTitle>Report form</DialogTitle>
                        <DialogContent dividers>
                            <Box display='flex' flexDirection='column' gap={2}>
                                <FormControl fullWidth error={isError ? !!error.response.data.message.type : false}>
                                    <InputLabel id='report-type-select'>Report type</InputLabel>
                                    <Select
                                        disabled={!!type}
                                        value={selected}
                                        onChange={(e) => setSelected(e.target.value)}
                                        labelId='report-type-select'
                                        label='Report type'
                                    >
                                        <MenuItem value='user'>User</MenuItem>
                                        <MenuItem value='game'>Listed game</MenuItem>
                                        <MenuItem value='bug'>Bug</MenuItem>
                                        <MenuItem value='suggestion'>Suggestion</MenuItem>
                                        <MenuItem value='other'>Other</MenuItem>
                                    </Select>
                                    <FormHelperText error={isError ? !!error.response.data.message.type : false}>
                                        {isError ? error.response.data.message.type : false}
                                    </FormHelperText>
                                </FormControl>

                                {selected === 'user' && (
                                    <Input
                                        error={isError ? !!error.response.data.message.username : false}
                                        helperText={isError ? error.response.data.message.username : false}
                                        onChange={(inputVal) => setTypedUsername(inputVal)}
                                        disabled={!!username}
                                        value={typedUsername}
                                        size='medium'
                                        id='report-user-field'
                                        name='report-user'
                                        label='Username to report'
                                        type='text'
                                        inputProps={{
                                            minLength: 4,
                                            maxLength: 20
                                        }}
                                        fullWidth
                                        required
                                    />
                                )}

                                {selected === 'game' && (
                                    <Input
                                        error={isError ? !!error.response.data.message.altId : false}
                                        helperText={isError ? error.response.data.message.altId : false}
                                        onChange={(inputVal) => setTypedAltId(inputVal)}
                                        disabled={!!altId}
                                        value={typedAltId}
                                        size='medium'
                                        id='report-game-field'
                                        name='report-game'
                                        label='Game ID'
                                        placeholder='Enter 8-letter long game ID'
                                        type='text'
                                        inputProps={{
                                            minLength: 8,
                                            maxLength: 8
                                        }}
                                        fullWidth
                                        required
                                    />
                                )}

                                <Input
                                    error={isError ? !!error.response.data.message.reportText : false}
                                    helperText={isError ? error.response.data.message.reportText : false}
                                    value={reportText}
                                    onChange={(inputVal) => setReportText(inputVal)}
                                    size='medium'
                                    multiline
                                    minRows={3}
                                    maxRows={10}
                                    inputProps={{
                                        minLength: 1,
                                        maxLength: 1000,
                                        placeholder: 'Details regarding your report (1-1000 characters)'
                                    }}
                                    name='report-info'
                                    type='text'
                                    label={`Report info ${reportText.length}/1000`}
                                    fullWidth
                                    required
                                />
                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <CustomBtn onClick={handleCloseDialog}>Cancel</CustomBtn>
                            <LoadingBtn loading={isLoading} type='submit' variant='contained' color='primary'>
                                Submit
                            </LoadingBtn>
                        </DialogActions>
                    </form>
                </Dialog>
            ) : (
                <Dialog open={open} onClose={handleCloseDialog} maxWidth='xs'>
                    <DialogContent sx={{ textAlign: 'center' }}>To send a report, you need to be logged in</DialogContent>
                    <CustomDivider />
                    <DialogActions>
                        <CustomBtn component={RouterLink} to='/create-account' variant='outlined' color='primary'>
                            New account
                        </CustomBtn>
                        <CustomBtn component={RouterLink} to='/login' variant='outlined' color='secondary'>
                            Login
                        </CustomBtn>
                    </DialogActions>
                </Dialog>
            )}
        </Fragment>
    )
}

export default ReportForm
