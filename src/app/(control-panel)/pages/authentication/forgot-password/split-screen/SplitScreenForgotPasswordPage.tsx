'use client';

import { Controller, useForm } from 'react-hook-form';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Link from '@fuse/core/Link';
import _ from 'lodash';
import AvatarGroup from '@mui/material/AvatarGroup';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

/**
 * Form Validation Schema
 */
const schema = z.object({
	email: z.string().email('You must enter a valid email').nonempty('You must enter an email')
});

const defaultValues = {
	email: ''
};

/**
 * The modern forgot password page.
 */
function SplitScreenForgotPasswordPage() {
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
		<div className="flex min-w-0 flex-auto flex-col items-center sm:flex-row sm:justify-center md:items-start md:justify-start">
			<Paper className="h-full w-full px-4 py-2 ltr:border-r-1 rtl:border-l-1 sm:h-auto sm:w-auto sm:rounded-xl sm:p-12 sm:shadow-sm md:flex md:h-full md:w-1/2 md:items-center md:justify-end md:rounded-none md:p-16 md:shadow-none">
				<div className="mx-auto w-full max-w-80 sm:mx-0 sm:w-80">
					<img
						className="w-12"
						src="/assets/images/logo/logo.svg"
						alt="logo"
					/>

					<Typography className="mt-8 text-4xl font-extrabold leading-[1.25] tracking-tight">
						Forgot password?
					</Typography>
					<div className="mt-0.5 flex items-baseline font-medium">
						<Typography>Fill the form to reset your password</Typography>
					</div>

					<form
						name="registerForm"
						noValidate
						className="mt-8 flex w-full flex-col justify-center"
						onSubmit={handleSubmit(onSubmit)}
					>
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

						<Button
							variant="contained"
							color="secondary"
							className=" mt-1 w-full"
							aria-label="Register"
							disabled={_.isEmpty(dirtyFields) || !isValid}
							type="submit"
							size="large"
						>
							Send reset link
						</Button>

						<Typography
							className="mt-8 text-md font-medium"
							color="text.secondary"
						>
							<span>Return to</span>
							<Link
								className="ml-1"
								to="/sign-in"
							>
								sign in
							</Link>
						</Typography>
					</form>
				</div>
			</Paper>

			<Box
				className="relative hidden h-full flex-auto items-center justify-center overflow-hidden p-16 md:flex lg:px-28"
				sx={{ backgroundColor: 'primary.dark', color: 'primary.contrastText' }}
			>
				<svg
					className="pointer-events-none absolute inset-0"
					viewBox="0 0 960 540"
					width="100%"
					height="100%"
					preserveAspectRatio="xMidYMax slice"
					xmlns="http://www.w3.org/2000/svg"
				>
					<Box
						component="g"
						className="opacity-5"
						fill="none"
						stroke="currentColor"
						strokeWidth="100"
					>
						<circle
							r="234"
							cx="196"
							cy="23"
						/>
						<circle
							r="234"
							cx="790"
							cy="491"
						/>
					</Box>
				</svg>
				<Box
					component="svg"
					className="absolute -right-16 -top-16 opacity-20"
					sx={{ color: 'primary.light' }}
					viewBox="0 0 220 192"
					width="220px"
					height="192px"
					fill="none"
				>
					<defs>
						<pattern
							id="837c3e70-6c3a-44e6-8854-cc48c737b659"
							x="0"
							y="0"
							width="20"
							height="20"
							patternUnits="userSpaceOnUse"
						>
							<rect
								x="0"
								y="0"
								width="4"
								height="4"
								fill="currentColor"
							/>
						</pattern>
					</defs>
					<rect
						width="220"
						height="192"
						fill="url(#837c3e70-6c3a-44e6-8854-cc48c737b659)"
					/>
				</Box>

				<div className="relative z-10 w-full max-w-4xl">
					<div className="text-7xl font-bold leading-none text-gray-100">
						<div>Welcome to</div>
						<div>our community</div>
					</div>
					<div className="mt-6 text-lg leading-6 tracking-tight text-gray-400">
						Fuse helps developers to build organized and well coded dashboards full of beautiful and rich
						modules. Join us and start building your application today.
					</div>
					<div className="mt-8 flex items-center">
						<AvatarGroup
							sx={{
								'& .MuiAvatar-root': {
									borderColor: 'primary.main'
								}
							}}
						>
							<Avatar src="/assets/images/avatars/female-18.jpg" />
							<Avatar src="/assets/images/avatars/female-11.jpg" />
							<Avatar src="/assets/images/avatars/male-09.jpg" />
							<Avatar src="/assets/images/avatars/male-16.jpg" />
						</AvatarGroup>

						<div className="ml-4 font-medium tracking-tight text-gray-400">
							More than 17k people joined us, it's your turn
						</div>
					</div>
				</div>
			</Box>
		</div>
	);
}

export default SplitScreenForgotPasswordPage;
