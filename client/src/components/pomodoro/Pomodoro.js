import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { FaPlay, FaPause, FaRedo, FaPlus, FaVolumeUp, FaVolumeMute, FaMusic, FaHeadphones } from 'react-icons/fa';
import { MdOutlineWaves, MdNature, MdCoffee, MdPiano, MdMusicNote } from 'react-icons/md';
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
  const [musicCategory, setMusicCategory] = useState('ambient'); // ambient, focus, nature

  // Refs
  const audioRef = useRef(null);
  const pomodoroCount = useRef(0);

  // Session count
  const [completedSessions, setCompletedSessions] = useState(0);

  useEffect(() => {
    fetchSessions();

    // Initialize audio
    audioRef.current = new Audio();

    // Load saved music preferences from localStorage
    const savedMusicCategory = localStorage.getItem('musicCategory');
    const savedSelectedSound = localStorage.getItem('selectedSound');
    const savedVolume = localStorage.getItem('musicVolume');
    const savedSoundEnabled = localStorage.getItem('soundEnabled');

    if (savedMusicCategory) {
      setMusicCategory(savedMusicCategory);
    }

    if (savedSelectedSound) {
      setSelectedSound(savedSelectedSound);
    }

    if (savedVolume) {
      setVolume(parseInt(savedVolume));
    }

    if (savedSoundEnabled !== null) {
      setSoundEnabled(savedSoundEnabled === 'true');
    }

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
    if (selectedSound !== 'none') {
      const soundMap = {
        // Ambient sounds
        whitenoise: '/sounds/whitenoise.mp3',
        rain: '/sounds/rain.mp3',
        cafe: '/sounds/cafe.mp3',
        forest: '/sounds/forest.mp3',
        // Focus music
        lofi: '/sounds/lofi.mp3',
        classical: '/sounds/classical.mp3',
        piano: '/sounds/piano.mp3',
        jazz: '/sounds/jazz.mp3',
        // Nature sounds
        ocean: '/sounds/ocean.mp3',
        birds: '/sounds/birds.mp3',
        creek: '/sounds/creek.mp3',
        campfire: '/sounds/campfire.mp3'
      };

      if (!audioRef.current) {
        audioRef.current = new Audio();
      }

      const soundUrl = process.env.PUBLIC_URL + soundMap[selectedSound];
      if (audioRef.current.src !== soundUrl) {
        audioRef.current.src = soundUrl;
        audioRef.current.load();
      }

      audioRef.current.loop = true;
      audioRef.current.volume = volume / 100;

      if (isActive && soundEnabled) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.warn("Audio playback error:", error);
          });
        }
      } else {
        audioRef.current.pause();
      }
    } else if (audioRef.current) {
      audioRef.current.pause();
    }

    // Save music preferences to localStorage
    localStorage.setItem('selectedSound', selectedSound);
    localStorage.setItem('musicVolume', volume.toString());
    localStorage.setItem('soundEnabled', soundEnabled.toString());
  }, [selectedSound, isActive, soundEnabled, volume]);

  // Save music category when it changes
  useEffect(() => {
    localStorage.setItem('musicCategory', musicCategory);
  }, [musicCategory]);

  const fetchSessions = async () => {
    try {
      const response = await axios.get('https://ai-powered-study-buddy-mono-repo.onrender.com/api/pomodoro');
      setSessions(response.data);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };

  const handleSessionComplete = useCallback(async () => {
    // Play notification sound
    if (soundEnabled) {
      const notification = new Audio(process.env.PUBLIC_URL + '/sounds/notification.mp3');
      notification.volume = volume / 100;
      const playPromise = notification.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.warn("Notification sound error:", error);
        });
      }
    }

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
      await axios.post('https://ai-powered-study-buddy-mono-repo.onrender.com/api/pomodoro', {
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
  }, [timerType, settings, currentTask, tasks, blockedSites, soundEnabled, volume]);

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
    if (audioRef.current && soundEnabled && selectedSound !== 'none') {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.warn("Audio playback error:", error);
        });
      }
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
          <h3>Study Music & Sounds</h3>

          <div className="music-categories">
            <button
              className={`category-button ${musicCategory === 'ambient' ? 'active' : ''}`}
              onClick={() => setMusicCategory('ambient')}
            >
              <MdOutlineWaves /> Ambient
            </button>
            <button
              className={`category-button ${musicCategory === 'focus' ? 'active' : ''}`}
              onClick={() => setMusicCategory('focus')}
            >
              <FaHeadphones /> Focus Music
            </button>
            <button
              className={`category-button ${musicCategory === 'nature' ? 'active' : ''}`}
              onClick={() => setMusicCategory('nature')}
            >
              <MdNature /> Nature
            </button>
          </div>

          <div className="sound-options">
            <div
              className={`sound-option ${selectedSound === 'none' ? 'active' : ''}`}
              onClick={() => setSelectedSound('none')}
            >
              None
            </div>

            {musicCategory === 'ambient' && (
              <>
                <div
                  className={`sound-option ${selectedSound === 'whitenoise' ? 'active' : ''}`}
                  onClick={() => setSelectedSound('whitenoise')}
                >
                  <MdOutlineWaves /> White Noise
                </div>
                <div
                  className={`sound-option ${selectedSound === 'rain' ? 'active' : ''}`}
                  onClick={() => setSelectedSound('rain')}
                >
                  <MdOutlineWaves /> Rain
                </div>
                <div
                  className={`sound-option ${selectedSound === 'cafe' ? 'active' : ''}`}
                  onClick={() => setSelectedSound('cafe')}
                >
                  <MdCoffee /> Cafe
                </div>
                <div
                  className={`sound-option ${selectedSound === 'forest' ? 'active' : ''}`}
                  onClick={() => setSelectedSound('forest')}
                >
                  <MdNature /> Forest
                </div>
              </>
            )}

            {musicCategory === 'focus' && (
              <>
                <div
                  className={`sound-option ${selectedSound === 'lofi' ? 'active' : ''}`}
                  onClick={() => setSelectedSound('lofi')}
                >
                  <FaMusic /> Lo-Fi
                </div>
                <div
                  className={`sound-option ${selectedSound === 'classical' ? 'active' : ''}`}
                  onClick={() => setSelectedSound('classical')}
                >
                  <MdMusicNote /> Classical
                </div>
                <div
                  className={`sound-option ${selectedSound === 'piano' ? 'active' : ''}`}
                  onClick={() => setSelectedSound('piano')}
                >
                  <MdPiano /> Piano
                </div>
                <div
                  className={`sound-option ${selectedSound === 'jazz' ? 'active' : ''}`}
                  onClick={() => setSelectedSound('jazz')}
                >
                  <FaMusic /> Jazz
                </div>
              </>
            )}

            {musicCategory === 'nature' && (
              <>
                <div
                  className={`sound-option ${selectedSound === 'ocean' ? 'active' : ''}`}
                  onClick={() => setSelectedSound('ocean')}
                >
                  <MdOutlineWaves /> Ocean
                </div>
                <div
                  className={`sound-option ${selectedSound === 'birds' ? 'active' : ''}`}
                  onClick={() => setSelectedSound('birds')}
                >
                  <MdNature /> Birds
                </div>
                <div
                  className={`sound-option ${selectedSound === 'creek' ? 'active' : ''}`}
                  onClick={() => setSelectedSound('creek')}
                >
                  <MdOutlineWaves /> Creek
                </div>
                <div
                  className={`sound-option ${selectedSound === 'campfire' ? 'active' : ''}`}
                  onClick={() => setSelectedSound('campfire')}
                >
                  <MdNature /> Campfire
                </div>
              </>
            )}
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

          <div className="music-info">
            <p>Music will automatically play when you start the timer and pause when you stop.</p>
            <p>Your music preference will be saved for future sessions.</p>
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