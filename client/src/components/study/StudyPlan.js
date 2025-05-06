import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaCalendarAlt,
  FaListAlt,
  FaChartBar,
  FaCheck,
  FaSave,
  FaTimes,
  FaBell,
  FaFlag,
  FaClock
} from 'react-icons/fa';
import './StudyPlan.css';

const API_URL = 'http://localhost:8000/api';

const StudyPlan = () => {
  const { currentUser } = useAuth();
  const userId = currentUser?.id || "507f1f77bcf86cd799439011"; // Fallback for development

  // State variables
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [activeTab, setActiveTab] = useState('list');
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showSessionForm, setShowSessionForm] = useState(false);
  const [showReminderForm, setShowReminderForm] = useState(false);
  const [showMilestoneForm, setShowMilestoneForm] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);

  // Form states
  const [newPlan, setNewPlan] = useState({
    plan_title: '',
    description: '',
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    goal_type: 'topic-based',
    subjects: []
  });

  const [newSubject, setNewSubject] = useState({
    subject_name: '',
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    color: '#4a90e2',
    topics: []
  });

  const [newTopic, setNewTopic] = useState({
    name: '',
    priority: 'medium'
  });

  const [newSession, setNewSession] = useState({
    title: '',
    session_date: new Date().toISOString().split('T')[0],
    start_time: '09:00',
    end_time: '10:00',
    topics_covered: [],
    duration_minutes: 60,
    recurring: false,
    recurrence_pattern: 'none'
  });

  const [newReminder, setNewReminder] = useState({
    title: '',
    message: '',
    reminder_date: new Date().toISOString().split('T')[0],
    reminder_time: '09:00',
    type: 'in-app'
  });

  const [newMilestone, setNewMilestone] = useState({
    title: '',
    description: '',
    due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });

  // Fetch study plans
  const fetchPlans = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/study-plans?user_id=${userId}`);
      setPlans(response.data);
    } catch (error) {
      console.error('Error fetching study plans:', error);
    }
  }, [userId]);

  // Fetch calendar events
  const fetchCalendarEvents = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/study-plans/calendar/${userId}`);
      setCalendarEvents(response.data);
    } catch (error) {
      console.error('Error fetching calendar events:', error);
    }
  }, [userId]);

  // Fetch data on component mount
  useEffect(() => {
    fetchPlans();
    fetchCalendarEvents();
  }, [userId, fetchPlans, fetchCalendarEvents]);

  // Create new study plan
  const handleCreatePlan = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/study-plans`, {
        ...newPlan,
        user_id: userId
      });
      fetchPlans();
      setShowCreateForm(false);
      setNewPlan({
        plan_title: '',
        description: '',
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        goal_type: 'topic-based',
        subjects: []
      });
    } catch (error) {
      console.error('Error creating study plan:', error);
    }
  };

  // Add subject to plan
  const handleAddSubject = async () => {
    if (!selectedPlan) return;

    try {
      const updatedPlan = { ...selectedPlan };
      updatedPlan.subjects.push(newSubject);

      await axios.put(`${API_URL}/study-plans/${selectedPlan._id}`, updatedPlan);
      fetchPlans();
      setSelectedPlan(updatedPlan);
      setNewSubject({
        subject_name: '',
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        color: '#4a90e2',
        topics: []
      });
    } catch (error) {
      console.error('Error adding subject:', error);
    }
  };

  // Add topic to subject
  const handleAddTopic = async () => {
    if (!selectedPlan || !selectedSubject) return;

    try {
      const updatedPlan = { ...selectedPlan };
      const subjectIndex = updatedPlan.subjects.findIndex(
        s => s._id === selectedSubject._id
      );

      if (subjectIndex !== -1) {
        if (!updatedPlan.subjects[subjectIndex].topics) {
          updatedPlan.subjects[subjectIndex].topics = [];
        }
        updatedPlan.subjects[subjectIndex].topics.push(newTopic);

        await axios.put(`${API_URL}/study-plans/${selectedPlan._id}`, updatedPlan);
        fetchPlans();
        setSelectedPlan(updatedPlan);
        setNewTopic({
          name: '',
          priority: 'medium'
        });
      }
    } catch (error) {
      console.error('Error adding topic:', error);
    }
  };

  // Add study session
  const handleAddSession = async () => {
    if (!selectedPlan || !selectedSubject) return;

    try {
      const updatedPlan = { ...selectedPlan };
      const subjectIndex = updatedPlan.subjects.findIndex(
        s => s._id === selectedSubject._id
      );

      if (subjectIndex !== -1) {
        if (!updatedPlan.subjects[subjectIndex].study_sessions) {
          updatedPlan.subjects[subjectIndex].study_sessions = [];
        }

        // Calculate duration in minutes
        const startTime = newSession.start_time.split(':');
        const endTime = newSession.end_time.split(':');
        const startMinutes = parseInt(startTime[0]) * 60 + parseInt(startTime[1]);
        const endMinutes = parseInt(endTime[0]) * 60 + parseInt(endTime[1]);
        const durationMinutes = endMinutes - startMinutes;

        updatedPlan.subjects[subjectIndex].study_sessions.push({
          ...newSession,
          duration_minutes: durationMinutes > 0 ? durationMinutes : 60
        });

        await axios.put(`${API_URL}/study-plans/${selectedPlan._id}`, updatedPlan);
        fetchPlans();
        fetchCalendarEvents();
        setSelectedPlan(updatedPlan);
        setShowSessionForm(false);
        setNewSession({
          title: '',
          session_date: new Date().toISOString().split('T')[0],
          start_time: '09:00',
          end_time: '10:00',
          topics_covered: [],
          duration_minutes: 60,
          recurring: false,
          recurrence_pattern: 'none'
        });
      }
    } catch (error) {
      console.error('Error adding study session:', error);
    }
  };

  // Add reminder
  const handleAddReminder = async () => {
    if (!selectedPlan) return;

    try {
      await axios.post(`${API_URL}/study-plans/${selectedPlan._id}/reminders`, newReminder);
      fetchPlans();
      const updatedPlan = await axios.get(`${API_URL}/study-plans/${selectedPlan._id}`);
      setSelectedPlan(updatedPlan.data);
      setShowReminderForm(false);
      setNewReminder({
        title: '',
        message: '',
        reminder_date: new Date().toISOString().split('T')[0],
        reminder_time: '09:00',
        type: 'in-app'
      });
    } catch (error) {
      console.error('Error adding reminder:', error);
    }
  };

  // Add milestone
  const handleAddMilestone = async () => {
    if (!selectedPlan) return;

    try {
      await axios.post(`${API_URL}/study-plans/${selectedPlan._id}/milestones`, newMilestone);
      fetchPlans();
      const updatedPlan = await axios.get(`${API_URL}/study-plans/${selectedPlan._id}`);
      setSelectedPlan(updatedPlan.data);
      setShowMilestoneForm(false);
      setNewMilestone({
        title: '',
        description: '',
        due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      });
    } catch (error) {
      console.error('Error adding milestone:', error);
    }
  };

  // Mark topic as completed
  const handleToggleTopic = async (subjectId, topicId, completed) => {
    try {
      await axios.patch(
        `${API_URL}/study-plans/${selectedPlan._id}/topics/${subjectId}/${topicId}`,
        { completed: !completed }
      );
      fetchPlans();
      const updatedPlan = await axios.get(`${API_URL}/study-plans/${selectedPlan._id}`);
      setSelectedPlan(updatedPlan.data);
    } catch (error) {
      console.error('Error updating topic:', error);
    }
  };

  // Mark session as completed
  const handleToggleSession = async (subjectId, sessionId, completed) => {
    try {
      await axios.patch(
        `${API_URL}/study-plans/${selectedPlan._id}/sessions/${subjectId}/${sessionId}`,
        { completed: !completed }
      );
      fetchPlans();
      fetchCalendarEvents();
      const updatedPlan = await axios.get(`${API_URL}/study-plans/${selectedPlan._id}`);
      setSelectedPlan(updatedPlan.data);
    } catch (error) {
      console.error('Error updating session:', error);
    }
  };

  // Mark milestone as completed
  const handleToggleMilestone = async (milestoneId, completed) => {
    try {
      await axios.patch(
        `${API_URL}/study-plans/${selectedPlan._id}/milestones/${milestoneId}`,
        { completed: !completed }
      );
      fetchPlans();
      const updatedPlan = await axios.get(`${API_URL}/study-plans/${selectedPlan._id}`);
      setSelectedPlan(updatedPlan.data);
    } catch (error) {
      console.error('Error updating milestone:', error);
    }
  };

  // Delete study plan
  const handleDeletePlan = async (planId) => {
    if (window.confirm('Are you sure you want to delete this study plan?')) {
      try {
        await axios.delete(`${API_URL}/study-plans/${planId}`);
        fetchPlans();
        fetchCalendarEvents();
        if (selectedPlan && selectedPlan._id === planId) {
          setSelectedPlan(null);
        }
      } catch (error) {
        console.error('Error deleting study plan:', error);
      }
    }
  };

  // Calendar event handlers
  const handleDateClick = (arg) => {
    if (selectedPlan) {
      setNewSession({
        ...newSession,
        session_date: arg.dateStr,
        start_time: '09:00',
        end_time: '10:00'
      });
      setShowSessionForm(true);
    }
  };

  const handleEventClick = (info) => {
    const { extendedProps } = info.event;
    const planId = extendedProps.plan_id;
    const subjectId = extendedProps.subject_id;
    const sessionId = info.event.id;

    // Find the plan
    const plan = plans.find(p => p._id === planId);
    if (plan) {
      setSelectedPlan(plan);

      // Find the subject
      const subject = plan.subjects.find(s => s._id === subjectId);
      if (subject) {
        setSelectedSubject(subject);

        // Find the session
        const session = subject.study_sessions.find(s => s._id === sessionId);
        if (session) {
          setSelectedSession(session);
        }
      }
    }
  };

  return (
    <div className="study-plan">
      <div className="study-plan-header">
        <h1>Study Plans</h1>
        <p>Organize your academic goals and track your progress</p>
      </div>

      <div className="study-plan-tabs">
        <div
          className={`study-plan-tab ${activeTab === 'list' ? 'active' : ''}`}
          onClick={() => setActiveTab('list')}
        >
          <FaListAlt /> Plans
        </div>
        <div
          className={`study-plan-tab ${activeTab === 'calendar' ? 'active' : ''}`}
          onClick={() => setActiveTab('calendar')}
        >
          <FaCalendarAlt /> Calendar
        </div>
        <div
          className={`study-plan-tab ${activeTab === 'progress' ? 'active' : ''}`}
          onClick={() => setActiveTab('progress')}
        >
          <FaChartBar /> Progress
        </div>
      </div>

      {activeTab === 'list' && (
        <div className="study-plan-content">
          <div className="plan-sidebar">
            <button
              className="btn btn-primary"
              onClick={() => setShowCreateForm(!showCreateForm)}
            >
              <FaPlus /> Create New Plan
            </button>

            {showCreateForm && (
              <div className="plan-form">
                <h3>Create New Study Plan</h3>
                <form onSubmit={handleCreatePlan}>
                  <div className="form-group">
                    <label>Plan Title</label>
                    <input
                      type="text"
                      value={newPlan.plan_title}
                      onChange={(e) => setNewPlan({...newPlan, plan_title: e.target.value})}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={newPlan.description}
                      onChange={(e) => setNewPlan({...newPlan, description: e.target.value})}
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Start Date</label>
                      <input
                        type="date"
                        value={newPlan.start_date}
                        onChange={(e) => setNewPlan({...newPlan, start_date: e.target.value})}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>End Date</label>
                      <input
                        type="date"
                        value={newPlan.end_date}
                        onChange={(e) => setNewPlan({...newPlan, end_date: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Goal Type</label>
                    <select
                      value={newPlan.goal_type}
                      onChange={(e) => setNewPlan({...newPlan, goal_type: e.target.value})}
                      required
                    >
                      <option value="time-based">Time-based</option>
                      <option value="topic-based">Topic-based</option>
                      <option value="milestone-based">Milestone-based</option>
                    </select>
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="btn">
                      <FaSave /> Save Plan
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowCreateForm(false)}
                    >
                      <FaTimes /> Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="plans-list">
              {plans.map((plan) => (
                <div
                  key={plan._id}
                  className={`plan-card ${selectedPlan && selectedPlan._id === plan._id ? 'active' : ''}`}
                  onClick={() => setSelectedPlan(plan)}
                >
                  <h3>
                    {plan.plan_title}
                    <div className="plan-actions">
                      <button
                        className="icon-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePlan(plan._id);
                        }}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </h3>
                  <div className="plan-card-meta">
                    <span>{new Date(plan.start_date).toLocaleDateString()} - {new Date(plan.end_date).toLocaleDateString()}</span>
                    <span>{plan.goal_type}</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${plan.overall_progress || 0}%` }}
                    ></div>
                  </div>
                  <div className="plan-card-meta">
                    <span>{plan.overall_progress || 0}% complete</span>
                    <span>{plan.subjects?.length || 0} subjects</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selectedPlan && (
            <div className="plan-main">
              <div className="plan-detail-header">
                <h2>{selectedPlan.plan_title}</h2>
                <div className="plan-detail-actions">
                  <button className="btn btn-sm">
                    <FaEdit /> Edit
                  </button>
                  <button
                    className="btn btn-sm"
                    onClick={() => setShowReminderForm(true)}
                  >
                    <FaBell /> Add Reminder
                  </button>
                  <button
                    className="btn btn-sm"
                    onClick={() => setShowMilestoneForm(true)}
                  >
                    <FaFlag /> Add Milestone
                  </button>
                </div>
              </div>

              <div className="plan-details">
                <p>{selectedPlan.description}</p>
                <div className="plan-meta">
                  <div>
                    <strong>Start Date:</strong> {new Date(selectedPlan.start_date).toLocaleDateString()}
                  </div>
                  <div>
                    <strong>End Date:</strong> {new Date(selectedPlan.end_date).toLocaleDateString()}
                  </div>
                  <div>
                    <strong>Goal Type:</strong> {selectedPlan.goal_type}
                  </div>
                  <div>
                    <strong>Progress:</strong> {selectedPlan.overall_progress || 0}%
                  </div>
                </div>

                <h3>Subjects</h3>
                <div className="subjects">
                  {selectedPlan.subjects && selectedPlan.subjects.map((subject) => (
                    <div
                      key={subject._id}
                      className={`subject-item ${selectedSubject && selectedSubject._id === subject._id ? 'active' : ''}`}
                      onClick={() => setSelectedSubject(subject)}
                    >
                      <div className="subject-header">
                        <h4>{subject.subject_name}</h4>
                        <div className="subject-actions">
                          <button
                            className="icon-button"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Add session form for this subject
                              setSelectedSubject(subject);
                              setShowSessionForm(true);
                            }}
                          >
                            <FaClock />
                          </button>
                        </div>
                      </div>
                      <p>
                        {new Date(subject.start_date).toLocaleDateString()} - {new Date(subject.end_date).toLocaleDateString()}
                      </p>
                      <div className="subject-progress">
                        <div className="progress-bar">
                          <div
                            className="progress-fill"
                            style={{
                              width: `${subject.progress || 0}%`,
                              backgroundColor: subject.color
                            }}
                          ></div>
                        </div>
                        <span>{subject.progress || 0}% complete</span>
                      </div>

                      {selectedSubject && selectedSubject._id === subject._id && (
                        <div className="subject-details">
                          <h4>Topics</h4>
                          {subject.topics && subject.topics.length > 0 ? (
                            <ul className="topics-list">
                              {subject.topics.map((topic) => (
                                <li key={topic._id} className={`topic-item ${topic.completed ? 'completed' : ''}`}>
                                  <label className="checkbox-container">
                                    <input
                                      type="checkbox"
                                      checked={topic.completed}
                                      onChange={() => handleToggleTopic(subject._id, topic._id, topic.completed)}
                                    />
                                    <span className="checkmark"></span>
                                  </label>
                                  <span className={`priority-badge ${topic.priority}`}>{topic.priority}</span>
                                  <span>{topic.name}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p>No topics added yet.</p>
                          )}

                          <div className="add-topic-form">
                            <h5>Add New Topic</h5>
                            <div className="form-row">
                              <input
                                type="text"
                                placeholder="Topic Name"
                                value={newTopic.name}
                                onChange={(e) => setNewTopic({...newTopic, name: e.target.value})}
                              />
                              <select
                                value={newTopic.priority}
                                onChange={(e) => setNewTopic({...newTopic, priority: e.target.value})}
                              >
                                <option value="low">Low Priority</option>
                                <option value="medium">Medium Priority</option>
                                <option value="high">High Priority</option>
                              </select>
                              <button
                                className="btn btn-sm"
                                onClick={handleAddTopic}
                                disabled={!newTopic.name}
                              >
                                <FaPlus /> Add
                              </button>
                            </div>
                          </div>

                          <h4>Study Sessions</h4>
                          {subject.study_sessions && subject.study_sessions.length > 0 ? (
                            <div className="sessions-list">
                              {subject.study_sessions.map((session) => (
                                <div key={session._id} className={`session-item ${session.completed ? 'completed' : ''}`}>
                                  <div className="session-header">
                                    <h5>{session.title}</h5>
                                    <div className="session-actions">
                                      <button
                                        className="icon-button"
                                        onClick={() => handleToggleSession(subject._id, session._id, session.completed)}
                                      >
                                        {session.completed ? <FaTimes /> : <FaCheck />}
                                      </button>
                                    </div>
                                  </div>
                                  <p>
                                    {new Date(session.session_date).toLocaleDateString()} | {session.start_time} - {session.end_time}
                                  </p>
                                  <p>
                                    Duration: {session.duration_minutes} minutes
                                    {session.recurring && ` | Recurring: ${session.recurrence_pattern}`}
                                  </p>
                                  {session.topics_covered && session.topics_covered.length > 0 && (
                                    <div className="session-topics">
                                      <strong>Topics:</strong> {session.topics_covered.join(', ')}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p>No study sessions scheduled yet.</p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}

                  <div className="add-subject-form">
                    <h4>Add New Subject</h4>
                    <div className="form-group">
                      <input
                        type="text"
                        placeholder="Subject Name"
                        value={newSubject.subject_name}
                        onChange={(e) => setNewSubject({...newSubject, subject_name: e.target.value})}
                      />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Start Date</label>
                        <input
                          type="date"
                          value={newSubject.start_date}
                          onChange={(e) => setNewSubject({...newSubject, start_date: e.target.value})}
                        />
                      </div>
                      <div className="form-group">
                        <label>End Date</label>
                        <input
                          type="date"
                          value={newSubject.end_date}
                          onChange={(e) => setNewSubject({...newSubject, end_date: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Color</label>
                      <input
                        type="color"
                        value={newSubject.color}
                        onChange={(e) => setNewSubject({...newSubject, color: e.target.value})}
                      />
                    </div>
                    <button
                      className="btn"
                      onClick={handleAddSubject}
                      disabled={!newSubject.subject_name}
                    >
                      <FaPlus /> Add Subject
                    </button>
                  </div>
                </div>

                <div className="milestones-section">
                  <h3>Milestones</h3>
                  {selectedPlan.milestones && selectedPlan.milestones.length > 0 ? (
                    <div className="milestones-list">
                      {selectedPlan.milestones.map((milestone) => (
                        <div key={milestone._id} className={`milestone-item ${milestone.completed ? 'completed' : ''}`}>
                          <div className="milestone-header">
                            <h4>{milestone.title}</h4>
                            <button
                              className="icon-button"
                              onClick={() => handleToggleMilestone(milestone._id, milestone.completed)}
                            >
                              {milestone.completed ? <FaTimes /> : <FaCheck />}
                            </button>
                          </div>
                          <p>{milestone.description}</p>
                          <p>Due: {new Date(milestone.due_date).toLocaleDateString()}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>No milestones added yet.</p>
                  )}
                </div>

                <div className="reminders-section">
                  <h3>Reminders</h3>
                  {selectedPlan.reminders && selectedPlan.reminders.length > 0 ? (
                    <div className="reminders-list">
                      {selectedPlan.reminders.map((reminder) => (
                        <div key={reminder._id} className={`reminder-item ${reminder.sent ? 'sent' : ''}`}>
                          <div className="reminder-header">
                            <h4>{reminder.title}</h4>
                            <span className="reminder-type">{reminder.type}</span>
                          </div>
                          <p>{reminder.message}</p>
                          <p>
                            {new Date(reminder.reminder_date).toLocaleDateString()} at {reminder.reminder_time}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>No reminders set yet.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'calendar' && (
        <div className="calendar-container">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            events={calendarEvents}
            eventClick={handleEventClick}
            dateClick={handleDateClick}
            height="auto"
            windowResize={true}
            stickyHeaderDates={true}
            expandRows={true}
            handleWindowResize={true}
          />
        </div>
      )}

      {activeTab === 'progress' && (
        <div className="progress-container">
          <h2>Progress Overview</h2>

          <div className="progress-cards">
            {plans.map((plan) => (
              <div key={plan._id} className="progress-card">
                <h3>{plan.plan_title}</h3>
                <div className="progress-bar large">
                  <div
                    className="progress-fill"
                    style={{ width: `${plan.overall_progress || 0}%` }}
                  ></div>
                </div>
                <div className="progress-stats">
                  <div className="stat">
                    <span className="stat-label">Overall Progress</span>
                    <span className="stat-value">{plan.overall_progress || 0}%</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Subjects</span>
                    <span className="stat-value">{plan.subjects?.length || 0}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Milestones</span>
                    <span className="stat-value">
                      {plan.milestones?.filter(m => m.completed).length || 0}/{plan.milestones?.length || 0}
                    </span>
                  </div>
                </div>

                {plan.subjects && plan.subjects.length > 0 && (
                  <div className="subject-progress-list">
                    <h4>Subject Progress</h4>
                    {plan.subjects.map((subject) => (
                      <div key={subject._id} className="subject-progress-item">
                        <div className="subject-progress-header">
                          <h5>{subject.subject_name}</h5>
                          <span>{subject.progress || 0}%</span>
                        </div>
                        <div className="progress-bar">
                          <div
                            className="progress-fill"
                            style={{
                              width: `${subject.progress || 0}%`,
                              backgroundColor: subject.color
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Session Form Modal */}
      {showSessionForm && selectedSubject && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add Study Session</h3>
              <button
                className="icon-button"
                onClick={() => setShowSessionForm(false)}
              >
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Session Title</label>
                <input
                  type="text"
                  value={newSession.title}
                  onChange={(e) => setNewSession({...newSession, title: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  value={newSession.session_date}
                  onChange={(e) => setNewSession({...newSession, session_date: e.target.value})}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Start Time</label>
                  <input
                    type="time"
                    value={newSession.start_time}
                    onChange={(e) => setNewSession({...newSession, start_time: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>End Time</label>
                  <input
                    type="time"
                    value={newSession.end_time}
                    onChange={(e) => setNewSession({...newSession, end_time: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Topics Covered</label>
                <select
                  multiple
                  value={newSession.topics_covered}
                  onChange={(e) => {
                    const topics = Array.from(e.target.selectedOptions, option => option.value);
                    setNewSession({...newSession, topics_covered: topics});
                  }}
                >
                  {selectedSubject.topics && selectedSubject.topics.map((topic) => (
                    <option key={topic._id} value={topic.name}>
                      {topic.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    checked={newSession.recurring}
                    onChange={(e) => setNewSession({...newSession, recurring: e.target.checked})}
                  />
                  <span className="checkmark"></span>
                  Recurring Session
                </label>
              </div>

              {newSession.recurring && (
                <div className="form-group">
                  <label>Recurrence Pattern</label>
                  <select
                    value={newSession.recurrence_pattern}
                    onChange={(e) => setNewSession({...newSession, recurrence_pattern: e.target.value})}
                  >
                    <option value="none">None</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button
                className="btn"
                onClick={handleAddSession}
                disabled={!newSession.title}
              >
                <FaSave /> Save Session
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setShowSessionForm(false)}
              >
                <FaTimes /> Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reminder Form Modal */}
      {showReminderForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add Reminder</h3>
              <button
                className="icon-button"
                onClick={() => setShowReminderForm(false)}
              >
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Reminder Title</label>
                <input
                  type="text"
                  value={newReminder.title}
                  onChange={(e) => setNewReminder({...newReminder, title: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Message</label>
                <textarea
                  value={newReminder.message}
                  onChange={(e) => setNewReminder({...newReminder, message: e.target.value})}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    value={newReminder.reminder_date}
                    onChange={(e) => setNewReminder({...newReminder, reminder_date: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Time</label>
                  <input
                    type="time"
                    value={newReminder.reminder_time}
                    onChange={(e) => setNewReminder({...newReminder, reminder_time: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Reminder Type</label>
                <select
                  value={newReminder.type}
                  onChange={(e) => setNewReminder({...newReminder, type: e.target.value})}
                >
                  <option value="in-app">In-App</option>
                  <option value="email">Email</option>
                  <option value="push">Push Notification</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn"
                onClick={handleAddReminder}
                disabled={!newReminder.title}
              >
                <FaSave /> Save Reminder
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setShowReminderForm(false)}
              >
                <FaTimes /> Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Milestone Form Modal */}
      {showMilestoneForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add Milestone</h3>
              <button
                className="icon-button"
                onClick={() => setShowMilestoneForm(false)}
              >
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Milestone Title</label>
                <input
                  type="text"
                  value={newMilestone.title}
                  onChange={(e) => setNewMilestone({...newMilestone, title: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newMilestone.description}
                  onChange={(e) => setNewMilestone({...newMilestone, description: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>Due Date</label>
                <input
                  type="date"
                  value={newMilestone.due_date}
                  onChange={(e) => setNewMilestone({...newMilestone, due_date: e.target.value})}
                  required
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn"
                onClick={handleAddMilestone}
                disabled={!newMilestone.title}
              >
                <FaSave /> Save Milestone
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setShowMilestoneForm(false)}
              >
                <FaTimes /> Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyPlan;