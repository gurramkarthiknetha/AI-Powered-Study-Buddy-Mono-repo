import mongoose from 'mongoose';

// Create consistent user IDs to use across all collections
const SAMPLE_USER_ID = new mongoose.Types.ObjectId("507f1f77bcf86cd799439011");
const GURRAM_USER_ID = new mongoose.Types.ObjectId("507f1f77bcf86cd799439022");

export const sampleData = {
  // Students/Users data
  students: [
    {
      _id: SAMPLE_USER_ID,
      name: "John Doe",
      email: "john.doe@example.com",
      password_hash: "$2a$10$XOPbrlUPQdwdJUpSrIF6X.LbE14qsMmKGhM1A8W9iqaG3vv1BD7WC", // 'password123'
      role: "student",
      preferences: {
        study_plan_type: "structured",
        study_times: ["morning", "evening"],
        notification_enabled: true,
      },
      study_data: {
        total_study_time: 1200, // in minutes
        total_progress: 65, // percentage
        performance: {
          last_assessment_score: 85,
          average_score: 78,
        }
      }
    },
    {
      _id: GURRAM_USER_ID,
      name: "Karthik Gurram",
      email: "gurram@gmail.com",
      password_hash: "$2a$10$Xt9Qs.GqQZe.YaUkIBU.eeHyFzIaFmEJ3F0/F.BGiGHXxvQdaEpDK", // 'Karthik@2006'
      role: "student",
      preferences: {
        study_plan_type: "structured",
        study_times: ["morning", "evening", "night"],
        notification_enabled: true,
      },
      study_data: {
        total_study_time: 1500, // in minutes
        total_progress: 75, // percentage
        performance: {
          last_assessment_score: 90,
          average_score: 85,
        }
      }
    },
    {
      name: "Jane Smith",
      email: "jane.smith@example.com",
      password_hash: "$2a$10$XOPbrlUPQdwdJUpSrIF6X.LbE14qsMmKGhM1A8W9iqaG3vv1BD7WC", // 'password123'
      role: "student",
      preferences: {
        study_plan_type: "freeform",
        study_times: ["afternoon"],
        notification_enabled: true,
      },
      study_data: {
        total_study_time: 800, // in minutes
        total_progress: 45, // percentage
        performance: {
          last_assessment_score: 75,
          average_score: 72,
        }
      }
    }
  ],

  // Study Plans data
  studyPlans: [
    {
      user_id: SAMPLE_USER_ID,
      plan_title: "Final Exams Preparation",
      description: "Comprehensive study plan for final exams",
      start_date: new Date("2023-11-01"),
      end_date: new Date("2023-12-15"),
      goal_type: "milestone-based",
      overall_progress: 65,
      calendar_integrated: true,
      calendar_id: "primary",
      subjects: [
        {
          subject_name: "Mathematics",
          start_date: new Date("2023-11-01"),
          end_date: new Date("2023-11-15"),
          color: "#4a90e2",
          progress: 80,
          topics: [
            {
              name: "Calculus",
              completed: true,
              priority: "high"
            },
            {
              name: "Linear Algebra",
              completed: false,
              priority: "medium"
            }
          ]
        },
        {
          subject_name: "Physics",
          start_date: new Date("2023-11-16"),
          end_date: new Date("2023-11-30"),
          color: "#e24a4a",
          progress: 50,
          topics: [
            {
              name: "Mechanics",
              completed: true,
              priority: "high"
            },
            {
              name: "Electromagnetism",
              completed: false,
              priority: "high"
            }
          ]
        }
      ],
      reminders: [
        {
          title: "Math Exam Reminder",
          message: "Don't forget to review calculus formulas",
          reminder_date: new Date("2023-11-14"),
          reminder_time: "18:00",
          sent: false,
          type: "in-app"
        }
      ],
      milestones: [
        {
          title: "Complete Math Review",
          description: "Finish all math topics review",
          due_date: new Date("2023-11-15"),
          completed: true
        },
        {
          title: "Complete Physics Review",
          description: "Finish all physics topics review",
          due_date: new Date("2023-11-30"),
          completed: false
        }
      ]
    },
    {
      user_id: GURRAM_USER_ID,
      plan_title: "Web Development Mastery",
      description: "Comprehensive plan to master full-stack web development",
      start_date: new Date("2023-10-15"),
      end_date: new Date("2024-01-15"),
      goal_type: "topic-based",
      overall_progress: 40,
      calendar_integrated: true,
      calendar_id: "primary",
      subjects: [
        {
          subject_name: "Frontend Development",
          start_date: new Date("2023-10-15"),
          end_date: new Date("2023-11-15"),
          color: "#4834d4",
          progress: 70,
          topics: [
            {
              name: "React.js",
              completed: true,
              priority: "high"
            },
            {
              name: "CSS Frameworks",
              completed: true,
              priority: "medium"
            },
            {
              name: "State Management",
              completed: false,
              priority: "high"
            }
          ]
        },
        {
          subject_name: "Backend Development",
          start_date: new Date("2023-11-16"),
          end_date: new Date("2023-12-15"),
          color: "#6ab04c",
          progress: 30,
          topics: [
            {
              name: "Node.js",
              completed: true,
              priority: "high"
            },
            {
              name: "Express.js",
              completed: false,
              priority: "high"
            },
            {
              name: "MongoDB",
              completed: false,
              priority: "medium"
            }
          ]
        },
        {
          subject_name: "DevOps",
          start_date: new Date("2023-12-16"),
          end_date: new Date("2024-01-15"),
          color: "#eb4d4b",
          progress: 10,
          topics: [
            {
              name: "Docker",
              completed: false,
              priority: "medium"
            },
            {
              name: "CI/CD",
              completed: false,
              priority: "low"
            }
          ]
        }
      ],
      reminders: [
        {
          title: "React Project Deadline",
          message: "Complete your React project by this date",
          reminder_date: new Date("2023-11-10"),
          reminder_time: "20:00",
          sent: true,
          type: "in-app"
        },
        {
          title: "Backend Study Session",
          message: "Start your Node.js learning session",
          reminder_date: new Date("2023-11-20"),
          reminder_time: "19:00",
          sent: false,
          type: "email"
        }
      ],
      milestones: [
        {
          title: "Complete Frontend Project",
          description: "Finish the React-based portfolio website",
          due_date: new Date("2023-11-15"),
          completed: true
        },
        {
          title: "Build REST API",
          description: "Create a fully functional REST API with Express and MongoDB",
          due_date: new Date("2023-12-15"),
          completed: false
        },
        {
          title: "Deploy Full-Stack Application",
          description: "Deploy the complete application to cloud platform",
          due_date: new Date("2024-01-10"),
          completed: false
        }
      ]
    }
  ],

  // Pomodoro Timer data
  pomodoroTimers: [
    {
      user_id: SAMPLE_USER_ID,
      start_time: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      end_time: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      session_duration: 25,
      distractions_blocked: ["facebook.com", "twitter.com", "instagram.com"]
    },
    {
      user_id: SAMPLE_USER_ID,
      start_time: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      end_time: new Date(Date.now() - 95 * 60 * 1000), // 1 hour 35 minutes ago
      session_duration: 25,
      distractions_blocked: ["youtube.com", "netflix.com"]
    },
    {
      user_id: GURRAM_USER_ID,
      start_time: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
      end_time: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
      session_duration: 30,
      distractions_blocked: ["facebook.com", "twitter.com", "instagram.com", "reddit.com"]
    },
    {
      user_id: GURRAM_USER_ID,
      start_time: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
      end_time: new Date(Date.now() - 2.5 * 60 * 60 * 1000), // 2.5 hours ago
      session_duration: 30,
      distractions_blocked: ["youtube.com", "netflix.com", "twitch.tv"]
    },
    {
      user_id: GURRAM_USER_ID,
      start_time: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      end_time: new Date(Date.now() - 23.5 * 60 * 60 * 1000), // 23.5 hours ago
      session_duration: 30,
      distractions_blocked: ["facebook.com", "twitter.com"]
    }
  ],

  // Performance data
  performances: [
    {
      user_id: SAMPLE_USER_ID,
      quiz_id: "math_quiz_1",
      score: 85,
      total_questions: 10,
      correct_answers: 8,
      incorrect_answers: 2,
      quiz_duration: 15 // in minutes
    },
    {
      user_id: SAMPLE_USER_ID,
      quiz_id: "physics_quiz_1",
      score: 70,
      total_questions: 10,
      correct_answers: 7,
      incorrect_answers: 3,
      quiz_duration: 20 // in minutes
    },
    {
      user_id: GURRAM_USER_ID,
      quiz_id: "javascript_quiz_1",
      score: 90,
      total_questions: 10,
      correct_answers: 9,
      incorrect_answers: 1,
      quiz_duration: 12 // in minutes
    },
    {
      user_id: GURRAM_USER_ID,
      quiz_id: "react_quiz_1",
      score: 95,
      total_questions: 20,
      correct_answers: 19,
      incorrect_answers: 1,
      quiz_duration: 25 // in minutes
    },
    {
      user_id: GURRAM_USER_ID,
      quiz_id: "node_quiz_1",
      score: 85,
      total_questions: 15,
      correct_answers: 13,
      incorrect_answers: 2,
      quiz_duration: 18 // in minutes
    }
  ],

  // Gamification data
  gamifications: [
    {
      user_id: SAMPLE_USER_ID,
      points: 1250,
      badges: ["Fast Learner", "Consistent", "Problem Solver"],
      level: "Intermediate",
      rewards: ["Study Guide Unlock", "Extra Practice Problems"],
      userProgress: {
        level: 5,
        experience: 2340,
        nextLevelXP: 3000,
        totalPoints: 4580,
        streak: 7
      },
      achievements: [
        {
          id: 1,
          title: "First Steps",
          description: "Complete your first study session",
          icon: "🏆",
          progress: 100,
          completed: true,
          reward: 100
        },
        {
          id: 2,
          title: "Knowledge Seeker",
          description: "Complete 10 study sessions",
          icon: "📚",
          progress: 70,
          completed: false,
          reward: 250
        }
      ],
      leaderboard: [
        {
          id: 1,
          name: "John Doe",
          points: 4580,
          rank: 1
        },
        {
          id: 2,
          name: "Jane Smith",
          points: 3950,
          rank: 2
        },
        {
          id: 3,
          name: "Bob Johnson",
          points: 3200,
          rank: 3
        }
      ],
      studyStats: {
        totalStudyTime: "24h 30m",
        sessionsCompleted: 15,
        averageScore: 78,
        topSubject: "Mathematics"
      }
    },
    {
      user_id: GURRAM_USER_ID,
      points: 1850,
      badges: ["Code Master", "Night Owl", "Quick Learner", "Persistent"],
      level: "Advanced",
      rewards: ["Premium Templates", "Advanced Tutorials", "AI Assistant Access"],
      userProgress: {
        level: 7,
        experience: 3650,
        nextLevelXP: 4000,
        totalPoints: 6280,
        streak: 12
      },
      achievements: [
        {
          id: 1,
          title: "First Steps",
          description: "Complete your first study session",
          icon: "🏆",
          progress: 100,
          completed: true,
          reward: 100
        },
        {
          id: 2,
          title: "Knowledge Seeker",
          description: "Complete 10 study sessions",
          icon: "📚",
          progress: 100,
          completed: true,
          reward: 250
        },
        {
          id: 3,
          title: "Coding Expert",
          description: "Complete 5 programming projects",
          icon: "💻",
          progress: 80,
          completed: false,
          reward: 300
        },
        {
          id: 4,
          title: "Perfect Streak",
          description: "Maintain a 10-day study streak",
          icon: "🔥",
          progress: 100,
          completed: true,
          reward: 200
        }
      ],
      leaderboard: [
        {
          id: 1,
          name: "Karthik Gurram",
          points: 6280,
          rank: 1
        },
        {
          id: 2,
          name: "John Doe",
          points: 4580,
          rank: 2
        },
        {
          id: 3,
          name: "Jane Smith",
          points: 3950,
          rank: 3
        },
        {
          id: 4,
          name: "Bob Johnson",
          points: 3200,
          rank: 4
        }
      ],
      studyStats: {
        totalStudyTime: "42h 15m",
        sessionsCompleted: 28,
        averageScore: 92,
        topSubject: "Web Development"
      }
    }
  ],

  // Flashcard data
  flashcards: [
    {
      user_id: SAMPLE_USER_ID,
      subject: "Mathematics",
      questions: [
        {
          question: "What is the quadratic formula?",
          answer: "x = (-b ± √(b² - 4ac)) / 2a",
          difficulty: "medium"
        },
        {
          question: "What is the derivative of sin(x)?",
          answer: "cos(x)",
          difficulty: "easy"
        }
      ]
    },
    {
      user_id: SAMPLE_USER_ID,
      subject: "Physics",
      questions: [
        {
          question: "What is Newton's Second Law?",
          answer: "F = ma (Force equals mass times acceleration)",
          difficulty: "medium"
        },
        {
          question: "What is the formula for kinetic energy?",
          answer: "KE = (1/2)mv² (half mass times velocity squared)",
          difficulty: "medium"
        }
      ]
    },
    {
      user_id: GURRAM_USER_ID,
      subject: "JavaScript",
      questions: [
        {
          question: "What is a closure in JavaScript?",
          answer: "A closure is a function that has access to its own scope, the scope of the outer function, and the global scope.",
          difficulty: "medium"
        },
        {
          question: "What is the difference between let and var?",
          answer: "let is block-scoped while var is function-scoped. let doesn't allow redeclaration and isn't hoisted to the top.",
          difficulty: "easy"
        },
        {
          question: "What is a Promise in JavaScript?",
          answer: "A Promise is an object representing the eventual completion or failure of an asynchronous operation.",
          difficulty: "medium"
        }
      ]
    },
    {
      user_id: GURRAM_USER_ID,
      subject: "React",
      questions: [
        {
          question: "What is JSX?",
          answer: "JSX is a syntax extension for JavaScript that looks similar to HTML and allows you to write HTML in React.",
          difficulty: "easy"
        },
        {
          question: "What is the virtual DOM?",
          answer: "The virtual DOM is a lightweight copy of the actual DOM that React uses to improve performance by minimizing direct DOM manipulation.",
          difficulty: "medium"
        },
        {
          question: "What are React hooks?",
          answer: "Hooks are functions that let you use state and other React features without writing a class component.",
          difficulty: "medium"
        },
        {
          question: "What is the purpose of useEffect?",
          answer: "useEffect is used for side effects in function components, similar to componentDidMount, componentDidUpdate, and componentWillUnmount in class components.",
          difficulty: "hard"
        }
      ]
    }
  ],

  // Chatbot Interaction data
  chatbotInteractions: [
    {
      user_id: SAMPLE_USER_ID,
      interaction_type: "question",
      question: "Can you explain the concept of integration?",
      answer: "Integration is the process of finding the antiderivative of a function. It's used to calculate areas, volumes, and other quantities by accumulating the values of a function.",
      resolved: true
    },
    {
      user_id: SAMPLE_USER_ID,
      interaction_type: "explanation",
      question: "I need help understanding quantum mechanics.",
      answer: "Quantum mechanics is a fundamental theory in physics that describes nature at the smallest scales of energy levels of atoms and subatomic particles. It's characterized by wave-particle duality, uncertainty principle, and quantum entanglement.",
      resolved: true
    },
    {
      user_id: GURRAM_USER_ID,
      interaction_type: "question",
      question: "What is the difference between React and Angular?",
      answer: "React is a JavaScript library for building user interfaces, while Angular is a complete framework. React uses a virtual DOM and one-way data binding, while Angular uses real DOM and two-way data binding. React has a smaller learning curve and is more flexible, while Angular provides more structure and built-in functionality.",
      resolved: true
    },
    {
      user_id: GURRAM_USER_ID,
      interaction_type: "explanation",
      question: "Explain how JWT authentication works.",
      answer: "JWT (JSON Web Token) authentication works by creating a token when a user logs in. This token contains encoded user information and is signed with a secret key. The client stores this token and sends it with subsequent requests in the Authorization header. The server verifies the token's signature and extracts the user information without needing to query the database, making it stateless and scalable.",
      resolved: true
    },
    {
      user_id: GURRAM_USER_ID,
      interaction_type: "question",
      question: "What are the best practices for React performance optimization?",
      answer: "Some best practices for React performance optimization include: 1) Using React.memo for component memoization, 2) Implementing useCallback and useMemo hooks to prevent unnecessary re-renders, 3) Using virtualization for long lists with react-window or react-virtualized, 4) Code-splitting with React.lazy and Suspense, 5) Avoiding inline function definitions in render methods, and 6) Using the production build of React for deployment.",
      resolved: true
    }
  ],

  // Profile data
  profiles: [
    {
      userId: SAMPLE_USER_ID.toString(),
      profileImage: {
        url: "https://randomuser.me/api/portraits/men/1.jpg",
        publicId: "profile/user1"
      },
      bio: "Computer Science student passionate about AI and machine learning.",
      educationLevel: "bachelors",
      subjects: ["Computer Science", "Mathematics", "Physics"],
      learningGoals: ["Master AI concepts", "Improve programming skills", "Prepare for graduate studies"],
      preferredLearningStyle: "visual",
      studySchedule: {
        preferredTime: "evening",
        weeklyHours: 20,
        preferredDays: ["Monday", "Wednesday", "Friday", "Saturday"],
        reminderEnabled: true,
        reminderTime: "18:00"
      },
      achievements: [
        {
          title: "Dean's List",
          date: new Date("2023-05-15"),
          description: "Achieved top grades in the semester"
        }
      ],
      socialLinks: {
        linkedin: "https://linkedin.com/in/johndoe",
        github: "https://github.com/johndoe",
        website: "https://johndoe.dev"
      },
      preferences: {
        theme: "dark",
        accentColor: "#4a6cf7",
        notifications: {
          studyReminders: true,
          achievements: true,
          messages: true
        },
        privacy: {
          showProfileToOthers: true,
          showProgressToOthers: true,
          showAchievementsToOthers: true
        }
      }
    },
    {
      userId: GURRAM_USER_ID.toString(),
      profileImage: {
        url: "https://randomuser.me/api/portraits/men/5.jpg",
        publicId: "profile/karthik"
      },
      bio: "Software Engineering student with a focus on web development and AI applications.",
      educationLevel: "masters",
      subjects: ["Software Engineering", "Web Development", "Artificial Intelligence", "Data Science"],
      learningGoals: ["Become a full-stack developer", "Build AI-powered applications", "Learn cloud architecture"],
      preferredLearningStyle: "kinesthetic",
      studySchedule: {
        preferredTime: "night",
        weeklyHours: 25,
        preferredDays: ["Monday", "Tuesday", "Thursday", "Sunday"],
        reminderEnabled: true,
        reminderTime: "20:00"
      },
      achievements: [
        {
          title: "Hackathon Winner",
          date: new Date("2023-08-10"),
          description: "First place in university hackathon"
        },
        {
          title: "Perfect Attendance",
          date: new Date("2023-06-30"),
          description: "Completed semester with perfect attendance"
        }
      ],
      socialLinks: {
        linkedin: "https://linkedin.com/in/karthikgurram",
        github: "https://github.com/karthikgurram",
        twitter: "https://twitter.com/karthikgurram",
        website: "https://karthikgurram.dev"
      },
      preferences: {
        theme: "system",
        accentColor: "#6c5ce7",
        notifications: {
          studyReminders: true,
          achievements: true,
          messages: true
        },
        privacy: {
          showProfileToOthers: true,
          showProgressToOthers: true,
          showAchievementsToOthers: false
        }
      }
    }
  ]
};
