import React, { useState } from 'react';
import { Trash2, Check, Pencil, X, Save } from 'lucide-react';
import { differenceInCalendarDays, format } from 'date-fns';

export default function TodoItem({ todo, toggleTodo, deleteTodo, updateTodo }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(todo.text);
    const [editPriority, setEditPriority] = useState(todo.priority);
    const [editTag, setEditTag] = useState(todo.tag);
    const [editDate, setEditDate] = useState(todo.date ? format(new Date(todo.date), 'yyyy-MM-dd') : '');

    const handleUpdate = () => {
        if (!editText.trim()) return;
        updateTodo(todo.id, editText, editPriority, editTag, editDate ? new Date(editDate) : null);
        setIsEditing(false);
    };

    const getDday = (date) => {
        if (!date) return null;
        const today = new Date();
        const target = new Date(date);
        // 날짜 차이 계산 (시간 제외)
        const diff = differenceInCalendarDays(target, today);

        let label = '';
        let type = 'safe';

        if (diff === 0) {
            label = 'D-Day';
            type = 'urgent';
        } else if (diff < 0) {
            label = `D+${Math.abs(diff)}`;
            type = 'urgent'; // 지각도 긴급
        } else {
            label = `D-${diff}`;
            if (diff <= 2) type = 'urgent';
            else if (diff <= 6) type = 'warning';
            else type = 'safe';
        }

        return { label, type };
    };

    const getPriorityLabel = (p) => {
        switch (p) {
            case 'high': return '높음';
            case 'low': return '낮음';
            default: return '보통';
        }
    };

    const dDayInfo = todo.date ? getDday(todo.date) : null;

    if (isEditing) {
        return (
            <div className="todo-item editing">
                <div className="edit-form">
                    <input
                        className="edit-input-text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        placeholder="할 일을 입력하세요"
                        autoFocus
                    />
                    <div className="edit-options">
                        <select
                            className="edit-input-select"
                            value={editPriority}
                            onChange={(e) => setEditPriority(e.target.value)}
                        >
                            <option value="high">높음</option>
                            <option value="medium">보통</option>
                            <option value="low">낮음</option>
                        </select>
                        <input
                            className="edit-input-text"
                            value={editTag}
                            onChange={(e) => setEditTag(e.target.value)}
                            placeholder="태그 (선택)"
                            style={{ width: '80px' }}
                        />
                        <input
                            type="date"
                            className="edit-input-date"
                            value={editDate}
                            onChange={(e) => setEditDate(e.target.value)}
                        />
                    </div>
                </div>
                <div className="edit-actions">
                    <button onClick={handleUpdate} className="action-btn save">
                        <Save size={18} />
                    </button>
                    <button onClick={() => setIsEditing(false)} className="action-btn cancel">
                        <X size={18} />
                    </button>
                </div>
            </div>
        );
    }

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
                        {dDayInfo && (
                            <span className={`badge dday ${dDayInfo.type}`}>
                                {dDayInfo.label}
                            </span>
                        )}
                        {todo.tag && <span className="badge tag">#{todo.tag}</span>}
                    </div>
                </div>
            </div>

            <div className="item-actions">
                <button
                    className="action-btn edit"
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsEditing(true);
                    }}
                >
                    <Pencil size={18} />
                </button>
                <button
                    className="action-btn delete"
                    onClick={(e) => {
                        e.stopPropagation();
                        deleteTodo(todo.id);
                    }}
                >
                    <Trash2 size={18} />
                </button>
            </div>
        </div>
    );
}
