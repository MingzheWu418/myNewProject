import React, { useState, useEffect, Fragment } from "react"
import { StyleSheet, View, Text, TouchableNativeFeedback, SafeAreaView, FlatList, Alert, Button, Redirect } from "react-native"
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Chart from "react-google-charts";


function displayStock() {
	const [stock, setStock] = useState(null);
  const indexArray = [];
  indexArray.length = 10;

	useEffect(() => {
		updateStock();
	}, []);

	function updateStock() {
		fetch('https://finnhub.io/api/v1/stock/symbol?exchange=US&token=btnth1n48v6p0j27i8k0')
			.then((response) => response.json())
			.then((data) => {
        for(var i = 0; i < 10; i++){
				      const randomIndex = Math.floor(Math.random() * data.length);
              indexArray[i] = data[randomIndex];
        }
        setStock(indexArray);
			})
	};

	return { stock, updateStock };
}


function HomeScreen({ navigation }) {
	const { stock, updateStock } = displayStock();
	const renderItem = ({ item }) => (
		<TouchableNativeFeedback
				onPress={() => { navigation.navigate('Details', {
            symbol: item.symbol,
          });
				}}
        background={TouchableNativeFeedback.SelectableBackground()}>
      <View style={{width: 300, height: 50, marginVertical : 5, backgroundColor: '#86C166'}}>
        <Text style={styles.symbolText}>{item.symbol}</Text>
      </View>
    </TouchableNativeFeedback>

	);

	return (
		<SafeAreaView style={styles.container}>
			{
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
			}
		</SafeAreaView>
	);
}

function DetailsScreen({ route, navigation }) {
	const {symbol} = route.params;
	var myUrl = "https://finnhub.io/api/v1/stock/candle?symbol="+ symbol +"&resolution=1&from=1572651390&to=1572910590&token=btnth1n48v6p0j27i8k0";
	var [info, setInfo] = useState(null);
	fetch(myUrl)
		.then(response => response.json())
		.then(data => {
			setInfo(data);
		})
		.catch((error) => {
      console.error(error);
    });
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Symbol : {JSON.stringify(symbol)}</Text>

    </View>
  );
}

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
					name="Home"
					component={ HomeScreen}
					options={{ title: 'Overview' }}
				/>
        <Stack.Screen
					name="Details"
					component={ DetailsScreen }
				/>
      </Stack.Navigator>
    </NavigationContainer>
  );
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
		marginVertical : 12,
		textAlign: "center",
		fontSize: 21,
	},
});


export default App;
