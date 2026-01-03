import React, { useState } from 'react';
import EmployeeLayout from '../layouts/EmployeeLayout';
import { ClockInOut } from '../types/attendance';
import { useAuth0 } from '@auth0/auth0-react';

type ViewMode = 'month' | 'week' | 'day';

interface NoteModalProps {
  entry: ClockInOut | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: ClockInOut) => void;
}

const NoteModal: React.FC<NoteModalProps> = ({ entry, isOpen, onClose, onSave }) => {
  const [notes, setNotes] = useState(entry?.notes || '');

  React.useEffect(() => {
    setNotes(entry?.notes || '');
  }, [entry]);

  if (!isOpen || !entry) return null;

  const handleSave = () => {
    if (entry) {
      onSave({ ...entry, notes });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Clock In/Out Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
            <input
              type="text"
              value={`${entry.firstName} ${entry.lastName} (${entry.employeeId})`}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={entry.date}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Clock In</label>
              <input
                type="time"
                value={entry.clockInTime}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Clock Out</label>
              <input
                type="time"
                value={entry.clockOutTime || 'Active'}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Add notes about this clock in/out..."
            />
            <p className="text-xs text-gray-500 mt-1">You can add or edit notes for your clock entries</p>
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Save Notes
          </button>
        </div>
      </div>
    </div>
  );
};

const EmployeeCalendar: React.FC = () => {
  const { user } = useAuth0();
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEntry, setSelectedEntry] = useState<ClockInOut | null>(null);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);

  // Mock data for current employee's clock-in/out records
  const [clockInOutData, setClockInOutData] = useState<ClockInOut[]>([
    {
      id: '1',
      employeeId: 'EMP001',
      firstName: user?.name?.split(' ')[0] || 'John',
      lastName: user?.name?.split(' ')[1] || 'Doe',
      date: '2026-01-02',
      clockInTime: '09:15',
      clockOutTime: '17:30',
      notes: 'Regular workday'
    },
    {
      id: '2',
      employeeId: 'EMP001',
      firstName: user?.name?.split(' ')[0] || 'John',
      lastName: user?.name?.split(' ')[1] || 'Doe',
      date: '2026-01-03',
      clockInTime: '09:00',
      clockOutTime: '17:00',
      notes: ''
    },
    {
      id: '3',
      employeeId: 'EMP001',
      firstName: user?.name?.split(' ')[0] || 'John',
      lastName: user?.name?.split(' ')[1] || 'Doe',
      date: '2025-12-30',
      clockInTime: '08:45',
      clockOutTime: '16:45',
      notes: 'Left early for doctor appointment'
    },
    {
      id: '4',
      employeeId: 'EMP001',
      firstName: user?.name?.split(' ')[0] || 'John',
      lastName: user?.name?.split(' ')[1] || 'Doe',
      date: '2025-12-31',
      clockInTime: '09:00',
      clockOutTime: '17:00',
      notes: ''
    },
    {
      id: '5',
      employeeId: 'EMP001',
      firstName: user?.name?.split(' ')[0] || 'John',
      lastName: user?.name?.split(' ')[1] || 'Doe',
      date: '2026-01-01',
      clockInTime: '09:30',
      clockOutTime: '17:30',
      notes: 'New Year - partial holiday'
    },
  ]);

  const handleEntryClick = (entry: ClockInOut) => {
    setSelectedEntry(entry);
    setIsNoteModalOpen(true);
  };

  const handleSaveNotes = (updatedEntry: ClockInOut) => {
    setClockInOutData(data =>
      data.map(entry => entry.id === updatedEntry.id ? updatedEntry : entry)
    );
  };

  const getEntriesForDate = (date: string): ClockInOut[] => {
    return clockInOutData.filter(entry => entry.date === date);
  };

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getMonthDays = (): Date[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: Date[] = [];

    // Add previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push(new Date(year, month - 1, prevMonthLastDay - i));
    }

    // Add current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    // Add next month days to complete the grid
    const remainingDays = 42 - days.length; // 6 rows * 7 days
    for (let i = 1; i <= remainingDays; i++) {
      days.push(new Date(year, month + 1, i));
    }

    return days;
  };

  const getWeekDays = (): Date[] => {
    const days: Date[] = [];
    const startOfWeek = new Date(currentDate);
    const dayOfWeek = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek);

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(day.getDate() + i);
      days.push(day);
    }

    return days;
  };

  const navigatePrevious = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() - 1);
    }
    setCurrentDate(newDate);
  };

  const navigateNext = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setCurrentDate(newDate);
  };

  const navigateToday = () => {
    setCurrentDate(new Date());
  };

  const getDisplayTitle = (): string => {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];

    if (viewMode === 'month') {
      return `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    } else if (viewMode === 'week') {
      const weekDays = getWeekDays();
      const start = weekDays[0];
      const end = weekDays[6];
      return `${monthNames[start.getMonth()]} ${start.getDate()} - ${monthNames[end.getMonth()]} ${end.getDate()}, ${currentDate.getFullYear()}`;
    } else {
      return `${monthNames[currentDate.getMonth()]} ${currentDate.getDate()}, ${currentDate.getFullYear()}`;
    }
  };

  const renderMonthView = () => {
    const days = getMonthDays();
    const currentMonth = currentDate.getMonth();
    const today = formatDate(new Date());

    return (
      <div className="grid grid-cols-7 gap-1 flex-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center font-semibold text-gray-700 py-2 bg-gray-100 rounded-t-lg">
            {day}
          </div>
        ))}
        {days.map((day, index) => {
          const dateStr = formatDate(day);
          const entries = getEntriesForDate(dateStr);
          const isCurrentMonth = day.getMonth() === currentMonth;
          const isToday = dateStr === today;

          return (
            <div
              key={index}
              className={`min-h-24 border border-gray-200 p-2 ${
                !isCurrentMonth ? 'bg-gray-50' : 'bg-white'
              } ${isToday ? 'ring-2 ring-blue-500 bg-blue-50' : ''} transition-colors rounded-lg`}
            >
              <div className={`text-sm ${!isCurrentMonth ? 'text-gray-400' : 'text-gray-900'} font-medium mb-1`}>
                {day.getDate()}
              </div>
              <div className="space-y-1 overflow-y-auto max-h-20">
                {entries.map(entry => (
                  <div
                    key={entry.id}
                    onClick={() => handleEntryClick(entry)}
                    className="text-xs bg-green-100 hover:bg-green-200 border border-green-300 rounded px-2 py-1 cursor-pointer transition-colors"
                  >
                    <div className="font-medium flex items-center justify-between">
                      <span>Clock In/Out</span>
                      {entry.notes && (
                        <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      )}
                    </div>
                    <div className="text-gray-600">
                      {entry.clockInTime} - {entry.clockOutTime || 'Active'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderWeekView = () => {
    const days = getWeekDays();
    const today = formatDate(new Date());

    return (
      <div className="grid grid-cols-7 gap-2 flex-1">
        {days.map((day, index) => {
          const dateStr = formatDate(day);
          const entries = getEntriesForDate(dateStr);
          const isToday = dateStr === today;
          const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

          return (
            <div
              key={index}
              className={`border border-gray-200 rounded-lg p-3 ${
                isToday ? 'ring-2 ring-blue-500 bg-blue-50' : 'bg-white'
              } transition-colors`}
            >
              <div className="text-center mb-2">
                <div className="text-xs text-gray-500">{dayNames[day.getDay()]}</div>
                <div className="text-lg font-bold text-gray-900">{day.getDate()}</div>
              </div>
              <div className="space-y-2 overflow-y-auto max-h-96">
                {entries.map(entry => (
                  <div
                    key={entry.id}
                    onClick={() => handleEntryClick(entry)}
                    className="text-xs bg-green-100 hover:bg-green-200 border border-green-300 rounded p-2 cursor-pointer transition-colors"
                  >
                    <div className="font-semibold flex items-center justify-between">
                      <span>Attendance</span>
                      {entry.notes && (
                        <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      )}
                    </div>
                    <div className="text-gray-700 mt-1">In: {entry.clockInTime}</div>
                    <div className="text-gray-700">Out: {entry.clockOutTime || 'Active'}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderDayView = () => {
    const dateStr = formatDate(currentDate);
    const entries = getEntriesForDate(dateStr);

    return (
      <div className="flex-1 bg-white rounded-lg border border-gray-200 p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {currentDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </h3>
        </div>

        <div className="space-y-3">
          {entries.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-500">No clock-in/out entries for this day</p>
            </div>
          ) : (
            <>
              {entries.map(entry => (
                <div
                  key={entry.id}
                  onClick={() => handleEntryClick(entry)}
                  className="bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg p-4 cursor-pointer transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-gray-900 flex items-center">
                        Clock Entry
                        {entry.notes && (
                          <svg className="w-4 h-4 text-green-600 ml-2" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        )}
                      </h4>
                      <p className="text-sm text-gray-600">Employee: {entry.firstName} {entry.lastName}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm">
                        <span className="font-medium">Clock In:</span> {entry.clockInTime}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Clock Out:</span> {entry.clockOutTime || 'Still Active'}
                      </div>
                    </div>
                  </div>
                  {entry.notes && (
                    <div className="mt-3 text-sm text-gray-700 bg-white border border-green-200 rounded p-2">
                      <span className="font-medium">Notes:</span> {entry.notes}
                    </div>
                  )}
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <EmployeeLayout>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={navigatePrevious}
                className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
              >
                &lt;
              </button>
              <button
                onClick={navigateToday}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                Today
              </button>
              <button
                onClick={navigateNext}
                className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
              >
                &gt;
              </button>
              <h2 className="text-xl font-bold text-gray-900 ml-4">{getDisplayTitle()}</h2>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode('month')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  viewMode === 'month'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setViewMode('week')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  viewMode === 'week'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setViewMode('day')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  viewMode === 'day'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Day
              </button>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 flex items-start">
          <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <p className="text-sm text-blue-800">
            Click on any clock-in/out entry to view details and add notes. Entries with notes are marked with a note icon.
          </p>
        </div>

        {/* Calendar View */}
        <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 p-4 overflow-auto">
          {viewMode === 'month' && renderMonthView()}
          {viewMode === 'week' && renderWeekView()}
          {viewMode === 'day' && renderDayView()}
        </div>

        <NoteModal
          entry={selectedEntry}
          isOpen={isNoteModalOpen}
          onClose={() => setIsNoteModalOpen(false)}
          onSave={handleSaveNotes}
        />
      </div>
    </EmployeeLayout>
  );
};

export default EmployeeCalendar;
