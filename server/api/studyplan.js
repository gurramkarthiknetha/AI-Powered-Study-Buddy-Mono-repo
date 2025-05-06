import express from 'express';
import StudyPlan from '../models/studyplan.js';

const router = express.Router();

const initializeCollection = async () => {
    const count = await StudyPlan.countDocuments();
    if (count === 0) {
        const today = new Date();
        const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

        await StudyPlan.create({
            user_id: "507f1f77bcf86cd799439011",
            plan_title: "Sample Study Plan",
            description: "A sample study plan for demonstration purposes",
            start_date: today,
            end_date: nextWeek,
            goal_type: "topic-based",
            overall_progress: 0,
            subjects: [{
                subject_name: "Mathematics",
                start_date: today,
                end_date: nextWeek,
                color: "#4a90e2",
                progress: 0,
                topics: [
                    { name: "Algebra Basics", completed: false, priority: "high" },
                    { name: "Linear Equations", completed: false, priority: "medium" }
                ],
                study_sessions: [{
                    title: "Algebra Introduction",
                    session_date: today,
                    start_time: "14:00",
                    end_time: "15:00",
                    topics_covered: ["Algebra Basics"],
                    duration_minutes: 60,
                    completed: false,
                    recurring: true,
                    recurrence_pattern: "weekly",
                    recurrence_end_date: nextWeek
                }]
            }],
            reminders: [{
                title: "Study Reminder",
                message: "Don't forget to study Algebra today!",
                reminder_date: today,
                reminder_time: "13:30",
                sent: false,
                type: "in-app"
            }],
            milestones: [{
                title: "Complete Algebra Basics",
                description: "Finish all algebra fundamentals",
                due_date: nextWeek,
                completed: false
            }]
        });
        console.warn("========================================");
        console.info("Initialized study plans collection with test data");
        console.warn("========================================");
    }
};

// Get all study plans
router.get('/', async (req, res) => {
    try {
        await initializeCollection();

        // Extract query parameters for filtering
        const { user_id, start_date, end_date, goal_type } = req.query;

        // Build filter object
        const filter = {};
        if (user_id) filter.user_id = user_id;
        if (goal_type) filter.goal_type = goal_type;
        if (start_date) filter.start_date = { $gte: new Date(start_date) };
        if (end_date) filter.end_date = { $lte: new Date(end_date) };

        const plans = await StudyPlan.find(filter);
        res.json(plans);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get study plan by ID
router.get('/:id', async (req, res) => {
    try {
        const plan = await StudyPlan.findById(req.params.id);
        if (!plan) return res.status(404).json({ message: 'Study plan not found' });
        res.json(plan);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create new study plan
router.post('/', async (req, res) => {
    try {
        const newPlan = await StudyPlan.create(req.body);

        // Get the io instance
        const io = req.app.get('io');
        if (io) {
            // Emit event to the user's room
            io.to(req.body.user_id).emit('study-plan-created', newPlan);
        }

        res.status(201).json(newPlan);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update study plan
router.put('/:id', async (req, res) => {
    try {
        const updatedPlan = await StudyPlan.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedPlan) return res.status(404).json({ message: 'Study plan not found' });

        // Get the io instance
        const io = req.app.get('io');
        if (io) {
            // Emit event to the user's room
            io.to(updatedPlan.user_id.toString()).emit('study-plan-updated', updatedPlan);
        }

        res.json(updatedPlan);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete study plan
router.delete('/:id', async (req, res) => {
    try {
        const deletedPlan = await StudyPlan.findByIdAndDelete(req.params.id);
        if (!deletedPlan) return res.status(404).json({ message: 'Study plan not found' });

        // Get the io instance
        const io = req.app.get('io');
        if (io) {
            // Emit event to the user's room
            io.to(deletedPlan.user_id.toString()).emit('study-plan-deleted', req.params.id);
        }

        res.json({ message: 'Study plan deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update study plan progress
router.patch('/:id/progress', async (req, res) => {
    try {
        const { overall_progress, subject_progress } = req.body;

        const plan = await StudyPlan.findById(req.params.id);
        if (!plan) return res.status(404).json({ message: 'Study plan not found' });

        // Update overall progress if provided
        if (overall_progress !== undefined) {
            plan.overall_progress = overall_progress;
        }

        // Update subject progress if provided
        if (subject_progress && Array.isArray(subject_progress)) {
            subject_progress.forEach(update => {
                const subjectIndex = plan.subjects.findIndex(
                    s => s._id.toString() === update.subject_id
                );

                if (subjectIndex !== -1) {
                    plan.subjects[subjectIndex].progress = update.progress;
                }
            });
        }

        await plan.save();

        // Get the io instance
        const io = req.app.get('io');
        if (io) {
            // Emit event to the user's room
            io.to(plan.user_id.toString()).emit('study-plan-progress-updated', plan);
        }

        res.json(plan);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Mark topic as completed
router.patch('/:id/topics/:subjectId/:topicId', async (req, res) => {
    try {
        const { completed } = req.body;

        const plan = await StudyPlan.findById(req.params.id);
        if (!plan) return res.status(404).json({ message: 'Study plan not found' });

        const subjectIndex = plan.subjects.findIndex(
            s => s._id.toString() === req.params.subjectId
        );

        if (subjectIndex === -1) {
            return res.status(404).json({ message: 'Subject not found' });
        }

        const topicIndex = plan.subjects[subjectIndex].topics.findIndex(
            t => t._id.toString() === req.params.topicId
        );

        if (topicIndex === -1) {
            return res.status(404).json({ message: 'Topic not found' });
        }

        plan.subjects[subjectIndex].topics[topicIndex].completed = completed;

        // Recalculate subject progress
        const totalTopics = plan.subjects[subjectIndex].topics.length;
        const completedTopics = plan.subjects[subjectIndex].topics.filter(t => t.completed).length;
        plan.subjects[subjectIndex].progress = Math.round((completedTopics / totalTopics) * 100);

        // Recalculate overall progress
        const totalSubjects = plan.subjects.length;
        const totalProgress = plan.subjects.reduce((sum, subject) => sum + subject.progress, 0);
        plan.overall_progress = Math.round(totalProgress / totalSubjects);

        await plan.save();

        // Get the io instance
        const io = req.app.get('io');
        if (io) {
            // Emit event to the user's room
            io.to(plan.user_id.toString()).emit('study-plan-topic-updated', plan);
        }

        res.json(plan);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Mark study session as completed
router.patch('/:id/sessions/:subjectId/:sessionId', async (req, res) => {
    try {
        const { completed, actual_duration_minutes, notes } = req.body;

        const plan = await StudyPlan.findById(req.params.id);
        if (!plan) return res.status(404).json({ message: 'Study plan not found' });

        const subjectIndex = plan.subjects.findIndex(
            s => s._id.toString() === req.params.subjectId
        );

        if (subjectIndex === -1) {
            return res.status(404).json({ message: 'Subject not found' });
        }

        const sessionIndex = plan.subjects[subjectIndex].study_sessions.findIndex(
            s => s._id.toString() === req.params.sessionId
        );

        if (sessionIndex === -1) {
            return res.status(404).json({ message: 'Study session not found' });
        }

        const session = plan.subjects[subjectIndex].study_sessions[sessionIndex];

        if (completed !== undefined) session.completed = completed;
        if (actual_duration_minutes !== undefined) session.actual_duration_minutes = actual_duration_minutes;
        if (notes !== undefined) session.notes = notes;

        await plan.save();

        // Get the io instance
        const io = req.app.get('io');
        if (io) {
            // Emit event to the user's room
            io.to(plan.user_id.toString()).emit('study-session-updated', plan);
        }

        res.json(plan);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add a reminder
router.post('/:id/reminders', async (req, res) => {
    try {
        const plan = await StudyPlan.findById(req.params.id);
        if (!plan) return res.status(404).json({ message: 'Study plan not found' });

        plan.reminders.push(req.body);
        await plan.save();

        // Get the io instance
        const io = req.app.get('io');
        if (io) {
            // Emit event to the user's room
            io.to(plan.user_id.toString()).emit('reminder-added', {
                plan_id: plan._id,
                reminder: plan.reminders[plan.reminders.length - 1]
            });
        }

        res.status(201).json(plan);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all reminders for a user
router.get('/reminders/user/:userId', async (req, res) => {
    try {
        const plans = await StudyPlan.find({ user_id: req.params.userId });

        const reminders = plans.reduce((allReminders, plan) => {
            const planReminders = plan.reminders.map(reminder => ({
                ...reminder.toObject(),
                plan_id: plan._id,
                plan_title: plan.plan_title
            }));
            return [...allReminders, ...planReminders];
        }, []);

        res.json(reminders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Mark reminder as sent
router.patch('/:id/reminders/:reminderId', async (req, res) => {
    try {
        const { sent } = req.body;

        const plan = await StudyPlan.findById(req.params.id);
        if (!plan) return res.status(404).json({ message: 'Study plan not found' });

        const reminderIndex = plan.reminders.findIndex(
            r => r._id.toString() === req.params.reminderId
        );

        if (reminderIndex === -1) {
            return res.status(404).json({ message: 'Reminder not found' });
        }

        plan.reminders[reminderIndex].sent = sent;
        await plan.save();

        res.json(plan);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add a milestone
router.post('/:id/milestones', async (req, res) => {
    try {
        const plan = await StudyPlan.findById(req.params.id);
        if (!plan) return res.status(404).json({ message: 'Study plan not found' });

        plan.milestones.push(req.body);
        await plan.save();

        res.status(201).json(plan);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Mark milestone as completed
router.patch('/:id/milestones/:milestoneId', async (req, res) => {
    try {
        const { completed } = req.body;

        const plan = await StudyPlan.findById(req.params.id);
        if (!plan) return res.status(404).json({ message: 'Study plan not found' });

        const milestoneIndex = plan.milestones.findIndex(
            m => m._id.toString() === req.params.milestoneId
        );

        if (milestoneIndex === -1) {
            return res.status(404).json({ message: 'Milestone not found' });
        }

        plan.milestones[milestoneIndex].completed = completed;
        await plan.save();

        res.json(plan);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get calendar data for a user
router.get('/calendar/:userId', async (req, res) => {
    try {
        const plans = await StudyPlan.find({ user_id: req.params.userId });

        const calendarEvents = [];

        plans.forEach(plan => {
            plan.subjects.forEach(subject => {
                subject.study_sessions.forEach(session => {
                    calendarEvents.push({
                        id: session._id,
                        title: session.title,
                        start: `${session.session_date.toISOString().split('T')[0]}T${session.start_time}:00`,
                        end: `${session.session_date.toISOString().split('T')[0]}T${session.end_time}:00`,
                        color: subject.color,
                        extendedProps: {
                            plan_id: plan._id,
                            plan_title: plan.plan_title,
                            subject_id: subject._id,
                            subject_name: subject.subject_name,
                            topics: session.topics_covered,
                            completed: session.completed,
                            recurring: session.recurring,
                            recurrence_pattern: session.recurrence_pattern
                        }
                    });
                });
            });
        });

        res.json(calendarEvents);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;