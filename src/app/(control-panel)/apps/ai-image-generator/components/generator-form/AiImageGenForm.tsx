import {
	Button,
	Typography,
	IconButton,
	Tooltip,
	OutlinedInput,
	ToggleButton,
	ToggleButtonGroup,
	Box,
	alpha
} from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { useCallback, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import _ from 'lodash';
import stylePresets from '../../constants/stylePresets';
import moodPresets from '../../constants/moodPresets';
import lightingPresets from '../../constants/lightingPresets';
import StyleSelectFormController from './controllers/StyleSelectFormController';
import PresetsMenu from '../AiImageGenPresetsMenu';
import FormSection from './FormSection';
import useAiImageGenAppContext from '../../contexts/useAiImageGenAppContext';
import artStylePresets from '../../constants/artStylePresets';
import SizeFormController from './controllers/SizeFormController';
import {
	AiImageGenPreset,
	AiImageGenSettings,
	useCreateAiImageGenPresetMutation,
	useCreateAiImageGenItemMutation,
	AiImageGenApiResponse
} from '../../AiImageGenApi';

type FormType = AiImageGenSettings;

const defaultValues: FormType = {
	prompt: '',
	negativePrompt: '',
	size: '1024x1024',
	style: 'natural',
	quality: 'standard',
	artStyle: 'realistic',
	mood: 'peaceful',
	lighting: 'natural'
};

const schema = z.object({
	prompt: z.string().min(1, 'You must enter a prompt'),
	negativePrompt: z.string().optional(),
	size: z.string().min(1, 'You must select a size'),
	style: z.string().min(1, 'You must select a style'),
	quality: z.string().min(1, 'You must select a quality'),
	artStyle: z.string().min(1, 'You must select an art style'),
	mood: z.string().min(1, 'You must select a mood'),
	lighting: z.string().min(1, 'You must select a lighting')
});

function ImageGeneratorForm() {
	const [createPreset] = useCreateAiImageGenPresetMutation();
	const { setConfigDialogOpen, apiKey, setLoading } = useAiImageGenAppContext();
	const [createItem] = useCreateAiImageGenItemMutation();

	const { control, handleSubmit, watch, formState, reset } = useForm({
		mode: 'all',
		defaultValues,
		resolver: zodResolver(schema)
	});

	const { isValid } = formState;

	const formData = watch();

	useEffect(() => {
		reset(defaultValues);
		// eslint-disable-next-line
	}, []);

	function handleOnLoadPreset(preset: AiImageGenPreset) {
		reset(preset.settings);
	}

	function handleOnSavePreset(name: string) {
		createPreset({
			name,
			settings: formData,
			createdAt: Date.now()
		});
	}

	const onSubmit = useCallback(
		async (data: FormType) => {
			if (!apiKey || apiKey === '') {
				setConfigDialogOpen(true);
				return;
			}

			const apiUrl = 'https://api.openai.com/v1/images/generations'; // Replace with the actual DALL-E API endpoint

			const artStylePreset = _.find(artStylePresets, { value: data.artStyle })?.description;
			const moodPreset = _.find(moodPresets, { value: data.mood })?.description;
			const lightingPreset = _.find(lightingPresets, { value: data.lighting })?.description;

			try {
				setLoading(true);
				const fullPrompt = `
				Prompt: ${data.prompt}
				Negative Prompt: ${data.negativePrompt || 'None'}
				Art Style: ${artStylePreset}
				Mood: ${moodPreset}
				Lighting: ${lightingPreset}
			`;

				const response = await fetch(apiUrl, {
					method: 'POST',
					headers: {
						Authorization: `Bearer ${apiKey}`,
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						prompt: fullPrompt,
						model: 'dall-e-3',
						quality: data.quality,
						response_format: 'url',
						style: data.style,
						size: data.size
					})
				});

				if (!response.ok) {
					throw new Error('Network response was not ok');
				}

				const result = (await response.json()) as AiImageGenApiResponse;

				createItem({
					formData: data,
					favorite: false,
					response: result
				});
			} catch (error) {
				console.error('Error generating image:', error);
			} finally {
				setLoading(false);
			}
		},
		[apiKey, createItem, setConfigDialogOpen, setLoading]
	);

	return (
		<form
			className="flex flex-col min-h-0"
			onSubmit={handleSubmit(onSubmit)}
		>
			<div className="flex justify-between items-center px-4 py-3">
				<Typography className="flex justify-between items-center text-md font-semibold">
					Generate New Image
				</Typography>

				<PresetsMenu
					onLoadPreset={handleOnLoadPreset}
					onSavePreset={handleOnSavePreset}
				/>
			</div>
			<div className="flex flex-col gap-4 overflow-y-auto px-4 py-2 min-h-0">
				<FormSection>
					<div className="flex flex-col gap-4">
						<div className="flex flex-col gap-2">
							<div className="flex justify-between items-center">
								<Typography
									className="text-sm font-semibold"
									color="text.secondary"
								>
									Image Description
								</Typography>
								<div className="flex items-center">
									<Tooltip title="Enhance with AI">
										<IconButton
											size="small"
											onClick={() => {}}
										>
											<FuseSvgIcon size={16}>heroicons-solid:sparkles</FuseSvgIcon>
										</IconButton>
									</Tooltip>
								</div>
							</div>

							<Controller
								name="prompt"
								control={control}
								render={({ field }) => (
									<OutlinedInput
										className="px-0 py-2 text-sm"
										fullWidth
										multiline
										rows={4}
										placeholder="Describe what you want to generate..."
										{...field}
									/>
								)}
							/>
						</div>

						<div className="flex flex-col gap-2">
							<Typography
								className="text-sm font-semibold"
								color="text.secondary"
							>
								Negative Prompt
							</Typography>

							<Controller
								name="negativePrompt"
								control={control}
								render={({ field }) => (
									<OutlinedInput
										className="px-0 py-2 text-sm"
										fullWidth
										multiline
										rows={2}
										placeholder="Describe what you want to avoid in the image..."
										{...field}
									/>
								)}
							/>
						</div>
					</div>
				</FormSection>

				<FormSection>
					<div className="space-y-6">
						<Controller
							name="style"
							control={control}
							render={({ field }) => (
								<StyleSelectFormController
									options={stylePresets}
									title="Model Style"
									{...field}
								/>
							)}
						/>

						<Controller
							name="artStyle"
							control={control}
							render={({ field }) => (
								<StyleSelectFormController
									options={artStylePresets}
									title="Art Style"
									{...field}
								/>
							)}
						/>

						<Controller
							name="mood"
							control={control}
							render={({ field }) => (
								<StyleSelectFormController
									options={moodPresets}
									title="Mood"
									{...field}
								/>
							)}
						/>

						<Controller
							name="lighting"
							control={control}
							render={({ field }) => (
								<StyleSelectFormController
									options={lightingPresets}
									title="Lighting"
									{...field}
								/>
							)}
						/>
					</div>
				</FormSection>

				<FormSection>
					<div className="flex justify-center mb-8">
						<Box
							sx={{
								backgroundColor: (theme) => alpha(theme.palette.background.default, 0.7),
								color: (theme) => theme.palette.text.secondary,
								border: (theme) => `1px dashed ${theme.palette.divider}`,
								width: '150px',
								aspectRatio: formData.size.replace('x', '/')
							}}
							className="rounded-sm flex items-center justify-center"
						>
							<Typography
								variant="caption"
								color="textSecondary"
							>
								{formData.size}
							</Typography>
						</Box>
					</div>

					<div className="space-y-6">
						<Controller
							name="size"
							control={control}
							render={({ field }) => <SizeFormController {...field} />}
						/>
						<Controller
							control={control}
							name="quality"
							render={({ field }) => (
								<div className="flex space-x-3 items-center justify-between">
									<Typography
										className="text-md font-medium"
										color="text.secondary"
									>
										Quality:
									</Typography>
									<ToggleButtonGroup
										value={field.value}
										exclusive
										onChange={field.onChange}
										aria-label="quality"
										size="small"
									>
										<ToggleButton
											className="normal-case"
											value="standard"
											aria-label="standard"
										>
											Standard
										</ToggleButton>
										<ToggleButton
											className="normal-case"
											value="hd"
											aria-label="hd"
										>
											HD
										</ToggleButton>
									</ToggleButtonGroup>
								</div>
							)}
						/>
					</div>
				</FormSection>
			</div>
			<div className="flex justify-end p-4">
				<Button
					fullWidth
					variant="contained"
					color="secondary"
					size="small"
					type="submit"
					disabled={!isValid}
				>
					Generate Image
				</Button>
			</div>
		</form>
	);
}

export default ImageGeneratorForm;
