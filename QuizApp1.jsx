import React, { useState, useEffect } from "react";
import "./QuizApp.css"; // Import the CSS file

const QuizApp = () => {
  const [quizData, setQuizData] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(10); // Timer for each question

  // Updated fallback data with more questions
  const fallbackData = {
    questions: [
      {
        question: "What is the capital of France?",
        options: ["Paris", "London", "Berlin", "Madrid"],
        correctAnswer: "Paris",
      },
      {
        question: "What is 2 + 2?",
        options: ["3", "4", "5", "6"],
        correctAnswer: "4",
      },
      {
        question: "Which planet is known as the Red Planet?",
        options: ["Earth", "Mars", "Jupiter", "Saturn"],
        correctAnswer: "Mars",
      },
      {
        question: "Who wrote 'To Kill a Mockingbird'?",
        options: ["Harper Lee", "Mark Twain", "J.K. Rowling", "Stephen King"],
        correctAnswer: "Harper Lee",
      },
      {
        question: "What is the largest mammal in the world?",
        options: ["Elephant", "Blue Whale", "Giraffe", "Shark"],
        correctAnswer: "Blue Whale",
      },
      {
        question: "Which country is known as the Land of the Rising Sun?",
        options: ["China", "Japan", "South Korea", "Thailand"],
        correctAnswer: "Japan",
      },
      {
        question: "What is the chemical symbol for water?",
        options: ["H2O", "CO2", "NaCl", "O2"],
        correctAnswer: "H2O",
      },
      {
        question: "Who painted the Mona Lisa?",
        options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Claude Monet"],
        correctAnswer: "Leonardo da Vinci",
      },
      {
        question: "What is the smallest prime number?",
        options: ["1", "2", "3", "5"],
        correctAnswer: "2",
      },
      {
        question: "Which element has the atomic number 1?",
        options: ["Helium", "Hydrogen", "Oxygen", "Carbon"],
        correctAnswer: "Hydrogen",
      },
    ],
  };

  // Fetch quiz data from the API
  useEffect(() => {
    fetch("https://api.jsonserve.com/Uw5CrX")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch quiz data: ${res.status} ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Fetched data:", data);
        setQuizData(data.questions || []);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching quiz data:", error);
        setError(error.message);
        // Use fallback data if the API fails
        setQuizData(fallbackData.questions);
        setIsLoading(false);
      });
  }, [fallbackData.questions]);

  // Timer logic
  useEffect(() => {
    if (quizStarted && !showResult && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      handleNextQuestion(); // Automatically move to the next question
    }
  }, [quizStarted, showResult, timeLeft]);

  // Reset the timer for each new question
  useEffect(() => {
    setTimeLeft(10);
  }, [currentQuestion]);

  // Handle answer selection
  const handleAnswerClick = (answer) => {
    setSelectedAnswer(answer);
  };

  // Move to the next question or show results
  const handleNextQuestion = () => {
    if (selectedAnswer === quizData[currentQuestion]?.correctAnswer) {
      setScore(score + 1);
    }
    setSelectedAnswer(null);
    if (currentQuestion + 1 < quizData.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  // Restart the quiz
  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setQuizStarted(false);
    setTimeLeft(10);
  };

  // Loading state
  if (isLoading) {
    return <p className="loading">Loading quiz...</p>;
  }

  return (
    <div className="quiz-container">
      {!quizStarted ? (
        <div className="welcome-screen">
          <h1>Welcome to the Quiz!</h1>
          <button onClick={() => setQuizStarted(true)}>Start Quiz</button>
        </div>
      ) : showResult ? (
        <div className="result-screen">
          <h2>Quiz Completed!</h2>
          <p>
            Your Score: {score} / {quizData.length}
          </p>
          <button onClick={restartQuiz}>Restart Quiz</button>
        </div>
      ) : (
        <div className="quiz-question">
          <div className="timer">Time Left: {timeLeft}s</div>
          <h2>{quizData[currentQuestion]?.question}</h2>
          <div className="options">
            {quizData[currentQuestion]?.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerClick(option)}
                className={selectedAnswer === option ? "selected" : ""}
              >
                {option}
              </button>
            ))}
          </div>
          <div className="footer">
            <button
              onClick={handleNextQuestion}
              disabled={!selectedAnswer}
              className="next-button"
            >
              {currentQuestion + 1 < quizData.length ? "Next" : "Finish"}
            </button>
          </div>
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{
                width: `${((currentQuestion + 1) / quizData.length) * 100}%`,
              }}
            ></div>
          </div>
          <p className="question-count">
            Question {currentQuestion + 1} of {quizData.length}
          </p>
        </div>
      )}
      {error && (
        <p className="error-message">
          Error: {error}. Using fallback data.
        </p>
      )}
    </div>
  );
};

export default QuizApp;