'use client';

import { Controller, useForm } from 'react-hook-form';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Link from '@fuse/core/Link';
import _ from 'lodash';
import Paper from '@mui/material/Paper';
import FormHelperText from '@mui/material/FormHelperText';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

/**
 * Form Validation Schema
 */
const schema = z
	.object({
		name: z.string().nonempty('You must enter your name'),
		email: z.string().email('You must enter a valid email').nonempty('You must enter an email'),
		password: z
			.string()
			.nonempty('Please enter your password.')
			.min(8, 'Password is too short - should be 8 chars minimum.'),
		passwordConfirm: z.string().nonempty('Password confirmation is required'),
		acceptTermsConditions: z.boolean().refine((val) => val === true, 'The terms and conditions must be accepted.')
	})
	.refine((data) => data.password === data.passwordConfirm, {
		message: 'Passwords must match',
		path: ['passwordConfirm']
	});

const defaultValues = {
	name: '',
	email: '',
	password: '',
	passwordConfirm: '',
	acceptTermsConditions: false
};

/**
 * The classic sign up page.
 */
function ClassicSignUpPage() {
	const { control, formState, handleSubmit, reset } = useForm({
		mode: 'onChange',
		defaultValues,
		resolver: zodResolver(schema)
	});

	const { isValid, dirtyFields, errors } = formState;

	function onSubmit() {
		reset(defaultValues);
	}

	return (
		<div className="flex min-w-0 flex-auto flex-col items-center sm:justify-center">
			<Paper className="min-h-full w-full rounded-none px-4 py-8 sm:min-h-auto sm:w-auto sm:rounded-xl sm:p-12 sm:shadow-sm">
				<div className="mx-auto w-full max-w-80 sm:mx-0 sm:w-80">
					<img
						className="w-12"
						src="/assets/images/logo/logo.svg"
						alt="logo"
					/>

					<Typography className="mt-8 text-4xl font-extrabold leading-[1.25] tracking-tight">
						Sign up
					</Typography>
					<div className="mt-0.5 flex items-baseline font-medium">
						<Typography>Already have an account?</Typography>
						<Link
							className="ml-1"
							to="/sign-in"
						>
							Sign in
						</Link>
					</div>

					<form
						name="registerForm"
						noValidate
						className="mt-8 flex w-full flex-col justify-center"
						onSubmit={handleSubmit(onSubmit)}
					>
						<Controller
							name="name"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									className="mb-6"
									label="Name"
									autoFocus
									type="name"
									error={!!errors.name}
									helperText={errors?.name?.message}
									variant="outlined"
									required
									fullWidth
								/>
							)}
						/>

						<Controller
							name="email"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									className="mb-6"
									label="Email"
									type="email"
									error={!!errors.email}
									helperText={errors?.email?.message}
									variant="outlined"
									required
									fullWidth
								/>
							)}
						/>

						<Controller
							name="password"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									className="mb-6"
									label="Password"
									type="password"
									error={!!errors.password}
									helperText={errors?.password?.message}
									variant="outlined"
									required
									fullWidth
								/>
							)}
						/>

						<Controller
							name="passwordConfirm"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									className="mb-6"
									label="Password (Confirm)"
									type="password"
									error={!!errors.passwordConfirm}
									helperText={errors?.passwordConfirm?.message}
									variant="outlined"
									required
									fullWidth
								/>
							)}
						/>

						<Controller
							name="acceptTermsConditions"
							control={control}
							render={({ field }) => (
								<FormControl error={!!errors.acceptTermsConditions}>
									<FormControlLabel
										label="I agree with Terms and Privacy Policy"
										control={
											<Checkbox
												size="small"
												{...field}
											/>
										}
									/>
									<FormHelperText>{errors?.acceptTermsConditions?.message}</FormHelperText>
								</FormControl>
							)}
						/>

						<Button
							variant="contained"
							color="secondary"
							className=" mt-6 w-full"
							aria-label="Register"
							disabled={_.isEmpty(dirtyFields) || !isValid}
							type="submit"
							size="large"
						>
							Create your free account
						</Button>
					</form>
				</div>
			</Paper>
		</div>
	);
}

export default ClassicSignUpPage;
