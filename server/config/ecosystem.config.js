export const apps = [
	{
		name               : meepledProd,
		script             : '../server.js',
		error_file         : '../logs/err.log',
		out_file           : '../logs/out.log',
		log_date_format    : 'YYYY-MM-DD HH:mm:ss:SSS',
		watch              : true,
		max_memory_restart : '200M'
	}
]
