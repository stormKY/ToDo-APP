import React from 'react';
import TodoItem from './TodoItem';

export default function TodoList({ todos, toggleTodo, deleteTodo }) {
    if (todos.length === 0) {
        return (
            <div className="empty-state">
                <p>할 일이 없습니다. 새로운 목표를 추가해보세요!</p>
            </div>
        );
    }

    return (
        <div className="todo-list">
            {todos.map(todo => (
                <TodoItem
                    key={todo.id}
                    todo={todo}
                    toggleTodo={toggleTodo}
                    deleteTodo={deleteTodo}
                />
            ))}
        </div>
    );
}
