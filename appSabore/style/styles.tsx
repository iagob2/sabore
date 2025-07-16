import { StyleSheet, Dimensions } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isSmallScreen = SCREEN_WIDTH < 400;
const isLargeScreen = SCREEN_WIDTH > 900;

export const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: isSmallScreen ? 6 : isLargeScreen ? 18 : 10,
        backgroundColor: '#F5F5F3',
    },
    logo: {
        color: '#650C0C',
        fontSize: isSmallScreen ? 14 : isLargeScreen ? 28 : 20,
    },
    buttons: {
        flexDirection: 'row',
    },
    button: {
        marginLeft: isSmallScreen ? 4 : 10,
        padding: isSmallScreen ? 6 : 10,
        backgroundColor: '#650C0C',
        borderRadius: 10,
    },
    buttonText: {
        color: '#F5F5F3',
        fontSize: isSmallScreen ? 12 : isLargeScreen ? 18 : 14,
    },
});

