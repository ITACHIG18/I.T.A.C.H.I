import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

// =========================================
// CONSTANTS
// =========================================

const API_URL = "http://127.0.0.1:5000/api";

const TEST_DURATION = 10 * 60;

// =========================================
// APP
// =========================================

function App() {
  // =======================================
  // NAVIGATION
  // =======================================

  const [activePage, setActivePage] =
    useState("Dashboard");

  // =======================================
  // UNITS
  // =======================================

  const [units, setUnits] = useState(() => {
    try {
      const savedUnits =
        localStorage.getItem("studymate_units");

      if (!savedUnits) {
        return [];
      }

      const parsedUnits =
        JSON.parse(savedUnits);

      return Array.isArray(parsedUnits)
        ? parsedUnits
        : [];
    } catch (error) {
      console.error(
        "Could not load saved units:",
        error
      );

      return [];
    }
  });

  // =======================================
  // SELECTED UNIT
  // =======================================

  const [selectedUnit, setSelectedUnit] =
    useState(null);

  // =======================================
  // ADD UNIT MODAL
  // =======================================

  const [showAddUnit, setShowAddUnit] =
    useState(false);

  const [newUnitName, setNewUnitName] =
    useState("");

  // =======================================
  // PDF
  // =======================================

  const [selectedFile, setSelectedFile] =
    useState(null);

  const [extractedText, setExtractedText] =
    useState("");

  const [uploading, setUploading] =
    useState(false);

  // =======================================
  // AI NOTES
  // =======================================

  const [studyNotes, setStudyNotes] =
    useState("");

  const [generatingNotes, setGeneratingNotes] =
    useState(false);

  // =======================================
  // TEST
  // =======================================

  const [testQuestions, setTestQuestions] =
    useState([]);

  const [testAnswers, setTestAnswers] =
    useState({});

  const [currentQuestion, setCurrentQuestion] =
    useState(0);

  const [testTimeLeft, setTestTimeLeft] =
    useState(TEST_DURATION);

  const [testStarted, setTestStarted] =
    useState(false);

  const [testFinished, setTestFinished] =
    useState(false);

  const [testGenerating, setTestGenerating] =
    useState(false);

  const [testScore, setTestScore] =
    useState(null);

  const [testResult, setTestResult] =
    useState(null);

  // =======================================
  // TEST HISTORY
  // =======================================

  const [testHistory, setTestHistory] =
    useState(() => {
      try {
        const savedHistory =
          localStorage.getItem(
            "studymate_test_history"
          );

        if (!savedHistory) {
          return [];
        }

        const parsed =
          JSON.parse(savedHistory);

        return Array.isArray(parsed)
          ? parsed
          : [];
      } catch (error) {
        console.error(
          "Could not load test history:",
          error
        );

        return [];
      }
    });

  // =======================================
  // SETTINGS
  // =======================================

  const [studyMode, setStudyMode] =
    useState(() => {
      return (
        localStorage.getItem(
          "studymate_study_mode"
        ) || "Dark Crimson"
      );
    });

  const [notesStyle, setNotesStyle] =
    useState(() => {
      return (
        localStorage.getItem(
          "studymate_notes_style"
        ) || "Short & Exam-Focused"
      );
    });

  const [autoSave, setAutoSave] =
    useState(() => {
      const saved =
        localStorage.getItem(
          "studymate_auto_save"
        );

      return saved === null
        ? true
        : saved === "true";
    });

  const [settingsMessage, setSettingsMessage] =
    useState("");

  // =======================================
  // SAVE UNITS
  // =======================================

  useEffect(() => {
    if (!autoSave) {
      return;
    }

    try {
      localStorage.setItem(
        "studymate_units",
        JSON.stringify(units)
      );
    } catch (error) {
      console.error(
        "Could not save units:",
        error
      );
    }
  }, [units, autoSave]);

  // =======================================
  // SAVE TEST HISTORY
  // =======================================

  useEffect(() => {
    if (!autoSave) {
      return;
    }

    try {
      localStorage.setItem(
        "studymate_test_history",
        JSON.stringify(testHistory)
      );
    } catch (error) {
      console.error(
        "Could not save test history:",
        error
      );
    }
  }, [testHistory, autoSave]);

  // =======================================
  // SAVE SETTINGS
  // =======================================

  useEffect(() => {
    try {
      localStorage.setItem(
        "studymate_study_mode",
        studyMode
      );
    } catch (error) {
      console.error(
        "Could not save study mode:",
        error
      );
    }
  }, [studyMode]);

  useEffect(() => {
    try {
      localStorage.setItem(
        "studymate_notes_style",
        notesStyle
      );
    } catch (error) {
      console.error(
        "Could not save notes style:",
        error
      );
    }
  }, [notesStyle]);

  useEffect(() => {
    try {
      localStorage.setItem(
        "studymate_auto_save",
        String(autoSave)
      );
    } catch (error) {
      console.error(
        "Could not save auto-save setting:",
        error
      );
    }
  }, [autoSave]);

  // =======================================
  // SETTINGS MESSAGE
  // =======================================

  const showSettingsMessage = (message) => {
    setSettingsMessage(message);

    setTimeout(() => {
      setSettingsMessage("");
    }, 2500);
  };

  // =======================================
  // RESET TEST STATE
  // =======================================

  const resetTestState = () => {
    setTestQuestions([]);
    setTestAnswers({});
    setCurrentQuestion(0);
    setTestTimeLeft(TEST_DURATION);
    setTestStarted(false);
    setTestFinished(false);
    setTestScore(null);
    setTestResult(null);
  };

  // =======================================
  // ADD UNIT
  // =======================================

  const handleAddUnit = () => {
    const trimmedName =
      newUnitName.trim();

    if (!trimmedName) {
      alert(
        "Please enter a unit name."
      );

      return;
    }

    const newUnit = {
      id: Date.now(),
      name: trimmedName,
      notes: 0,
      tests: 0,
      score: null,
      pdf: null,
      extractedText: "",
      studyNotes: "",
    };

    setUnits(
      (previousUnits) => [
        ...previousUnits,
        newUnit,
      ]
    );

    setNewUnitName("");
    setShowAddUnit(false);
  };

  // =======================================
  // DELETE UNIT
  // =======================================

  const handleDeleteUnit = (
    unitId
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this unit?"
      );

    if (!confirmed) {
      return;
    }

    setUnits(
      (previousUnits) =>
        previousUnits.filter(
          (unit) =>
            unit.id !== unitId
        )
    );

    if (
      selectedUnit?.id === unitId
    ) {
      setSelectedUnit(null);
      setSelectedFile(null);
      setExtractedText("");
      setStudyNotes("");

      resetTestState();

      setActivePage("Units");
    }
  };

  // =======================================
  // OPEN UNIT
  // =======================================

  const handleOpenUnit = (
    unit
  ) => {
    setSelectedUnit(unit);

    if (unit.pdf) {
      setSelectedFile({
        name:
          unit.pdf.name ||
          "Uploaded PDF",

        size:
          unit.pdf.size || 0,

        type:
          unit.pdf.type ||
          "application/pdf",

        filename:
          unit.pdf.filename ||
          "",

        pages:
          unit.pdf.pages || 0,
      });
    } else {
      setSelectedFile(null);
    }

    setExtractedText(
      unit.extractedText || ""
    );

    setStudyNotes(
      unit.studyNotes || ""
    );

    resetTestState();

    setActivePage("Unit");
  };

  // =======================================
  // BACK TO UNITS
  // =======================================

  const handleBackToUnits = () => {
    setSelectedUnit(null);
    setSelectedFile(null);
    setExtractedText("");
    setStudyNotes("");

    resetTestState();

    setActivePage("Units");
  };

  // =======================================
  // PDF UPLOAD
  // =======================================

  const handlePdfUpload = async (
    event
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (
      file.type !==
        "application/pdf" &&
      !file.name
        .toLowerCase()
        .endsWith(".pdf")
    ) {
      alert(
        "Please select a PDF file."
      );

      event.target.value = "";

      return;
    }

    setSelectedFile(file);
    setExtractedText("");
    setStudyNotes("");

    try {
      setUploading(true);

      const formData =
        new FormData();

      formData.append(
        "file",
        file
      );

      const response =
        await axios.post(
          `${API_URL}/upload-pdf`,
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

      const extractedPdfText =
        response.data.text || "";

      const savedPdf = {
        name: file.name,
        size: file.size,
        type:
          file.type ||
          "application/pdf",

        filename:
          response.data
            .filename || "",

        pages:
          response.data.pages || 0,
      };

      setExtractedText(
        extractedPdfText
      );

      setStudyNotes("");

      setSelectedFile({
        name: file.name,
        size: file.size,
        type:
          file.type ||
          "application/pdf",

        filename:
          response.data
            .filename || "",

        pages:
          response.data.pages || 0,
      });

      setUnits(
        (previousUnits) =>
          previousUnits.map(
            (unit) =>
              unit.id ===
              selectedUnit?.id
                ? {
                    ...unit,
                    pdf: savedPdf,
                    extractedText:
                      extractedPdfText,
                    studyNotes: "",
                    notes: 0,
                  }
                : unit
          )
      );

      setSelectedUnit(
        (previousUnit) => {
          if (!previousUnit) {
            return previousUnit;
          }

          return {
            ...previousUnit,
            pdf: savedPdf,
            extractedText:
              extractedPdfText,
            studyNotes: "",
            notes: 0,
          };
        }
      );

      alert(
        `PDF processed successfully!\n\nPages: ${
          response.data.pages || 0
        }`
      );
    } catch (error) {
      console.error(
        "PDF upload error:",
        error
      );

      const errorMessage =
        error.response?.data
          ?.error ||
        "Something went wrong while processing the PDF.";

      alert(errorMessage);

      setSelectedFile(null);
    } finally {
      setUploading(false);

      event.target.value = "";
    }
  };

  // =======================================
  // GENERATE AI NOTES
  // =======================================

  const handleGenerateNotes =
    async () => {
      if (!extractedText.trim()) {
        alert(
          "Please upload and process a PDF first."
        );

        return;
      }

      try {
        setGeneratingNotes(true);
        setStudyNotes("");

        const response =
          await axios.post(
            `${API_URL}/generate-notes`,
            {
              text: extractedText,
            }
          );

        const notes =
          response.data.notes || "";

        setStudyNotes(notes);

        setUnits(
          (previousUnits) =>
            previousUnits.map(
              (unit) =>
                unit.id ===
                selectedUnit?.id
                  ? {
                      ...unit,
                      studyNotes:
                        notes,
                      notes: notes
                        ? 1
                        : 0,
                    }
                  : unit
            )
        );

        setSelectedUnit(
          (previousUnit) => {
            if (!previousUnit) {
              return previousUnit;
            }

            return {
              ...previousUnit,
              studyNotes: notes,
              notes: notes
                ? 1
                : 0,
            };
          }
        );
      } catch (error) {
        console.error(
          "AI notes error:",
          error
        );

        const errorMessage =
          error.response?.data
            ?.error ||
          "Something went wrong while generating study notes.";

        alert(errorMessage);
      } finally {
        setGeneratingNotes(false);
      }
    };

  // =======================================
  // GENERATE TEST
  // =======================================

  const handleGenerateTest =
    async (options = {}) => {
      const materialText =
        options.text ||
        extractedText;

      if (!materialText.trim()) {
        alert(
          "Please upload and process a PDF first."
        );

        return;
      }

      // Save previous questions BEFORE
      // resetting the test state.
      const previousQuestions =
        testQuestions.map(
          (question) =>
            question.question
        );

      try {
        resetTestState();

        setTestGenerating(true);

        setActivePage("Test");

        const attemptId =
          `${Date.now()}-${Math.random()
            .toString(36)
            .substring(2, 10)}`;

        console.log(
          "Generating fresh test attempt:",
          attemptId
        );

        console.log(
          "Previous questions being sent:",
          previousQuestions.length
        );

        const response =
          await axios.post(
            `${API_URL}/generate-test`,
            {
              text: materialText,

              attempt:
                attemptId,

              previousQuestions:
                previousQuestions,
            }
          );

        console.log(
          "Generate test response:",
          response.data
        );

        const questions =
          response.data.questions ||
          [];

        if (
          !Array.isArray(
            questions
          )
        ) {
          throw new Error(
            "The server returned an invalid test format."
          );
        }

        if (
          questions.length !== 30
        ) {
          throw new Error(
            `The test contained ${questions.length} questions instead of 30.`
          );
        }

        const validQuestions =
          questions.every(
            (question) =>
              question &&
              typeof question.question ===
                "string" &&
              Array.isArray(
                question.options
              ) &&
              question.options
                .length === 4 &&
              typeof question.answer ===
                "number" &&
              Number.isInteger(
                question.answer
              ) &&
              question.answer >= 0 &&
              question.answer <= 3
          );

        if (!validQuestions) {
          throw new Error(
            "The AI returned an invalid question format."
          );
        }

        setTestQuestions(
          questions
        );

        setTestAnswers({});

        setCurrentQuestion(0);

        setTestTimeLeft(
          TEST_DURATION
        );

        setTestStarted(false);

        setTestFinished(false);

        setTestScore(null);

        setTestResult(null);

        console.log(
          "30 fresh test questions successfully loaded."
        );
      } catch (error) {
        console.error(
          "Test generation error:",
          error
        );

        console.error(
          "Server response:",
          error.response?.data
        );

        const errorMessage =
          error.response?.data
            ?.error ||
          error.message ||
          "Something went wrong while generating the test.";

        alert(errorMessage);

        setActivePage("Unit");
      } finally {
        setTestGenerating(false);
      }
    };

  // =======================================
  // START TEST
  // =======================================

  const handleStartTest = () => {
    if (
      testQuestions.length !== 30
    ) {
      alert(
        "The test is not ready yet."
      );

      return;
    }

    setTestStarted(true);

    setTestFinished(false);

    setTestTimeLeft(
      TEST_DURATION
    );

    setCurrentQuestion(0);

    setTestAnswers({});

    setTestScore(null);

    setTestResult(null);
  };

  // =======================================
  // SELECT ANSWER
  // =======================================

  const handleSelectAnswer = (
    optionIndex
  ) => {
    if (testFinished) {
      return;
    }

    setTestAnswers(
      (previousAnswers) => ({
        ...previousAnswers,
        [currentQuestion]:
          optionIndex,
      })
    );
  };

  // =======================================
  // FINISH TEST
  // =======================================

  const finishTest = () => {
    if (
      testFinished ||
      testQuestions.length === 0
    ) {
      return;
    }

    let correctAnswers = 0;

    testQuestions.forEach(
      (question, index) => {
        if (
          testAnswers[index] ===
          question.answer
        ) {
          correctAnswers++;
        }
      }
    );

    const percentage =
      Math.round(
        (correctAnswers /
          testQuestions.length) *
          100
      );

    let resultTitle = "";
    let resultMessage = "";

    if (percentage >= 90) {
      resultTitle =
        "SHARINGAN MASTERED";

      resultMessage =
        "Your understanding is exceptionally strong. You saw the material clearly.";
    } else if (
      percentage >= 75
    ) {
      resultTitle =
        "STRONG PERCEPTION";

      resultMessage =
        "Excellent work. Your understanding of the material is strong.";
    } else if (
      percentage >= 50
    ) {
      resultTitle =
        "KEEP TRAINING";

      resultMessage =
        "You have the foundation. Review the weaker areas and try again.";
    } else {
      resultTitle =
        "REVIEW THE MATERIAL";

      resultMessage =
        "Go back through your study notes before attempting the test again.";
    }

    setTestScore(
      percentage
    );

    setTestResult({
      title: resultTitle,
      message: resultMessage,
      correct: correctAnswers,
      total: testQuestions.length,
    });

    setTestFinished(true);

    setTestStarted(false);

    setUnits(
      (previousUnits) =>
        previousUnits.map(
          (unit) =>
            unit.id ===
            selectedUnit?.id
              ? {
                  ...unit,
                  tests:
                    (unit.tests ||
                      0) + 1,
                  score:
                    percentage,
                }
              : unit
        )
    );

    setSelectedUnit(
      (previousUnit) => {
        if (!previousUnit) {
          return previousUnit;
        }

        return {
          ...previousUnit,
          tests:
            (previousUnit.tests ||
              0) + 1,
          score: percentage,
        };
      }
    );

    const historyItem = {
      id: Date.now(),

      unitId:
        selectedUnit?.id ||
        null,

      unitName:
        selectedUnit?.name ||
        "Unknown Unit",

      score: percentage,

      correct:
        correctAnswers,

      total:
        testQuestions.length,

      date:
        new Date().toLocaleString(),
    };

    setTestHistory(
      (previousHistory) => [
        historyItem,
        ...previousHistory,
      ]
    );
  };

  // =======================================
  // TIMER
  // =======================================

  useEffect(() => {
    if (
      !testStarted ||
      testFinished
    ) {
      return;
    }

    if (
      testTimeLeft <= 0
    ) {
      finishTest();

      return;
    }

    const timer =
      setInterval(() => {
        setTestTimeLeft(
          (previousTime) =>
            previousTime - 1
        );
      }, 1000);

    return () =>
      clearInterval(timer);
  }, [
    testStarted,
    testFinished,
    testTimeLeft,
  ]);

  // =======================================
  // FORMAT TIME
  // =======================================

  const formatTime = (
    seconds
  ) => {
    const minutes =
      Math.floor(
        seconds / 60
      );

    const remainingSeconds =
      seconds % 60;

    return `${String(
      minutes
    ).padStart(
      2,
      "0"
    )}:${String(
      remainingSeconds
    ).padStart(
      2,
      "0"
    )}`;
  };

  // =======================================
  // CURRENT ANSWER
  // =======================================

  const currentAnswer =
    testAnswers[
      currentQuestion
    ];

  // =======================================
  // CLEAR TEST HISTORY
  // =======================================

  const handleClearHistory =
    () => {
      const confirmed =
        window.confirm(
          "Are you sure you want to clear all test history? This cannot be undone."
        );

      if (!confirmed) {
        return;
      }

      setTestHistory([]);

      showSettingsMessage(
        "Test history cleared successfully."
      );
    };

  // =======================================
  // RESET STUDYMATE
  // =======================================

  const handleResetStudyMate =
    () => {
      const confirmed =
        window.confirm(
          "This will permanently delete all units, PDFs, study notes, test history and saved preferences. Are you sure?"
        );

      if (!confirmed) {
        return;
      }

      localStorage.removeItem(
        "studymate_units"
      );

      localStorage.removeItem(
        "studymate_test_history"
      );

      localStorage.removeItem(
        "studymate_study_mode"
      );

      localStorage.removeItem(
        "studymate_notes_style"
      );

      localStorage.removeItem(
        "studymate_auto_save"
      );

      setUnits([]);

      setTestHistory([]);

      setSelectedUnit(null);

      setSelectedFile(null);

      setExtractedText("");

      setStudyNotes("");

      setStudyMode(
        "Dark Crimson"
      );

      setNotesStyle(
        "Short & Exam-Focused"
      );

      setAutoSave(true);

      resetTestState();

      setActivePage(
        "Dashboard"
      );

      alert(
        "StudyMate has been reset successfully."
      );
    };

  // =======================================
  // NAVIGATION
  // =======================================

  const renderPage = () => {
    if (
      activePage ===
      "Dashboard"
    ) {
      return renderDashboard();
    }

    if (
      activePage === "Units"
    ) {
      return renderUnits();
    }

    if (
      activePage === "Unit"
    ) {
      return renderUnitDetails();
    }

    if (
      activePage === "Tests"
    ) {
      return renderTests();
    }

    if (
      activePage === "Test"
    ) {
      return renderTest();
    }

    if (
      activePage === "History"
    ) {
      return renderHistory();
    }

    if (
      activePage === "Settings"
    ) {
      return renderSettings();
    }

    return renderDashboard();
  };

  // =======================================
  // DASHBOARD
  // =======================================

  const renderDashboard = () => {
    const totalNotes =
      units.reduce(
        (total, unit) =>
          total +
          (unit.notes || 0),
        0
      );

    const totalTests =
      units.reduce(
        (total, unit) =>
          total +
          (unit.tests || 0),
        0
      );

    const scores =
      units
        .map(
          (unit) =>
            unit.score
        )
        .filter(
          (score) =>
            typeof score ===
            "number"
        );

    const averageScore =
      scores.length
        ? Math.round(
            scores.reduce(
              (a, b) =>
                a + b,
              0
            ) /
              scores.length
          )
        : 0;

    return (
      <div className="page">
        <div className="welcome-section">
          <div>
            <p className="eyebrow">
              STUDYMATE
            </p>

            <h2>
              Study with precision.
            </h2>

            <p className="welcome-text">
              Upload your material,
              understand it,
              then test yourself.
            </p>
          </div>

          <button
            className="primary-button"
            onClick={() =>
              setShowAddUnit(
                true
              )
            }
          >
            + Add Unit
          </button>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              U
            </div>

            <div>
              <span>
                Units
              </span>

              <strong>
                {units.length}
              </strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              N
            </div>

            <div>
              <span>
                Study Notes
              </span>

              <strong>
                {totalNotes}
              </strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              T
            </div>

            <div>
              <span>
                Tests
              </span>

              <strong>
                {totalTests}
              </strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              %
            </div>

            <div>
              <span>
                Average Score
              </span>

              <strong>
                {averageScore}%
              </strong>
            </div>
          </div>
        </div>

        <div className="section-header">
          <h3>
            Your Units
          </h3>

          <button
            className="text-button"
            onClick={() =>
              setActivePage(
                "Units"
              )
            }
          >
            View all
          </button>
        </div>

        {units.length === 0 ? (
          <div className="empty-state">
            <div className="empty-symbol">
              +
            </div>

            <h3>
              No units yet
            </h3>

            <p>
              Create your first unit
              and begin building
              your study system.
            </p>

            <button
              className="primary-button"
              onClick={() =>
                setShowAddUnit(
                  true
                )
              }
            >
              Create First Unit
            </button>
          </div>
        ) : (
          <div className="units-grid">
            {units
              .slice(0, 6)
              .map(
                (unit) => (
                  <div
                    className="unit-card"
                    key={unit.id}
                  >
                    <div className="unit-card-top">
                      <div className="unit-symbol">
                        {unit.name
                          .charAt(
                            0
                          )
                          .toUpperCase()}
                      </div>

                      <button
                        className="delete-button"
                        onClick={() =>
                          handleDeleteUnit(
                            unit.id
                          )
                        }
                      >
                        ×
                      </button>
                    </div>

                    <h3>
                      {unit.name}
                    </h3>

                    <div className="unit-meta">
                      <span>
                        {unit.notes ||
                          0}{" "}
                        notes
                      </span>

                      <span>
                        {unit.tests ||
                          0}{" "}
                        tests
                      </span>

                      <span>
                        {unit.pdf
                          ? "PDF"
                          : "No PDF"}
                      </span>
                    </div>

                    <button
                      className="open-unit-button"
                      onClick={() =>
                        handleOpenUnit(
                          unit
                        )
                      }
                    >
                      Open Unit →
                    </button>
                  </div>
                )
              )}
          </div>
        )}
      </div>
    );
  };

  // =======================================
  // UNITS PAGE
  // =======================================

  const renderUnits = () => (
    <div className="page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">
            YOUR MATERIAL
          </p>

          <h2>
            Units
          </h2>

          <p>
            Manage your study material.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={() =>
            setShowAddUnit(
              true
            )
          }
        >
          + Add Unit
        </button>
      </div>

      {units.length === 0 ? (
        <div className="empty-state">
          <div className="empty-symbol">
            +
          </div>

          <h3>
            No units created
          </h3>

          <p>
            Add a unit to begin.
          </p>

          <button
            className="primary-button"
            onClick={() =>
              setShowAddUnit(
                true
              )
            }
          >
            Add Unit
          </button>
        </div>
      ) : (
        <div className="units-grid">
          {units.map(
            (unit) => (
              <div
                className="unit-card"
                key={unit.id}
              >
                <div className="unit-card-top">
                  <div className="unit-symbol">
                    {unit.name
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <button
                    className="delete-button"
                    onClick={() =>
                      handleDeleteUnit(
                        unit.id
                      )
                    }
                  >
                    ×
                  </button>
                </div>

                <h3>
                  {unit.name}
                </h3>

                <div className="unit-meta">
                  <span>
                    {unit.notes ||
                      0}{" "}
                    notes
                  </span>

                  <span>
                    {unit.tests ||
                      0}{" "}
                    tests
                  </span>

                  <span>
                    {unit.pdf
                      ? "PDF ready"
                      : "No PDF"}
                  </span>
                </div>

                <button
                  className="open-unit-button"
                  onClick={() =>
                    handleOpenUnit(
                      unit
                    )
                  }
                >
                  Open Unit →
                </button>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );

  // =======================================
  // UNIT DETAILS
  // =======================================

  const renderUnitDetails =
    () => {
      if (!selectedUnit) {
        return (
          <div className="page">
            <div className="empty-state">
              <h3>
                No unit selected
              </h3>

              <button
                className="primary-button"
                onClick={() =>
                  setActivePage(
                    "Units"
                  )
                }
              >
                Go to Units
              </button>
            </div>
          </div>
        );
      }

      return (
        <div className="page">
          <button
            className="back-button"
            onClick={
              handleBackToUnits
            }
          >
            ← Back to Units
          </button>

          <div className="unit-details-header">
            <div className="large-unit-symbol">
              {selectedUnit.name
                .charAt(0)
                .toUpperCase()}
            </div>

            <div>
              <p className="eyebrow">
                UNIT
              </p>

              <h2>
                {selectedUnit.name}
              </h2>

              <p>
                Your study material
              </p>
            </div>
          </div>

          {!selectedFile ? (
            <div className="upload-card">
              <div className="upload-icon">
                ↑
              </div>

              <h3>
                Upload your lecture PDF
              </h3>

              <p>
                StudyMate will extract
                the material and prepare
                it for studying.
              </p>

              <label className="upload-button">
                {uploading
                  ? "Processing..."
                  : "Choose PDF"}

                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={
                    handlePdfUpload
                  }
                  hidden
                  disabled={
                    uploading
                  }
                />
              </label>

              <span className="upload-hint">
                PDF files only
              </span>
            </div>
          ) : (
            <div className="uploaded-file-card">
              <div className="file-icon">
                PDF
              </div>

              <div className="file-information">
                <strong>
                  {selectedFile.name}
                </strong>

                <span>
                  {selectedFile.pages ||
                    0}{" "}
                  pages
                </span>
              </div>

              <div className="ready-badge">
                READY
              </div>
            </div>
          )}

          {extractedText && (
            <div
              className="coming-next"
              style={{
                marginBottom:
                  "18px",
              }}
            >
              <span>
                STEP 03
              </span>

              <h3>
                AI Study Notes
              </h3>

              <p>
                Turn your extracted
                lecture material into
                short, clear and
                exam-focused study notes.
              </p>

              <button
                className="primary-button"
                onClick={
                  handleGenerateNotes
                }
                disabled={
                  generatingNotes
                }
                style={{
                  marginTop:
                    "20px",
                }}
              >
                {generatingNotes
                  ? "Generating Study Notes..."
                  : "✦ Generate AI Study Notes"}
              </button>
            </div>
          )}

          {studyNotes && (
            <div
              className="coming-next"
              style={{
                marginBottom:
                  "18px",
              }}
            >
              <span>
                AI GENERATED
              </span>

              <h3>
                Your Study Notes
              </h3>

              <p
                style={{
                  whiteSpace:
                    "pre-wrap",

                  lineHeight:
                    "1.8",

                  color: "#ddd",

                  marginTop:
                    "20px",
                }}
              >
                {studyNotes}
              </p>
            </div>
          )}

          {extractedText && (
            <div className="test-launch-card">
              <div className="test-launch-symbol">
                ◉
              </div>

              <div className="test-launch-content">
                <span>
                  STEP 04
                </span>

                <h3>
                  Sharingan Test
                </h3>

                <p>
                  Test your understanding
                  with 30 AI-generated
                  questions in 10 minutes.
                </p>
              </div>

              <button
                className="primary-button"
                onClick={
                  handleGenerateTest
                }
                disabled={
                  testGenerating
                }
              >
                {testGenerating
                  ? "Creating Test..."
                  : "Generate 30 Questions"}
              </button>
            </div>
          )}
        </div>
      );
    };

  // =======================================
  // TESTS PAGE
  // =======================================

  const renderTests = () => (
    <div className="page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">
            TEST CENTER
          </p>

          <h2>
            Tests
          </h2>

          <p>
            Challenge your understanding.
          </p>
        </div>
      </div>

      {units.length === 0 ? (
        <div className="empty-state">
          <div className="empty-symbol">
            ◉
          </div>

          <h3>
            No tests available
          </h3>

          <p>
            Add a unit and upload
            study material first.
          </p>
        </div>
      ) : (
        <div className="units-grid">
          {units.map(
            (unit) => (
              <div
                className="unit-card"
                key={unit.id}
              >
                <div className="unit-card-top">
                  <div className="unit-symbol">
                    ◉
                  </div>
                </div>

                <h3>
                  {unit.name}
                </h3>

                <div className="unit-meta">
                  <span>
                    {unit.tests ||
                      0}{" "}
                    tests
                  </span>

                  <span>
                    {unit.score !==
                      null &&
                    unit.score !==
                      undefined
                      ? `${unit.score}%`
                      : "No score"}
                  </span>
                </div>

                <button
                  className="open-unit-button"
                  onClick={() => {
                    if (
                      !unit.extractedText
                    ) {
                      handleOpenUnit(
                        unit
                      );

                      return;
                    }

                    setSelectedUnit(
                      unit
                    );

                    if (
                      unit.pdf
                    ) {
                      setSelectedFile(
                        {
                          name:
                            unit
                              .pdf
                              .name ||
                            "Uploaded PDF",

                          size:
                            unit
                              .pdf
                              .size ||
                            0,

                          type:
                            unit
                              .pdf
                              .type ||
                            "application/pdf",

                          filename:
                            unit
                              .pdf
                              .filename ||
                            "",

                          pages:
                            unit
                              .pdf
                              .pages ||
                            0,
                        }
                      );
                    } else {
                      setSelectedFile(
                        null
                      );
                    }

                    setExtractedText(
                      unit.extractedText ||
                        ""
                    );

                    setStudyNotes(
                      unit.studyNotes ||
                        ""
                    );

                    handleGenerateTest(
                      {
                        text:
                          unit.extractedText,
                      }
                    );
                  }}
                >
                  {unit.extractedText
                    ? "Generate Test →"
                    : "Open Unit →"}
                </button>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );

  // =======================================
  // TEST PAGE
  // =======================================

  const renderTest = () => {
    if (testGenerating) {
      return (
        <div className="page">
          <div className="test-loading">
            <div className="sharingan-loader">
              <div className="loader-eye">
                <div className="loader-pupil">
                  ◉
                </div>
              </div>

              <div className="loader-eye">
                <div className="loader-pupil">
                  ◉
                </div>
              </div>
            </div>

            <p className="eyebrow">
              SHARINGAN MODE
            </p>

            <h2>
              Preparing your test...
            </h2>

            <p>
              StudyMate is creating
              30 fresh questions from your
              study material.
            </p>
          </div>
        </div>
      );
    }

    if (
      testQuestions.length ===
      0
    ) {
      return (
        <div className="page">
          <div className="empty-state">
            <div className="empty-symbol">
              ◉
            </div>

            <h3>
              Test not ready
            </h3>

            <p>
              Generate a test from
              your unit material first.
            </p>

            <button
              className="primary-button"
              onClick={() =>
                setActivePage(
                  "Units"
                )
              }
            >
              Go to Units
            </button>
          </div>
        </div>
      );
    }

    if (testFinished) {
      return (
        <div className="page">
          <div className="result-screen">

            <p className="eyebrow">
              TEST COMPLETE
            </p>

            <div className="result-eyes">

              <div className="result-eye">
                <div className="result-pupil">
                  ◉
                </div>
              </div>

              <div className="result-eye">
                <div className="result-pupil">
                  ◉
                </div>
              </div>

            </div>

            <h2>
              {testResult?.title}
            </h2>

            <div className="result-score">
              {testScore}%
            </div>

            <p className="result-message">
              {testResult?.message}
            </p>

            <div className="result-stats">

              <div>
                <strong>
                  {testResult?.correct}
                </strong>

                <span>
                  Correct
                </span>
              </div>

              <div>
                <strong>
                  {testResult?.total -
                    testResult?.correct}
                </strong>

                <span>
                  Incorrect
                </span>
              </div>

              <div>
                <strong>
                  {testResult?.total}
                </strong>

                <span>
                  Questions
                </span>
              </div>

            </div>

            <div
              style={{
                marginTop:
                  "45px",
                textAlign:
                  "left",
              }}
            >

              <p className="eyebrow">
                ANSWER REVIEW
              </p>

              <h3
                style={{
                  fontSize:
                    "24px",
                  marginBottom:
                    "8px",
                }}
              >
                See what you missed
              </h3>

              <p
                style={{
                  color:
                    "#888",
                  marginBottom:
                    "25px",
                }}
              >
                Review every incorrect
                answer and learn the
                correct choice.
              </p>

            </div>

            {testQuestions.every(
              (question, index) =>
                testAnswers[index] ===
                question.answer
            ) ? (

              <div
                style={{
                  padding:
                    "25px",
                  borderRadius:
                    "16px",
                  background:
                    "rgba(40, 180, 100, 0.08)",
                  border:
                    "1px solid rgba(40, 180, 100, 0.25)",
                  textAlign:
                    "left",
                  marginBottom:
                    "25px",
                }}
              >

                <strong
                  style={{
                    display:
                      "block",
                    fontSize:
                      "18px",
                    marginBottom:
                      "8px",
                  }}
                >
                  Perfect score.
                </strong>

                <p
                  style={{
                    margin:
                      0,
                    color:
                      "#aaa",
                  }}
                >
                  You answered every
                  question correctly.
                  Sharingan mastered.
                </p>

              </div>

            ) : (

              <div
                style={{
                  display:
                    "flex",
                  flexDirection:
                    "column",
                  gap:
                    "16px",
                  textAlign:
                    "left",
                  marginBottom:
                    "30px",
                }}
              >

                {testQuestions.map(
                  (
                    question,
                    index
                  ) => {

                    const userAnswer =
                      testAnswers[
                        index
                      ];

                    const correctAnswer =
                      question.answer;

                    const isCorrect =
                      userAnswer ===
                      correctAnswer;

                    if (
                      isCorrect
                    ) {
                      return null;
                    }

                    return (
                      <div
                        key={
                          index
                        }
                        style={{
                          padding:
                            "22px",
                          borderRadius:
                            "16px",
                          background:
                            "rgba(220, 40, 60, 0.07)",
                          border:
                            "1px solid rgba(220, 40, 60, 0.22)",
                        }}
                      >

                        <div
                          style={{
                            fontSize:
                              "12px",
                            fontWeight:
                              "700",
                            letterSpacing:
                              "1px",
                            color:
                              "#888",
                            marginBottom:
                              "10px",
                          }}
                        >
                          QUESTION{" "}
                          {String(
                            index +
                              1
                          ).padStart(
                            2,
                            "0"
                          )}
                        </div>

                        <h4
                          style={{
                            fontSize:
                              "17px",
                            lineHeight:
                              "1.5",
                            margin:
                              "0 0 18px",
                          }}
                        >
                          {
                            question.question
                          }
                        </h4>

                        <div
                          style={{
                            padding:
                              "13px 15px",
                            borderRadius:
                              "10px",
                            background:
                              "rgba(220, 40, 60, 0.08)",
                            marginBottom:
                              "10px",
                          }}
                        >

                          <span
                            style={{
                              display:
                                "block",
                              fontSize:
                                "11px",
                              fontWeight:
                                "700",
                              color:
                                "#ff7d8d",
                              marginBottom:
                                "5px",
                              letterSpacing:
                                "0.8px",
                            }}
                          >
                            YOUR ANSWER
                          </span>

                          <span
                            style={{
                              color:
                                "#ddd",
                            }}
                          >
                            {userAnswer !==
                            undefined
                              ? `${String.fromCharCode(
                                  65 +
                                    userAnswer
                                )}. ${
                                  question
                                    .options[
                                    userAnswer
                                  ]
                                }`
                              : "Not answered"}
                          </span>

                        </div>

                        <div
                          style={{
                            padding:
                              "13px 15px",
                            borderRadius:
                              "10px",
                            background:
                              "rgba(40, 180, 100, 0.08)",
                            border:
                              "1px solid rgba(40, 180, 100, 0.15)",
                          }}
                        >

                          <span
                            style={{
                              display:
                                "block",
                              fontSize:
                                "11px",
                              fontWeight:
                                "700",
                              color:
                                "#6ee7a0",
                              marginBottom:
                                "5px",
                              letterSpacing:
                                "0.8px",
                            }}
                          >
                            CORRECT ANSWER
                          </span>

                          <span
                            style={{
                              color:
                                "#ddd",
                              fontWeight:
                                "600",
                            }}
                          >
                            {String.fromCharCode(
                              65 +
                                correctAnswer
                            )}.{" "}
                            {
                              question
                                .options[
                                correctAnswer
                              ]
                            }
                          </span>

                        </div>

                      </div>
                    );
                  }
                )}

              </div>
            )}

            <div className="result-actions">

              <button
                className="primary-button"
                onClick={() =>
                  handleGenerateTest()
                }
              >
                Try Again
              </button>

              <button
                className="secondary-button"
                onClick={() =>
                  setActivePage(
                    "History"
                  )
                }
              >
                View History
              </button>

            </div>

          </div>
        </div>
      );
    }

    if (!testStarted) {
      return (
        <div className="page">
          <div className="test-intro">

            <p className="eyebrow">
              SHARINGAN MODE
            </p>

            <div className="sharingan-eyes">

              <div className="sharingan-eye">
                <div className="eye-pupil">

                  <span className="tomoe top">
                    ●
                  </span>

                  <span className="tomoe left">
                    ●
                  </span>

                  <span className="tomoe right">
                    ●
                  </span>

                  ◉

                </div>
              </div>

              <div className="sharingan-eye">
                <div className="eye-pupil">

                  <span className="tomoe top">
                    ●
                  </span>

                  <span className="tomoe left">
                    ●
                  </span>

                  <span className="tomoe right">
                    ●
                  </span>

                  ◉

                </div>
              </div>

            </div>

            <h2>
              {selectedUnit?.name ||
                "StudyMate Test"}
            </h2>

            <p>
              Your perception will be
              tested across 30 questions.
            </p>

            <div className="test-rules">

              <div>
                <strong>
                  30
                </strong>

                <span>
                  Questions
                </span>
              </div>

              <div>
                <strong>
                  10
                </strong>

                <span>
                  Minutes
                </span>
              </div>

              <div>
                <strong>
                  4
                </strong>

                <span>
                  Options
                </span>
              </div>

            </div>

            <button
              className="primary-button test-start-button"
              onClick={
                handleStartTest
              }
            >
              Activate Sharingan
            </button>

          </div>
        </div>
      );
    }

    const question =
      testQuestions[
        currentQuestion
      ];

    if (!question) {
      return (
        <div className="page">
          <div className="empty-state">

            <h3>
              Question unavailable
            </h3>

            <p>
              Something went wrong
              with this test.
            </p>

            <button
              className="primary-button"
              onClick={() =>
                setActivePage(
                  "Units"
                )
              }
            >
              Return to Units
            </button>

          </div>
        </div>
      );
    }

    const progress =
      ((currentQuestion + 1) /
        testQuestions.length) *
      100;

    const isLastQuestion =
      currentQuestion ===
      testQuestions.length - 1;

    return (
      <div className="page test-page">

        <div className="test-top">

          <div>
            <p className="eyebrow">
              SHARINGAN TEST
            </p>

            <h2>
              {selectedUnit?.name}
            </h2>
          </div>

          <div
            className={`test-timer ${
              testTimeLeft <= 60
                ? "timer-danger"
                : ""
            }`}
          >
            ◉{" "}
            {formatTime(
              testTimeLeft
            )}
          </div>

        </div>

        <div className="test-progress-container">

          <div className="test-progress-info">

            <span>
              Question{" "}
              {currentQuestion + 1}{" "}
              of{" "}
              {testQuestions.length}
            </span>

            <span>
              {Math.round(
                progress
              )}
              %
            </span>

          </div>

          <div className="test-progress">

            <div
              className="test-progress-fill"
              style={{
                width: `${progress}%`,
              }}
            />

          </div>

        </div>

        <div className="test-question-card">

          <div className="question-number">
            QUESTION{" "}
            {String(
              currentQuestion + 1
            ).padStart(
              2,
              "0"
            )}
          </div>

          <h3>
            {question.question}
          </h3>

          <div className="answer-options">

            {question.options.map(
              (
                option,
                index
              ) => (

                <button
                  key={index}
                  className={`answer-option ${
                    currentAnswer ===
                    index
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    handleSelectAnswer(
                      index
                    )
                  }
                >

                  <span className="option-letter">
                    {String.fromCharCode(
                      65 + index
                    )}
                  </span>

                  <span>
                    {option}
                  </span>

                </button>

              )
            )}

          </div>

        </div>

        <div className="test-navigation">

          <button
            className="secondary-button"
            disabled={
              currentQuestion ===
              0
            }
            onClick={() =>
              setCurrentQuestion(
                (previous) =>
                  previous - 1
              )
            }
          >
            ← Previous
          </button>

          <div className="question-dots">

            {testQuestions
              .slice(
                Math.max(
                  0,
                  currentQuestion -
                    2
                ),
                Math.min(
                  testQuestions.length,
                  currentQuestion +
                    3
                )
              )
              .map(
                (
                  _,
                  index
                ) => {

                  const realIndex =
                    Math.max(
                      0,
                      currentQuestion -
                        2
                    ) +
                    index;

                  return (
                    <button
                      key={
                        realIndex
                      }
                      className={
                        realIndex ===
                        currentQuestion
                          ? "active"
                          : testAnswers[
                              realIndex
                            ] !==
                            undefined
                          ? "answered"
                          : ""
                      }
                      onClick={() =>
                        setCurrentQuestion(
                          realIndex
                        )
                      }
                    >
                      {realIndex +
                        1}
                    </button>
                  );

                }
              )}

          </div>

          {isLastQuestion ? (

            <button
              className="primary-button"
              onClick={
                finishTest
              }
            >
              Submit Test
            </button>

          ) : (

            <button
              className="primary-button"
              onClick={() =>
                setCurrentQuestion(
                  (previous) =>
                    previous + 1
                )
              }
            >
              Next →
            </button>

          )}

        </div>

      </div>
    );
  };

  // =======================================
  // HISTORY
  // =======================================

  const renderHistory = () => (
    <div className="page">

      <div className="page-heading">

        <div>

          <p className="eyebrow">
            PERFORMANCE
          </p>

          <h2>
            Test History
          </h2>

          <p>
            Your previous test results.
          </p>

        </div>

      </div>

      {testHistory.length ===
      0 ? (

        <div className="empty-state">

          <div className="empty-symbol">
            ◉
          </div>

          <h3>
            No test history
          </h3>

          <p>
            Complete your first test
            to see your results here.
          </p>

        </div>

      ) : (

        <div className="history-list">

          {testHistory.map(
            (item) => (

              <div
                className="history-card"
                key={item.id}
              >

                <div className="history-icon">
                  ◉
                </div>

                <div className="history-info">

                  <strong>
                    {item.unitName}
                  </strong>

                  <span>
                    {item.date}
                  </span>

                </div>

                <div className="history-result">

                  <strong>
                    {item.score}%
                  </strong>

                  <span>
                    {item.correct}/
                    {item.total}
                  </span>

                </div>

              </div>

            )
          )}

        </div>

      )}

    </div>
  );

  // =======================================
  // SETTINGS
  // =======================================

  const renderSettings =
    () => (
      <div className="page">

        {/* HEADER */}

        <div className="page-heading">

          <div>

            <p className="eyebrow">
              PREFERENCES
            </p>

            <h2>
              Settings
            </h2>

            <p>
              Customize your StudyMate
              experience.
            </p>

          </div>

        </div>

        {/* MESSAGE */}

        {settingsMessage && (

          <div
            style={{
              marginBottom:
                "20px",

              padding:
                "14px 18px",

              borderRadius:
                "12px",

              background:
                "rgba(180, 20, 40, 0.12)",

              border:
                "1px solid rgba(220, 40, 60, 0.35)",

              color: "#ffb3bd",

              fontSize: "14px",

              fontWeight: "600",
            }}
          >
            ✓{" "}
            {settingsMessage}
          </div>

        )}

        {/* APPEARANCE */}

        <div
          className="settings-card"
          style={{
            marginBottom:
              "18px",

            display: "block",
          }}
        >

          <div
            style={{
              display: "flex",

              justifyContent:
                "space-between",

              alignItems:
                "flex-start",

              gap: "20px",

              marginBottom:
                "22px",
            }}
          >

            <div>

              <p className="eyebrow">
                APPEARANCE
              </p>

              <h3>
                Study mode
              </h3>

              <p>
                Choose the visual style
                used throughout StudyMate.
              </p>

            </div>

            <span className="settings-status">
              ACTIVE
            </span>

          </div>

          <div
            style={{
              display: "grid",

              gridTemplateColumns:
                "repeat(auto-fit, minmax(220px, 1fr))",

              gap: "12px",
            }}
          >

            <button
              type="button"
              onClick={() => {

                setStudyMode(
                  "Dark Crimson"
                );

                showSettingsMessage(
                  "Dark Crimson mode is active."
                );

              }}
              style={{
                padding:
                  "18px",

                borderRadius:
                  "14px",

                border:
                  studyMode ===
                  "Dark Crimson"
                    ? "1px solid rgba(220, 40, 60, 0.7)"
                    : "1px solid rgba(255,255,255,0.08)",

                background:
                  studyMode ===
                  "Dark Crimson"
                    ? "rgba(180, 20, 40, 0.15)"
                    : "rgba(255,255,255,0.03)",

                color: "#fff",

                textAlign:
                  "left",

                cursor:
                  "pointer",
              }}
            >

              <strong
                style={{
                  display:
                    "block",

                  marginBottom:
                    "7px",
                }}
              >
                ◉ Dark Crimson
              </strong>

              <span
                style={{
                  color: "#aaa",

                  fontSize:
                    "13px",
                }}
              >
                Itachi-inspired dark
                study environment.
              </span>

            </button>

            <div
              style={{
                padding:
                  "18px",

                borderRadius:
                  "14px",

                border:
                  "1px solid rgba(255,255,255,0.06)",

                background:
                  "rgba(255,255,255,0.02)",

                opacity: 0.55,
              }}
            >

              <strong
                style={{
                  display:
                    "block",

                  marginBottom:
                    "7px",
                }}
              >
                ○ Light Mode
              </strong>

              <span
                style={{
                  color: "#aaa",

                  fontSize:
                    "13px",
                }}
              >
                Light theme will be
                available in a future
                version.
              </span>

            </div>

          </div>

        </div>

        {/* STUDY PREFERENCES */}

        <div
          className="settings-card"
          style={{
            marginBottom:
              "18px",

            display: "block",
          }}
        >

          <div
            style={{
              marginBottom:
                "20px",
            }}
          >

            <p className="eyebrow">
              STUDY
            </p>

            <h3>
              Study preferences
            </h3>

            <p>
              Control how StudyMate
              prepares your revision
              material.
            </p>

          </div>

          <div
            style={{
              display: "flex",

              justifyContent:
                "space-between",

              alignItems:
                "center",

              gap: "20px",

              padding:
                "16px 0",

              borderTop:
                "1px solid rgba(255,255,255,0.06)",
            }}
          >

            <div>

              <strong>
                AI notes style
              </strong>

              <p
                style={{
                  margin:
                    "5px 0 0",

                  fontSize:
                    "13px",

                  color: "#888",
                }}
              >
                How your lecture
                material should be
                summarized.
              </p>

            </div>

            <select
              value={
                notesStyle
              }
              onChange={(
                event
              ) => {

                setNotesStyle(
                  event.target
                    .value
                );

                showSettingsMessage(
                  "Study preference updated."
                );

              }}
              style={{
                background:
                  "#17171c",

                color: "#fff",

                border:
                  "1px solid rgba(255,255,255,0.1)",

                borderRadius:
                  "10px",

                padding:
                  "11px 14px",

                outline:
                  "none",
              }}
            >

              <option>
                Short & Exam-Focused
              </option>

              <option>
                Balanced
              </option>

              <option>
                Detailed Revision
              </option>

            </select>

          </div>

          <div
            style={{
              display: "flex",

              justifyContent:
                "space-between",

              alignItems:
                "center",

              gap: "20px",

              padding:
                "16px 0",

              borderTop:
                "1px solid rgba(255,255,255,0.06)",
            }}
          >

            <div>

              <strong>
                Automatically save progress
              </strong>

              <p
                style={{
                  margin:
                    "5px 0 0",

                  fontSize:
                    "13px",

                  color: "#888",
                }}
              >
                Keep units, notes and
                test history after
                refreshing the page.
              </p>

            </div>

            <button
              type="button"
              onClick={() => {

                setAutoSave(
                  (previous) =>
                    !previous
                );

                showSettingsMessage(
                  autoSave
                    ? "Automatic saving disabled."
                    : "Automatic saving enabled."
                );

              }}
              style={{
                width:
                  "52px",

                height:
                  "28px",

                borderRadius:
                  "30px",

                border:
                  "none",

                padding:
                  "3px",

                cursor:
                  "pointer",

                background:
                  autoSave
                    ? "#b51f35"
                    : "#333",

                transition:
                  "0.2s ease",

                position:
                  "relative",
              }}
            >

              <span
                style={{
                  display:
                    "block",

                  width:
                    "22px",

                  height:
                    "22px",

                  borderRadius:
                    "50%",

                  background:
                    "#fff",

                  transform:
                    autoSave
                      ? "translateX(24px)"
                      : "translateX(0)",

                  transition:
                    "0.2s ease",
                }}
              />

            </button>

          </div>

        </div>

        {/* TEST PREFERENCES */}

        <div
          className="settings-card"
          style={{
            marginBottom:
              "18px",

            display: "block",
          }}
        >

          <div
            style={{
              marginBottom:
                "20px",
            }}
          >

            <p className="eyebrow">
              TEST CENTER
            </p>

            <h3>
              Test preferences
            </h3>

            <p>
              Your current Sharingan
              test configuration.
            </p>

          </div>

          <div
            style={{
              display: "grid",

              gridTemplateColumns:
                "repeat(auto-fit, minmax(180px, 1fr))",

              gap: "12px",
            }}
          >

            <div
              style={{
                padding:
                  "18px",

                borderRadius:
                  "14px",

                background:
                  "rgba(255,255,255,0.03)",

                border:
                  "1px solid rgba(255,255,255,0.06)",
              }}
            >

              <span
                style={{
                  display:
                    "block",

                  color: "#888",

                  fontSize:
                    "12px",

                  marginBottom:
                    "8px",
                }}
              >
                QUESTIONS
              </span>

              <strong
                style={{
                  fontSize:
                    "25px",
                }}
              >
                30
              </strong>

              <p
                style={{
                  margin:
                    "5px 0 0",

                  color: "#888",

                  fontSize:
                    "13px",
                }}
              >
                Per attempt
              </p>

            </div>

            <div
              style={{
                padding:
                  "18px",

                borderRadius:
                  "14px",

                background:
                  "rgba(255,255,255,0.03)",

                border:
                  "1px solid rgba(255,255,255,0.06)",
              }}
            >

              <span
                style={{
                  display:
                    "block",

                  color: "#888",

                  fontSize:
                    "12px",

                  marginBottom:
                    "8px",
                }}
              >
                TIME LIMIT
              </span>

              <strong
                style={{
                  fontSize:
                    "25px",
                }}
              >
                10:00
              </strong>

              <p
                style={{
                  margin:
                    "5px 0 0",

                  color: "#888",

                  fontSize:
                    "13px",
                }}
              >
                Per attempt
              </p>

            </div>

            <div
              style={{
                padding:
                  "18px",

                borderRadius:
                  "14px",

                background:
                  "rgba(255,255,255,0.03)",

                border:
                  "1px solid rgba(255,255,255,0.06)",
              }}
            >

              <span
                style={{
                  display:
                    "block",

                  color: "#888",

                  fontSize:
                    "12px",

                  marginBottom:
                    "8px",
                }}
              >
                OPTIONS
              </span>

              <strong
                style={{
                  fontSize:
                    "25px",
                }}
              >
                4
              </strong>

              <p
                style={{
                  margin:
                    "5px 0 0",

                  color: "#888",

                  fontSize:
                    "13px",
                }}
              >
                Per question
              </p>

            </div>

          </div>

          <div
            style={{
              marginTop:
                "16px",

              padding:
                "14px 16px",

              borderRadius:
                "12px",

              background:
                "rgba(180,20,40,0.08)",

              border:
                "1px solid rgba(180,20,40,0.2)",

              color: "#aaa",

              fontSize:
                "13px",
            }}
          >
            ◉ Every new attempt
            generates a fresh set of
            questions from your
            learning material.
          </div>

        </div>

        {/* DATA MANAGEMENT */}

        <div
          className="settings-card"
          style={{
            marginBottom:
              "18px",

            display: "block",
          }}
        >

          <div
            style={{
              marginBottom:
                "20px",
            }}
          >

            <p className="eyebrow">
              DATA
            </p>

            <h3>
              Data management
            </h3>

            <p>
              Manage the information
              stored locally by StudyMate.
            </p>

          </div>

          <div
            style={{
              display: "flex",

              justifyContent:
                "space-between",

              alignItems:
                "center",

              gap: "20px",

              padding:
                "16px 0",

              borderTop:
                "1px solid rgba(255,255,255,0.06)",
            }}
          >

            <div>

              <strong>
                Test history
              </strong>

              <p
                style={{
                  margin:
                    "5px 0 0",

                  fontSize:
                    "13px",

                  color: "#888",
                }}
              >
                {testHistory.length}{" "}
                saved{" "}
                {testHistory.length ===
                1
                  ? "attempt"
                  : "attempts"}
              </p>

            </div>

            <button
              className="secondary-button"
              onClick={
                handleClearHistory
              }
              disabled={
                testHistory.length ===
                0
              }
              style={{
                color:
                  testHistory.length ===
                  0
                    ? "#666"
                    : "#fff",
              }}
            >
              Clear History
            </button>

          </div>

          <div
            style={{
              display: "flex",

              justifyContent:
                "space-between",

              alignItems:
                "center",

              gap: "20px",

              padding:
                "16px 0",

              borderTop:
                "1px solid rgba(255,255,255,0.06)",
            }}
          >

            <div>

              <strong>
                Reset StudyMate
              </strong>

              <p
                style={{
                  margin:
                    "5px 0 0",

                  fontSize:
                    "13px",

                  color: "#888",
                }}
              >
                Delete all units,
                notes, history and
                saved preferences.
              </p>

            </div>

            <button
              type="button"
              onClick={
                handleResetStudyMate
              }
              style={{
                padding:
                  "10px 15px",

                borderRadius:
                  "10px",

                border:
                  "1px solid rgba(220,40,60,0.35)",

                background:
                  "rgba(220,40,60,0.08)",

                color:
                  "#ff7d8d",

                cursor:
                  "pointer",

                fontWeight:
                  "600",
              }}
            >
              Reset Data
            </button>

          </div>

        </div>

        {/* =====================================
            ITACHI SHARINGAN ARCHIVE
        ===================================== */}

        <div
          className="settings-card"
          style={{
            marginBottom:
              "18px",

            display:
              "block",

            position:
              "relative",

            overflow:
              "hidden",

            border:
              "1px solid rgba(180, 20, 40, 0.35)",

            background:
              "radial-gradient(circle at 90% 10%, rgba(120, 10, 25, 0.18), transparent 35%), #111",
          }}
        >

          {/* DECORATIVE SHARINGAN CIRCLES */}

          <div
            style={{
              position:
                "absolute",

              width:
                "140px",

              height:
                "140px",

              right:
                "-60px",

              top:
                "-60px",

              border:
                "2px solid rgba(180,20,40,0.12)",

              borderRadius:
                "50%",
            }}
          />

          <div
            style={{
              position:
                "absolute",

              width:
                "90px",

              height:
                "90px",

              right:
                "-35px",

              top:
                "-35px",

              border:
                "1px solid rgba(180,20,40,0.16)",

              borderRadius:
                "50%",
            }}
          />

          {/* HEADER */}

          <div
            style={{
              position:
                "relative",

              zIndex:
                2,

              display:
                "flex",

              alignItems:
                "center",

              gap:
                "16px",

              marginBottom:
                "22px",
            }}
          >

            <div
              style={{
                width:
                  "52px",

                height:
                  "52px",

                minWidth:
                  "52px",

                borderRadius:
                  "50%",

                display:
                  "flex",

                alignItems:
                  "center",

                justifyContent:
                  "center",

                border:
                  "2px solid #8f1728",

                color:
                  "#d52b40",

                fontSize:
                  "25px",

                boxShadow:
                  "0 0 18px rgba(170,20,35,0.25)",
              }}
            >
              ◉
            </div>

            <div>

              <p
                className="eyebrow"
                style={{
                  marginBottom:
                    "5px",
                }}
              >
                SHARINGAN ARCHIVE
              </p>

              <h3
                style={{
                  margin:
                    0,

                  fontSize:
                    "20px",

                  color:
                    "#f1f1f1",
                }}
              >
                Itachi Uchiha — The Shinobi Who Chose Sacrifice
              </h3>

            </div>

          </div>

          {/* QUOTE */}

          <div
            style={{
              position:
                "relative",

              zIndex:
                2,

              marginBottom:
                "20px",

              paddingLeft:
                "18px",

              borderLeft:
                "3px solid #8f1728",
            }}
          >

            <p
              style={{
                margin:
                  0,

                color:
                  "#aaa",

                fontSize:
                  "15px",

                lineHeight:
                  "1.7",

                fontStyle:
                  "italic",
              }}
            >
              “Sometimes the person who looks like the villain is carrying the heaviest burden.”
            </p>

          </div>

          {/* FAN NOTE */}

          <div
            style={{
              position:
                "relative",

              zIndex:
                2,

              display:
                "flex",

              alignItems:
                "center",

              gap:
                "10px",

              padding:
                "14px 16px",

              borderRadius:
                "10px",

              background:
                "rgba(120,10,25,0.12)",

              border:
                "1px solid rgba(150,20,35,0.25)",
            }}
          >

            <span
              style={{
                fontSize:
                  "21px",
              }}
            >
              🐦‍⬛
            </span>

            <p
              style={{
                margin:
                  0,

                color:
                  "#999",

                fontSize:
                  "14px",
              }}
            >
              Dedicated to{" "}
              <strong
                style={{
                  color:
                    "#d52b40",
                }}
              >
                Warren
              </strong>{" "}
              — Itachi's{" "}
              <strong
                style={{
                  color:
                    "#d52b40",
                }}
              >
                #1 Fan.
              </strong>
            </p>

          </div>

        </div>

        {/* ABOUT */}

        <div
          className="settings-card"
          style={{
            display:
              "block",
          }}
        >

          <div
            style={{
              display:
                "flex",

              alignItems:
                "center",

              gap:
                "15px",
            }}
          >

            <div
              style={{
                width:
                  "48px",

                height:
                  "48px",

                borderRadius:
                  "14px",

                display:
                  "flex",

                alignItems:
                  "center",

                justifyContent:
                  "center",

                background:
                  "rgba(180,20,40,0.14)",

                border:
                  "1px solid rgba(220,40,60,0.25)",

                fontWeight:
                  "800",

                color:
                  "#ff687a",
              }}
            >
              S
            </div>

            <div>

              <h3>
                StudyMate
              </h3>

              <p>
                Study with precision.
              </p>

            </div>

            <span
              style={{
                marginLeft:
                  "auto",

                color:
                  "#777",

                fontSize:
                  "12px",
              }}
            >
              v1.0
            </span>

          </div>

          <div
            style={{
              marginTop:
                "18px",

              paddingTop:
                "18px",

              borderTop:
                "1px solid rgba(255,255,255,0.06)",
            }}
          >

            <p
              style={{
                color:
                  "#888",

                fontSize:
                  "13px",

                lineHeight:
                  "1.7",

                margin:
                  0,
              }}
            >
              StudyMate is your personal
              study system for turning
              lecture material into clear
              revision notes and focused
              practice tests.
            </p>

          </div>

        </div>

      </div>
    );

  // =======================================
  // RETURN
  // =======================================

  return (
    <div className="app">

      {/* SIDEBAR */}

      <aside className="sidebar">

        <div className="brand">

          <div className="brand-symbol">
            S
          </div>

          <div>

            <h1>
              StudyMate
            </h1>

            <span>
              Study with precision
            </span>

          </div>

        </div>

        <nav className="navigation">

          <button
            className={`nav-item ${
              activePage ===
              "Dashboard"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActivePage(
                "Dashboard"
              )
            }
          >

            <span className="nav-icon">
              ◆
            </span>

            <span>
              Dashboard
            </span>

          </button>

          <button
            className={`nav-item ${
              activePage ===
                "Units" ||
              activePage ===
                "Unit"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActivePage(
                "Units"
              )
            }
          >

            <span className="nav-icon">
              ◈
            </span>

            <span>
              Units
            </span>

          </button>

          <button
            className={`nav-item ${
              activePage ===
                "Tests" ||
              activePage ===
                "Test"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActivePage(
                "Tests"
              )
            }
          >

            <span className="nav-icon">
              ◉
            </span>

            <span>
              Tests
            </span>

          </button>

          <button
            className={`nav-item ${
              activePage ===
              "History"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActivePage(
                "History"
              )
            }
          >

            <span className="nav-icon">
              ↗
            </span>

            <span>
              History
            </span>

          </button>

          <button
            className={`nav-item ${
              activePage ===
              "Settings"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActivePage(
                "Settings"
              )
            }
          >

            <span className="nav-icon">
              ⚙
            </span>

            <span>
              Settings
            </span>

          </button>

        </nav>

        <div className="sidebar-bottom">

          <div className="study-message">

            <span className="message-symbol">
              ◆
            </span>

            <div>

              <strong>
                Stay focused.
              </strong>

              <p>
                Understand.
                Practice.
                Master.
              </p>

            </div>

          </div>

        </div>

      </aside>

      {/* MAIN */}

      <main className="main-content">

        <header className="topbar">

          <span className="page-label">
            {activePage ===
            "Test"
              ? "Test Center"
              : activePage}
          </span>

          <div className="profile">

            <div className="profile-avatar">
              W
            </div>

            <div className="profile-info">

              <strong>
                Student
              </strong>

              <span>
                StudyMate
              </span>

            </div>

          </div>

        </header>

        {renderPage()}

      </main>

      {/* ADD UNIT MODAL */}

      {showAddUnit && (

        <div className="modal-overlay">

          <div className="modal">

            <button
              className="modal-close"
              onClick={() =>
                setShowAddUnit(
                  false
                )
              }
            >
              ×
            </button>

            <p className="eyebrow">
              NEW UNIT
            </p>

            <h2>
              Add a Unit
            </h2>

            <p>
              Give your study unit a name.
            </p>

            <input
              type="text"
              placeholder="e.g. EET101 Electronics"
              value={
                newUnitName
              }
              onChange={(
                event
              ) =>
                setNewUnitName(
                  event.target
                    .value
                )
              }
              onKeyDown={(
                event
              ) => {

                if (
                  event.key ===
                  "Enter"
                ) {
                  handleAddUnit();
                }

              }}
              autoFocus
            />

            <div className="modal-actions">

              <button
                className="secondary-button"
                onClick={() =>
                  setShowAddUnit(
                    false
                  )
                }
              >
                Cancel
              </button>

              <button
                className="primary-button"
                onClick={
                  handleAddUnit
                }
              >
                Create Unit
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default App;