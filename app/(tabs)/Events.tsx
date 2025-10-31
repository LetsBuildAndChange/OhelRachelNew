import {View, ScrollView, Image} from "react-native";
import React from "react";
import { icons } from "@/constants/icons";
import { Avatar, Button, Card, Text } from 'react-native-paper';

// const LeftContent = (props: any) => <icons.arrow {...props} icon="folder" />

const lectureCard = (props: any) => (
    <View>
        <Image source={icons.event}></Image>
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

const Events = () => {
    // @ts-ignore
    return(

        <ScrollView className = "flex-1 mt-4">
            {/*<lectureCard/>*/}
            <Card>
                <Card.Title title="Card Title" subtitle="Card Subtitle"/>
                <Card.Content>
                    <Text variant="titleLarge">Card title</Text>
                    <Text variant="bodyMedium">Card content</Text>
                </Card.Content>
                <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
                <Card.Actions>
                    <Button>Cancel</Button>
                    <Button>Ok</Button>
                </Card.Actions>
            </Card>
            <Text>Events</Text>
        </ScrollView>
    )
}

export default Events;