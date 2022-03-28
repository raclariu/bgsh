// @ Modules
import React from 'react'

// @ Mui
import Pagination from '@mui/material/Pagination'

// @ Main
const Paginate = ({ pagination, handleFilters }) => {
	const onPageChangeHandler = (e, page) => {
		window.scrollTo({
			top      : 0,
			behavior : 'smooth'
		})
		handleFilters(page, 'page')
	}

	return (
		<div>
			{pagination.totalPages > 1 && (
				<Pagination
					page={pagination.page}
					onChange={(e, page) => onPageChangeHandler(e, page)}
					count={pagination.totalPages}
					color="secondary"
					variant="outlined"
					shape="rounded"
					size="large"
				/>
			)}
		</div>
	)
}

export default Paginate
