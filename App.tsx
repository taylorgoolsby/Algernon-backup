import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import SQLite from 'react-native-sqlite-storage';

SQLite.DEBUG(true);
SQLite.enablePromise(true);

const database_name = "Test.db";
const database_version = "1.0";
const database_displayname = "SQLite Test Database";
const database_size = 200000;

let db;

const App = () => {
  useEffect(() => {
    initializeDB();
  }, []);

  const initializeDB = async () => {
    try {
      db = await SQLite.openDatabase(
        database_name,
        database_version,
        database_displayname,
        database_size
      );
      await db.executeSql('CREATE TABLE IF NOT EXISTS Users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)');
      await db.executeSql('INSERT INTO Users (name) VALUES (?)', ['John Doe']);
      const results = await db.executeSql('SELECT * FROM Users');
      const rows = results[0].rows;
      for (let i = 0; i < rows.length; i++) {
        const user = rows.item(i);
        console.log(`User: ${user.name}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View>
      <Text>Check your console for database operations results.</Text>
    </View>
  );
};

export default App;
