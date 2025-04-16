import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './StudyPlan.css';

const StudyPlan = () => {
  const [plans, setPlans] = useState([]);
  const [newPlan, setNewPlan] = useState({
    plan_title: '',
    subjects: []
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/study-plans');
      setPlans(response.data);
    } catch (error) {
      console.error('Error fetching study plans:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/study-plans', {
        ...newPlan,
        user_id: "507f1f77bcf86cd799439011" // Temporary user ID
      });
      fetchPlans();
      setNewPlan({ plan_title: '', subjects: [] });
    } catch (error) {
      console.error('Error creating study plan:', error);
    }
  };

  return (
    <div className="study-plan">
      <h2>Study Plans</h2>
      
      <form onSubmit={handleSubmit} className="plan-form">
        <input
          type="text"
          placeholder="Plan Title"
          value={newPlan.plan_title}
          onChange={(e) => setNewPlan({...newPlan, plan_title: e.target.value})}
        />
        <button type="submit">Create Plan</button>
      </form>

      <div className="plans-list">
        {plans.map((plan) => (
          <div key={plan._id} className="plan-card">
            <h3>{plan.plan_title}</h3>
            <div className="subjects">
              {plan.subjects.map((subject, index) => (
                <div key={index} className="subject-item">
                  <h4>{subject.subject_name}</h4>
                  <p>Start: {new Date(subject.start_date).toLocaleDateString()}</p>
                  <p>End: {new Date(subject.end_date).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudyPlan;