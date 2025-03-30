import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import clsx from 'clsx';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { ApexOptions } from 'apexcharts';
import _ from 'lodash';
import { WatchListItemType } from '../types/WatchlistType';
import dynamic from 'next/dynamic';
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

type WatchlistItemProps = {
	item: WatchListItemType;
};

/**
 * The watchlist item component.
 */
function WatchlistItem(props: WatchlistItemProps) {
	const { item } = props;
	const theme = useTheme();

	const chartOptions: ApexOptions = {
		chart: {
			animations: {
				enabled: false
			},
			fontFamily: 'inherit',
			foreColor: 'inherit',
			height: '100%',
			type: 'line',
			sparkline: {
				enabled: true
			}
		},
		colors: item.trend.dir === 'up' ? [theme.palette.success.main] : [theme.palette.error.main],
		stroke: {
			curve: 'smooth',
			width: 2
		},
		tooltip: {
			theme: 'dark'
		},
		xaxis: {
			type: 'category'
		}
	};

	return (
		<div className="flex shrink-0 items-center p-5 border-b space-x-6">
			<div className="flex flex-col flex-auto">
				<div className="flex items-baseline space-x-1">
					<Typography
						className=" font-medium text-md"
						color="text.secondary"
					>
						{item.title}
					</Typography>
					<Typography
						className="font-medium text-sm uppercase tracking-wider"
						color="text.secondary"
					>
						({item.iso})
					</Typography>
				</div>
				<div className="flex items-end mt-2">
					<Typography className="min-w-20 font-mono text-2xl tracking-tighter leading-none">
						{item.amount.toLocaleString('en-US', {
							style: 'currency',
							currency: 'USD'
						})}
					</Typography>

					<FuseSvgIcon
						className={clsx(
							'icon-size-3.5 mx-0.5 mb-px',
							item.trend.dir === 'up' && 'text-green-500',
							item.trend.dir === 'down' && 'text-red-500'
						)}
						size={14}
					>
						{item.trend.dir === 'up'
							? 'heroicons-solid:arrow-small-up'
							: 'heroicons-solid:arrow-small-down'}
					</FuseSvgIcon>
					<Typography
						className={clsx(
							'font-mono font-medium text-sm leading-none',
							item.trend.dir === 'up' && 'text-green-500',
							item.trend.dir === 'down' && 'text-red-500'
						)}
					>
						{item.trend.amount}%
					</Typography>
				</div>
			</div>
			<ReactApexChart
				className="flex-auto w-full h-9 min-w-0"
				options={chartOptions}
				series={_.cloneDeep(item.series)}
				type={chartOptions?.chart?.type}
				height={chartOptions?.chart?.height}
			/>
		</div>
	);
}

export default WatchlistItem;
