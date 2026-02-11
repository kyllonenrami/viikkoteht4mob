import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Todo } from './types/Todo';
import { TodoItem } from './components/Row';

const STORAGE_KEY = '@todos';

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      const storedTodos = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedTodos) {
        setTodos(JSON.parse(storedTodos));
      }
    } catch (error) {
      console.log('Virhe ladattaessa tehtäviä:', error);
    }
  };

  const saveTodos = async (newTodos: Todo[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newTodos));
      setTodos(newTodos);
    } catch (error) {
      console.log('Virhe tallennettaessa tehtäviä:', error);
    }
  };

  const addTodo = async () => {
    if (!inputText.trim()) return;

    const newTodo: Todo = {
      id: Date.now(),
      text: inputText,
      completed: 0,
    };

    const updatedTodos = [newTodo, ...todos];
    await saveTodos(updatedTodos);
    setInputText('');
  };

  const toggleTodo = async (id: number) => {
    const updatedTodos = todos.map(todo =>
      todo.id === id
        ? { ...todo, completed: todo.completed ? 0 : 1 }
        : todo
    );

    await saveTodos(updatedTodos);
  };

  const deleteTodo = async (id: number) => {
    const updatedTodos = todos.filter(todo => todo.id !== id);
    await saveTodos(updatedTodos);
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
          <TodoItem
            item={item}
            toggleTodo={() => toggleTodo(item.id)}
            deleteTodo={() => deleteTodo(item.id)}
          />
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
});
