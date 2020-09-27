import React, { useState, useEffect, Fragment } from "react"
import { StyleSheet, View, Text, Button, SafeAreaView, FlatList } from "react-native"

function displayStock() {
	const [stock, setStock] = useState(null);
  const indexArray = [];
  indexArray.length = 10;

	useEffect(() => {
		updateStock()
	}, [])

	function updateStock() {
		fetch('https://finnhub.io/api/v1/stock/symbol?exchange=US&token=btfst8n48v6rl6gbq2lg')
			.then((response) => response.json())
			.then((data) => {
        for(var i = 0; i < 10; i++){
				      const randomIndex = Math.floor(Math.random() * data.length)
              indexArray[i] = data[randomIndex];
        }
        setStock(indexArray);
			})
	}

	return { stock, updateStock }
}

const Item = ({ symbolText }) =>(
	<View style = {styles.item}>
		<Text style={styles.symbolText}>{symbolText}</Text>
	</View>
);

export default function App() {
	const { stock, updateStock } = displayStock()
	const renderItem = ({ item }) => (
		<Item symbolText={item.symbol} />
	);

	return (
		<SafeAreaView style={styles.container}>
			{stock && (
				<Fragment>
					<FlatList
						data = {stock}
						renderItem = {renderItem}
						keyExtractor = {item => item.displaySymbol}
						/>
					<Button
						onPress = {updateStock}
						title = "Show Me Some Other Stocks!"
						color = '#DB8E71'
						/>
				</Fragment>
			)}
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
		padding: 25,
	},
	symbolText: {
		textAlign: "center",
		fontSize: 15,
	},
	item: {
		backgroundColor: '#86C166',
		padding: 20,
		width : 300,
		marginVertical: 5,
		marginHorizontal: 0,
	},
})
