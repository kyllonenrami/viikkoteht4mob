import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import * as SQLite from 'expo-sqlite';
import { Todo } from './types/Todo';
import { TodoItem } from './components/Row';

export default function App() {
  const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    const initDB = async () => {
      const database = await SQLite.openDatabaseAsync('todos.db');
      setDb(database);

      await database.execAsync(`
        CREATE TABLE IF NOT EXISTS todos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          text TEXT NOT NULL,
          completed INTEGER DEFAULT 0
        );
      `);

      loadTodos(database);
    };

    initDB();
  }, []);

  const loadTodos = async (database: SQLite.SQLiteDatabase) => {
    const result = await database.getAllAsync<Todo>('SELECT * FROM todos ORDER BY id DESC');
    setTodos(result);
  };

 
  const addTodo = async () => {
    if (!inputText.trim() || !db) return;

    await db.runAsync('INSERT INTO todos (text) VALUES (?)', inputText);
    setInputText('');
    loadTodos(db);
  };

  const toggleTodo = async (id: number, completed: number) => {
    if (!db) return;
    await db.runAsync('UPDATE todos SET completed = ? WHERE id = ?', completed ? 0 : 1, id);
    loadTodos(db);
  };

  // Delete todo
  const deleteTodo = async (id: number) => {
    if (!db) return;
    await db.runAsync('DELETE FROM todos WHERE id = ?', id);
    loadTodos(db);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tehtävä sovellus</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Lisää tehtävä..."
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={addTodo}
        />
        <TouchableOpacity style={styles.addButton} onPress={addTodo}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={todos}
        keyExtractor={(item) => item.id.toString()}
        style={styles.list}
        renderItem={({ item }) => (
          <TodoItem item={item} toggleTodo={toggleTodo} deleteTodo={deleteTodo} />
        )}
      />

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 10,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  list: {
    flex: 1,
  },
  todoItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  todoText: {
    flex: 1,
  },
  todoTextContent: {
    fontSize: 16,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});