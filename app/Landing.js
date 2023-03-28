import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import ContactCard from './ContactCard';

const Landing = () => {
  const contacts = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '123-456-7890',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '098-765-4321',
    },
  ];

  return (
    <PaperProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView>
          {contacts.map((contact) => (
            <ContactCard
              key={contact.id}
              name={contact.name}
              email={contact.email}
              phone={contact.phone}
            />
          ))}
        </ScrollView>
      </SafeAreaView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});

export default Landing;
