import { zodResolver } from '@hookform/resolvers/zod'
import { tw } from '@pixi/layout/tailwind'
import type { FC } from 'react'
import { useState } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
	FormCheckboxField,
	FormRadioGroupField,
	FormSwitchField,
	FormTextAreaField,
	FormTextField,
} from '../../form'
import {
	Button,
	Colors,
	Dialog,
	Label,
	Panel,
	ScrollView,
	Slider,
	WrappedLabel,
} from '../../ui'

type FormDemoScreenProps = {
	onBack: () => void
}

const classItems = [
	{ text: 'Warrior', value: 'warrior' },
	{ text: 'Mage', value: 'mage' },
	{ text: 'Archer', value: 'archer' },
]

const formSchema = z.object({
	characterName: z
		.string()
		.trim()
		.min(3, 'Name must have at least 3 characters'),
	bio: z
		.string()
		.trim()
		.min(10, 'Bio must have at least 10 characters')
		.max(120, 'Bio must stay under 120 characters'),
	classId: z.string().min(1, 'Select a class'),
	acceptRules: z.boolean().refine((value) => value, {
		message: 'You must accept the rules',
	}),
	musicEnabled: z.boolean(),
})

type FormValues = z.infer<typeof formSchema>

const defaultValues: FormValues = {
	characterName: '',
	bio: '',
	classId: '',
	acceptRules: false,
	musicEnabled: true,
}

const CharacterFormFields: FC<{
	form: UseFormReturn<FormValues>
	status: string
}> = ({ form, status }) => {
	return (
		<layoutContainer layout={{ ...tw`w-full flex-col`, gap: 14 }}>
			<FormTextField
				control={form.control}
				name='characterName'
				label='Character name'
				helperText='3 to 16 characters'
				placeholder='Enter name'
				maxLength={16}
			/>
			<FormTextAreaField
				control={form.control}
				name='bio'
				label='Biography'
				helperText='Minimum 10 characters, maximum 120'
				placeholder='Short character background'
				height={120}
				maxLength={120}
			/>
			<FormRadioGroupField
				control={form.control}
				name='classId'
				label='Class'
				helperText='Required choice with initially empty state'
				items={classItems}
			/>
			<FormCheckboxField
				control={form.control}
				name='acceptRules'
				text='I accept the rules'
			/>
			<FormSwitchField
				control={form.control}
				name='musicEnabled'
				text='Music enabled'
				helperText='Optional boolean field'
			/>
			<Label text={status} font='labelSm' color={Colors.silver} />
		</layoutContainer>
	)
}

const DialogFormBody: FC<{
	onSubmit: (values: FormValues) => void
	onCancel: () => void
}> = ({ onSubmit, onCancel }) => {
	const [status, setStatus] = useState('Ready to validate the dialog form')
	const [volumePreview, setVolumePreview] = useState(65)

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues,
	})

	const submitDialog = form.handleSubmit(
		(values) => {
			setStatus('Validation passed')
			onSubmit(values)
		},
		() => {
			setStatus(
				'Validation failed and focus moved to the first invalid text field',
			)
		},
	)

	const resetDialog = () => {
		form.reset(defaultValues)
		setVolumePreview(65)
		setStatus('Form reset to defaults')
	}

	return (
		<layoutContainer layout={{ ...tw`w-full flex-col`, flex: 1, gap: 16 }}>
			<ScrollView layout={{ flex: 1 }} contentLayout={{ paddingRight: 4 }}>
				<Panel layout={{ width: '100%', gap: 16 }}>
					<WrappedLabel
						text='This dialog uses the reusable footer actions for submit/cancel/reset, so it validates Pixi-driven submission without any native HTML form dependency.'
						width={520}
						font='bodySm'
						color={Colors.silver}
					/>
					<layoutContainer layout={{ ...tw`w-full flex-col`, gap: 10 }}>
						<Label text='Volume preview' font='label' color={Colors.gold} />
						<Slider
							value={volumePreview}
							onChange={setVolumePreview}
							layout={{ width: '100%' }}
						/>
						<Label
							text={`Current value: ${volumePreview}`}
							font='labelSm'
							color={Colors.silver}
						/>
					</layoutContainer>
					<CharacterFormFields form={form} status={status} />
				</Panel>
			</ScrollView>
			<layoutContainer layout={tw`w-full flex-row justify-between`}>
				<Button text='Reset' variant='small' onPress={resetDialog} />
				<Button text='Cancel' variant='small' onPress={onCancel} />
				<Button text='Submit' onPress={submitDialog} />
			</layoutContainer>
		</layoutContainer>
	)
}

const FormDemoBackground: FC<{
	onBack: () => void
	onOpenDialog: () => void
	inlineForm: UseFormReturn<FormValues>
	inlineStatus: string
	inlinePayload: string
	dialogPayload: string
	onResetInline: () => void
	onSubmitInline: () => void
}> = ({
	onBack,
	onOpenDialog,
	inlineForm,
	inlineStatus,
	inlinePayload,
	dialogPayload,
	onResetInline,
	onSubmitInline,
}) => {
	return (
		<layoutContainer
			layout={{
				...tw`w-full h-full flex-col`,
				backgroundColor: Colors.backgroundDark,
				padding: 32,
				gap: 20,
			}}
		>
			<layoutContainer
				layout={tw`w-full flex-row items-center justify-between`}
			>
				<layoutContainer layout={tw`flex-col gap-1`}>
					<Label text='Form Demo' font='title' color={Colors.gold} />
					<WrappedLabel
						text='This demo validates react-hook-form + zod integration on Pixi-rendered controls, both inline and inside a dialog.'
						width={760}
						font='bodySm'
						color={Colors.silver}
					/>
				</layoutContainer>
				<Button text='Back' variant='small' onPress={onBack} />
			</layoutContainer>

			<layoutContainer
				layout={{
					...tw`w-full flex-row`,
					flex: 1,
					gap: 24,
				}}
			>
				<Panel layout={{ width: 560, height: '100%', gap: 16 }}>
					<Label text='Inline Panel Form' font='titleSm' color={Colors.gold} />
					<WrappedLabel
						text='Submit empty to see errors, blur a text field to trigger touched state, select a class to clear its error, and toggle the checkbox and switch through RHF state.'
						width={500}
						font='bodySm'
						color={Colors.silver}
					/>
					<CharacterFormFields form={inlineForm} status={inlineStatus} />
					<layoutContainer layout={tw`w-full flex-row justify-between`}>
						<Button text='Reset' variant='small' onPress={onResetInline} />
						<Button text='Create character' onPress={onSubmitInline} />
					</layoutContainer>
				</Panel>

				<Panel layout={{ flex: 1, height: '100%', gap: 16 }}>
					<Label text='Submitted Payloads' font='titleSm' color={Colors.gold} />
					<layoutContainer layout={tw`w-full flex-col gap-3`}>
						<Label
							text='Inline form'
							font='label'
							color={Colors.metalHighlight}
						/>
						<WrappedLabel
							text={inlinePayload}
							width={320}
							font='labelSm'
							color={Colors.silver}
						/>
					</layoutContainer>
					<layoutContainer layout={tw`w-full flex-col gap-3`}>
						<Label
							text='Dialog form'
							font='label'
							color={Colors.metalHighlight}
						/>
						<WrappedLabel
							text={dialogPayload}
							width={320}
							font='labelSm'
							color={Colors.silver}
						/>
					</layoutContainer>
					<Button text='Open dialog form' onPress={onOpenDialog} />
				</Panel>
			</layoutContainer>
		</layoutContainer>
	)
}

export const FormDemoScreen: FC<FormDemoScreenProps> = ({ onBack }) => {
	const [dialogOpen, setDialogOpen] = useState(false)
	const [inlineStatus, setInlineStatus] = useState(
		'Ready to validate the inline form',
	)
	const [inlinePayload, setInlinePayload] = useState('No submit yet')
	const [dialogPayload, setDialogPayload] = useState('No dialog submit yet')

	const inlineForm = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues,
	})

	const submitInline = inlineForm.handleSubmit(
		(values) => {
			setInlineStatus('Validation passed')
			setInlinePayload(JSON.stringify(values, null, 2))
		},
		() => {
			setInlineStatus(
				'Validation failed and focus moved to the first invalid text field',
			)
		},
	)

	const resetInline = () => {
		inlineForm.reset(defaultValues)
		setInlineStatus('Form reset to defaults')
		setInlinePayload('No submit yet')
	}

	return (
		<Dialog
			visible={dialogOpen}
			title='Form In Dialog'
			onClose={() => setDialogOpen(false)}
			width={620}
			height={720}
			backgroundContent={
				<FormDemoBackground
					onBack={onBack}
					onOpenDialog={() => setDialogOpen(true)}
					inlineForm={inlineForm}
					inlineStatus={inlineStatus}
					inlinePayload={inlinePayload}
					dialogPayload={dialogPayload}
					onResetInline={resetInline}
					onSubmitInline={submitInline}
				/>
			}
		>
			{dialogOpen ? (
				<DialogFormBody
					onCancel={() => setDialogOpen(false)}
					onSubmit={(values) => {
						setDialogPayload(JSON.stringify(values, null, 2))
						setDialogOpen(false)
					}}
				/>
			) : null}
		</Dialog>
	)
}
