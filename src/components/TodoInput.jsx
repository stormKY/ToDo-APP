import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { format } from 'date-fns';

export default function TodoInput({ addTodo, selectedDate }) {
    const [inputValue, setInputValue] = useState('');
    const [priority, setPriority] = useState('medium');
    const [tag, setTag] = useState('');
    const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));

    // Update date input when selectedDate changes in calendar
    useEffect(() => {
        setDate(format(selectedDate, 'yyyy-MM-dd'));
    }, [selectedDate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        addTodo({
            text: inputValue,
            priority,
            tag,
            date: new Date(date)
        });

        setInputValue('');
        setTag('');
        setPriority('medium');
        // Date stays as selected
    };

    return (
        <form className="input-group" onSubmit={handleSubmit}>
            <div className="input-wrapper">
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
            </div>

            <div className="input-row">
                <select
                    className="input-select"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                >
                    <option value="high">높음</option>
                    <option value="medium">보통</option>
                    <option value="low">낮음</option>
                </select>

                <input
                    type="text"
                    className="input-text"
                    placeholder="태그 (예: 공부)"
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                />

                <input
                    type="date"
                    className="input-date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
            </div>
        </form>
    );
}
