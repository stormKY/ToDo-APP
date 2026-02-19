import React, { useState } from 'react';
import { Plus } from 'lucide-react';

export default function TodoInput({ addTodo }) {
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        addTodo(inputValue);
        setInputValue('');
    };

    return (
        <form className="input-wrapper" onSubmit={handleSubmit}>
            <input
                type="text"
                className="todo-input"
                placeholder="할 일을 입력하세요..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                autoFocus
            />
            <button type="submit" className="add-btn" aria-label="Add task">
                <Plus size={20} />
            </button>
        </form>
    );
}
