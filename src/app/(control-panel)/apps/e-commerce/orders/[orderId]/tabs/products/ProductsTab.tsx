import Typography from '@mui/material/Typography';

import { useParams } from 'next/navigation';
import Link from '@fuse/core/Link';
import { useGetECommerceOrderQuery } from '../../../../ECommerceApi';

/**
 * The products tab.
 */
function ProductsTab() {
	const routeParams = useParams<{ orderId: string }>();

	const { orderId } = routeParams;

	const { data: order } = useGetECommerceOrderQuery(orderId, {
		skip: !orderId
	});

	return (
		<div className="w-full max-w-5xl table-responsive border rounded-md">
			<table className="simple dense">
				<thead>
					<tr>
						<th>
							<Typography className="font-semibold">ID</Typography>
						</th>
						<th>
							<Typography className="font-semibold">Image</Typography>
						</th>
						<th>
							<Typography className="font-semibold">Name</Typography>
						</th>
						<th>
							<Typography className="font-semibold">Price</Typography>
						</th>
						<th>
							<Typography className="font-semibold">Quantity</Typography>
						</th>
					</tr>
				</thead>
				<tbody>
					{order?.products?.map((product) => (
						<tr key={product.id}>
							<td className="w-16">{product.id}</td>
							<td className="w-20">
								<img
									className="product-image"
									src={product.image}
									alt="product"
								/>
							</td>
							<td>
								<Typography
									component={Link}
									to={`/apps/e-commerce/products/${product.id}`}
									className="truncate"
									style={{
										color: 'inherit',
										textDecoration: 'underline'
									}}
								>
									{product.name}
								</Typography>
							</td>
							<td className="w-16 text-right">
								<span className="truncate">${product.price}</span>
							</td>
							<td className="w-16 text-right">
								<span className="truncate">{product.quantity}</span>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

export default ProductsTab;
