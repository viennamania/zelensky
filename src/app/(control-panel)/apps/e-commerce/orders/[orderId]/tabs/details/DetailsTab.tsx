import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState } from 'react';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useParams } from 'next/navigation';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import { useGetECommerceOrderQuery } from '../../../../ECommerceApi';
import OrdersStatus from '../../../OrdersStatus';
import GoogleAddressMap from './GoogleAddressMap';

/**
 * The order details tab.
 */
function DetailsTab() {
	const routeParams = useParams();

	const { orderId } = routeParams as { orderId: string };

	const { data: order, isError } = useGetECommerceOrderQuery(orderId, {
		skip: !orderId
	});

	const [map, setMap] = useState<string>('shipping');

	if (!isError && !order) {
		return null;
	}

	return (
		<div className="w-full max-w-5xl space-y-12">
			<div className="space-y-4">
				<div className="flex items-center border-b-1 space-x-2 pb-2">
					<FuseSvgIcon
						color="action"
						size={24}
					>
						heroicons-outline:user-circle
					</FuseSvgIcon>
					<Typography
						className="text-2xl"
						color="text.secondary"
					>
						Customer
					</Typography>
				</div>

				<div className="space-y-4">
					<div className="table-responsive border rounded-md">
						<table className="table dense simple">
							<thead>
								<tr>
									<th>
										<Typography className="font-semibold">Name</Typography>
									</th>
									<th>
										<Typography className="font-semibold">Email</Typography>
									</th>
									<th>
										<Typography className="font-semibold">Phone</Typography>
									</th>
									<th>
										<Typography className="font-semibold">Company</Typography>
									</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>
										<div className="flex items-center">
											<Avatar src={order.customer.avatar} />
											<Typography className="truncate mx-2">
												{`${order.customer.firstName} ${order.customer.lastName}`}
											</Typography>
										</div>
									</td>
									<td>
										<Typography className="truncate">{order.customer.email}</Typography>
									</td>
									<td>
										<Typography className="truncate">{order.customer.phone}</Typography>
									</td>
									<td>
										<span className="truncate">{order.customer.company}</span>
									</td>
								</tr>
							</tbody>
						</table>
					</div>

					<div className="space-y-4">
						<Accordion
							className="border-0 shadow-0 overflow-hidden"
							expanded={map === 'shipping'}
							onChange={() => setMap(map !== 'shipping' ? 'shipping' : '')}
							sx={{ backgroundColor: 'background.default', borderRadius: '8px!important' }}
						>
							<AccordionSummary expandIcon={<ExpandMoreIcon />}>
								<Typography className="font-semibold">Shipping Address</Typography>
							</AccordionSummary>
							<AccordionDetails className="flex flex-col md:flex-row">
								<Typography className="w-full md:max-w-64 mb-4 md:mb-0 mx-2 text-lg">
									{order.customer.shippingAddress.address}
								</Typography>
								<div className="w-full h-80 rounded-xl overflow-hidden mx-2">
									<GoogleAddressMap
										center={{
											lng: order.customer.shippingAddress.lng,
											lat: order.customer.shippingAddress.lat
										}}
									/>
								</div>
							</AccordionDetails>
						</Accordion>

						<Accordion
							className="border-0 shadow-0 overflow-hidden"
							expanded={map === 'invoice'}
							onChange={() => setMap(map !== 'invoice' ? 'invoice' : '')}
							sx={{ backgroundColor: 'background.default', borderRadius: '8px!important' }}
						>
							<AccordionSummary expandIcon={<ExpandMoreIcon />}>
								<Typography className="font-semibold">Invoice Address</Typography>
							</AccordionSummary>
							<AccordionDetails className="flex flex-col md:flex-row -mx-2">
								<Typography className="w-full md:max-w-64 mb-4 md:mb-0 mx-2 text-lg">
									{order.customer.invoiceAddress.address}
								</Typography>
								<div className="w-full h-80 rounded-xl overflow-hidden mx-2">
									<GoogleAddressMap
										center={{
											lng: order.customer.invoiceAddress.lng,
											lat: order.customer.invoiceAddress.lat
										}}
									/>
								</div>
							</AccordionDetails>
						</Accordion>
					</div>
				</div>
			</div>

			<div className="space-y-4">
				<div className="flex items-center border-b-1 space-x-2 pb-2">
					<FuseSvgIcon
						color="action"
						size={24}
					>
						heroicons-outline:clock
					</FuseSvgIcon>
					<Typography
						className="text-2xl"
						color="text.secondary"
					>
						Order Status
					</Typography>
				</div>

				<div className="table-responsive border rounded-md">
					<Table className="simple">
						<TableHead>
							<TableRow>
								<TableCell>
									<Typography className="font-semibold">Status</Typography>
								</TableCell>
								<TableCell>
									<Typography className="font-semibold">Updated On</Typography>
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{order.status.map((status) => (
								<TableRow key={status.id}>
									<TableCell>
										<OrdersStatus name={status.name} />
									</TableCell>
									<TableCell>{status.date}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</div>

			<div className="space-y-4">
				<div className="flex items-center border-b-1 space-x-2 pb-2">
					<FuseSvgIcon
						color="action"
						size={24}
					>
						heroicons-outline:currency-dollar
					</FuseSvgIcon>
					<Typography
						className="text-2xl"
						color="text.secondary"
					>
						Payment
					</Typography>
				</div>

				<div className="table-responsive border rounded-md">
					<table className="simple">
						<thead>
							<tr>
								<th>
									<Typography className="font-semibold">TransactionID</Typography>
								</th>
								<th>
									<Typography className="font-semibold">Payment Method</Typography>
								</th>
								<th>
									<Typography className="font-semibold">Amount</Typography>
								</th>
								<th>
									<Typography className="font-semibold">Date</Typography>
								</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>
									<span className="truncate">{order.payment.transactionId}</span>
								</td>
								<td>
									<span className="truncate">{order.payment.method}</span>
								</td>
								<td>
									<span className="truncate">{order.payment.amount}</span>
								</td>
								<td>
									<span className="truncate">{order.payment.date}</span>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>

			<div className="space-y-4">
				<div className="flex items-center border-b-1 space-x-2 pb-2">
					<FuseSvgIcon
						color="action"
						size={24}
					>
						heroicons-outline:truck
					</FuseSvgIcon>
					<Typography
						className="text-2xl"
						color="text.secondary"
					>
						Shipping
					</Typography>
				</div>

				<div className="table-responsive border rounded-md">
					<table className="simple dense">
						<thead>
							<tr>
								<th>
									<Typography className="font-semibold">Tracking Code</Typography>
								</th>
								<th>
									<Typography className="font-semibold">Carrier</Typography>
								</th>
								<th>
									<Typography className="font-semibold">Weight</Typography>
								</th>
								<th>
									<Typography className="font-semibold">Fee</Typography>
								</th>
								<th>
									<Typography className="font-semibold">Date</Typography>
								</th>
							</tr>
						</thead>
						<tbody>
							{order.shippingDetails.map((shipping) => (
								<tr key={shipping.date}>
									<td>
										<span className="truncate">{shipping.tracking}</span>
									</td>
									<td>
										<span className="truncate">{shipping.carrier}</span>
									</td>
									<td>
										<span className="truncate">{shipping.weight}</span>
									</td>
									<td>
										<span className="truncate">{shipping.fee}</span>
									</td>
									<td>
										<span className="truncate">{shipping.date}</span>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}

export default DetailsTab;
