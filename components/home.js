import React, { useState, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions, Animated, PanResponder } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // <-- 1. IMPORTAR

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const demoMatches = [
  // ... (tus datos de demoMatches)
  { 
    id: '1', 
    name: 'Ana', 
    age: 25, 
    distance: '2 km', 
    bio: 'Me encanta viajar y probar nuevos restaurantes 🌍✈️',
    work: 'Diseñadora en Spotify',
    school: 'UNAM',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400' 
  },
  { 
    id: '2', 
    name: 'Carlos', 
    age: 28, 
    distance: '5 km', 
    bio: 'Fotógrafo profesional | Amante de los perros 🐕📷',
    work: 'Fotógrafo Freelance',
    school: 'Tec de Monterrey',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400' 
  },
  { 
    id: '3', 
    name: 'María', 
    age: 24, 
    distance: '1 km', 
    bio: 'Coffee addict ☕ | Yoga lover 🧘‍♀️',
    work: 'Marketing Manager',
    school: 'Universidad Panamericana',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400' 
  },
];

export default function TinderSwipeScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const position = useRef(new Animated.ValueXY()).current;
  const rotation = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp',
  });

  const likeOpacity = position.x.interpolate({
    inputRange: [0, SCREEN_WIDTH / 4],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const nopeOpacity = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 4, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > 120) {
          swipeRight();
        } else if (gesture.dx < -120) {
          swipeLeft();
        } else {
          resetPosition();
        }
      },
    })
  ).current;

  const swipeRight = () => {
    Animated.timing(position, {
      toValue: { x: SCREEN_WIDTH + 100, y: 0 },
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      nextCard();
    });
  };

  const swipeLeft = () => {
    Animated.timing(position, {
      toValue: { x: -SCREEN_WIDTH - 100, y: 0 },
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      nextCard();
    });
  };

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
    }).start();
  };

  const nextCard = () => {
    position.setValue({ x: 0, y: 0 });
    setCurrentIndex((currentIndex + 1) % demoMatches.length);
  };

  const handleUndo = () => {
    position.setValue({ x: 0, y: 0 });
    setCurrentIndex((currentIndex - 1 + demoMatches.length) % demoMatches.length);
  };

  const handleSuperLike = () => {
    Animated.timing(position, {
      toValue: { x: 0, y: -SCREEN_HEIGHT - 100 },
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      nextCard();
    });
  };

  const renderCard = (item, index) => {
    if (index !== currentIndex) {
      if (index === (currentIndex + 1) % demoMatches.length) {
        return (
          // --- ESTA ES LA TARJETA "SIGUIENTE" ---
          <Animated.View
            key={item.id}
            style={{
              position: 'absolute',
              width: SCREEN_WIDTH - 32,
              height: SCREEN_HEIGHT - 200,
              transform: [{ scale: 0.95 }],
              zIndex: 1, // <-- 2. AÑADIR zIndex 1
            }}
          >
            <View style={{
              flex: 1,
              borderRadius: 20,
              overflow: 'hidden',
              backgroundColor: '#f5f5f5',
            }}>
              <Image
                source={{ uri: item.image }}
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
              />
            </View>
          </Animated.View>
        );
      }
      return null;
    }

    const currentItem = demoMatches[currentIndex];

    // --- ESTA ES LA TARJETA "ACTUAL" (LA QUE SE SWIPEA) ---
    return (
      <Animated.View
        key={currentItem.id}
        style={{
          position: 'absolute',
          width: SCREEN_WIDTH - 32,
          height: SCREEN_HEIGHT - 200,
          transform: [
            { translateX: position.x },
            { translateY: position.y },
            { rotate: rotation },
          ],
          zIndex: 2, // <-- 3. AÑADIR zIndex 2
        }}
        {...panResponder.panHandlers}
      >
        <View style={{
          flex: 1,
          borderRadius: 20,
          overflow: 'hidden',
          backgroundColor: '#f5f5f5',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 5,
        }}>
          <Image
            source={{ uri: currentItem.image }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
          
          {/* NOPE Label */}
          <Animated.View
            style={{
              position: 'absolute',
              top: 50,
              left: 40,
              opacity: nopeOpacity,
              transform: [{ rotate: '30deg' }],
              borderWidth: 4,
              borderColor: '#ff006f',
              borderRadius: 10,
              padding: 10,
            }}
          >
            <Text style={{
              fontSize: 32,
              fontWeight: '800',
              color: '#ff006f',
            }}>NOPE</Text>
          </Animated.View>

          {/* LIKE Label */}
          <Animated.View
            style={{
              position: 'absolute',
              top: 50,
              right: 40,
              opacity: likeOpacity,
              transform: [{ rotate: '-30deg' }],
              borderWidth: 4,
              borderColor: '#00eda6',
              borderRadius: 10,
              padding: 10,
            }}
          >
            <Text style={{
              fontSize: 32,
              fontWeight: '800',
              color: '#00eda6',
            }}>LIKE</Text>
          </Animated.View>

          {/* Profile Info --> 4. REEMPLAZAR <View> CON <LinearGradient> */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,0.9)']}
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: 24,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <Text style={{
                fontSize: 34,
                fontWeight: '700',
                color: '#fff',
              }}>
                {currentItem.name}
              </Text>
              <Text style={{
                fontSize: 28,
                fontWeight: '400',
                color: '#fff',
                marginLeft: 8,
              }}>
                {currentItem.age}
              </Text>
            </View>
            
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
              <Text style={{ fontSize: 16, color: '#fff', opacity: 0.9 }}>📍 A {currentItem.distance} de distancia</Text>
            </View>

            <Text style={{
              fontSize: 16,
              color: '#fff',
              marginBottom: 8,
              lineHeight: 22,
            }}>
              {currentItem.bio}
            </Text>

            <View style={{ gap: 6 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 16, color: '#fff', opacity: 0.9 }}>💼 {currentItem.work}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 16, color: '#fff', opacity: 0.9 }}>🎓 {currentItem.school}</Text>
              </View>
            </View>
          </LinearGradient>
          
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={{
      flex: 1,
      backgroundColor: '#fff',
    }}>
      {/* Header */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 50,
        paddingBottom: 16,
      }}>
        <Image
          source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Tinder_Logomark_2020.svg/512px-Tinder_Logomark_2020.svg.png' }}
          style={{ width: 40, height: 40 }}
          resizeMode="contain"
        />
        <View style={{ flexDirection: 'row', gap: 16 }}>
          <View style={{ width: 40, height: 40, backgroundColor: '#f0f0f0', borderRadius: 20 }} />
          <View style={{ width: 40, height: 40, backgroundColor: '#f0f0f0', borderRadius: 20 }} />
          <View style={{ width: 40, height: 40, backgroundColor: '#f0f0f0', borderRadius: 20 }} />
        </View>
      </View>

      {/* Cards Container */}
      <View style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
      }}>
        {/* El mapeo simple funciona ahora porque el zIndex 
          controla el apilamiento, no el orden de renderizado.
        */}
        {demoMatches.map((item, index) => renderCard(item, index))}
      </View>

      {/* Action Buttons */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 40,
        gap: 16,
      }}>
        <TouchableOpacity
          onPress={handleUndo}
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: '#fff',
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <Text style={{ fontSize: 24, color: '#ffc629' }}>↺</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={swipeLeft}
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: '#fff',
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <Text style={{ fontSize: 32, color: '#ff006f' }}>✕</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSuperLike}
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: '#fff',
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <Text style={{ fontSize: 24, color: '#00d4ff' }}>★</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={swipeRight}
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: '#fff',
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <Text style={{ fontSize: 32, color: '#00eda6' }}>♥</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: '#fff',
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <Text style={{ fontSize: 24, color: '#9b59ff' }}>⚡</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}