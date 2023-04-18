import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  Image,
  TouchableOpacity,
} from "react-native";
import * as Contacts from "expo-contacts";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ListItem = React.memo(({ item, addContact, isSelected }) => (
  <TouchableOpacity
    activeOpacity={1}
    style={[
      styles.listItem,
      isSelected ? styles.listItemSelected : styles.listItemDefault,
    ]}
    onPress={() => addContact(item)}
  >
    <View style={styles.listItemContent}>
      <Text style={styles.listItemText}>{item.name}</Text>
    </View>
    <View style={styles.addButton}>
      <Text style={styles.addButtonText}>{isSelected ? "Remove" : "Add"}</Text>
    </View>
  </TouchableOpacity>
));

export default function InvitePeople() {
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();


  const addContact = useCallback((contact) => {
    setSelectedContacts((prev) => {
      const index = prev.findIndex((c) => c.id === contact.id);
      if (index !== -1) {
        return prev.filter((c) => c.id !== contact.id);
      } else {
        return [...prev, contact];
      }
    });
  }, []);

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

  const handleSaveContacts = () => {
    navigation.navigate("CreateDestination", { selectedContacts });
  };

  const renderItem = useCallback(
    ({ item }) => {
      const isSelected =
        selectedContacts.findIndex((c) => c.id === item.id) !== -1;
      return (
        <ListItem item={item} isSelected={isSelected} addContact={addContact} />
      );
    },
    [selectedContacts, addContact]
  );
  const renderFloatingNav = () => {
    const numSelected = selectedContacts.length;
    return (
      <View style={styles.floatingNav}>
        <Text style={styles.numSelected}>{numSelected} selected</Text>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSaveContacts}
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      <View style={styles.searchBarContainer}>
        <Image
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/482/482631.png",
          }}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor="gray"
          onChangeText={searchFilterFunction}
          value={search}
          autoFocus={true}
        />
      </View>
      <FlatList
        data={filteredContacts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        windowSize={10} // Increase or decrease this value based on your device's performance
        maxToRenderPerBatch={10} // Increase or decrease this value based on your device's performance
        removeClippedSubviews={true}
      />
      {selectedContacts.length > 0 && renderFloatingNav()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    // marginBottom: 12,
    // borderRadius: 8,
  },
  listItemDefault: {
    backgroundColor: "#343434",
  },
  listItemSelected: {
    backgroundColor: "#4b9eda",
  },
  listItemContent: {
    flex: 1,
  },
  listItemText: {
    fontSize: 18,
    color: "#fff",
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
  addButton: {
    backgroundColor: "transparent",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  floatingNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#4b9eda",
    padding: 16,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  numSelected: {
    fontSize: 16,
    color: "#fff",
  },
  saveButton: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  saveButtonText: {
    color: "#4b9eda",
    fontSize: 16,
    fontWeight: "bold",
  },
  selectedContact: {
    fontSize: 16,
    color: "#fff",
    margin: 4,
  },
});
