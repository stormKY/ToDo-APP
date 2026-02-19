import React from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { ko } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Calendar({ selectedDate, setSelectedDate, todos, holidays }) {
    const [currentMonth, setCurrentMonth] = React.useState(new Date());

    const onPrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
    const onNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const calendarDays = eachDayOfInterval({
        start: startDate,
        end: endDate,
    });

    const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

    const getTodoStatus = (date) => {
        const todosForDate = todos.filter(todo => {
            const todoDate = todo.date ? new Date(todo.date) : new Date(todo.createdAt);
            return isSameDay(todoDate, date);
        });

        if (todosForDate.length === 0) {
            return 'none';
        }

        const hasIncomplete = todosForDate.some(todo => !todo.completed);
        return hasIncomplete ? 'incomplete' : 'complete';
    };

    return (
        <div className="calendar-container">
            <div className="calendar-header">
                <button onClick={onPrevMonth} className="nav-btn">
                    <ChevronLeft size={20} />
                </button>
                <span className="current-month">
                    {format(currentMonth, 'yyyy년 M월', { locale: ko })}
                </span>
                <button onClick={onNextMonth} className="nav-btn">
                    <ChevronRight size={20} />
                </button>
            </div>

            <div className="calendar-grid">
                {weekDays.map(day => (
                    <div key={day} className="week-day">{day}</div>
                ))}

                {calendarDays.map((day, idx) => {
                    const todoStatus = getTodoStatus(day);
                    const isSunday = day.getDay() === 0;
                    const isSaturday = day.getDay() === 6;
                    const isHoliday = holidays?.has(format(day, 'yyyy-MM-dd'));

                    return (
                    <div
                        key={day.toString()}
                        className={`
              calendar-day 
              ${!isSameMonth(day, monthStart) ? 'disabled' : ''} 
              ${isSameDay(day, selectedDate) ? 'selected' : ''}
              ${isSameDay(day, new Date()) ? 'today' : ''}
              ${todoStatus === 'complete' ? 'status-complete' : ''}
              ${todoStatus === 'incomplete' ? 'status-incomplete' : ''}
              ${isHoliday ? 'holiday' : ''}
              ${!isHoliday && isSunday ? 'sunday' : ''}
              ${!isHoliday && isSaturday ? 'saturday' : ''}
            `}
                        onClick={() => setSelectedDate(day)}
                    >
                        <span className="day-number">{format(day, 'd')}</span>
                    </div>
                    );
                })}
            </div>
        </div>
    );
}
