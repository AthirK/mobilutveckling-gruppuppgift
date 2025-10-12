import React from "react";
import { Dimensions, FlatList, Image, StyleSheet, TouchableOpacity, View } from "react-native";

const IMAGE_SIZE = Dimensions.get("window").width / 3;

export default function Gallery() {
  const images = [
    require("../../assets/images/placeholder.jpg"),
    require("../../assets/images/placeholder.png"),
    require("../../assets/images/grass4.jpg"),
    require("../../assets/images/placeholder.jpg"),
    require("../../assets/images/placeholder.png"),
    require("../../assets/images/grass4.jpg"),
    require("../../assets/images/placeholder.jpg"),
    require("../../assets/images/placeholder.png"),
    require("../../assets/images/grass4.jpg"),
    require("../../assets/images/placeholder.jpg"),
    require("../../assets/images/placeholder.png"),
    require("../../assets/images/grass4.jpg"),
    require("../../assets/images/placeholder.jpg"),
    require("../../assets/images/placeholder.png"),
    require("../../assets/images/grass4.jpg"),
    require("../../assets/images/placeholder.jpg"),
    require("../../assets/images/placeholder.png"),
    require("../../assets/images/grass4.jpg"),
    require("../../assets/images/placeholder.jpg"),
    require("../../assets/images/placeholder.png"),
    require("../../assets/images/grass4.jpg"),
    require("../../assets/images/placeholder.jpg"),
    require("../../assets/images/placeholder.png"),
    require("../../assets/images/grass4.jpg"),
    require("../../assets/images/placeholder.jpg"),
    require("../../assets/images/placeholder.png"),
    require("../../assets/images/grass4.jpg"),
    require("../../assets/images/placeholder.jpg"),
    require("../../assets/images/placeholder.png"),
    require("../../assets/images/grass4.jpg"),
    require("../../assets/images/placeholder.jpg"),
    require("../../assets/images/placeholder.png"),
    require("../../assets/images/grass4.jpg"),
    require("../../assets/images/placeholder.jpg"),
    require("../../assets/images/placeholder.png"),
    require("../../assets/images/grass4.jpg"),
  ];

  const handlePress = (image: any) => {
    console.log("Image source:", image);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <FlatList
        data={images}
        keyExtractor={(_, idx) => idx.toString()}
        numColumns={3}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handlePress(item)} style={styles.imageContainer}>
            <Image source={item} style={styles.image} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    padding: 2,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
});