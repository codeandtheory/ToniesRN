import { Text, View, Image, StyleSheet } from 'react-native'
import React, { Component } from 'react'

export default class RubieIntro extends Component {
  render() {
    return (
      <View style={{ position: 'relative' }}>
        <Image 
          source={require('@/assets/images/rubie.png')} 
          style={styles.imageRubie}
        />
        <Image 
          source={require('@/assets/images/speech_bubble.png')} 
          style={styles.imageSpeechBubble}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  imageRubie: {
    position: 'relative',
    width: 200, height: 200
  },
  imageSpeechBubble: {
    position: 'absolute',
    top: -20,
    right: -20,
    width: 100,
    height: 80,
    zIndex: 1
  }
});