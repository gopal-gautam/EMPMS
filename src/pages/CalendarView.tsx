import React, { useState, useEffect, useRef } from 'react';
import { LayoutWithSidebarTopbar } from '../layouts/LayoutWithSidebarTopbar';
import { ClockInOut } from '../types/attendance';
import { getEmployees } from '../api/employees';
import { getClockInOuts, createClockInOut, updateClockInOut, deleteClockInOut } from '../api/clock-in-outs';
import type { Employee } from '../types/employee';

type ViewMode = 'month' | 'week' | 'day';

interface DetailModalProps {
  entry: ClockInOut | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: ClockInOut) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const DetailModal: React.FC<DetailModalProps> = ({ entry, isOpen, onClose, onSave, onDelete }) => {
  const [editedEntry, setEditedEntry] = useState<ClockInOut | null>(entry);

  React.useEffect(() => {
    setEditedEntry(entry);
  }, [entry]);

  if (!isOpen || !editedEntry) return null;

  const handleSave = async () => {
    if (editedEntry) {
      await onSave(editedEntry);
      onClose();
    }
  };

  const handleDelete = async () => {
    if (editedEntry && window.confirm('Are you sure you want to delete this entry?')) {
      await onDelete(editedEntry.id);
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
              value={`${editedEntry.firstName} ${editedEntry.lastName} (${editedEntry.employeeId})`}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={editedEntry.date}
              onChange={(e) => setEditedEntry({ ...editedEntry, date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Clock In</label>
              <input
                type="time"
                value={editedEntry.clockInTime}
                onChange={(e) => setEditedEntry({ ...editedEntry, clockInTime: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Clock Out</label>
              <input
                type="time"
                value={editedEntry.clockOutTime || ''}
                onChange={(e) => setEditedEntry({ ...editedEntry, clockOutTime: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              value={editedEntry.notes || ''}
              onChange={(e) => setEditedEntry({ ...editedEntry, notes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Add notes here..."
            />
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
          <div className="flex space-x-2">
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
              Save Changes
            </button>
          </div>
        </div>
      </div>
            </div>
  );
};

interface AddEntryModalProps {
  date: string;
  isOpen: boolean;
  onClose: () => void;
  onAdd: (entry: Omit<ClockInOut, 'id'>) => Promise<void>;
}

const AddEntryModal: React.FC<AddEntryModalProps> = ({ date, isOpen, onClose, onAdd }) => {
  const [newEntry, setNewEntry] = useState<Omit<ClockInOut, 'id'>>({
    employeeId: '',
    firstName: '',
    lastName: '',
    date: date,
    clockInTime: '09:00',
    clockOutTime: '17:00',
    notes: ''
  });

  React.useEffect(() => {
    setNewEntry(prev => ({ ...prev, date }));
  }, [date]);

  // Suggestions for employee lookup
  const [suggestions, setSuggestions] = useState<Employee[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const debounceRef = useRef<number | null>(null);

  // Fetch limited employee fields and filter client-side when employeeId changes
  useEffect(() => {
    if (!isOpen) {
      setSuggestions([]);
      return;
    }
    const q = (newEntry.employeeId || '').trim();
    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
    }
    if (q.length === 0) {
      setSuggestions([]);
      return;
    }
    debounceRef.current = window.setTimeout(async () => {
      setLoadingSuggestions(true);
      try {
        const employees = await getEmployees({ fields: ['employeeId', 'firstName', 'lastName'] });
        const qLower = q.toLowerCase();
        const filtered = employees.filter(emp => {
          const id = (emp.employeeId || '').toLowerCase();
          const name = `${(emp.firstName || '')} ${(emp.lastName || '')}`.toLowerCase();
          return id.includes(qLower) || name.includes(qLower);
        });
        setSuggestions(filtered.slice(0, 10));
      } catch (e) {
        setSuggestions([]);
      } finally {
        setLoadingSuggestions(false);
      }
    }, 300);
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [newEntry.employeeId, isOpen]);

  if (!isOpen) return null;

  const handleAdd = async () => {
    if (newEntry.employeeId && newEntry.firstName && newEntry.lastName && newEntry.clockInTime) {
      await onAdd(newEntry);
      onClose();
      // Reset form
      setNewEntry({
        employeeId: '',
        firstName: '',
        lastName: '',
        date: date,
        clockInTime: '09:00',
        clockOutTime: '17:00',
        notes: ''
      });
    } else {
      alert('Please fill in all required fields');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Add Clock In/Out Entry</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID *</label>
            <input
              type="text"
              value={newEntry.employeeId}
              onChange={(e) => {
                setNewEntry({ ...newEntry, employeeId: e.target.value });
              }}
              onBlur={() => {
                // Delay hiding to allow click on suggestion
                setTimeout(() => setSuggestions([]), 150);
              }}
              onFocus={() => {
                // effect picks up value and fetches suggestions if present
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="EMP001"
              aria-autocomplete="list"
              aria-controls="employee-suggest-list"
            />
            {loadingSuggestions && <div className="absolute right-2 top-8 text-sm text-gray-500">Loading...</div>}
            {suggestions.length > 0 && (
              <ul id="employee-suggest-list" role="listbox" className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md max-h-48 overflow-auto shadow-md">
                {suggestions.map((emp) => (
                  <li
                    key={emp.employeeId || emp.id || `${emp.firstName}-${emp.lastName}`}
                    role="option"
                    onMouseDown={(e) => {
                      e.preventDefault(); // prevent blur before click
                      setNewEntry({ ...newEntry, employeeId: emp.employeeId || '', firstName: emp.firstName || '', lastName: emp.lastName || '' });
                      setSuggestions([]);
                    }}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <div className="text-sm font-medium">{emp.employeeId} — {emp.firstName} {emp.lastName}</div>
                    <div className="text-xs text-gray-500">{emp.firstName} {emp.lastName}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
              <input
                type="text"
                value={newEntry.firstName}
                onChange={(e) => setNewEntry({ ...newEntry, firstName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
              <input
                type="text"
                value={newEntry.lastName}
                onChange={(e) => setNewEntry({ ...newEntry, lastName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
            <input
              type="date"
              value={newEntry.date}
              onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Clock In *</label>
              <input
                type="time"
                value={newEntry.clockInTime}
                onChange={(e) => setNewEntry({ ...newEntry, clockInTime: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Clock Out</label>
              <input
                type="time"
                value={newEntry.clockOutTime || ''}
                onChange={(e) => setNewEntry({ ...newEntry, clockOutTime: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              value={newEntry.notes || ''}
              onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Add notes here..."
            />
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
            onClick={handleAdd}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Add Entry
          </button>
        </div>
      </div>
    </div>
  );
};

const CalendarView: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [clockInOutData, setClockInOutData] = useState<ClockInOut[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<ClockInOut | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch clock-in-outs from API on mount
  useEffect(() => {
    const fetchClockInOuts = async () => {
      try {
        setLoading(true);
        const data = await getClockInOuts();
        console.log('Fetched clock-in-outs:', data);
        console.log('Number of entries:', data.length);
        setClockInOutData(data);
      } catch (error) {
        console.error('Failed to fetch clock-in-outs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchClockInOuts();
  }, []);

  const handleEntryClick = (entry: ClockInOut) => {
    setSelectedEntry(entry);
    setIsDetailModalOpen(true);
  };

  const handleSaveEntry = async (updatedEntry: ClockInOut) => {
    try {
      const updated = await updateClockInOut(updatedEntry.id, updatedEntry);
      setClockInOutData(data =>
        data.map(entry => entry.id === updated.id ? updated : entry)
      );
    } catch (error) {
      console.error('Failed to update clock-in-out:', error);
      alert('Failed to update entry. Please try again.');
    }
  };

  const handleDeleteEntry = async (id: string) => {
    try {
      await deleteClockInOut(id);
      setClockInOutData(data => data.filter(entry => entry.id !== id));
    } catch (error) {
      console.error('Failed to delete clock-in-out:', error);
      alert('Failed to delete entry. Please try again.');
    }
  };

  const handleAddEntry = async (newEntry: Omit<ClockInOut, 'id'>) => {
    try {
      const created = await createClockInOut(newEntry);
      setClockInOutData([...clockInOutData, created]);
    } catch (error) {
      console.error('Failed to create clock-in-out:', error);
      alert('Failed to add entry. Please try again.');
    }
  };

  const handleCellClick = (date: string) => {
    setSelectedDate(date);
    setIsAddModalOpen(true);
  };

  const getEntriesForDate = (date: string): ClockInOut[] => {
    const entries = clockInOutData.filter(entry => entry.date === date);
    if (entries.length > 0) {
      console.log(`Entries for ${date}:`, entries);
    }
    return entries;
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
          <div key={day} className="text-center font-semibold text-gray-700 py-2 bg-gray-100">
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
              className={`min-h-24 border border-gray-200 p-1 ${
                !isCurrentMonth ? 'bg-gray-50' : 'bg-white'
              } ${isToday ? 'ring-2 ring-blue-500' : ''} cursor-pointer hover:bg-gray-50 transition-colors`}
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  handleCellClick(dateStr);
                }
              }}
            >
              <div className={`text-sm ${!isCurrentMonth ? 'text-gray-400' : 'text-gray-900'} font-medium mb-1`}>
                {day.getDate()}
              </div>
              <div className="space-y-1 overflow-y-auto max-h-20">
                {entries.map(entry => (
                  <div
                    key={entry.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEntryClick(entry);
                    }}
                    className="text-xs bg-blue-100 hover:bg-blue-200 border border-blue-300 rounded px-1 py-0.5 cursor-pointer transition-colors"
                  >
                    <div className="font-medium truncate">{entry.firstName} {entry.lastName}</div>
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
              className={`border border-gray-200 rounded-lg p-2 ${
                isToday ? 'ring-2 ring-blue-500 bg-blue-50' : 'bg-white'
              } cursor-pointer hover:bg-gray-50 transition-colors`}
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  handleCellClick(dateStr);
                }
              }}
            >
              <div className="text-center mb-2">
                <div className="text-xs text-gray-500">{dayNames[day.getDay()]}</div>
                <div className="text-lg font-bold text-gray-900">{day.getDate()}</div>
              </div>
              <div className="space-y-2 overflow-y-auto max-h-96">
                {entries.map(entry => (
                  <div
                    key={entry.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEntryClick(entry);
                    }}
                    className="text-xs bg-blue-100 hover:bg-blue-200 border border-blue-300 rounded p-2 cursor-pointer transition-colors"
                  >
                    <div className="font-semibold truncate">{entry.firstName} {entry.lastName}</div>
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
              <p className="text-gray-500 mb-4">No entries for this day</p>
              <button
                onClick={() => handleCellClick(dateStr)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Add Entry
              </button>
            </div>
          ) : (
            <>
              {entries.map(entry => (
                <div
                  key={entry.id}
                  onClick={() => handleEntryClick(entry)}
                  className="bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg p-4 cursor-pointer transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {entry.firstName} {entry.lastName}
                      </h4>
                      <p className="text-sm text-gray-600">ID: {entry.employeeId}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm">
                        <span className="font-medium">In:</span> {entry.clockInTime}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Out:</span> {entry.clockOutTime || 'Active'}
                      </div>
                    </div>
                  </div>
                  {entry.notes && (
                    <div className="mt-2 text-sm text-gray-700 border-t border-blue-200 pt-2">
                      <span className="font-medium">Notes:</span> {entry.notes}
                    </div>
                  )}
                </div>
              ))}
              <button
                onClick={() => handleCellClick(dateStr)}
                className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors"
              >
                + Add Another Entry
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <LayoutWithSidebarTopbar menuItem="calendar">
      <div className="flex-1 p-6 flex flex-col">
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
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
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
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setViewMode('week')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  viewMode === 'week'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setViewMode('day')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  viewMode === 'day'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Day
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 p-4 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-500">Loading clock-in/out data...</div>
            </div>
          ) : (
            <>
              {viewMode === 'month' && renderMonthView()}
              {viewMode === 'week' && renderWeekView()}
              {viewMode === 'day' && renderDayView()}
            </>
          )}
        </div>

        <DetailModal
          entry={selectedEntry}
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          onSave={handleSaveEntry}
          onDelete={handleDeleteEntry}
        />

        <AddEntryModal
          date={selectedDate}
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddEntry}
        />
      </div>
    </LayoutWithSidebarTopbar>
  );
};

export default CalendarView;
