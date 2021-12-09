import React, { Fragment, useState, useEffect } from 'react'
import { useSnackbar } from 'notistack'

export const useNotification = () => {
	const { enqueueSnackbar, closeSnackbar } = useSnackbar()

	const showSuccessSnackbar = ({ text, preventDuplicate }) => {
		enqueueSnackbar(text, {
			variant          : 'success',
			preventDuplicate : preventDuplicate || false
		})
	}

	const showErrorSnackbar = ({ text }) => {
		enqueueSnackbar(text, {
			variant          : 'error',
			preventDuplicate : true,
			autoHideDuration : 8000
		})
	}

	const showWarningSnackbar = ({ text, preventDuplicate }) => {
		enqueueSnackbar(text, {
			variant          : 'warning',
			preventDuplicate : preventDuplicate || false
		})
	}

	const showInfoSnackbar = ({ text, preventDuplicate }) => {
		enqueueSnackbar(text, {
			variant          : 'info',
			preventDuplicate : preventDuplicate || false
		})
	}

	const showSnackbar = {
		success : showSuccessSnackbar,
		error   : showErrorSnackbar,
		warning : showWarningSnackbar,
		info    : showInfoSnackbar
	}

	return [ showSnackbar ]
}
