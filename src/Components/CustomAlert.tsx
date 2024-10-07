import React, { useEffect } from 'react';
import { Text, StyleSheet, Animated } from 'react-native';

type Props = {
    message: string;
    onDismiss: () => void;
};

const CustomAlert: React.FC<Props> = ({ message, onDismiss }) => {
    const opacity = new Animated.Value(1);

    useEffect(() => {
        Animated.timing(opacity, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
        }).start(() => {
            onDismiss();
        });
    }, [message, onDismiss]);

    return (
        <Animated.View style={[styles.alertContainer, { opacity }]}>
            <Text style={styles.alertText}>{message}</Text>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    alertContainer: {
        position: 'absolute',
        top: 50,
        left: 20,
        right: 20,
        padding: 18,
        backgroundColor: '#1a237e', 
        borderRadius: 25,
        alignItems: 'center',
        shadowColor: '#333333', 
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 5, 
        zIndex: 1,
    },
    alertText: {
        color: '#FFFFFF',
        fontSize: 17,
        fontWeight: 'bold',
    },
});

export default CustomAlert;
