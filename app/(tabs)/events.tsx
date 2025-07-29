import { View, Text } from 'react-native';
import { ScrollView } from 'react-native';
import React from "react";

const minyanTimes = [
    { name: 'Shacharit', time: '7:30 AM' },
    { name: 'Mincha', time: '1:30 PM' },
    { name: 'Maariv', time: '8:45 PM'},
];

export default function MinyanTimes() {
    return (
        // <View>
        //     <Text>MinyanTimes</Text>
        // </View>
        <ScrollView className="p-4 bg-white">
            <Text className="text-2xl font-bold mt-10 text-center">Weekday Minyan Times</Text>
            {minyanTimes.map((minyan, idx) => (
                <View key={idx} className="flex-row items-center justify-between mb-4 p-4 rounded-2xl bg-white shadow">
                    <View className="flex-row items-center space-x-3">
                        {/*{minyan.icon}*/}
                        <Text className="text-lg font-semibold">{minyan.name}</Text>
                    </View>
                    <Text className="text-lg">{minyan.time}</Text>
                </View>
            ))}
            {/*<Text className="text-2xl font-bold mt-10 text-center mb-6">*/}
            {/*    Weekday Minyan Times*/}
            {/*</Text>*/}

            {/*{minyanTimes.map((minyan, idx) => (*/}
            {/*    <View*/}
            {/*        key={idx}*/}
            {/*        className="flex-row justify-between items-center p-4 mb-4 bg-white rounded-2xl shadow-lg"*/}
            {/*    >*/}
            {/*        <Text className="text-lg font-semibold">{minyan.name}</Text>*/}
            {/*        <Text className="text-lg">{minyan.time}</Text>*/}
            {/*    </View>*/}
            {/*))}*/}
        </ScrollView>

        // <ScrollView className="p-4 bg-primary">
        //     <Text className="text-2xl font-bold mt-10 text-center">Weekday Minyan Times</Text>
        //     {minyanTimes.map((minyan, idx) => (
        //         <View key={idx} className="flex-row items-center justify-between mb-4 p-4 rounded-2xl bg-white shadow">
        //             <View className="flex-row items-center space-x-3">
        //                 {/*{minyan.icon}*/}
        //                 <Text className="text-lg font-semibold">{minyan.name}</Text>
        //             </View>
        //             <Text className="text-lg">{minyan.time}</Text>
        //         </View>
        //     ))}
        // </ScrollView>
    );
}
