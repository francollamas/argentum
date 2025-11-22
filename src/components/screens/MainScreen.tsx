import type { FC } from 'react'
import { useState } from 'react'
import { Text } from '../common/Text'
import {
	Button,
	CheckBox,
	Input,
	Label,
	Panel,
	ProgressBar,
	RadioGroup,
	Switch,
} from '../ui'

export const MainScreen: FC = () => {
	const [soundEnabled, setSoundEnabled] = useState(true)
	const [musicEnabled, setMusicEnabled] = useState(false)
	const [notifications, setNotifications] = useState(true)

	const [selectedClass, setSelectedClass] = useState(0)
	const [acceptTerms, setAcceptTerms] = useState(false)

	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')

	const [health, setHealth] = useState(850)
	const [mana, setMana] = useState(420)
	const [experience, setExperience] = useState(6750)

	return (
		<>
			<Text text='UI Components Showcase' x={20} y={20} bold />

			<Panel x={20} y={60} width={380} height={280}>
				<Label text='Character Creation' x={20} y={15} font='general' />

				<Label text='Username:' x={20} y={50} font='general' />
				<Input
					x={20}
					y={75}
					width={340}
					height={35}
					placeholder='Enter your username'
					value={username}
					onChange={setUsername}
					maxLength={16}
				/>

				<Label text='Password:' x={20} y={120} font='general' />
				<Input
					x={20}
					y={145}
					width={340}
					height={35}
					placeholder='Enter your password'
					value={password}
					onChange={setPassword}
					secure
				/>

				<CheckBox
					x={20}
					y={200}
					checked={acceptTerms}
					onChange={setAcceptTerms}
					variant='normal'
					text='I accept the terms and conditions'
				/>

				<Button
					text='Create Character'
					x={105}
					y={235}
					width={170}
					height={35}
					variant='normal'
					onPress={() => console.log('Character created:', username)}
				/>
			</Panel>

			<Panel x={420} y={60} width={340} height={280}>
				<Label text='Class Selection' x={20} y={15} font='general' />

				<RadioGroup
					x={50}
					y={50}
					selectedIndex={selectedClass}
					onChange={setSelectedClass}
					type='vertical'
					items={[
						{ text: 'Warrior' },
						{ text: 'Mage' },
						{ text: 'Cleric' },
						{ text: 'Paladin' },
						{ text: 'Assassin' },
					]}
				/>
			</Panel>

			<Panel x={780} y={60} width={340} height={280}>
				<Label text='Game Settings' x={20} y={15} font='general' />

				<Switch
					x={30}
					y={60}
					enabled={soundEnabled}
					onChange={setSoundEnabled}
					text='Sound Effects'
				/>

				<Switch
					x={30}
					y={110}
					enabled={musicEnabled}
					onChange={setMusicEnabled}
					text='Background Music'
				/>

				<Switch
					x={30}
					y={160}
					enabled={notifications}
					onChange={setNotifications}
					text='Push Notifications'
				/>

				<Button
					text='Apply Settings'
					x={85}
					y={220}
					width={170}
					height={35}
					variant='normal'
					onPress={() => console.log('Settings applied')}
				/>
			</Panel>

			<Panel x={20} y={360} width={540} height={200}>
				<Label text='Character Stats' x={20} y={15} font='general' />

				<Label text='Health' x={20} y={50} font='general' />
				<ProgressBar
					x={20}
					y={75}
					width={500}
					height={28}
					value={health}
					max={1000}
					fillColor={0xff3333}
					textVariant='amount'
				/>

				<Label text='Mana' x={20} y={115} font='general' />
				<ProgressBar
					x={20}
					y={140}
					width={500}
					height={28}
					value={mana}
					max={500}
					fillColor={0x3399ff}
					textVariant='percentage'
				/>
			</Panel>

			<Panel x={580} y={360} width={540} height={200}>
				<Label text='Experience Progress' x={20} y={15} font='general' />

				<Label text='Level 12 → Level 13' x={20} y={50} font='general' />
				<ProgressBar
					x={20}
					y={75}
					width={500}
					height={28}
					value={experience}
					max={10000}
					fillColor={0xffaa00}
					textVariant='amount'
				/>

				<Button
					text='Small Action'
					x={30}
					y={135}
					width={120}
					height={35}
					variant='small'
					onPress={() => setExperience(Math.min(10000, experience + 250))}
				/>

				<Button
					text='Gain Experience'
					x={170}
					y={130}
					width={180}
					height={45}
					variant='normal'
					onPress={() => setExperience(Math.min(10000, experience + 500))}
				/>

				<Button
					text='Heal & Restore'
					x={370}
					y={130}
					width={150}
					height={45}
					variant='normal'
					onPress={() => {
						setHealth(1000)
						setMana(500)
					}}
				/>
			</Panel>
		</>
	)
}
