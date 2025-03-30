import { useTheme } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { ApexOptions } from 'apexcharts';
import { useAppSelector } from 'src/store/hooks';
import _ from 'lodash';
import VisitsWidgetType from './types/VisitsWidgetType';
import { selectWidget } from '../AnalyticsDashboardApi';
import dynamic from 'next/dynamic';
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

/**
 * Impressions widget.
 */
function Impressions() {
	const theme = useTheme();
	const widget = useAppSelector(selectWidget<VisitsWidgetType>('visits'));
	const series = widget?.series;
	const amount = widget?.amount;
	const labels = widget?.labels;

	const chartOptions: ApexOptions = {
		chart: {
			animations: {
				enabled: false
			},
			fontFamily: 'inherit',
			foreColor: 'inherit',
			height: '100%',
			type: 'area',
			sparkline: {
				enabled: true
			}
		},
		colors: [theme.palette.error.main],
		fill: {
			colors: [theme.palette.error.light],
			opacity: 0.5
		},
		stroke: {
			curve: 'smooth'
		},
		tooltip: {
			followCursor: true,
			theme: 'dark'
		},
		xaxis: {
			type: 'category',
			categories: labels
		}
	};

	if (!widget) {
		return null;
	}

	return (
		<Paper className="flex flex-col flex-auto shadow-sm rounded-xl overflow-hidden">
			<div className="flex items-start justify-between m-4 mb-0">
				<Typography className="text-lg font-medium tracking-tight leading-6 truncate">Visits</Typography>
				<div className="ml-2">
					<Chip
						size="small"
						className="font-medium text-sm"
						label=" 30 days"
					/>
				</div>
			</div>
			<div className="flex flex-col lg:flex-row lg:items-center mx-6 mt-3">
				<Typography className="text-7xl font-bold tracking-tighter leading-[1.25]">
					{amount.toLocaleString('en-US')}
				</Typography>
				<div className="flex lg:flex-col lg:ml-3">
					<FuseSvgIcon
						size={20}
						className="text-red-500"
					>
						heroicons-solid:trending-down
					</FuseSvgIcon>
					<Typography
						className="flex items-center ml-1 lg:ml-0 lg:mt-0.5 text-md leading-none whitespace-nowrap"
						color="text.secondary"
					>
						<span className="font-medium text-red-500">4%</span>
						<span className="ml-1">below target</span>
					</Typography>
				</div>
			</div>
			<div className="flex flex-col flex-auto h-20">
				<ReactApexChart
					options={chartOptions}
					series={_.cloneDeep(series)}
					type={chartOptions?.chart?.type}
					height={chartOptions?.chart?.height}
				/>
			</div>
		</Paper>
	);
}

export default Impressions;
