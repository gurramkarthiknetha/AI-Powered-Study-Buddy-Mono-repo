import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { FaPlay, FaPause, FaRedo, FaPlus, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import './Pomodoro.css';

const Pomodoro = () => {
  // Timer state
  const [timerType, setTimerType] = useState('pomodoro'); // pomodoro, shortBreak, longBreak
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [blockedSites, setBlockedSites] = useState(['']);

  // Timer settings
  const [settings, setSettings] = useState({
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15,
    autoStartBreaks: false,
    autoStartPomodoros: false,
    longBreakInterval: 4
  });

  // Tasks state
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [currentTask, setCurrentTask] = useState(null);

  // Sound state
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedSound, setSelectedSound] = useState('none');
  const [volume, setVolume] = useState(50);

  // Refs
  const audioRef = useRef(null);
  const pomodoroCount = useRef(0);

  // Session count
  const [completedSessions, setCompletedSessions] = useState(0);

  useEffect(() => {
    fetchSessions();

    // Initialize audio
    audioRef.current = new Audio();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  useEffect(() => {
    // Set timer based on type
    if (timerType === 'pomodoro') {
      setTimeLeft(settings.pomodoro * 60);
    } else if (timerType === 'shortBreak') {
      setTimeLeft(settings.shortBreak * 60);
    } else if (timerType === 'longBreak') {
      setTimeLeft(settings.longBreak * 60);
    }
  }, [timerType, settings]);

  useEffect(() => {
    // Update audio source when sound changes
    if (audioRef.current && selectedSound !== 'none') {
      const soundMap = {
        whitenoise: '/sounds/whitenoise.mp3',
        rain: '/sounds/rain.mp3',
        cafe: '/sounds/cafe.mp3',
        forest: '/sounds/forest.mp3'
      };

      audioRef.current.src = soundMap[selectedSound] || '';
      audioRef.current.loop = true;
      audioRef.current.volume = volume / 100;

      if (isActive && soundEnabled) {
        audioRef.current.play().catch(e => console.error('Error playing audio:', e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [selectedSound, isActive, soundEnabled, volume]);

  const fetchSessions = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/pomodoro');
      setSessions(response.data);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };

  const handleSessionComplete = useCallback(async () => {
    // Play notification sound
    const notification = new Audio('/sounds/notification.mp3');
    notification.play().catch(e => console.error('Error playing notification:', e));

    setIsActive(false);

    if (timerType === 'pomodoro') {
      // Increment pomodoro count
      pomodoroCount.current += 1;
      setCompletedSessions(prev => prev + 1);

      // Mark current task as completed if there is one
      if (currentTask) {
        setTasks(tasks.map(task =>
          task.id === currentTask.id ? { ...task, completed: true } : task
        ));
        setCurrentTask(null);
      }

      // Determine next break type
      const nextBreakType = pomodoroCount.current % settings.longBreakInterval === 0
        ? 'longBreak'
        : 'shortBreak';

      // Auto start break if enabled
      if (settings.autoStartBreaks) {
        setTimerType(nextBreakType);
        setIsActive(true);
      } else {
        setTimerType(nextBreakType);
      }
    } else {
      // Break completed
      if (settings.autoStartPomodoros) {
        setTimerType('pomodoro');
        setIsActive(true);
      } else {
        setTimerType('pomodoro');
      }
    }

    // Save session to backend
    try {
      await axios.post('http://localhost:8000/api/pomodoro', {
        user_id: "507f1f77bcf86cd799439011",
        start_time: new Date(Date.now() - (timerType === 'pomodoro' ? settings.pomodoro : timerType === 'shortBreak' ? settings.shortBreak : settings.longBreak) * 60 * 1000),
        end_time: new Date(),
        session_duration: timerType === 'pomodoro' ? settings.pomodoro : timerType === 'shortBreak' ? settings.shortBreak : settings.longBreak,
        session_type: timerType,
        distractions_blocked: blockedSites.filter(site => site),
        task: currentTask ? currentTask.text : null
      });
      fetchSessions();
    } catch (error) {
      console.error('Error saving session:', error);
    }
  }, [timerType, settings, currentTask, tasks, blockedSites]);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      handleSessionComplete();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, handleSessionComplete]);

  const startTimer = () => {
    setIsActive(true);

    // Start audio if enabled
    if (audioRef.current && soundEnabled && selectedSound !== 'none') {
      audioRef.current.play().catch(e => console.error('Error playing audio:', e));
    }
  };

  const pauseTimer = () => {
    setIsActive(false);

    // Pause audio
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const resetTimer = () => {
    setIsActive(false);
    if (timerType === 'pomodoro') {
      setTimeLeft(settings.pomodoro * 60);
    } else if (timerType === 'shortBreak') {
      setTimeLeft(settings.shortBreak * 60);
    } else {
      setTimeLeft(settings.longBreak * 60);
    }

    // Pause audio
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSettingChange = (setting, value) => {
    setSettings({
      ...settings,
      [setting]: value
    });

    // Update current timer if the changed setting affects it
    if (isActive) return; // Don't update if timer is active

    if (timerType === 'pomodoro' && setting === 'pomodoro') {
      setTimeLeft(value * 60);
    } else if (timerType === 'shortBreak' && setting === 'shortBreak') {
      setTimeLeft(value * 60);
    } else if (timerType === 'longBreak' && setting === 'longBreak') {
      setTimeLeft(value * 60);
    }
  };

  const addTask = () => {
    if (!newTask.trim()) return;

    const task = {
      id: Date.now(),
      text: newTask,
      completed: false
    };

    setTasks([...tasks, task]);
    setNewTask('');
  };

  const toggleTaskCompletion = (taskId) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const selectTaskForSession = (task) => {
    setCurrentTask(task);
  };

  // Calculate progress percentage for the timer circle
  const calculateProgress = () => {
    const totalSeconds = timerType === 'pomodoro'
      ? settings.pomodoro * 60
      : timerType === 'shortBreak'
        ? settings.shortBreak * 60
        : settings.longBreak * 60;

    return ((totalSeconds - timeLeft) / totalSeconds) * 100;
  };

  return (
    <div className="pomodoro">
      <div className="pomodoro-left">
        <div className="timer-container">
          <h2>Focus Timer</h2>

          <div className="timer-type-selector">
            <button
              className={`timer-type-button ${timerType === 'pomodoro' ? 'active' : ''}`}
              onClick={() => {
                setTimerType('pomodoro');
                setTimeLeft(settings.pomodoro * 60);
              }}
            >
              Pomodoro
            </button>
            <button
              className={`timer-type-button ${timerType === 'shortBreak' ? 'active' : ''}`}
              onClick={() => {
                setTimerType('shortBreak');
                setTimeLeft(settings.shortBreak * 60);
              }}
            >
              Short Break
            </button>
            <button
              className={`timer-type-button ${timerType === 'longBreak' ? 'active' : ''}`}
              onClick={() => {
                setTimerType('longBreak');
                setTimeLeft(settings.longBreak * 60);
              }}
            >
              Long Break
            </button>
          </div>

          <div className="timer-circle">
            <svg className="timer-progress" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="var(--border-color)"
                strokeWidth="5"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="var(--primary-color)"
                strokeWidth="5"
                strokeDasharray="283"
                strokeDashoffset={283 - (283 * calculateProgress() / 100)}
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="timer-display">
              {formatTime(timeLeft)}
            </div>
          </div>

          {currentTask && (
            <div className="current-task">
              Working on: <strong>{currentTask.text}</strong>
            </div>
          )}

          <div className="timer-controls">
            {isActive ? (
              <button onClick={pauseTimer} className="stop">
                <FaPause /> Pause
              </button>
            ) : (
              <button onClick={startTimer} className="start">
                <FaPlay /> Start
              </button>
            )}
            <button onClick={resetTimer} className="reset">
              <FaRedo /> Reset
            </button>
          </div>
        </div>

        <div className="timer-settings">
          <h3>Timer Settings</h3>
          <div className="settings-grid">
            <div className="setting-item">
              <label>Pomodoro Length (minutes)</label>
              <input
                type="number"
                min="1"
                max="60"
                value={settings.pomodoro}
                onChange={(e) => handleSettingChange('pomodoro', parseInt(e.target.value))}
              />
            </div>
            <div className="setting-item">
              <label>Short Break Length (minutes)</label>
              <input
                type="number"
                min="1"
                max="30"
                value={settings.shortBreak}
                onChange={(e) => handleSettingChange('shortBreak', parseInt(e.target.value))}
              />
            </div>
            <div className="setting-item">
              <label>Long Break Length (minutes)</label>
              <input
                type="number"
                min="1"
                max="60"
                value={settings.longBreak}
                onChange={(e) => handleSettingChange('longBreak', parseInt(e.target.value))}
              />
            </div>
            <div className="setting-item">
              <label>Long Break Interval</label>
              <input
                type="number"
                min="1"
                max="10"
                value={settings.longBreakInterval}
                onChange={(e) => handleSettingChange('longBreakInterval', parseInt(e.target.value))}
              />
            </div>
          </div>
          <div className="setting-item">
            <label>
              <input
                type="checkbox"
                checked={settings.autoStartBreaks}
                onChange={(e) => handleSettingChange('autoStartBreaks', e.target.checked)}
              />
              Auto-start Breaks
            </label>
          </div>
          <div className="setting-item">
            <label>
              <input
                type="checkbox"
                checked={settings.autoStartPomodoros}
                onChange={(e) => handleSettingChange('autoStartPomodoros', e.target.checked)}
              />
              Auto-start Pomodoros
            </label>
          </div>
        </div>

        <div className="ambient-sounds">
          <h3>Ambient Sounds</h3>
          <div className="sound-options">
            <div
              className={`sound-option ${selectedSound === 'none' ? 'active' : ''}`}
              onClick={() => setSelectedSound('none')}
            >
              None
            </div>
            <div
              className={`sound-option ${selectedSound === 'whitenoise' ? 'active' : ''}`}
              onClick={() => setSelectedSound('whitenoise')}
            >
              White Noise
            </div>
            <div
              className={`sound-option ${selectedSound === 'rain' ? 'active' : ''}`}
              onClick={() => setSelectedSound('rain')}
            >
              Rain
            </div>
            <div
              className={`sound-option ${selectedSound === 'cafe' ? 'active' : ''}`}
              onClick={() => setSelectedSound('cafe')}
            >
              Cafe
            </div>
          </div>
          <div className="volume-control">
            <label>
              Volume: {volume}%
              <button
                className="icon-button"
                onClick={() => setSoundEnabled(!soundEnabled)}
                style={{ marginLeft: '10px' }}
              >
                {soundEnabled ? <FaVolumeUp /> : <FaVolumeMute />}
              </button>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(parseInt(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>
        </div>
      </div>

      <div className="pomodoro-right">
        <div className="task-association">
          <h3>Tasks</h3>
          <div className="task-input">
            <input
              type="text"
              placeholder="What are you working on?"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTask()}
            />
            <button className="icon-button" onClick={addTask}>
              <FaPlus />
            </button>
          </div>

          <ul className="task-list">
            {tasks.map((task) => (
              <li
                key={task.id}
                className={`task-item ${task.completed ? 'completed' : ''}`}
                onClick={() => !task.completed && selectTaskForSession(task)}
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTaskCompletion(task.id)}
                  onClick={(e) => e.stopPropagation()}
                />
                <span>{task.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="distraction-blocker">
          <h3>Distraction Blocker</h3>
          <p>Enter websites you want to avoid during focus sessions:</p>
          {blockedSites.map((site, index) => (
            <input
              key={index}
              type="text"
              placeholder="Enter website to block (e.g., facebook.com)"
              value={site}
              onChange={(e) => {
                const newSites = [...blockedSites];
                newSites[index] = e.target.value;
                if (index === blockedSites.length - 1 && e.target.value) {
                  newSites.push('');
                }
                setBlockedSites(newSites);
              }}
            />
          ))}
        </div>

        <div className="sessions-history">
          <h3>Recent Sessions</h3>
          <div className="session-stats">
            <p>Today's Focus Time: {completedSessions * settings.pomodoro} minutes</p>
            <p>Completed Sessions: {completedSessions}</p>
          </div>
          {sessions.map((session) => (
            <div key={session._id} className="session-card">
              <p>
                <strong>{session.session_type === 'pomodoro' ? 'Focus Session' : session.session_type === 'shortBreak' ? 'Short Break' : 'Long Break'}</strong>
              </p>
              <p>Duration: {session.session_duration} minutes</p>
              <p>Started: {new Date(session.start_time).toLocaleString()}</p>
              {session.task && <p>Task: {session.task}</p>}
              <div className="session-stats">
                <span>Distractions blocked: {session.distractions_blocked?.length || 0}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pomodoro;