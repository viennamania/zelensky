'use client';

import { Controller, useForm } from 'react-hook-form';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import _ from 'lodash';
import Paper from '@mui/material/Paper';
import Link from '@fuse/core/Link';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

/**
 * Form Validation Schema
 */
const schema = z.object({
	name: z.string().nonempty('You must enter your name'),
	password: z
		.string()
		.nonempty('Please enter your password.')
		.min(8, 'Password is too short - should be 8 chars minimum.')
});

const defaultValues = {
	name: 'Brian Hughes',
	password: ''
};

/**
 * The classic unlock session page.
 */
function ClassicUnlockSessionPage() {
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
						Unlock your session
					</Typography>
					<Typography className="font-medium">Your session is locked due to inactivity</Typography>

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
									label="Full name"
									autoFocus
									type="name"
									error={!!errors.name}
									helperText={errors?.name?.message}
									variant="outlined"
									fullWidth
									disabled
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

						<Button
							variant="contained"
							color="secondary"
							className=" mt-1 w-full"
							aria-label="Register"
							disabled={_.isEmpty(dirtyFields) || !isValid}
							type="submit"
							size="large"
						>
							Unlock your session
						</Button>

						<Typography
							className="mt-8 text-md font-medium"
							color="text.secondary"
						>
							<span>I'm not</span>
							<Link
								className="ml-1"
								to="/sign-in"
							>
								Brian Hughes
							</Link>
						</Typography>
					</form>
				</div>
			</Paper>
		</div>
	);
}

export default ClassicUnlockSessionPage;
