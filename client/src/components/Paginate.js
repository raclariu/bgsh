// @ Libraries
import React from 'react'

// @ Mui
import Pagination from '@material-ui/lab/Pagination'

// @ Main
const Paginate = ({ pagination, handleFilters }) => {
	const onPageChangeHandler = (e, page) => {
		window.scrollTo(0, 0)
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
				/>
			)}
		</div>
	)
}

export default Paginate
