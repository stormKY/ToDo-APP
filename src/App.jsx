import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { isAfter, isSameDay } from 'date-fns';
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

  const updateTodo = (id, newText, newPriority, newTag, newDate) => {
    setTodos(todos.map(todo =>
      todo.id === id ? {
        ...todo,
        text: newText,
        priority: newPriority,
        tag: newTag,
        date: newDate
      } : todo
    ));
  };

  // Filter and sort todos
  const filteredTodos = todos
    .filter(todo => {
      const todoDate = todo.date ? new Date(todo.date) : new Date(todo.createdAt);

      if (selectedDate) {
        const target = new Date(selectedDate);
        target.setHours(0, 0, 0, 0);

        // 1. D-Day(마감일)가 있는 경우
        if (todo.date) {
          const dDay = new Date(todo.date);
          dDay.setHours(0, 0, 0, 0);

          // 생성일(시작일) 체크
          const created = new Date(todo.createdAt);
          created.setHours(0, 0, 0, 0);

          // 미완료 항목: 생성일 <= 선택된 날짜 <= 마감일
          if (!todo.completed) {
            return target >= created && target <= dDay;
          }

          // 완료된 항목: 해당 날짜(마감일)에만 보임 (기존 유지)
          return target.getTime() === dDay.getTime();
        }

        // 2. 마감일이 없는 경우
        // 미완료: 항상 보임 (매일매일 해야 할 일)
        if (!todo.completed) return true;

        // 완료: 생성일(혹은 추후 완료일)에만 보임
        const created = new Date(todo.createdAt);
        created.setHours(0, 0, 0, 0);
        return target.getTime() === created.getTime();
      }
      return true;
    })
    .sort((a, b) => {
      // 1. 완료 여부 (미완료가 위로)
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }

      // 2. 둘 다 미완료인 경우: 마감일 존재 여부 (마감일 있는 것이 위로)
      if (!a.completed) {
        if (a.date && !b.date) return -1;
        if (!a.date && b.date) return 1;

        // 3. 둘 다 마감일이 있는 경우: 마감일 임박순 (오름차순)
        if (a.date && b.date) {
          return new Date(a.date) - new Date(b.date);
        }
      }

      // 4. 그 외 (둘 다 마감일 없거나, 완료된 항목끼리): 최신순 또는 기본 유지
      return b.id - a.id; // ID 기준 내림차순 (최신순) - ID가 createdAt 기반이 아니라면 createdAt 비교 필요
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

      <TodoList
        todos={filteredTodos}
        toggleTodo={toggleTodo}
        deleteTodo={deleteTodo}
        updateTodo={updateTodo}
      />

      <TodoInput addTodo={addTodo} selectedDate={selectedDate} />
    </div>
  );
}

export default App;
