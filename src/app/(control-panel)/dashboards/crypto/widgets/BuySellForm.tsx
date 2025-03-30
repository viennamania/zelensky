import { Controller, useForm } from 'react-hook-form';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormHelperText from '@mui/material/FormHelperText';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import _ from 'lodash';
import Typography from '@mui/material/Typography';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import FuseLoading from '@fuse/core/FuseLoading';
import WalletsType from '../types/WalletsType';
import PricesType from '../types/PricesType';
import CoinTypes from '../types/CoinTypes';
import { useGetCryptoDashboardWidgetsQuery } from '../CryptoDashboardApi';

const actionValues = [
	{ title: 'Buy', value: 'buy' },
	{ title: 'Sell', value: 'sell' }
];

const walletValues = [
	{ title: 'Bitcoin', value: 'btc' },
	{ title: 'Ethereum', value: 'eth' },
	{ title: 'Bitcoin Cash', value: 'bch' },
	{ title: 'XRP', value: 'xrp' }
];

const defaultValues = {
	action: 'buy',
	wallet: 'btc',
	amount: 0,
	amountType: 'usd'
};

type FormType = {
	action: string;
	wallet: string;
	amount: number;
	amountType: string;
};

/**
 * Form Validation Schema
 */

const schema = z.object({
	action: z.string().min(1, 'You must select a value'),
	wallet: z.string().min(1, 'You must select a value'),
	amount: z
		.number()
		.nonnegative('You must specify a number value')
		.positive('You must specify a number value greater than 0')
		.or(z.number().min(0, 'Amount must be greater than or equal to 0')), // allows zero
	amountType: z.string().min(1, 'You must select a value')
});

/**
 * The buy sell form.
 */
function BuySellForm() {
	const { data: widgets, isLoading } = useGetCryptoDashboardWidgetsQuery();
	const wallets = widgets?.wallets as WalletsType;
	const prices = widgets?.prices as PricesType;

	const { handleSubmit, reset, control, watch, formState, setValue } = useForm<FormType>({
		defaultValues,
		mode: 'all',
		resolver: zodResolver(schema)
	});

	const { isValid, dirtyFields, errors } = formState;

	const actionValue = watch('action');
	const walletValue = watch('wallet');
	const amountTypeValue = watch('amountType');

	function onSubmit(_data: FormType) {
		reset();
	}

	if (isLoading) {
		return <FuseLoading />;
	}

	if (!wallets || !prices) {
		return null;
	}

	return (
		<form
			className="w-full p-6 space-y-6"
			onSubmit={handleSubmit(onSubmit)}
		>
			<div>
				<Controller
					render={({ field }) => (
						<FormControl
							error={!!errors.action}
							required
							fullWidth
						>
							<FormLabel
								className="font-medium text-base"
								component="legend"
							>
								Action
							</FormLabel>
							<Select
								{...field}
								variant="outlined"
								fullWidth
							>
								{actionValues.map((item) => (
									<MenuItem
										key={item.value}
										value={item.value}
									>
										{item.title}
									</MenuItem>
								))}
							</Select>
							<FormHelperText>{errors?.action?.message}</FormHelperText>
						</FormControl>
					)}
					name="action"
					control={control}
				/>
			</div>
			<div>
				<Controller
					name="wallet"
					control={control}
					render={({ field }) => (
						<FormControl
							error={!!errors.wallet}
							required
							fullWidth
						>
							<FormLabel
								className="font-medium text-base"
								component="legend"
							>
								Wallet
							</FormLabel>
							<Select
								{...field}
								variant="outlined"
								fullWidth
								onChange={(ev) => {
									field.onChange(ev.target.value);
									setValue('amountType', ev.target.value);
								}}
							>
								{walletValues.map((item) => (
									<MenuItem
										key={item.value}
										value={item.value}
									>
										{`${item.title} - ${
											wallets[item.value as keyof WalletsType]
										} ${item.value.toUpperCase()}`}
									</MenuItem>
								))}
							</Select>
							<FormHelperText className="flex items-center space-x-1">
								<Typography
									component="span"
									className="text-md"
								>
									USD:
								</Typography>
								<Typography
									component="span"
									className="font-mono font-medium text-md"
								>
									{(
										wallets[field.value as CoinTypes] * prices[field.value as CoinTypes]
									).toLocaleString('en-US', {
										style: 'currency',
										currency: 'USD'
									})}
								</Typography>
							</FormHelperText>
							<FormHelperText>{errors?.wallet?.message}</FormHelperText>
						</FormControl>
					)}
				/>
			</div>
			<div>
				<Controller
					name="amount"
					control={control}
					render={({ field: { onChange, value, ...fieldProps } }) => (
						<TextField
							{...fieldProps}
							value={value || ''}
							onChange={(e) => {
								const number = parseFloat(e.target.value);
								onChange(Number.isNaN(number) ? '' : number);
							}}
							label="Amount"
							variant="outlined"
							error={!!errors.amount}
							helperText={
								errors?.amount?.message || (
									<>
										{actionValue === 'buy' && amountTypeValue === 'usd' && (
											<>
												<Typography
													component="span"
													className="text-md"
												>
													You will receive:
												</Typography>
												<Typography
													component="span"
													className="font-mono font-medium text-md mx-1"
												>
													{(value / prices[walletValue as CoinTypes]).toLocaleString(
														'en-US',
														{
															style: 'currency',
															currency: walletValue,
															maximumFractionDigits: 8
														}
													)}
												</Typography>
											</>
										)}

										{actionValue === 'buy' && amountTypeValue !== 'usd' && (
											<>
												<Typography
													component="span"
													className="text-md"
												>
													it will cost:
												</Typography>
												<Typography
													component="span"
													className="font-mono font-medium text-md mx-1"
												>
													{(value * prices[walletValue as CoinTypes]).toLocaleString(
														'en-US',
														{
															style: 'currency',
															currency: 'USD'
														}
													)}
												</Typography>
											</>
										)}

										{actionValue === 'sell' && amountTypeValue === 'usd' && (
											<>
												<Typography
													component="span"
													className="text-md"
												>
													You will sell:
												</Typography>
												<Typography
													component="span"
													className="font-mono font-medium text-md mx-1"
												>
													{(value / prices[walletValue as CoinTypes]).toLocaleString(
														'en-US',
														{
															style: 'currency',
															currency: walletValue,
															maximumFractionDigits: 8
														}
													)}
												</Typography>
											</>
										)}

										{actionValue === 'sell' && amountTypeValue !== 'usd' && (
											<>
												<Typography
													component="span"
													className="text-md"
												>
													You will receive:
												</Typography>
												<Typography
													component="span"
													className="font-mono font-medium text-md mx-1"
												>
													{(value * prices[walletValue as CoinTypes]).toLocaleString(
														'en-US',
														{
															style: 'currency',
															currency: 'USD'
														}
													)}
												</Typography>
											</>
										)}
									</>
								)
							}
							required
							fullWidth
							type="number"
							InputProps={{
								endAdornment: (
									<Controller
										control={control}
										name="amountType"
										render={({ field: _field }) => (
											<FormControl className="min-w-20">
												<Select
													{..._field}
													variant="outlined"
													size="small"
													sx={{
														'& .MuiSelect-select ': {
															minHeight: '0!important',
															paddingY: 0
														},
														'& fieldset': {
															display: 'none'
														}
													}}
												>
													<MenuItem
														key="usd"
														value="usd"
													>
														USD
													</MenuItem>
													<MenuItem
														key={walletValue}
														value={walletValue}
													>
														{walletValue?.toUpperCase()}
													</MenuItem>
												</Select>
											</FormControl>
										)}
									/>
								)
							}}
						/>
					)}
				/>
			</div>
			<div className="flex my-12 items-center">
				<Button
					className="uppercase"
					variant="contained"
					color="secondary"
					type="submit"
					disabled={_.isEmpty(dirtyFields) || !isValid}
					fullWidth
				>
					{_.find(actionValues, { value: actionValue })?.title}
				</Button>
			</div>
		</form>
	);
}

export default BuySellForm;
