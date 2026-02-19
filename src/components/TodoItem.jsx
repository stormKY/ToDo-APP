import React from 'react';
import { Trash2, Check } from 'lucide-react';
import { differenceInCalendarDays } from 'date-fns';

export default function TodoItem({ todo, toggleTodo, deleteTodo }) {
    const getDday = (date) => {
        if (!date) return '';
        const today = new Date();
        const target = new Date(date);
        const diff = differenceInCalendarDays(target, today);

        if (diff === 0) return 'D-Day';
        if (diff > 0) return `D-${diff}`;
        return `D+${Math.abs(diff)}`;
    };

    const getPriorityLabel = (p) => {
        switch (p) {
            case 'high': return '높음';
            case 'low': return '낮음';
            default: return '보통';
        }
    };

    const dDay = todo.date ? getDday(todo.date) : '';

    return (
        <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
            <div className="todo-content" onClick={() => toggleTodo(todo.id)}>
                <div className="checkbox">
                    {todo.completed && <Check size={14} strokeWidth={3} />}
                </div>

                <div className="todo-info">
                    <span className="todo-text">{todo.text}</span>
                    <div className="badges">
                        {todo.priority && (
                            <span className={`badge ${todo.priority}`}>
                                {getPriorityLabel(todo.priority)}
                            </span>
                        )}
                        {dDay && <span className="badge dday">{dDay}</span>}
                        {todo.tag && <span className="badge tag">#{todo.tag}</span>}
                    </div>
                </div>
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
