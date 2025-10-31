import {View, ScrollView, Image, Text} from "react-native";
import React from "react";
import { icons } from "@/constants/icons";
import { Avatar, Button, Card } from 'react-native-paper';

// const LeftContent = (props: any) => <icons.arrow {...props} icon="folder" />

function LectureCard() {
    return(
        <View className={"flex-1 items-center justify-center"}>
        <Text>Title</Text>
        <Text>Description</Text>
        <Text>Date</Text>
        <Text>Time</Text>
        <Text>Venue</Text>
        <Text>Speaker</Text>
        <Text>Tags</Text>
        <Text>Link</Text>
        <Text>Link</Text>
    </View>
    )
}

const Events = () => {
    // @ts-ignore
    return(

        <ScrollView className = "flex-1 mt-10">
            <View className={"flex-1 items-center justify-center"}>
                <Image source={icons.event} className={"w-10 h-10 color-primary"}></Image>
                <Text>Events & Classes</Text>
                <Text className={"items-center justify-center"}>
                    Join our weekly classes and upcoming community events</Text>
            </View>
            <View className={"flex-1 items-left"}>
                <Text>Weekly Classes</Text>
            </View>
            <LectureCard/>
        {/*    <Card>*/}
        {/*        <Card.Title title="Card Title" subtitle="Card Subtitle"/>*/}
        {/*        <Card.Content>*/}
        {/*            /!*<Text variant="titleLarge">Card title</Text>*!/*/}
        {/*            /!*<Text variant="bodyMedium">Card content</Text>*!/*/}
        {/*        </Card.Content>*/}
        {/*        <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />*/}
        {/*        <Card.Actions>*/}
        {/*            <Button>Cancel</Button>*/}
        {/*            <Button>Ok</Button>*/}
        {/*        </Card.Actions>*/}
        {/*    </Card>*/}
        {/*    <Text>Events</Text>*/}
        </ScrollView>

    )
}

export default Events;