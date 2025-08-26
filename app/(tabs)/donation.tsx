import {View, Text, StyleSheet} from "react-native";
import React from "react";
const Donation = () => {
    return(
        <View>
            <Text style={styles.headingText}>Donation</Text>
            <View style={styles.container}>
                <View style={[styles.card, styles.cardOne]}>
                    <Text>Red</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    headingText: {
        fontSize: 20,
        fontWeight: 'bold',
        // marginVertical: 10,
        paddingHorizontal: 10,
    },
    container: {},
    cardOne: {
        backgroundColor: '#EF5354',

    },
    card: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: 100,
        height: 100,
    borderRadius: 10,
        margin: 8,
    }
})

export default Donation;