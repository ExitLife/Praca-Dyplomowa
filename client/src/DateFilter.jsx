import React, { useState, useMemo } from 'react';

// Nazwy dni tygodnia i miesięcy po polsku
const DAYS_SHORT = ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd'];
const MONTHS_PL = [
    'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
    'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'
];

// Pomocnicze funkcje do porównywania dat (bez godzin)
function isSameDay(d1, d2) {
    if (!d1 || !d2) return false;
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
}

function isInRange(day, start, end) {
    if (!start || !end) return false;
    const d = new Date(day.getFullYear(), day.getMonth(), day.getDate()).getTime();
    const s = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
    const e = new Date(end.getFullYear(), end.getMonth(), end.getDate()).getTime();
    return d >= Math.min(s, e) && d <= Math.max(s, e);
}

function DateFilter({ dateFrom, dateTo, onDateChange, eventDates }) {
    const today = new Date();
    const [viewMonth, setViewMonth] = useState(today.getMonth());
    const [viewYear, setViewYear] = useState(today.getFullYear());
    const [isOpen, setIsOpen] = useState(false);
    const [selectingEnd, setSelectingEnd] = useState(false);

    // Zbiór dat w których są wydarzenia (do podświetlania kropek)
    const eventDaySet = useMemo(() => {
        const set = new Set();
        if (eventDates) {
            eventDates.forEach(dateStr => {
                const d = new Date(dateStr);
                set.add(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`);
            });
        }
        return set;
    }, [eventDates]);

    // Generowanie dni w kalendarzu
    const calendarDays = useMemo(() => {
        const firstDay = new Date(viewYear, viewMonth, 1);
        // getDay() zwraca 0=niedziela, my chcemy 0=poniedziałek
        let startDay = firstDay.getDay() - 1;
        if (startDay < 0) startDay = 6;

        const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
        const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

        const days = [];

        // Dni z poprzedniego miesiąca
        for (let i = startDay - 1; i >= 0; i--) {
            days.push({
                date: new Date(viewYear, viewMonth - 1, daysInPrevMonth - i),
                isCurrentMonth: false
            });
        }

        // Dni bieżącego miesiąca
        for (let i = 1; i <= daysInMonth; i++) {
            days.push({
                date: new Date(viewYear, viewMonth, i),
                isCurrentMonth: true
            });
        }

        // Dni z następnego miesiąca (dopełnienie do pełnych tygodni)
        const remaining = 42 - days.length; // 6 tygodni * 7 dni
        for (let i = 1; i <= remaining; i++) {
            days.push({
                date: new Date(viewYear, viewMonth + 1, i),
                isCurrentMonth: false
            });
        }

        return days;
    }, [viewMonth, viewYear]);

    // Nawigacja między miesiącami
    function prevMonth() {
        if (viewMonth === 0) {
            setViewMonth(11);
            setViewYear(viewYear - 1);
        } else {
            setViewMonth(viewMonth - 1);
        }
    }

    function nextMonth() {
        if (viewMonth === 11) {
            setViewMonth(0);
            setViewYear(viewYear + 1);
        } else {
            setViewMonth(viewMonth + 1);
        }
    }

    // Kliknięcie na dzień
    function handleDayClick(day) {
        if (!selectingEnd) {
            // Pierwszy klik = ustawiamy datę "od"
            onDateChange(day.date, null);
            setSelectingEnd(true);
        } else {
            // Drugi klik = ustawiamy datę "do"
            let from = dateFrom;
            let to = day.date;
            // Upewnij się że from <= to
            if (from && to < from) {
                [from, to] = [to, from];
            }
            onDateChange(from, to);
            setSelectingEnd(false);
        }
    }

    // Szybkie filtry
    function setQuickFilter(type) {
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        switch (type) {
            case 'today': {
                onDateChange(startOfDay, startOfDay);
                setSelectingEnd(false);
                break;
            }
            case 'tomorrow': {
                const tomorrow = new Date(startOfDay);
                tomorrow.setDate(tomorrow.getDate() + 1);
                onDateChange(tomorrow, tomorrow);
                setSelectingEnd(false);
                break;
            }
            case 'weekend': {
                // Najbliższy piątek-niedziela
                const dayOfWeek = now.getDay(); // 0=nd, 6=so
                let daysToFriday = 5 - dayOfWeek;
                if (daysToFriday < 0) daysToFriday += 7;
                if (dayOfWeek === 0) daysToFriday = 5; // niedziela -> następny piątek
                // Jeśli dziś jest piątek, sobota lub niedziela, pokaż ten weekend
                const friday = new Date(startOfDay);
                if (dayOfWeek >= 5 || dayOfWeek === 0) {
                    // Już weekend lub niedziela
                    friday.setDate(friday.getDate() - ((dayOfWeek === 0 ? 7 : dayOfWeek) - 5));
                } else {
                    friday.setDate(friday.getDate() + daysToFriday);
                }
                const sunday = new Date(friday);
                sunday.setDate(sunday.getDate() + 2);
                onDateChange(friday, sunday);
                setSelectingEnd(false);
                break;
            }
            case 'week': {
                const endOfWeek = new Date(startOfDay);
                endOfWeek.setDate(endOfWeek.getDate() + 7);
                onDateChange(startOfDay, endOfWeek);
                setSelectingEnd(false);
                break;
            }
            case 'month': {
                const endOfMonth = new Date(startOfDay);
                endOfMonth.setDate(endOfMonth.getDate() + 30);
                onDateChange(startOfDay, endOfMonth);
                setSelectingEnd(false);
                break;
            }
            default:
                break;
        }
    }

    // Reset filtra dat
    function clearDates() {
        onDateChange(null, null);
        setSelectingEnd(false);
    }

    // Formatowanie wybranego zakresu do wyświetlenia
    function formatDateRange() {
        if (!dateFrom && !dateTo) return null;

        const opts = { day: 'numeric', month: 'short' };

        if (dateFrom && dateTo) {
            if (isSameDay(dateFrom, dateTo)) {
                return dateFrom.toLocaleDateString('pl-PL', { ...opts, year: 'numeric' });
            }
            return `${dateFrom.toLocaleDateString('pl-PL', opts)} — ${dateTo.toLocaleDateString('pl-PL', { ...opts, year: 'numeric' })}`;
        }

        if (dateFrom) {
            return `Od: ${dateFrom.toLocaleDateString('pl-PL', { ...opts, year: 'numeric' })}`;
        }

        return null;
    }

    const hasActiveFilter = dateFrom || dateTo;

    return (
        <div className="date-filter">
            {/* Przycisk otwierający kalendarz */}
            <button
                className={`date-filter-toggle ${hasActiveFilter ? 'active' : ''} ${isOpen ? 'open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <i className="fa-solid fa-calendar-days"></i>
                <span>
                    {hasActiveFilter ? formatDateRange() : 'Filtruj po dacie'}
                </span>
                {hasActiveFilter && (
                    <button
                        className="date-clear-inline"
                        onClick={(e) => { e.stopPropagation(); clearDates(); }}
                        title="Wyczyść filtr daty"
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                )}
                <i className={`fa-solid fa-chevron-${isOpen ? 'up' : 'down'} date-filter-arrow`}></i>
            </button>

            {/* Panel kalendarza */}
            {isOpen && (
                <div className="date-filter-panel fade-in">
                    {/* Szybkie filtry */}
                    <div className="quick-filters">
                        <button onClick={() => setQuickFilter('today')} className="quick-filter-btn">Dziś</button>
                        <button onClick={() => setQuickFilter('tomorrow')} className="quick-filter-btn">Jutro</button>
                        <button onClick={() => setQuickFilter('weekend')} className="quick-filter-btn">Weekend</button>
                        <button onClick={() => setQuickFilter('week')} className="quick-filter-btn">7 dni</button>
                        <button onClick={() => setQuickFilter('month')} className="quick-filter-btn">30 dni</button>
                    </div>

                    {/* Info o zaznaczaniu */}
                    {selectingEnd && dateFrom && (
                        <div className="date-hint">
                            <i className="fa-solid fa-info-circle"></i>
                            Kliknij drugą datę, aby wybrać zakres
                        </div>
                    )}

                    {/* Nawigacja miesiąca */}
                    <div className="calendar-nav">
                        <button onClick={prevMonth} className="cal-nav-btn">
                            <i className="fa-solid fa-chevron-left"></i>
                        </button>
                        <span className="cal-month-label">
                            {MONTHS_PL[viewMonth]} {viewYear}
                        </span>
                        <button onClick={nextMonth} className="cal-nav-btn">
                            <i className="fa-solid fa-chevron-right"></i>
                        </button>
                    </div>

                    {/* Nagłówki dni tygodnia */}
                    <div className="calendar-grid">
                        {DAYS_SHORT.map(day => (
                            <div key={day} className="cal-day-header">{day}</div>
                        ))}

                        {/* Dni kalendarza */}
                        {calendarDays.map(({ date, isCurrentMonth }, idx) => {
                            const isToday = isSameDay(date, today);
                            const isStart = isSameDay(date, dateFrom);
                            const isEnd = isSameDay(date, dateTo);
                            const inRange = dateFrom && dateTo && isInRange(date, dateFrom, dateTo);
                            const hasEvent = eventDaySet.has(`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`);
                            const isPast = date < new Date(today.getFullYear(), today.getMonth(), today.getDate());

                            let classes = 'cal-day';
                            if (!isCurrentMonth) classes += ' other-month';
                            if (isToday) classes += ' today';
                            if (isStart || isEnd) classes += ' selected';
                            if (inRange && !isStart && !isEnd) classes += ' in-range';
                            if (isPast && isCurrentMonth) classes += ' past';

                            return (
                                <button
                                    key={idx}
                                    className={classes}
                                    onClick={() => handleDayClick({ date })}
                                    disabled={!isCurrentMonth}
                                >
                                    {date.getDate()}
                                    {hasEvent && isCurrentMonth && (
                                        <span className="cal-event-dot"></span>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Legenda */}
                    <div className="calendar-legend">
                        <span className="legend-item">
                            <span className="legend-dot event"></span> Wydarzenie
                        </span>
                        <span className="legend-item">
                            <span className="legend-dot today"></span> Dziś
                        </span>
                    </div>

                    {/* Przycisk reset */}
                    {hasActiveFilter && (
                        <button onClick={clearDates} className="date-clear-btn">
                            <i className="fa-solid fa-rotate-left" style={{ marginRight: '6px' }}></i>
                            Wyczyść filtr daty
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

export default DateFilter;
