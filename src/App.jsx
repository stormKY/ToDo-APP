import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { isSameDay } from 'date-fns';
import TodoInput from './components/TodoInput';
import TodoList from './components/TodoList';
import Calendar from './components/Calendar';
import './styles/App.css';

function App() {
  const [holidays, setHolidays] = useState(new Set());
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      return JSON.parse(savedTodos);
    }
    return [];
  });

  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const loadHolidays = async () => {
      try {
        const res = await fetch(import.meta.env.BASE_URL + 'holidays.ics');
        if (!res.ok) return;
        const text = await res.text();
        const set = new Set();

        for (const line of text.split(/\r?\n/)) {
          const m = line.match(/^DTSTART(?:;VALUE=DATE)?:([0-9]{8})/);
          if (m) {
            const y = m[1].slice(0, 4);
            const mo = m[1].slice(4, 6);
            const d = m[1].slice(6, 8);
            set.add(`${y}-${mo}-${d}`);
          }
        }

        setHolidays(set);
      } catch (error) {
        console.error('Failed to load holidays', error);
      }
    };

    loadHolidays();
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = ({ text, priority, tag, date }) => {
    const newTodo = {
      id: uuidv4(),
      text: text.trim(),
      completed: false,
      createdAt: Date.now(),
      date: date ? new Date(date) : selectedDate, // Use input date or fallback to selected
      priority: priority || 'medium',
      tag: tag || ''
    };
    setTodos([newTodo, ...todos]);
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // Filter todos by selected date
  const filteredTodos = todos.filter(todo => {
    const todoDate = todo.date ? new Date(todo.date) : new Date(todo.createdAt);
    return isSameDay(todoDate, selectedDate);
  });

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">할건하자</h1>
        <p className="app-subtitle">{selectedDate.toLocaleDateString('ko-KR', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
      </header>

      <Calendar
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        todos={todos}
        holidays={holidays}
      />

      <TodoInput addTodo={addTodo} selectedDate={selectedDate} />
      <TodoList
        todos={filteredTodos}
        toggleTodo={toggleTodo}
        deleteTodo={deleteTodo}
      />
    </div>
  );
}

export default App;
