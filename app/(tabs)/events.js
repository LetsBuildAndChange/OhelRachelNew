import React, { useEffect, useState } from "react";
import { FlatList, Text, View } from 'react-native';
import {db} from "./Firebase";
import { collection, onSnapshot } from "firebase/firestore"

const weekdayTimes = [
    {id:"local-1", name: 'Selichot#1', time: '5:00 AM' },
    {id:"local-2", name: 'Shacharit', time: '7:30 AM' },
    {id:"local-3", name: 'Shacharit', time: '7:30 AM' },
    {id:"local-4", name: "Selichot#2", time: "5:00 PM"},
    {id:"local-5", name: 'Mincha/Arvit', time: '5:45 PM' },
    // { name: 'Maariv', time: '8:45 PM'},
];

export default function MinyanTimes() {
    const [minyanTimes, setMinyanTimes] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        setLoading(true);
        const UserQuery = collection(db, "PrayerName");
        
        onSnapshot(UserQuery, (snapshot)=> {
            let userList = [];
            snapshot.docs.map((doc) => {
                 userList.push({...doc.data(), id: doc.id}, [])})
                setMinyanTimes(userList);
                setLoading(false);
            
        })
    }, [])

    // Add a new document in collection "cities"
   // const addData1 = asnyc () => {await setDoc(doc(db, "cities", "LA"), {
   //     name: "Los Angeles",
   //     state: "CA",
   //     country: "USA"
   // })}

// Add a new document with a generated id.
    // const addData = async () => await addDoc(collection(db, "PrayerName"), {
    //     PrayerName: "Afternoon Prayers",
    //     Time: "10:00 AM"
    // })
    //     .then(() => {
    //         console.log("Document successfully written!");
    //     })
    //     .catch((error) => {
    //         console.error("Error writing document: ", error);
    //     });
    console.log(MinyanTimes);
    const renderItem = ({item}) => (

        <View className="flex-row items-center justify-between mb-4 p-4 rounded-xl bg-light-200 shadow">
            <Text>
                {item.Time}
            </Text>

            <Text clsssName="text-lg">{item.Time}
            </Text>
        </View>

    )
    return (

        <View className="p-4 bg-gray-100">
            <Text className="text-2xl font-bold mt-3 text-center">Weekday Minyan Times</Text>
            <FlatList data={minyanTimes}
                      renderItem={renderItem}
                      keyExtractor={item => item.id}
                      />
        </View>
    );
}



















    {/*// <ScrollView className="p-4 bg-gray-100">*/}
    {/*//     <Text className="text-2xl font-bold mt-3 text-center">Weekday Minyan Times</Text>*/}
    {/*//*/}
    {/*//     <View>*/}
    {/*//         {weekdayTimes.map((minyan, idx) => (*/}
    {/*//             <View key={idx}*!/*/}
    {/*//                   className="flex-row items-center justify-between mb-4 p-4 rounded-xl bg-light-200 shadow">*/}
    {/*//                 <View className="flex-row items-center space-x-3">*/}
    {/*//                     <Text className="text-lg font-semibold">{minyan.name}</Text>*/}
    {/*//                 </View>*/}
    {/*//                 <Text className="text-lg">{minyan.time}</Text>*/}
    {/*//*/}
    {/*//             </View>*/}
    {/*    //     ))}*/}
    {/*    // </View>*/}
    {/*// </ScrollView>*/}


    // <View>
    //     <Text>MinyanTimes</Text>
    // <ScrollView className="p-4">
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
    //     </ScrollView>
    // </View>
    // <SafeAreaView className="flex-1">
    //     <ScrollView className="pt-8 bg-blue-50">
    //         <Text className="text-2xl font-bold text-center mt-4 mb-6">
    //             Weekday Minyan Times
    //         </Text>
    //
    //         {minyanTimes.map((minyan, idx) => (
    //             <View
    //                 key={idx}
    //                 className="
    //       bg-white
    //       mx-4
    //       py-4 px-6
    //       mb-4
    //       rounded-full
    //       border border-gray-200
    //       shadow
    //       elevation-2
    //     "
    //             >
    //                 <View className="flex-row justify-between items-center">
    //                     <Text className="text-lg font-semibold">{minyan.name}</Text>
    //                     <Text className="text-lg">{minyan.time}</Text>
    //                 </View>
    //             </View>
    //         ))}
    //     </ScrollView>
    // </SafeAreaView>

//     <ScrollView className="p-4 bg-gray-100">
//         <Text className="text-2xl font-bold mt-3 text-center">Weekday Minyan Times</Text>
//
//         <View>
//             {weekdayTimes.map((minyan, idx) => (
//                 <View key={idx}
//                       className="flex-row items-center justify-between mb-4 p-4 rounded-xl bg-light-200 shadow">
//                     <View className="flex-row items-center space-x-3">
//                         <Text className="text-lg font-semibold">{minyan.name}</Text>
//                     </View>
//                     <Text className="text-lg">{minyan.time}</Text>*
//
//                 </View>
//             ))}
//         </View>
//     </ScrollView>
//


