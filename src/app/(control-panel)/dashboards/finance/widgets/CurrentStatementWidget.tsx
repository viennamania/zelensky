import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { memo } from 'react';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import FuseLoading from '@fuse/core/FuseLoading';
import CurrentStatementWidgetType from './types/CurrentStatementWidgetType';
import { useGetFinanceDashboardWidgetsQuery } from '../FinanceDashboardApi';

/**
 * The CurrentStatementWidget widget.
 */
function CurrentStatementWidget() {
	const { data: widgets, isLoading } = useGetFinanceDashboardWidgetsQuery();
	const widget = widgets?.currentStatement as CurrentStatementWidgetType;
	const status = widget?.status;
	const date = widget?.date;
	const limit = widget?.limit;
	const spent = widget?.spent;
	const minimum = widget?.minimum;

	if (isLoading) {
		return <FuseLoading />;
	}

	if (!widget) {
		return null;
	}

	return (
		<Paper className="relative flex flex-col flex-auto rounded-xl shadow-sm overflow-hidden">
			<div className="flex items-center justify-between px-2 pt-2">
				<div className="px-2 flex flex-col">
					<Typography className="text-lg font-medium tracking-tight leading-6 truncate">
						Current Statement
					</Typography>
					{status === 'paid' && (
						<Typography className="text-green-600 font-medium text-sm">Paid on {date}</Typography>
					)}
					{status === 'pending' && (
						<Typography className="text-red-600 font-medium text-sm">Must be paid before {date}</Typography>
					)}
				</div>
				<div className="">
					<IconButton aria-label="more">
						<FuseSvgIcon>heroicons-outline:ellipsis-vertical</FuseSvgIcon>
					</IconButton>
				</div>
			</div>
			<div className="flex flex-row flex-wrap p-4 space-x-3">
				<div className="flex flex-col my-3">
					<Typography
						color="text.secondary"
						className="text-sm font-medium leading-none"
					>
						Card Limit
					</Typography>
					<Typography className="mt-2 font-medium text-3xl leading-none">
						{limit.toLocaleString('en-US', {
							style: 'currency',
							currency: 'USD'
						})}
					</Typography>
				</div>
				<div className="flex flex-col my-3">
					<Typography
						color="text.secondary"
						className="text-sm font-medium leading-none"
					>
						Spent
					</Typography>
					<Typography className="mt-2 font-medium text-3xl leading-none">
						{spent.toLocaleString('en-US', {
							style: 'currency',
							currency: 'USD'
						})}
					</Typography>
				</div>
				<div className="flex flex-col my-3">
					<Typography
						color="text.secondary"
						className="text-sm font-medium leading-none"
					>
						Minimum
					</Typography>
					<Typography className="mt-2 font-medium text-3xl leading-none">
						{minimum.toLocaleString('en-US', {
							style: 'currency',
							currency: 'USD'
						})}
					</Typography>
				</div>
			</div>

			<div className="absolute bottom-0 ltr:right-0 rtl:left-0 w-24 h-24 -m-6">
				{status === 'paid' && (
					<FuseSvgIcon
						size={96}
						className="opacity-25 text-green-500 dark:text-green-400"
					>
						heroicons-outline:check-circle
					</FuseSvgIcon>
				)}

				{status === 'pending' && (
					<FuseSvgIcon
						size={96}
						className="opacity-25 text-red-500 dark:text-red-400"
					>
						heroicons-outline:exclamation-circle
					</FuseSvgIcon>
				)}
			</div>
		</Paper>
	);
}

export default memo(CurrentStatementWidget);
