// @ Modules
import React from 'react'

// @ Mui
import Box from '@mui/material/Box'
import Pagination from '@mui/material/Pagination'
import useMediaQuery from '@mui/material/useMediaQuery'

// @ Main
const Paginate = ({ pagination, handleFilters }) => {
	const matches = useMediaQuery((theme) => theme.breakpoints.up('md'))

	const onPageChangeHandler = (e, page) => {
		window.scrollTo({
			top      : 64,
			behavior : 'smooth'
		})
		handleFilters(page, 'page')
	}

	return (
		<Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" gap={1} mt={4}>
			<Pagination
				page={pagination.page}
				onChange={(e, page) => onPageChangeHandler(e, page)}
				count={pagination.totalPages}
				color="secondary"
				variant="outlined"
				shape="rounded"
				size={matches ? 'large' : 'medium'}
				siblingCount={1}
			/>

			<Box fontSize="caption.fontSize" color="text.secondary">
				{`showing ${pagination.perPage * (pagination.page - 1) + 1} to ${pagination.perPage * pagination.page >
				pagination.totalItems
					? pagination.totalItems
					: pagination.perPage * pagination.page} of
				${pagination.totalItems} total`}
			</Box>
		</Box>
	)
}

export default Paginate
