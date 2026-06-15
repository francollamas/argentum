import { tw } from '@pixi/layout/tailwind'
import type { FC } from 'react'
import { Button, Colors, Label, Panel, Tooltip, WrappedLabel } from '../../ui'

export const TooltipDemoScreen: FC = () => {
	return (
		<layoutContainer
			layout={{
				...tw`w-full h-full flex-col items-center gap-6`,
				padding: 32,
			}}
		>
			<layoutContainer layout={tw`flex-col items-center gap-1`}>
				<Label text='Tooltip Demo' font='title' color={Colors.gold} />
				<WrappedLabel
					text='Hover the triggers to inspect delayed tooltips with natural sizing, placement hints, and mixed ReactNode content.'
					width={760}
					font='bodySm'
					color={Colors.silver}
					align='center'
				/>
			</layoutContainer>

			<layoutContainer
				layout={{
					...tw`w-full flex-row flex-wrap justify-center`,
					gap: 20,
				}}
			>
				<Panel layout={{ width: 360, alignItems: 'center', gap: 18 }}>
					<Label text='Top / Bottom' font='titleSm' color={Colors.gold} />
					<Tooltip
						placement='top'
						content={<Label text='Shows above after 300ms.' font='labelSm' />}
					>
						<Button text='Hover top tooltip' variant='small' />
					</Tooltip>
					<Tooltip
						placement='bottom'
						content={
							<layoutContainer layout={{ ...tw`flex-col`, gap: 4 }}>
								<Label
									text='Bottom placement'
									font='labelSm'
									color={Colors.gold}
								/>
								<Label
									text='Pointer leave hides it instantly.'
									font='labelSm'
								/>
							</layoutContainer>
						}
					>
						<Button text='Hover bottom tooltip' variant='small' />
					</Tooltip>
				</Panel>

				<Panel layout={{ width: 420, alignItems: 'center', gap: 18 }}>
					<Label text='Left / Right' font='titleSm' color={Colors.gold} />
					<Tooltip
						placement='left'
						content={
							<layoutContainer layout={{ ...tw`flex-col`, gap: 4 }}>
								<Label
									text='Left side tooltip'
									font='labelSm'
									color={Colors.gold}
								/>
								<Label
									text='Useful for compact icon clusters.'
									font='labelSm'
								/>
							</layoutContainer>
						}
					>
						<Button text='Hover left tooltip' variant='small' />
					</Tooltip>
					<Tooltip
						placement='right'
						content={
							<layoutContainer layout={{ ...tw`flex-col`, gap: 6 }}>
								<Label
									text='Mixed content'
									font='labelSm'
									color={Colors.gold}
								/>
								<Label
									text='Any ReactNode can live inside the shell.'
									font='labelSm'
								/>
								<layoutContainer
									layout={{ ...tw`flex-row items-center`, gap: 8 }}
								>
									<Label text='Range:' font='labelSm' color={Colors.silver} />
									<Label
										text='12 - 144'
										font='labelSm'
										color={Colors.metalHighlight}
									/>
								</layoutContainer>
							</layoutContainer>
						}
					>
						<Button text='Hover right tooltip' variant='small' />
					</Tooltip>
				</Panel>

				<Panel layout={{ width: 560, alignItems: 'center', gap: 18 }}>
					<Label text='Natural width' font='titleSm' color={Colors.gold} />
					<Tooltip
						placement='top'
						content={
							<Label
								text='This tooltip intentionally uses a longer single-line sentence so the shell grows naturally without a default max-width constraint.'
								font='labelSm'
							/>
						}
					>
						<Button text='Hover wide tooltip' />
					</Tooltip>
				</Panel>
			</layoutContainer>
		</layoutContainer>
	)
}
