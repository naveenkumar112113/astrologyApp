import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';

const App = () => {
	const [selectedOption1, setSelectedOption1] = useState('');
	const [selectedOption2, setSelectedOption2] = useState('');
	const [option1Data, setOption1Data] = useState([]);
	const [option2Data, setOption2Data] = useState([]);
	const [tableData, setTableData] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		axios.get('http://192.168.1.5:3000/fetch-options')
			.then(response => {
				setOption1Data(response.data.option1);
				setOption2Data(response.data.option1);
				setLoading(false);
			})
			.catch(error => {
				console.error(error);
				setLoading(false);
			});
	}, []);

	const handleFetchData = () => {
		axios.post('http://192.168.1.5:3000/fetch-data', {
			option1: selectedOption1,
			option2: selectedOption2
		})
			.then(response => {
				setTableData(response.data);
			})
			.catch(error => {
				console.error(error);
			});
	};

	if (loading) {
		return <ActivityIndicator size="large" color="#0000ff" />;
	}

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Astrology App</Text>
			<Picker
				selectedValue={selectedOption1}
				style={styles.picker}
				onValueChange={(itemValue) => setSelectedOption1(itemValue)}
			>
				<Picker.Item label="மணமகன் நட்சத்திரம்" value="" />
				{option1Data.map((option, index) => (
					<Picker.Item key={index} label={option.natchathiram_name} value={option.id} />
				))}
			</Picker>
			<Picker
				selectedValue={selectedOption2}
				style={styles.picker}
				onValueChange={(itemValue) => setSelectedOption2(itemValue)}
			>
				<Picker.Item label="மணப்பெண் நட்சத்திரம்" value="" />
				{option2Data.map((option, index) => (
					<Picker.Item key={index} label={option.natchathiram_name} value={option.id} />
				))}
			</Picker>
			<Button
				title="பொருத்தம்"
				onPress={handleFetchData}
			/>
			<View style={styles.table}>
				{tableData.map((row, index) => (
					<View key={index} style={styles.tableRow}>
						<Text>{row.porutham_name}</Text>
						<Text>{row.porutham_type == 1 ? 'பொருந்தும்' : 'பொருந்தாது'}</Text>
					</View>
				))}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
		backgroundColor: '#fff'
	},
	title: {
		fontSize: 24,
		marginBottom: 16,
		textAlign: 'center'
	},
	picker: {
		height: 50,
		width: '100%',
		marginBottom: 16
	},
	table: {
		marginTop: 16,
	},
	tableRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		padding: 8,
		borderBottomWidth: 1,
		borderBottomColor: '#ccc',
	}
});

export default App;