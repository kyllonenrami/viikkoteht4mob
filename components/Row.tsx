import { TouchableOpacity, StyleSheet, View, Text } from "react-native";
import { Todo } from "../types/Todo";

interface TodoItemProps {
  item: Todo;
  toggleTodo: (id: number, completed: number) => Promise<void>;
  deleteTodo: (id: number) => Promise<void>;
}

export function TodoItem({ item, toggleTodo, deleteTodo }: TodoItemProps) {
  return <View style={styles.todoItem}>
    <TouchableOpacity
      style={styles.todoText}
      onPress={() => toggleTodo(item.id, item.completed)}
    >
      <Text style={[
        styles.todoTextContent,
        item.completed ? styles.completedText : null
      ]}>
        {item.text}
      </Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={styles.deleteButton}
      onPress={() => deleteTodo(item.id)}
    >
      <Text style={styles.deleteButtonText}>Delete</Text>
    </TouchableOpacity>
  </View>;
}

const styles = StyleSheet.create({
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