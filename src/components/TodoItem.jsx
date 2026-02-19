import React from 'react';
import { Trash2, Check } from 'lucide-react';

export default function TodoItem({ todo, toggleTodo, deleteTodo }) {
    return (
        <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
            <div className="todo-content" onClick={() => toggleTodo(todo.id)}>
                <div className="checkbox">
                    {todo.completed && <Check size={14} strokeWidth={3} />}
                </div>
                <span className="todo-text">{todo.text}</span>
            </div>
            <button
                className="delete-btn"
                onClick={(e) => {
                    e.stopPropagation();
                    deleteTodo(todo.id);
                }}
                aria-label="Delete todo"
            >
                <Trash2 size={18} />
            </button>
        </div>
    );
}
