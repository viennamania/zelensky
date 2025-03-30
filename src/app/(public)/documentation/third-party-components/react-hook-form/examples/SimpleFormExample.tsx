import { Controller, useForm } from 'react-hook-form';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Switch from '@mui/material/Switch';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import _ from 'lodash';
import clsx from 'clsx';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormHelperText from '@mui/material/FormHelperText';
import { DateTimePicker } from '@mui/x-date-pickers';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { DevTool } from '@hookform/devtools';

let renderCount = 0;

const options = [
	{
		value: 'chocolate',
		label: 'Chocolate'
	},
	{
		value: 'strawberry',
		label: 'Strawberry'
	},
	{
		value: 'vanilla',
		label: 'Vanilla'
	}
];

const defaultValues = {
	Native: '',
	TextField: '',
	Select: '',
	Autocomplete: [],
	Checkbox: false,
	Switch: false,
	RadioGroup: '',
	DateTimePicker: ''
};

/**
 * Form Validation Schema
 */
const schema = z.object({
	TextField: z.string().nonempty('You must enter a value'),
	Native: z.string().nonempty('You must enter a value'),
	Select: z
		.string()
		.nonempty('You must select a value')
		.refine((val) => ['20', '30'].includes(val), 'Select 20 or 30.'),
	Checkbox: z.boolean().refine((val) => val === true, 'You must check.'),
	Switch: z.boolean().refine((val) => val === true, 'You must turn it on.'),
	RadioGroup: z.string().refine((val) => val === 'female', 'You must select female.'),
	Autocomplete: z.array(z.string()).min(2, 'Select at least two.'),
	DateTimePicker: z.string().refine((val) => val === null || val.trim().length > 0, 'You must select a date')
});

/**
 * Simple Form Example
 */
function SimpleFormExample() {
	const { handleSubmit, register, reset, control, watch, formState } = useForm({
		defaultValues,
		mode: 'all',
		resolver: zodResolver(schema)
	});

	const { isValid, dirtyFields, errors, touchedFields } = formState;

	renderCount += 1;

	const data = watch();

	return (
		<div className="flex w-full max-w-screen-md justify-start items-start">
			<form
				className="w-1/2"
				// eslint-disable-next-line no-console
				onSubmit={handleSubmit((_data) => console.info(_data))}
			>
				<div className="mt-12 mb-4">
					<Typography className="mb-6 font-medium text-base">Native Input:</Typography>

					<input
						className={clsx('border-1 outline-hidden rounded-lg p-2', !!errors.Native && 'border-red')}
						{...register('Native')}
						required
					/>

					{!!errors.Native && (
						<Typography
							className="px-1 py-2 font-medium text-base"
							color="error"
						>
							{errors?.Native?.message}
						</Typography>
					)}
				</div>

				<div className="mt-12 mb-4">
					<Controller
						name="Checkbox"
						control={control}
						render={({ field: { onChange, value, onBlur, ref } }) => (
							<FormControl
								error={!!errors.Checkbox}
								required
							>
								<FormLabel
									className="font-medium text-base"
									component="legend"
								>
									MUI Checkbox
								</FormLabel>
								<FormControlLabel
									label="I agree"
									control={
										<Checkbox
											checked={value}
											onBlur={onBlur}
											onChange={(ev) => onChange(ev.target.checked)}
											inputRef={ref}
											required
										/>
									}
								/>
								<FormHelperText>{errors?.Checkbox?.message}</FormHelperText>
							</FormControl>
						)}
					/>
				</div>

				<div className="mt-12 mb-4">
					<Controller
						render={({ field }) => (
							<FormControl
								error={!!errors.RadioGroup}
								required
							>
								<FormLabel
									className="font-medium text-base"
									component="legend"
								>
									Radio Group
								</FormLabel>
								<RadioGroup
									{...field}
									aria-label="gender"
									name="gender1"
								>
									<FormControlLabel
										value="female"
										control={<Radio />}
										label="Female"
									/>
									<FormControlLabel
										value="male"
										control={<Radio />}
										label="Male"
									/>
								</RadioGroup>
								<FormHelperText>{errors?.RadioGroup?.message}</FormHelperText>
							</FormControl>
						)}
						name="RadioGroup"
						control={control}
					/>
				</div>

				<div className="mt-12 mb-4">
					<Controller
						render={({ field }) => (
							<TextField
								{...field}
								label="MUI TextField"
								variant="outlined"
								error={!!errors.TextField}
								helperText={errors?.TextField?.message}
								required
								fullWidth
							/>
						)}
						name="TextField"
						control={control}
					/>
				</div>

				<div className="mt-12 mb-4">
					<Controller
						render={({ field }) => (
							<FormControl
								error={!!errors.Select}
								required
								fullWidth
							>
								<FormLabel
									className="font-medium text-base"
									component="legend"
								>
									MUI Select
								</FormLabel>
								<Select
									{...field}
									variant="outlined"
									fullWidth
								>
									<MenuItem value="10">Ten (10)</MenuItem>
									<MenuItem value="20">Twenty (20)</MenuItem>
									<MenuItem value="30">Thirty (30)</MenuItem>
								</Select>
								<FormHelperText>{errors?.Select?.message}</FormHelperText>
							</FormControl>
						)}
						name="Select"
						control={control}
					/>
				</div>

				<div className="mt-12 mb-4">
					<Controller
						name="Switch"
						control={control}
						render={({ field: { onChange, value, ref, onBlur } }) => (
							<FormControl
								required
								error={!!errors.Switch}
							>
								<FormLabel
									className="font-medium text-base"
									component="legend"
								>
									MUI Switch
								</FormLabel>
								<Switch
									checked={value}
									onBlur={onBlur}
									onChange={(ev) => onChange(ev.target.checked)}
									inputRef={ref}
									required
								/>
								<FormHelperText>{errors?.Switch?.message}</FormHelperText>
							</FormControl>
						)}
					/>
				</div>

				<div className="mt-12 mb-4">
					<Typography className="mb-6 font-medium text-base">Autocomplete</Typography>
					<Controller
						name="Autocomplete"
						control={control}
						defaultValue={[]}
						render={({ field: { onChange, value, onBlur, ref } }) => (
							<Autocomplete
								className="mt-2 mb-4"
								multiple
								freeSolo
								options={options}
								value={value}
								onChange={(_event, newValue) => {
									onChange(newValue);
								}}
								renderInput={(params) => (
									<TextField
										{...params}
										placeholder="Select multiple tags"
										label="Tags"
										variant="outlined"
										InputLabelProps={{
											shrink: true
										}}
										error={!!errors.Autocomplete}
										helperText={errors?.Autocomplete?.message}
										onBlur={onBlur}
										inputRef={ref}
									/>
								)}
							/>
						)}
					/>
				</div>

				<div className="mt-12 mb-4">
					<Typography className="mb-6 font-medium text-base">DateTimePicker</Typography>

					<Controller
						name="DateTimePicker"
						control={control}
						render={({ field: { onChange, value } }) => (
							<DateTimePicker
								value={new Date(value)}
								onChange={(val) => {
									onChange(val.toISOString());
								}}
								slotProps={{
									textField: {
										id: 'birthday',
										label: 'Birthday',
										InputLabelProps: {
											shrink: true
										},
										fullWidth: true,
										variant: 'outlined',
										error: !!errors.DateTimePicker,
										helperText: errors?.DateTimePicker?.message
									},
									inputAdornment: {
										position: 'start',
										children: <FuseSvgIcon size={20}>heroicons-solid:cake</FuseSvgIcon>
									}
								}}
							/>
						)}
					/>
				</div>

				<div className="flex my-12 items-center">
					<Button
						className="mx-2"
						variant="contained"
						color="secondary"
						type="submit"
						disabled={_.isEmpty(dirtyFields) || !isValid}
					>
						Submit
					</Button>

					<Button
						className="mx-2"
						type="button"
						onClick={() => {
							reset(defaultValues);
						}}
					>
						Reset Form
					</Button>
				</div>
			</form>

			<div className="w-1/2 my-12 p-6">
				<div className="mb-3">
					<Typography>Is Valid: {isValid ? 'true' : 'false'}</Typography>
				</div>

				<div className="mb-3">
					<Typography>Form data</Typography>
				</div>

				<div className="mb-3">
					<pre className="language-js p-6 w-100">{JSON.stringify(data, null, 2)}</pre>
				</div>

				<div className="mb-3">
					<Typography>Touched fields</Typography>

					<pre className="language-js p-6 w-100">{JSON.stringify(touchedFields, null, 2)}</pre>
				</div>

				<div className="mb-3">
					<Typography
						className="mt-4 font-medium text-md italic"
						color="text.secondary"
					>
						Render Count: {renderCount}
					</Typography>
				</div>
			</div>
			<DevTool
				control={control}
				styles={{ button: { position: 'relative' } }}
			/>
		</div>
	);
}

export default SimpleFormExample;
