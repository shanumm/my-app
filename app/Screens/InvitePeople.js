import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  Image,
} from "react-native";
import * as Contacts from "expo-contacts";

import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function InvitePeople() {
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredContacts, setFilteredContacts] = useState([]);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === "granted") {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.Name],
        });

        if (data.length > 0) {
          const nonNullContacts = data.filter(
            (contact) => contact.name !== "null null"
          );
          setContacts(nonNullContacts);
          setFilteredContacts(nonNullContacts);
        }
      }
    })();
  }, []);

  const searchFilterFunction = (text) => {
    if (text) {
      const newData = contacts.filter((item) => {
        const itemData = `${item.name.toUpperCase()}`;
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredContacts(newData);
      setSearch(text);
    } else {
      setFilteredContacts(contacts);
      setSearch(text);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.listItem}>
      <Text style={styles.listItemText}>{item.name}</Text>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor="gray"
          //   onChangeText={handleInputChange}
          //   value={inputValue}
          autoFocus={true}
        />
        <Image
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/482/482631.png",
          }}
          style={styles.searchIcon}
        />
      </View>
      <FlatList
        data={filteredContacts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  listItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  listItemText: {
    fontSize: 18,
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    padding: 8,
    backgroundColor: "transparent",
    fontSize: 16,
  },
  searchIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  searchContainer: {
    flex: 1,
  },
});
