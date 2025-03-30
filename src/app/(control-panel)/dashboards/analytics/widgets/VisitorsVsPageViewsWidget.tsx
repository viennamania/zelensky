import { useTheme } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Tooltip } from '@mui/material';
import { ApexOptions } from 'apexcharts';
import { useAppSelector } from 'src/store/hooks';
import _ from 'lodash';
import VisitorsVsPageViewsType from './types/VisitorsVsPageViewsType';
import { selectWidget } from '../AnalyticsDashboardApi';
import dynamic from 'next/dynamic';
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

/**
 * Visitors vs. Page Views widget.
 */
function VisitorsVsPageViewsWidget() {
	const theme = useTheme();
	const widget = useAppSelector(selectWidget<VisitorsVsPageViewsType>('visitorsVsPageViews'));
	const series = widget?.series;
	const averageRatio = widget?.averageRatio;
	const predictedRatio = widget?.predictedRatio;
	const overallScore = widget?.overallScore;

	const chartOptions: ApexOptions = {
		chart: {
			animations: {
				enabled: false
			},
			fontFamily: 'inherit',
			foreColor: 'inherit',
			height: '100%',
			type: 'area',
			toolbar: {
				show: false
			},
			zoom: {
				enabled: false
			}
		},
		colors: [theme.palette.primary.light, theme.palette.primary.light],
		dataLabels: {
			enabled: false
		},
		fill: {
			colors: [theme.palette.primary.dark, theme.palette.primary.light],
			opacity: 0.5
		},
		grid: {
			show: false,
			padding: {
				bottom: -40,
				left: 0,
				right: 0
			}
		},
		legend: {
			show: false
		},
		stroke: {
			curve: 'smooth',
			width: 2
		},
		tooltip: {
			followCursor: true,
			theme: 'dark',
			x: {
				format: 'MMM dd, yyyy'
			}
		},
		xaxis: {
			axisBorder: {
				show: false
			},
			labels: {
				offsetY: -20,
				rotate: 0,
				style: {
					colors: theme.palette.text.secondary
				}
			},
			tickAmount: 3,
			tooltip: {
				enabled: false
			},
			type: 'datetime'
		},
		yaxis: {
			labels: {
				style: {
					colors: theme.palette.divider
				}
			},
			max: (max) => max + 250,
			min: (min) => min - 250,
			show: false,
			tickAmount: 5
		}
	};

	if (!widget) {
		return null;
	}

	return (
		<Paper className="flex flex-col flex-auto shadow-sm rounded-xl overflow-hidden">
			<div className="flex items-start justify-between m-6 mb-0">
				<Typography className="text-xl font-medium tracking-tight leading-6 truncate">
					Visitors vs. Page Views
				</Typography>
				<div className="ml-2">
					<Chip
						size="small"
						className="font-medium text-sm"
						label=" 30 days"
					/>
				</div>
			</div>
			<div className="flex items-start mt-6 mx-6">
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-10.5 sm:gap-12">
					<div className="flex flex-col">
						<div className="flex items-center">
							<div className="font-medium text-secondary leading-5">Overall Score</div>
							<Tooltip title="Score is calculated by using the historical ratio between Page Views and Visitors. Best score is 1000, worst score is 0.">
								<FuseSvgIcon
									className="ml-1.5"
									size={16}
									color="disabled"
								>
									heroicons-solid:information-circle
								</FuseSvgIcon>
							</Tooltip>
						</div>
						<div className="flex items-start mt-2">
							<div className="text-4xl font-bold tracking-tight leading-none">{overallScore}</div>
							<div className="flex items-center ml-2">
								<FuseSvgIcon
									className="text-green-500"
									size={20}
								>
									heroicons-solid:arrow-circle-up
								</FuseSvgIcon>
								<Typography className="ml-1 text-md font-medium text-green-500">42.9%</Typography>
							</div>
						</div>
					</div>
					<div className="flex flex-col">
						<div className="flex items-center">
							<div className="font-medium text-secondary leading-5">Average Ratio</div>
							<Tooltip title="Average Ratio is the average ratio between Page Views and Visitors">
								<FuseSvgIcon
									className="ml-1.5"
									size={16}
									color="disabled"
								>
									heroicons-solid:arrow-circle-up
								</FuseSvgIcon>
							</Tooltip>
						</div>
						<div className="flex items-start mt-2">
							<div className="text-4xl font-bold tracking-tight leading-none">{averageRatio}%</div>
							<div className="flex items-center ml-2">
								<FuseSvgIcon
									className="text-red-500"
									size={20}
								>
									heroicons-solid:arrow-circle-down
								</FuseSvgIcon>
								<Typography className="ml-1 text-md font-medium text-red-500">13.1%</Typography>
							</div>
						</div>
					</div>
					<div className="flex flex-col">
						<div className="flex items-center">
							<div className="font-medium text-secondary leading-5">Predicted Ratio</div>
							<Tooltip title="Predicted Ratio is calculated by using historical ratio, current trends and your goal targets.">
								<FuseSvgIcon
									className="ml-1.5"
									size={16}
									color="disabled"
								>
									heroicons-solid:information-circle
								</FuseSvgIcon>
							</Tooltip>
						</div>
						<div className="flex items-start mt-2">
							<div className="text-4xl font-bold tracking-tight leading-none">{predictedRatio}%</div>
							<div className="flex items-center ml-2">
								<FuseSvgIcon
									className="text-green-500"
									size={20}
								>
									heroicons-solid:arrow-circle-up
								</FuseSvgIcon>
								<Typography className="ml-1 text-md font-medium text-green-500">22.2%</Typography>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="flex flex-col flex-auto h-80 mt-3">
				<ReactApexChart
					className="flex-auto w-full h-full"
					options={chartOptions}
					series={_.cloneDeep(series)}
					type={chartOptions?.chart?.type}
					height={chartOptions?.chart?.height}
				/>
			</div>
		</Paper>
	);
}

export default VisitorsVsPageViewsWidget;
