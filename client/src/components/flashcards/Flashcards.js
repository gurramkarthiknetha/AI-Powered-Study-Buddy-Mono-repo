import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Flashcards.css';

const Flashcards = () => {
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [currentSet, setCurrentSet] = useState(null);
  const [newSet, setNewSet] = useState({
    subject: '',
    questions: [{ question: '', answer: '', difficulty: 'medium' }]
  });

  useEffect(() => {
    fetchFlashcards();
  }, []);

  const fetchFlashcards = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/flashcards');
      setFlashcardSets(response.data);
    } catch (error) {
      console.error('Error fetching flashcards:', error);
    }
  };

  const handleCreateSet = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/flashcards', {
        ...newSet,
        user_id: "507f1f77bcf86cd799439011"
      });
      fetchFlashcards();
      setNewSet({ subject: '', questions: [{ question: '', answer: '', difficulty: 'medium' }] });
    } catch (error) {
      console.error('Error creating flashcard set:', error);
    }
  };

  const addQuestion = () => {
    setNewSet({
      ...newSet,
      questions: [...newSet.questions, { question: '', answer: '', difficulty: 'medium' }]
    });
  };

  return (
    <div className="flashcards">
      <div className="create-flashcards">
        <h2>Create New Flashcard Set</h2>
        <form onSubmit={handleCreateSet}>
          <input
            type="text"
            placeholder="Subject"
            value={newSet.subject}
            onChange={(e) => setNewSet({ ...newSet, subject: e.target.value })}
          />
          
          {newSet.questions.map((q, index) => (
            <div key={index} className="question-input">
              <input
                type="text"
                placeholder="Question"
                value={q.question}
                onChange={(e) => {
                  const questions = [...newSet.questions];
                  questions[index].question = e.target.value;
                  setNewSet({ ...newSet, questions });
                }}
              />
              <input
                type="text"
                placeholder="Answer"
                value={q.answer}
                onChange={(e) => {
                  const questions = [...newSet.questions];
                  questions[index].answer = e.target.value;
                  setNewSet({ ...newSet, questions });
                }}
              />
              <select
                value={q.difficulty}
                onChange={(e) => {
                  const questions = [...newSet.questions];
                  questions[index].difficulty = e.target.value;
                  setNewSet({ ...newSet, questions });
                }}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          ))}
          
          <button type="button" onClick={addQuestion}>Add Question</button>
          <button type="submit">Create Set</button>
        </form>
      </div>

      <div className="flashcard-sets">
        <h2>Your Flashcard Sets</h2>
        <div className="sets-grid">
          {flashcardSets.map((set) => (
            <div key={set._id} className="set-card">
              <h3>{set.subject}</h3>
              <p>{set.questions.length} cards</p>
              <button onClick={() => setCurrentSet(set)}>Study Now</button>
            </div>
          ))}
        </div>
      </div>

      {currentSet && (
        <div className="study-mode">
          <h3>Studying: {currentSet.subject}</h3>
          <div className="flashcard-review">
            {currentSet.questions.map((q, index) => (
              <div key={index} className="flashcard">
                <div className="front">{q.question}</div>
                <div className="back">{q.answer}</div>
              </div>
            ))}
          </div>
          <button onClick={() => setCurrentSet(null)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default Flashcards;