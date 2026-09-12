import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "https://i-t-a-c-h-i-backend.onrender.com/api";
const TEST_DURATION = 10 * 60;

function App() {
  const [screen, setScreen] = useState("dashboard");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [notesTopic, setNotesTopic] = useState("");
  const [shortNotes, setShortNotes] = useState("");
  const [notesLoading, setNotesLoading] = useState(false);
  const [notesError, setNotesError] = useState("");

  const [units, setUnits] = useState(() => {
    try {
      const savedUnits = localStorage.getItem("studymate_units");

      if (!savedUnits) {
        return [];
      }

      const parsedUnits = JSON.parse(savedUnits);

      return Array.isArray(parsedUnits) ? parsedUnits : [];
    } catch (error) {
      console.error("Could not load saved units:", error);
      return [];
    }
  });

  const [selectedUnit, setSelectedUnit] = useState(null);

  const [pdfFile, setPdfFile] = useState(null);
  const [pdfInfo, setPdfInfo] = useState(null);
  const [extractedText, setExtractedText] = useState("");

  
  const [aiNotes, setAiNotes] = useState("");
  const [aiNotesLoading, setAiNotesLoading] = useState(false);
  const [aiNotesError, setAiNotesError] = useState("");

  const [testQuestions, setTestQuestions] = useState([]);
  const [testAnswers, setTestAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [testTimeLeft, setTestTimeLeft] = useState(TEST_DURATION);
  const [testStarted, setTestStarted] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const [reviewFilter, setReviewFilter] = useState("failed");

  const [history, setHistory] = useState(() => {
    try {
      const savedHistory = localStorage.getItem("studymate_history");

      if (!savedHistory) {
        return [];
      }

      const parsedHistory = JSON.parse(savedHistory);

      return Array.isArray(parsedHistory) ? parsedHistory : [];
    } catch (error) {
      console.error("Could not load history:", error);
      return [];
    }
  });

  const [settings, setSettings] = useState(() => {
    try {
      const savedSettings = localStorage.getItem("studymate_settings");

      if (!savedSettings) {
        return {
          sound: true,
          animations: true,
        };
      }

      return JSON.parse(savedSettings);
    } catch (error) {
      return {
        sound: true,
        animations: true,
      };
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(
        "studymate_units",
        JSON.stringify(units)
      );
    } catch (error) {
      console.error("Could not save units:", error);
    }
  }, [units]);

  useEffect(() => {
    try {
      localStorage.setItem(
        "studymate_history",
        JSON.stringify(history)
      );
    } catch (error) {
      console.error("Could not save history:", error);
    }
  }, [history]);

  useEffect(() => {
    try {
      localStorage.setItem(
        "studymate_settings",
        JSON.stringify(settings)
      );
    } catch (error) {
      console.error("Could not save settings:", error);
    }
  }, [settings]);

  useEffect(() => {
    if (!testStarted) {
      return;
    }

    if (testTimeLeft <= 0) {
      finishTest();
      return;
    }

    const timer = setInterval(() => {
      setTestTimeLeft((previous) => previous - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [testStarted, testTimeLeft]);

  const clearMessages = () => {
    setMessage("");
    setError("");
  };

  const showMessage = (text) => {
    setError("");
    setMessage(text);
  };

  const showError = (text) => {
    setMessage("");
    setError(text);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  /* =======================================================
CLEAR HISTORY
======================================================= */

const handleClearHistory = () => {
if (history.length === 0) {
showMessage("There is no test history to clear.");
return;
}


const confirmed = window.confirm(
  "Are you sure you want to clear all test history?"
);

if (!confirmed) {
  return;
}

setHistory([]);
showMessage("Test history cleared.");


};

/* =======================================================
RESET STUDYMATE
======================================================= */

const handleResetStudyMate = () => {
const confirmed = window.confirm(
"This will remove your saved units, history, and settings. Continue?"
);


if (!confirmed) {
  return;
}

localStorage.removeItem("studymate_units");
localStorage.removeItem("studymate_history");
localStorage.removeItem("studymate_settings");

setUnits([]);
setHistory([]);

setSettings({
  sound: true,
  animations: true,
});

setSelectedUnit(null);
setPdfFile(null);
setPdfInfo(null);
setExtractedText("");


setTestQuestions([]);
setTestAnswers({});
setCurrentQuestion(0);
setTestTimeLeft(TEST_DURATION);
setTestStarted(false);
setTestResult(null);

setScreen("dashboard");

showMessage("StudyMate has been reset.");


};

/* =======================================================
AUTHENTICATION STATE
======================================================= */

const [isAuthenticated, setIsAuthenticated] = useState(() => {
try {
return localStorage.getItem("studymate_authenticated") === "true";
} catch (error) {
return false;
}
});

const [authMode, setAuthMode] = useState("login");

const [authForm, setAuthForm] = useState({
name: "",
email: "",
password: "",
});

const [authLoading, setAuthLoading] = useState(false);

useEffect(() => {
try {
localStorage.setItem(
"studymate_authenticated",
isAuthenticated ? "true" : "false"
);
} catch (error) {
console.error(
"Could not save authentication state:",
error
);
}
}, [isAuthenticated]);

const handleAuthInput = (event) => {
const { name, value } = event.target;


setAuthForm((previous) => ({
  ...previous,
  [name]: value,
}));


};

const handleLogin = async (event) => {
event.preventDefault();


clearMessages();

if (!authForm.email.trim() || !authForm.password.trim()) {
  showError("Please enter your email and password.");
  return;
}

setAuthLoading(true);

try {
  /*
   * The backend can be connected here later.
   * For now StudyMate keeps authentication locally so
   * the application can continue working independently.
   */

  await new Promise((resolve) => setTimeout(resolve, 500));

  setIsAuthenticated(true);
  setScreen("dashboard");

  showMessage("Welcome back to StudyMate.");
} catch (error) {
  console.error("Login error:", error);
  showError("Unable to log in. Please try again.");
} finally {
  setAuthLoading(false);
}


};

const handleRegister = async (event) => {
event.preventDefault();


clearMessages();

if (
  !authForm.name.trim() ||
  !authForm.email.trim() ||
  !authForm.password.trim()
) {
  showError("Please complete all fields.");
  return;
}

if (authForm.password.length < 6) {
  showError("Password must contain at least 6 characters.");
  return;
}

setAuthLoading(true);

try {
  /*
   * Local registration for the current StudyMate frontend.
   * Backend authentication can be connected without changing
   * the rest of the application.
   */

  await new Promise((resolve) => setTimeout(resolve, 500));

  try {
    localStorage.setItem(
      "studymate_user",
      JSON.stringify({
        name: authForm.name.trim(),
        email: authForm.email.trim(),
      })
    );
  } catch (storageError) {
    console.error(
      "Could not save user:",
      storageError
    );
  }

  setIsAuthenticated(true);
  setScreen("dashboard");

  showMessage(
    `Welcome to StudyMate, ${authForm.name.trim()}!`
  );
} catch (error) {
  console.error("Registration error:", error);
  showError("Unable to create your account.");
} finally {
  setAuthLoading(false);
}


};

const handleLogout = () => {
setIsAuthenticated(false);
setScreen("dashboard");


clearMessages();

showMessage("You have been logged out.");


};

const getCurrentUser = () => {
try {
const savedUser = localStorage.getItem(
"studymate_user"
);


  if (!savedUser) {
    return {
      name: "Student",
      email: "",
    };
  }

  const parsedUser = JSON.parse(savedUser);

  return {
    name: parsedUser.name || "Student",
    email: parsedUser.email || "",
  };
} catch (error) {
  return {
    name: "Student",
    email: "",
  };
}


};

const currentUser = getCurrentUser();

/* =======================================================
SIMPLE NAVIGATION
======================================================= */

const navigateTo = (nextScreen) => {
clearMessages();
setScreen(nextScreen);
};

const handleUnitSelect = (unit) => {
setSelectedUnit(unit);
clearMessages();
setScreen("unit");
};

const handleBackToDashboard = () => {
clearMessages();
setSelectedUnit(null);
setScreen("dashboard");
};

/* =======================================================
SHARINGAN / ITACHI MODE
======================================================= */

const [itachiMode, setItachiMode] = useState(() => {
try {
return localStorage.getItem("studymate_itachi_mode") === "true";
} catch (error) {
return false;
}
});

useEffect(() => {
try {
localStorage.setItem(
"studymate_itachi_mode",
itachiMode ? "true" : "false"
);
} catch (error) {
console.error(
"Could not save Itachi mode:",
error
);
}
}, [itachiMode]);

const toggleItachiMode = () => {
setItachiMode((previous) => !previous);
};


/* =======================================================
SHARINGAN EYE
======================================================= */
const SharinganEye = ({ size = 90 }) => {
  const [frame, setFrame] = useState(0);

  const frames = [
    "/images/sharingan_01_open.png",
    "/images/sharingan_02_blinking.png",
    "/images/sharingan_03_closed.png",
    "/images/sharingan_04_opening.png",
    "/images/sharingan_05_open.png",
    "/images/sharingan_06_open.png",
  ];

  useEffect(() => {
    let currentFrame = 0;

    // EXACT timing for every frame
    const frameTimes = [
      2200, // 01 OPEN      - stay open
      120,  // 02 BLINKING  - quick
      140,  // 03 CLOSED    - quick
      140,  // 04 OPENING   - quick
      180,  // 05 OPEN      - settle
      2200, // 06 OPEN      - stay open
    ];

    let timer;

    const playFrame = () => {
      timer = setTimeout(() => {
        currentFrame++;

        if (currentFrame >= frames.length) {
          currentFrame = 0;
        }

        setFrame(currentFrame);
        playFrame();
      }, frameTimes[currentFrame]);
    };

    playFrame();

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <img
      src={frames[frame]}
      alt="Sharingan eye"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        objectFit: "contain",
        display: "block",
        userSelect: "none",
        pointerEvents: "none",

        filter:
          "drop-shadow(0 0 8px rgba(255,0,0,0.8)) drop-shadow(0 0 18px rgba(150,0,0,0.55))",

        // Prevent the image from visually jumping
        flexShrink: 0,
      }}
    />
  );
};
const BlinkingSharinganEyes = ({ size = 105 }) => {
  const [frame, setFrame] = useState(0);

  const frames = [
    "/images/sharingan_01_open.png",
    "/images/sharingan_02_blinking.png",
    "/images/sharingan_03_closed.png",
    "/images/sharingan_04_opening.png",
    "/images/sharingan_05_open.png",
    "/images/sharingan_06_open.png",
  ];

  useEffect(() => {
    // Keep the eyes open for a while before blinking.
    const timers = [
      setTimeout(() => setFrame(1), 2500),
      setTimeout(() => setFrame(2), 2600),
      setTimeout(() => setFrame(3), 2750),
      setTimeout(() => setFrame(4), 2900),
      setTimeout(() => setFrame(5), 3050),
    ];

    const resetTimer = setTimeout(() => {
      setFrame(0);
    }, 3250);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(resetTimer);
    };
  }, [frame]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        padding: "10px 0",
      }}
    >
      <img
        src={frames[frame]}
        alt="Sharingan"
        style={{
          width: `${size * 2.1}px`,
          height: `${size}px`,
          objectFit: "contain",
          display: "block",
          filter:
            "drop-shadow(0 0 8px rgba(255,0,0,0.75)) drop-shadow(0 0 20px rgba(180,0,0,0.45))",
          userSelect: "none",
          pointerEvents: "none",
        }}
      />
    </div>
  );
};


/* =======================================================
UNIT HELPERS
======================================================= */

const createUnit = (name) => {
const cleanName = String(name || "").trim();


if (!cleanName) {
  showError("Please enter a unit name.");
  return null;
}

const existingUnit = units.find(
  (unit) =>
    String(unit.name || "").toLowerCase() ===
    cleanName.toLowerCase()
);

if (existingUnit) {
  showError("A unit with that name already exists.");
  return null;
}

const newUnit = {
  id: Date.now(),
  name: cleanName,
  createdAt: new Date().toISOString(),
  notes: "",
  pdf: null,
};

setUnits((previous) => [...previous, newUnit]);

showMessage(`Unit "${cleanName}" created.`);

return newUnit;


};

const deleteUnit = (unitId) => {
const confirmed = window.confirm(
"Are you sure you want to delete this unit?"
);


if (!confirmed) {
  return;
}

setUnits((previous) =>
  previous.filter((unit) => unit.id !== unitId)
);

if (selectedUnit?.id === unitId) {
  setSelectedUnit(null);
  setScreen("dashboard");
}

showMessage("Unit deleted.");


};

const updateUnit = (unitId, updates) => {
setUnits((previous) =>
previous.map((unit) =>
unit.id === unitId
? {
...unit,
...updates,
}
: unit
)
);


setSelectedUnit((previous) => {
  if (!previous || previous.id !== unitId) {
    return previous;
  }

  return {
    ...previous,
    ...updates,
  };
});


};

/* =======================================================
FILE HANDLING
======================================================= */

const handlePdfChange = async (event) => {
  const file = event.target.files?.[0];

  if (!file) {
    return;
  }

  if (file.type !== "application/pdf") {
    showError("Please select a PDF file.");
    return;
  }

  setPdfFile(file);

  setPdfInfo({
    name: file.name,
    size: file.size,
    type: file.type,
  });

  setExtractedText("");

  clearMessages();

  showMessage(
    `"${file.name}" is being processed...`
  );

  try {
    const formData = new FormData();

    formData.append("file", file);

    const response = await axios.post(
      `${API_URL}/upload-pdf`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    const extractedText =
      response.data.text || "";

    if (!extractedText.trim()) {
      showError(
        "The PDF was uploaded, but no readable text was found."
      );
      return;
    }

    setExtractedText(extractedText);

    showMessage(
      `"${file.name}" was processed successfully.`
    );

  } catch (error) {
    console.error(
      "PDF upload/extraction error:",
      error
    );

    showError(
      error.response?.data?.error ||
        "Unable to process the PDF. Please try again."
    );
  }
};

const removePdf = () => {
  setPdfFile(null);
  setPdfInfo(null);
  setExtractedText("");
  setAiNotes("");
  setAiNotesError("");

  if (selectedUnit) {
    updateUnit(selectedUnit.id, {
      pdf: null,
    });
  }

  showMessage("PDF removed.");
};
const selectAnswer = (questionIndex, answer) => {
  setTestAnswers((previous) => ({
    ...previous,
    [questionIndex]: answer,
  }));
};

const goToNextQuestion = () => {
if (currentQuestion < testQuestions.length - 1) {
setCurrentQuestion(
(previous) => previous + 1
);
}
};

const goToPreviousQuestion = () => {
if (currentQuestion > 0) {
setCurrentQuestion(
(previous) => previous - 1
);
}
};

const finishTest = () => {
if (!testQuestions.length) {
return;
}


setTestStarted(false);

let correctAnswers = 0;

testQuestions.forEach((question, index) => {
  const selectedAnswer = testAnswers[index];

  if (
    selectedAnswer !== undefined &&
    selectedAnswer === question.answer
  ) {
    correctAnswers += 1;
  }
});

const percentage =
  testQuestions.length > 0
    ? Math.round(
        (correctAnswers / testQuestions.length) * 100
      )
    : 0;

const result = {
  id: Date.now(),
  date: new Date().toISOString(),
  unitId: selectedUnit?.id || null,
  unitName:
    selectedUnit?.name || "General Test",
  totalQuestions: testQuestions.length,
  correctAnswers,
  wrongAnswers:
    testQuestions.length - correctAnswers,
  percentage,
  answers: testAnswers,
  questions: testQuestions,
};

setTestResult(result);

setHistory((previous) => [
  result,
  ...previous,
]);

setScreen("result");


};

const getQuestionCorrect = (question, index) => {
return (
testAnswers[index] !== undefined &&
testAnswers[index] === question.answer
);
};

const getFilteredReviewQuestions = () => {
if (!testResult?.questions) {
return [];
}


return testResult.questions
  .map((question, index) => ({
    ...question,
    questionIndex: index,
    userAnswer:
      testResult.answers?.[index],
    isCorrect:
      testResult.answers?.[index] ===
      question.answer,
  }))
  .filter((question) => {
    if (reviewFilter === "failed") {
      return !question.isCorrect;
    }

    if (reviewFilter === "passed") {
      return question.isCorrect;
    }

    return true;
  });


};

/* =======================================================
DASHBOARD STATISTICS
======================================================= */

const totalUnits = units.length;

const totalTests = history.length;

const averageScore =
history.length > 0
? Math.round(
history.reduce(
(total, item) =>
total + Number(item.percentage || 0),
0
) / history.length
)
: 0;

const bestScore =
history.length > 0
? Math.max(
...history.map((item) =>
Number(item.percentage || 0)
)
)
: 0;

/* =======================================================
STYLING HELPERS
======================================================= */


const pageStyle = {
  minHeight: "100vh",
  background: itachiMode
    ? "radial-gradient(circle at 50% 0%, #350000 0%, #120000 28%, #050505 65%, #000000 100%)"
    : "#f5f7fb",
  color: itachiMode
    ? "#ffffff"
    : "#171717",
  transition: "background 0.4s ease, color 0.4s ease",
};




const cardStyle = {
  background: itachiMode
    ? "linear-gradient(145deg, rgba(35,5,5,0.96), rgba(10,10,10,0.98))"
    : "#ffffff",
  border: itachiMode
    ? "1px solid #650000"
    : "1px solid #e7eaf0",
  borderRadius: "18px",
  padding: "24px",
  boxShadow: itachiMode
    ? "0 10px 35px rgba(0,0,0,0.65), 0 0 18px rgba(139,0,0,0.18)"
    : "0 10px 30px rgba(0,0,0,0.06)",
  transition:
    "background 0.4s ease, border 0.4s ease, box-shadow 0.4s ease",
};


const buttonStyle = {
border: "none",
borderRadius: "12px",
padding: "12px 18px",
cursor: "pointer",
fontWeight: "700",
fontSize: "14px",
};

const authInputStyle = {
width: "100%",
boxSizing: "border-box",
padding: "14px 15px",
borderRadius: "12px",
border: itachiMode
? "1px solid #3a3a3a"
: "1px solid #dfe3ea",
background: itachiMode
? "#101010"
: "#ffffff",
color: itachiMode
? "#ffffff"
: "#171717",
outline: "none",
fontSize: "15px",
};
/* =======================================================
LOGIN / REGISTER SCREEN
======================================================= */

const renderAuthScreen = () => {
return (
<div
style={{
minHeight: "100vh",
display: "flex",
alignItems: "center",
justifyContent: "center",
padding: "30px 20px",
background: itachiMode
? "#080808"
: "linear-gradient(135deg, #eef2ff, #f8fafc)",
}}
>
<div
style={{
width: "100%",
maxWidth: "460px",
}}
>
<div
style={{
textAlign: "center",
marginBottom: "28px",
}}
>
<div
style={{
width: "72px",
height: "72px",
margin: "0 auto 18px",
borderRadius: "22px",
display: "flex",
alignItems: "center",
justifyContent: "center",
fontSize: "32px",
background: itachiMode
? "#1a1a1a"
: "#111827",
color: "#ffffff",
}}
>
👁 </div>


        <h1
          style={{
            margin: 0,
            fontSize: "34px",
            fontWeight: "800",
            letterSpacing: "-1px",
          }}
        >
          StudyMate
        </h1>

        <p
          style={{
            marginTop: "8px",
            color: itachiMode
              ? "#aaaaaa"
              : "#64748b",
          }}
        >
          Your smarter study companion
        </p>
      </div>

      <div style={cardStyle}>
        <div
          style={{
            display: "flex",
            gap: "8px",
            padding: "5px",
            marginBottom: "25px",
            borderRadius: "12px",
            background: itachiMode
              ? "#101010"
              : "#f1f5f9",
          }}
        >
          <button
            type="button"
            onClick={() => {
              setAuthMode("login");
              clearMessages();
            }}
            style={{
              ...buttonStyle,
              flex: 1,
              background:
                authMode === "login"
                  ? itachiMode
                    ? "#2a2a2a"
                    : "#ffffff"
                  : "transparent",
              color: itachiMode
                ? "#ffffff"
                : "#171717",
              boxShadow:
                authMode === "login"
                  ? "0 3px 10px rgba(0,0,0,0.08)"
                  : "none",
            }}
          >
            Login
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthMode("register");
              clearMessages();
            }}
            style={{
              ...buttonStyle,
              flex: 1,
              background:
                authMode === "register"
                  ? itachiMode
                    ? "#2a2a2a"
                    : "#ffffff"
                  : "transparent",
              color: itachiMode
                ? "#ffffff"
                : "#171717",
              boxShadow:
                authMode === "register"
                  ? "0 3px 10px rgba(0,0,0,0.08)"
                  : "none",
            }}
          >
            Create account
          </button>
        </div>

        <h2
          style={{
            margin: "0 0 7px",
            fontSize: "25px",
          }}
        >
          {authMode === "login"
            ? "Welcome back"
            : "Create your account"}
        </h2>

        <p
          style={{
            margin: "0 0 24px",
            color: itachiMode
              ? "#999999"
              : "#64748b",
          }}
        >
          {authMode === "login"
            ? "Continue your learning journey."
            : "Start organizing your studies today."}
        </p>

        {message && (
          <div
            style={{
              padding: "12px 14px",
              marginBottom: "16px",
              borderRadius: "10px",
              background: "#ecfdf5",
              color: "#047857",
              fontSize: "14px",
            }}
          >
            {message}
          </div>
        )}

        {error && (
          <div
            style={{
              padding: "12px 14px",
              marginBottom: "16px",
              borderRadius: "10px",
              background: "#fef2f2",
              color: "#b91c1c",
              fontSize: "14px",
            }}
          >
            {error}
          </div>
        )}

        <form
          onSubmit={
            authMode === "login"
              ? handleLogin
              : handleRegister
          }
        >
          {authMode === "register" && (
            <div style={{ marginBottom: "17px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "7px",
                  fontSize: "14px",
                  fontWeight: "700",
                }}
              >
                Full name
              </label>

              <input
                type="text"
                name="name"
                value={authForm.name}
                onChange={handleAuthInput}
                placeholder="Enter your name"
                style={authInputStyle}
              />
            </div>
          )}

          <div style={{ marginBottom: "17px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "7px",
                fontSize: "14px",
                fontWeight: "700",
              }}
            >
              Email address
            </label>

            <input
              type="email"
              name="email"
              value={authForm.email}
              onChange={handleAuthInput}
              placeholder="you@example.com"
              style={authInputStyle}
            />
          </div>

          <div style={{ marginBottom: "22px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "7px",
                fontSize: "14px",
                fontWeight: "700",
              }}
            >
              Password
            </label>

            <input
              type="password"
              name="password"
              value={authForm.password}
              onChange={handleAuthInput}
              placeholder="Enter your password"
              style={authInputStyle}
            />
          </div>

          <button
            type="submit"
            disabled={authLoading}
            style={{
              ...buttonStyle,
              width: "100%",
              padding: "14px",
              background: itachiMode
                ? "#ffffff"
                : "#111827",
              color: itachiMode
                ? "#111111"
                : "#ffffff",
              opacity: authLoading ? 0.7 : 1,
            }}
          >
            {authLoading
              ? "Please wait..."
              : authMode === "login"
              ? "Login to StudyMate"
              : "Create my account"}
          </button>
        </form>
      </div>
    </div>
  </div>
);


};

/* =======================================================
NAVIGATION BAR
======================================================= */

const renderNavbar = () => {
return (
<header
style={{
position: "sticky",
top: 0,
zIndex: 100,
background: itachiMode
? "rgba(8,8,8,0.95)"
: "rgba(255,255,255,0.95)",
borderBottom: itachiMode
? "1px solid #262626"
: "1px solid #e5e7eb",
backdropFilter: "blur(12px)",
}}
>
<div
style={{
maxWidth: "1200px",
margin: "0 auto",
padding: "15px 20px",
display: "flex",
alignItems: "center",
justifyContent: "space-between",
gap: "20px",
}}
>
<button
type="button"
onClick={() => navigateTo("dashboard")}
style={{
border: "none",
background: "transparent",
cursor: "pointer",
fontSize: "21px",
fontWeight: "800",
color: itachiMode
? "#ffffff"
: "#111827",
}}
>
StudyMate </button>


      <nav
        style={{
          display: "flex",
          alignItems: "center",
          gap: "7px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <button
          type="button"
          onClick={() => navigateTo("dashboard")}
          style={{
            ...buttonStyle,
            padding: "9px 12px",
            background:
              screen === "dashboard"
                ? itachiMode
                  ? "#292929"
                  : "#f1f5f9"
                : "transparent",
            color: itachiMode
              ? "#ffffff"
              : "#334155",
          }}
        >
          Dashboard
        </button>

        <button
          type="button"
          onClick={() => navigateTo("units")}
          style={{
            ...buttonStyle,
            padding: "9px 12px",
            background:
              screen === "units"
                ? itachiMode
                  ? "#292929"
                  : "#f1f5f9"
                : "transparent",
            color: itachiMode
              ? "#ffffff"
              : "#334155",
          }}
        >
          My Units
        </button>

        <button
          type="button"
          onClick={() => navigateTo("history")}
          style={{
            ...buttonStyle,
            padding: "9px 12px",
            background:
              screen === "history"
                ? itachiMode
                  ? "#292929"
                  : "#f1f5f9"
                : "transparent",
            color: itachiMode
              ? "#ffffff"
              : "#334155",
          }}
        >
          History
        </button>

        <button
          type="button"
          onClick={() => navigateTo("settings")}
          style={{
            ...buttonStyle,
            padding: "9px 12px",
            background:
              screen === "settings"
                ? itachiMode
                  ? "#292929"
                  : "#f1f5f9"
                : "transparent",
            color: itachiMode
              ? "#ffffff"
              : "#334155",
          }}
        >
          Settings
        </button>
      </nav>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <button
          type="button"
          onClick={toggleItachiMode}
          title="Toggle Itachi mode"
          style={{
            ...buttonStyle,
            padding: "9px 12px",
            background: itachiMode
              ? "#2b2b2b"
              : "#f1f5f9",
            color: itachiMode
              ? "#ffffff"
              : "#334155",
          }}
        >
          👁
        </button>

        <button
          type="button"
          onClick={handleLogout}
          style={{
            ...buttonStyle,
            padding: "9px 12px",
            background: "transparent",
            color: itachiMode
              ? "#dddddd"
              : "#475569",
          }}
        >
          Logout
        </button>
      </div>
    </div>
  </header>
);


};

/* =======================================================
MESSAGE BANNER
======================================================= */

const renderMessages = () => {
if (!message && !error) {
return null;
}


return (
  <div
    style={{
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "18px 20px 0",
    }}
  >
    {message && (
      <div
        style={{
          padding: "13px 16px",
          borderRadius: "12px",
          background: itachiMode
            ? "#13251b"
            : "#ecfdf5",
          color: itachiMode
            ? "#b8f5ca"
            : "#047857",
          border: "1px solid",
          borderColor: itachiMode
            ? "#214d31"
            : "#a7f3d0",
        }}
      >
        {message}
      </div>
    )}

    {error && (
      <div
        style={{
          padding: "13px 16px",
          borderRadius: "12px",
          background: itachiMode
            ? "#2a1111"
            : "#fef2f2",
          color: itachiMode
            ? "#ffb4b4"
            : "#b91c1c",
          border: "1px solid",
          borderColor: itachiMode
            ? "#5b2222"
            : "#fecaca",
        }}
      >
        {error}
      </div>
    )}
  </div>
);


};

/* =======================================================
DASHBOARD
======================================================= */


const renderDashboard = () => {
  return (
    <main
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "40px 20px 70px",
      }}
    >
      <section
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "25px",
          alignItems: "center",
          marginBottom: "35px",
        }}
      >
        <div>
          <p
            className="eyebrow"
            style={{
              marginBottom: "8px",
              color: itachiMode ? "#ff3333" : undefined,
              letterSpacing: itachiMode ? "2px" : undefined,
            }}
          >
            {itachiMode
              ? "SHARINGAN STUDY SPACE"
              : "YOUR STUDY SPACE"}
          </p>

          <h1
            style={{
              margin: 0,
              fontSize: "clamp(32px, 5vw, 52px)",
              lineHeight: 1.05,
              letterSpacing: "-2px",
              textShadow: itachiMode
                ? "0 0 18px rgba(255,0,0,0.25)"
                : "none",
            }}
          >
            Welcome back,
            <br />
            {currentUser.name}
          </h1>

          <p
            style={{
              marginTop: "18px",
              fontSize: "17px",
              lineHeight: 1.6,
              maxWidth: "600px",
              color: itachiMode
                ? "#b8b8b8"
                : "#64748b",
            }}
          >
            Organize your units, study your notes,
            and test yourself with StudyMate.
          </p>

          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "22px",
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              onClick={() => navigateTo("units")}
              style={{
                ...buttonStyle,
                background: itachiMode
                  ? "linear-gradient(135deg, #ff1a1a, #8b0000)"
                  : "#111827",
                color: "#ffffff",
                boxShadow: itachiMode
                  ? "0 0 18px rgba(255,0,0,0.35)"
                  : "none",
              }}
            >
              Open my units
            </button>

            <button
              type="button"
              onClick={() => navigateTo("history")}
              style={{
                ...buttonStyle,
                background: itachiMode
                  ? "#1a0505"
                  : "#ffffff",
                color: itachiMode
                  ? "#ffcccc"
                  : "#111827",
                border: itachiMode
                  ? "1px solid #720000"
                  : "1px solid #e2e8f0",
                boxShadow: itachiMode
                  ? "0 0 12px rgba(139,0,0,0.25)"
                  : "none",
              }}
            >
              View test history
            </button>
          </div>
        </div>

        <div
          style={{
            ...cardStyle,
            minHeight: "220px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {itachiMode ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "18px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "18px",
                }}
              >
                <SharinganEye size={105} />
                <SharinganEye size={105} />
              </div>

              <div
                style={{
                  color: "#ff3333",
                  fontSize: "13px",
                  fontWeight: "900",
                  letterSpacing: "4px",
                  textShadow:
                    "0 0 12px rgba(255,0,0,0.8)",
                }}
              >
                ITACHI MODE
              </div>
            </div>
          ) : (
            <div>
              <div
                style={{
                  fontSize: "68px",
                  marginBottom: "10px",
                }}
              >
                📚
              </div>

              <h3
                style={{
                  margin: 0,
                  fontSize: "21px",
                }}
              >
                Keep learning.
              </h3>

              <p
                style={{
                  marginTop: "8px",
                  marginBottom: 0,
                  color: "#64748b",
                }}
              >
                Small progress every day adds up.
              </p>
            </div>
          )}

          {itachiMode && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                background:
                  "radial-gradient(circle at center, rgba(255,0,0,0.10), transparent 60%)",
              }}
            />
          )}
        </div>
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "15px",
          marginBottom: "35px",
        }}
      >
        <div style={cardStyle}>
          <p
            style={{
              margin: 0,
              color: itachiMode
                ? "#999999"
                : "#64748b",
            }}
          >
            Units
          </p>

          <h2
            style={{
              margin: "8px 0 0",
              fontSize: "34px",
              color: itachiMode
                ? "#ff3333"
                : "inherit",
              textShadow: itachiMode
                ? "0 0 12px rgba(255,0,0,0.35)"
                : "none",
            }}
          >
            {totalUnits}
          </h2>
        </div>

        <div style={cardStyle}>
          <p
            style={{
              margin: 0,
              color: itachiMode
                ? "#999999"
                : "#64748b",
            }}
          >
            Tests completed
          </p>

          <h2
            style={{
              margin: "8px 0 0",
              fontSize: "34px",
              color: itachiMode
                ? "#ff3333"
                : "inherit",
              textShadow: itachiMode
                ? "0 0 12px rgba(255,0,0,0.35)"
                : "none",
            }}
          >
            {totalTests}
          </h2>
        </div>

        <div style={cardStyle}>
          <p
            style={{
              margin: 0,
              color: itachiMode
                ? "#999999"
                : "#64748b",
            }}
          >
            Average score
          </p>

          <h2
            style={{
              margin: "8px 0 0",
              fontSize: "34px",
              color: itachiMode
                ? "#ff3333"
                : "inherit",
              textShadow: itachiMode
                ? "0 0 12px rgba(255,0,0,0.35)"
                : "none",
            }}
          >
            {averageScore}%
          </h2>
        </div>

        <div style={cardStyle}>
          <p
            style={{
              margin: 0,
              color: itachiMode
                ? "#999999"
                : "#64748b",
            }}
          >
            Best score
          </p>

          <h2
            style={{
              margin: "8px 0 0",
              fontSize: "34px",
              color: itachiMode
                ? "#ff3333"
                : "inherit",
              textShadow: itachiMode
                ? "0 0 12px rgba(255,0,0,0.35)"
                : "none",
            }}
          >
            {bestScore}%
          </h2>
        </div>
      </section>

      <section>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "15px",
            marginBottom: "17px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <p
              className="eyebrow"
              style={{
                marginBottom: "5px",
                color: itachiMode
                  ? "#ff3333"
                  : undefined,
              }}
            >
              QUICK ACCESS
            </p>

            <h2 style={{ margin: 0 }}>
              Your units
            </h2>
          </div>

          <button
            type="button"
            onClick={() => navigateTo("units")}
            style={{
              ...buttonStyle,
              background: itachiMode
                ? "#1a0505"
                : "#ffffff",
              color: itachiMode
                ? "#ffcccc"
                : "#111827",
              border: itachiMode
                ? "1px solid #720000"
                : "1px solid #e2e8f0",
            }}
          >
            View all
          </button>
        </div>

        {units.length === 0 ? (
          <div style={cardStyle}>
            <div
              style={{
                textAlign: "center",
                padding: "35px 15px",
              }}
            >
              {itachiMode ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: "18px",
                  }}
                >
                  <SharinganEye size={75} />
                </div>
              ) : (
                <div
                  style={{
                    fontSize: "45px",
                    marginBottom: "10px",
                  }}
                >
                  📖
                </div>
              )}

              <h3 style={{ margin: "0 0 8px" }}>
                No units yet
              </h3>

              <p
                style={{
                  margin: "0 auto 20px",
                  maxWidth: "500px",
                  color: itachiMode
                    ? "#999999"
                    : "#64748b",
                }}
              >
                Create your first study unit to
                start organizing your learning
                materials.
              </p>

              <button
                type="button"
                onClick={() => navigateTo("units")}
                style={{
                  ...buttonStyle,
                  background: itachiMode
                    ? "linear-gradient(135deg, #ff1a1a, #8b0000)"
                    : "#111827",
                  color: "#ffffff",
                  boxShadow: itachiMode
                    ? "0 0 18px rgba(255,0,0,0.35)"
                    : "none",
                }}
              >
                Create first unit
              </button>
            </div>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(230px, 1fr))",
              gap: "15px",
            }}
          >
            {units.slice(0, 6).map((unit) => (
              <button
                key={unit.id}
                type="button"
                onClick={() =>
                  handleUnitSelect(unit)
                }
                style={{
                  ...cardStyle,
                  textAlign: "left",
                  cursor: "pointer",
                  color: itachiMode
                    ? "#ffffff"
                    : "#111827",
                }}
              >
                <div
                  style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "15px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: itachiMode
                      ? "#250505"
                      : "#f1f5f9",
                    border: itachiMode
                      ? "1px solid #720000"
                      : "none",
                    marginBottom: "15px",
                    boxShadow: itachiMode
                      ? "0 0 14px rgba(139,0,0,0.25)"
                      : "none",
                  }}
                >
                  {itachiMode ? (
                    <span
                      style={{
                        fontSize: "25px",
                      }}
                    >
                      🔴
                    </span>
                  ) : (
                    <span
                      style={{
                        fontSize: "30px",
                      }}
                    >
                      📚
                    </span>
                  )}
                </div>

                <h3
                  style={{
                    margin: "0 0 7px",
                    fontSize: "19px",
                  }}
                >
                  {unit.name}
                </h3>

                <p
                  style={{
                    margin: 0,
                    color: itachiMode
                      ? "#999999"
                      : "#64748b",
                    fontSize: "14px",
                  }}
                >
                  Open unit →
                </p>
              </button>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};


/* =======================================================
UNITS SCREEN
======================================================= */

const [newUnitName, setNewUnitName] = useState("");



const handleCreateUnit = (event) => {
event.preventDefault();


const createdUnit = createUnit(newUnitName);

if (!createdUnit) {
  return;
}

setNewUnitName("");


};


const renderUnits = () => {
return (
<main
style={{
maxWidth: "1200px",
margin: "0 auto",
padding: "40px 20px 70px",
}}
>
<div
style={{
display: "flex",
justifyContent: "space-between",
alignItems: "flex-start",
gap: "20px",
flexWrap: "wrap",
marginBottom: "30px",
}}
> <div>
<button
type="button"
onClick={handleBackToDashboard}
style={{
...buttonStyle,
background: "transparent",
color: itachiMode
? "#bbbbbb"
: "#64748b",
padding: "0",
marginBottom: "15px",
}}
>
← Back to dashboard </button>


        <p
          className="eyebrow"
          style={{ marginBottom: "7px" }}
        >
          STUDY MATERIALS
        </p>

        <h1
          style={{
            margin: 0,
            fontSize: "clamp(32px, 5vw, 46px)",
            letterSpacing: "-1.5px",
          }}
        >
          My Units
        </h1>

        <p
          style={{
            marginTop: "12px",
            color: itachiMode
              ? "#999999"
              : "#64748b",
            maxWidth: "620px",
            lineHeight: 1.6,
          }}
        >
          Create a unit for each subject or course
          you are studying. Keep your notes and
          learning materials organized in one place.
        </p>
      </div>
    </div>

    <section
      style={{
        ...cardStyle,
        marginBottom: "28px",
      }}
    >
      <h2
        style={{
          margin: "0 0 7px",
          fontSize: "22px",
        }}
      >
        Create a new unit
      </h2>

      <p
        style={{
          margin: "0 0 18px",
          color: itachiMode
            ? "#999999"
            : "#64748b",
        }}
      >
        Give your study unit a clear name.
      </p>

      <form
        onSubmit={handleCreateUnit}
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          value={newUnitName}
          onChange={(event) =>
            setNewUnitName(event.target.value)
          }
          placeholder="e.g. Mathematics, Biology, Computer Science"
          style={{
            ...authInputStyle,
            flex: "1 1 300px",
          }}
        />

        <button
          type="submit"
          style={{
            ...buttonStyle,
            background: itachiMode
              ? "#ffffff"
              : "#111827",
            color: itachiMode
              ? "#111111"
              : "#ffffff",
          }}
        >
          + Create unit
        </button>
      </form>
    </section>

    {units.length === 0 ? (
      <div style={cardStyle}>
        <div
          style={{
            textAlign: "center",
            padding: "45px 20px",
          }}
        >
          <div
            style={{
              fontSize: "55px",
              marginBottom: "15px",
            }}
          >
            📚
          </div>

          <h2 style={{ margin: "0 0 10px" }}>
            Your units will appear here
          </h2>

          <p
            style={{
              margin: 0,
              color: itachiMode
                ? "#999999"
                : "#64748b",
            }}
          >
            Create your first unit above.
          </p>
        </div>
      </div>
    ) : (
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "18px",
        }}
      >
        {units.map((unit) => (
          <div
            key={unit.id}
            style={cardStyle}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: "12px",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: itachiMode
                    ? "#242424"
                    : "#f1f5f9",
                  fontSize: "23px",
                }}
              >
                📖
              </div>

              <button
                type="button"
                onClick={() =>
                  deleteUnit(unit.id)
                }
                style={{
                  border: "none",
                  background: "transparent",
                  color: itachiMode
                    ? "#999999"
                    : "#94a3b8",
                  cursor: "pointer",
                  fontSize: "18px",
                }}
                title="Delete unit"
              >
                ⋮
              </button>
            </div>

            <h3
              style={{
                margin: "18px 0 7px",
                fontSize: "21px",
              }}
            >
              {unit.name}
            </h3>

            <p
              style={{
                margin: "0 0 18px",
                fontSize: "14px",
                color: itachiMode
                  ? "#999999"
                  : "#64748b",
              }}
            >
              Created{" "}
              {unit.createdAt
                ? new Date(
                    unit.createdAt
                  ).toLocaleDateString()
                : "recently"}
            </p>

            <button
              type="button"
              onClick={() =>
                handleUnitSelect(unit)
              }
              style={{
                ...buttonStyle,
                width: "100%",
                background: itachiMode
                  ? "#242424"
                  : "#f8fafc",
                color: itachiMode
                  ? "#ffffff"
                  : "#111827",
                border: itachiMode
                  ? "1px solid #333"
                  : "1px solid #e2e8f0",
              }}
            >
              Open unit →
            </button>
          </div>
        ))}
      </div>
    )}
  </main>
);


};

/* =======================================================
UNIT SCREEN
======================================================= */



const generateShortNotes = async () => {
  setAiNotesError("");

  if (!selectedUnit) {
    setAiNotesError(
      "Please select a study unit first."
    );
    return;
  }

  if (!extractedText.trim()) {
    setAiNotesError(
      "Please upload and process a PDF first."
    );
    return;
  }

  setAiNotesLoading(true);
  setAiNotes("");

  try {
    const response = await axios.post(
      `${API_URL}/ai/short-notes`,
      {
        text: extractedText,
        topic: selectedUnit.name,
      }
    );

    setAiNotes(
      response.data.notes || ""
    );

  } catch (error) {
    console.error(
      "AI short notes error:",
      error
    );

    setAiNotesError(
      error.response?.data?.error ||
        "Unable to generate short notes. Please try again."
    );

  } finally {
    setAiNotesLoading(false);
  }
};
const handleUnitPdfSave = () => {
  if (!selectedUnit) {
    showError("Please select a unit first.");
    return;
  }

  if (!pdfFile) {
    showError("Please choose a PDF file first.");
    return;
  }

  if (!extractedText.trim()) {
    showError(
      "Please wait for the PDF to finish processing first."
    );
    return;
  }

  updateUnit(selectedUnit.id, {
    pdf: {
      name: pdfFile.name,
      size: pdfFile.size,
      type: pdfFile.type,
    },
  });

  showMessage(
    `"${pdfFile.name}" has been attached to ${selectedUnit.name}.`
  );
};

const loadSelectedUnit = () => {
  if (!selectedUnit) {
    return;
  }

  if (selectedUnit.pdf) {
    setPdfInfo(selectedUnit.pdf);
  } else {
    setPdfInfo(null);
  }
};

const renderUnit = () => {
if (!selectedUnit) {
return (
<main
style={{
maxWidth: "900px",
margin: "0 auto",
padding: "60px 20px",
}}
> <div style={cardStyle}> <h2>No unit selected</h2>


        <button
          type="button"
          onClick={() => navigateTo("units")}
          style={{
            ...buttonStyle,
            background: itachiMode
              ? "#ffffff"
              : "#111827",
            color: itachiMode
              ? "#111111"
              : "#ffffff",
          }}
        >
          Go to units
        </button>
      </div>
    </main>
  );
}

return (
  <main
    style={{
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "40px 20px 70px",
    }}
  >
    <button
      type="button"
      onClick={() => navigateTo("units")}
      style={{
        ...buttonStyle,
        background: "transparent",
        color: itachiMode
          ? "#bbbbbb"
          : "#64748b",
        padding: 0,
        marginBottom: "18px",
      }}
    >
      ← Back to units
    </button>

    <div
      style={{
        marginBottom: "30px",
      }}
    >
      <p
        className="eyebrow"
        style={{ marginBottom: "7px" }}
      >
        STUDY UNIT
      </p>

      <h1
        style={{
          margin: 0,
          fontSize: "clamp(32px, 5vw, 48px)",
          letterSpacing: "-1.5px",
        }}
      >
        {selectedUnit.name}
      </h1>

      <p
        style={{
          marginTop: "12px",
          color: itachiMode
            ? "#999999"
            : "#64748b",
        }}
      >
        Study, review and test your knowledge.
      </p>
    </div>

    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit, minmax(320px, 1fr))",
        gap: "20px",
        marginBottom: "20px",
      }}
    >
    

      <section style={cardStyle}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "15px",
            alignItems: "center",
            marginBottom: "18px",
          }}
        >
          <div>
            <p
              className="eyebrow"
              style={{ marginBottom: "5px" }}
            >
              MATERIAL
            </p>

            <h2 style={{ margin: 0 }}>
              Study PDF
            </h2>
          </div>

          <span style={{ fontSize: "25px" }}>
            📄
          </span>
        </div>

         
  {/* ======================================================= 
        AI SHORT NOTES 
        ======================================================= */} 
 
    
 


        <label
          style={{
            display: "block",
            padding: "28px 15px",
            borderRadius: "14px",
            border: itachiMode
              ? "1px dashed #444"
              : "1px dashed #cbd5e1",
            textAlign: "center",
            cursor: "pointer",
            marginBottom: "15px",
          }}
        >
          <div
            style={{
              fontSize: "35px",
              marginBottom: "8px",
            }}
          >
            📤
          </div>

          <strong>
            Choose a PDF
          </strong>

          <p
            style={{
              margin: "7px 0 0",
              fontSize: "13px",
              color: itachiMode
                ? "#999999"
                : "#64748b",
            }}
          >
            Upload your study material
          </p>

          <input
            type="file"
            accept="application/pdf"
            onChange={handlePdfChange}
            style={{ display: "none" }}
          />
        </label>

        {pdfInfo && (
          <div
            style={{
              padding: "14px",
              borderRadius: "12px",
              background: itachiMode
                ? "#202020"
                : "#f8fafc",
              marginBottom: "15px",
            }}
          >
            <strong
              style={{
                display: "block",
                wordBreak: "break-word",
              }}
            >
              {pdfInfo.name}
            </strong>

            {pdfInfo.size && (
              <span
                style={{
                  display: "block",
                  marginTop: "5px",
                  fontSize: "13px",
                  color: itachiMode
                    ? "#999999"
                    : "#64748b",
                }}
              >
                {(pdfInfo.size / 1024 / 1024).toFixed(
                  2
                )}{" "}
                MB
              </span>
            )}
          </div>
        )}

        <div
          style={{
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            onClick={handleUnitPdfSave}
            style={{
              ...buttonStyle,
              flex: 1,
              background: itachiMode
                ? "#ffffff"
                : "#111827",
              color: itachiMode
                ? "#111111"
                : "#ffffff",
            }}
          >
            Save PDF
          </button>

          {pdfInfo && (
            <button
              type="button"
              onClick={removePdf}
              style={{
                ...buttonStyle,
                background: itachiMode
                  ? "#242424"
                  : "#ffffff",
                color: itachiMode
                  ? "#ffffff"
                  : "#334155",
                border: itachiMode
                  ? "1px solid #333"
                  : "1px solid #e2e8f0",
              }}
            >
              Remove
            </button>
          )}
        </div>

        <section 
      style={{ 
        ...cardStyle, 
        marginTop: "20px", 
        marginBottom: "20px", 
      }} 
    > 
      <div 
        style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          gap: "15px", 
          flexWrap: "wrap", 
          marginBottom: "18px", 
        }} 
      > 
        <div> 
          <p 
            className="eyebrow" 
            style={{ 
              marginBottom: "5px", 
              color: itachiMode 
                ? "#ff3333" 
                : undefined, 
            }} 
          > 
            AI STUDY ASSISTANT 
          </p> 
 
          <h2 style={{ margin: 0 }}> 
            Generate Short Notes 
          </h2> 
        </div> 
 
        <span 
          style={{ 
            fontSize: "28px", 
          }} 
        > 
          ✨ 
        </span> 
      </div> 
 
      <p 
        style={{ 
          margin: "0 0 18px", 
          lineHeight: 1.6, 
          color: itachiMode 
            ? "#999999" 
            : "#64748b", 
        }} 
      > 
        Let AI turn your study material into 
        short, easy-to-revise notes. 
      </p> 
 
      <button 
        type="button" 
        onClick={generateShortNotes} 
        disabled={aiNotesLoading} 
        style={{ 
          ...buttonStyle, 
          width: "100%", 
          padding: "14px 18px", 
          background: itachiMode 
            ? "linear-gradient(135deg, #ff1a1a, #8b0000)" 
            : "#111827", 
          color: "#ffffff", 
          opacity: aiNotesLoading ? 0.7 : 1, 
          cursor: aiNotesLoading 
            ? "not-allowed" 
            : "pointer", 
          boxShadow: itachiMode 
            ? "0 0 18px rgba(255,0,0,0.3)" 
            : "none", 
        }} 
      > 
        {aiNotesLoading 
          ? "✨ Generating short notes..." 
          : "✨ Generate Short Notes"} 
      </button> 
 
      {aiNotesError && ( 
        <div 
          style={{ 
            marginTop: "15px", 
            padding: "12px 14px", 
            borderRadius: "10px", 
            background: itachiMode 
              ? "#2a1111" 
              : "#fef2f2", 
            color: itachiMode 
              ? "#ffb4b4" 
              : "#b91c1c", 
            border: "1px solid", 
            borderColor: itachiMode 
              ? "#5b2222" 
              : "#fecaca", 
            fontSize: "14px", 
          }} 
        > 
          {aiNotesError} 
        </div> 
      )} 
 
      {aiNotes && ( 
        <div 
          style={{ 
            marginTop: "20px", 
            padding: "20px", 
            borderRadius: "14px", 
            background: itachiMode 
              ? "#100505" 
              : "#f8fafc", 
            border: itachiMode 
              ? "1px solid #4d0000" 
              : "1px solid #e2e8f0", 
          }} 
        > 
          <div 
            style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "10px", 
              marginBottom: "14px", 
            }} 
          > 
            <span style={{ fontSize: "22px" }}> 
              📚 
            </span> 
 
            <h3 
              style={{ 
                margin: 0, 
                fontSize: "19px", 
              }} 
            > 
              AI Short Notes 
            </h3> 
          </div> 
 
          <div 
            style={{ 
              whiteSpace: "pre-wrap", 
              lineHeight: 1.7, 
              fontSize: "15px", 
            }} 
          > 
            {aiNotes} 
          </div> 
        </div> 
      )} 
    </section> 
    
      </section>
    </div>

    <section
      style={{
        ...cardStyle,
        marginTop: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <p
            className="eyebrow"
            style={{ marginBottom: "5px" }}
          >
            KNOWLEDGE CHECK
          </p>

          <h2 style={{ margin: 0 }}>
            Ready to test yourself?
          </h2>

          <p
            style={{
              margin: "8px 0 0",
              color: itachiMode
                ? "#999999"
                : "#64748b",
            }}
          >
            Start a timed test based on your study
            material.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            showError(
              "Test generation will be connected to your backend in the next section."
            );
          }}
          style={{
            ...buttonStyle,
            padding: "14px 20px",
            background: itachiMode
              ? "#ffffff"
              : "#111827",
            color: itachiMode
              ? "#111111"
              : "#ffffff",
          }}
        >
          Start test →
        </button>
      </div>
    </section>
  </main>
);


};

/* =======================================================
TEST SCREEN
======================================================= */
const resetTest = () => {
  setTestQuestions([]);
  setTestAnswers({});
  setCurrentQuestion(0);
  setTestTimeLeft(TEST_DURATION);
  setTestStarted(false);
  setTestResult(null);
};

const renderTest = () => {
if (!testQuestions.length) {
return (
<main
style={{
maxWidth: "900px",
margin: "0 auto",
padding: "60px 20px",
}}
> <div style={cardStyle}> <h2>No test available</h2>


        <p
          style={{
            color: itachiMode
              ? "#999999"
              : "#64748b",
          }}
        >
          There are currently no questions to
          display.
        </p>

        <button
          type="button"
          onClick={() =>
            navigateTo("dashboard")
          }
          style={{
            ...buttonStyle,
            background: itachiMode
              ? "#ffffff"
              : "#111827",
            color: itachiMode
              ? "#111111"
              : "#ffffff",
          }}
        >
          Return to dashboard
        </button>
      </div>
    </main>
  );
}

const question =
  testQuestions[currentQuestion];

const selectedAnswer =
  testAnswers[currentQuestion];

const progress =
  ((currentQuestion + 1) /
    testQuestions.length) *
  100;

const isLastQuestion =
  currentQuestion ===
  testQuestions.length - 1;

return (
  <main
    style={{
      maxWidth: "1000px",
      margin: "0 auto",
      padding: "35px 20px 70px",
    }}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "15px",
        flexWrap: "wrap",
        marginBottom: "18px",
      }}
    >
      <div>
        <p
          className="eyebrow"
          style={{ marginBottom: "5px" }}
        >
          {selectedUnit?.name ||
            "STUDY TEST"}
        </p>

        <h1
          style={{
            margin: 0,
            fontSize: "28px",
          }}
        >
          Knowledge Test
        </h1>
      </div>

      <div
        style={{
          padding: "12px 17px",
          borderRadius: "12px",
          background:
            testTimeLeft <= 60
              ? "#fee2e2"
              : itachiMode
              ? "#202020"
              : "#ffffff",
          color:
            testTimeLeft <= 60
              ? "#b91c1c"
              : itachiMode
              ? "#ffffff"
              : "#111827",
          border:
            testTimeLeft <= 60
              ? "1px solid #fecaca"
              : itachiMode
              ? "1px solid #333"
              : "1px solid #e2e8f0",
          fontWeight: "800",
          fontSize: "18px",
          minWidth: "90px",
          textAlign: "center",
        }}
      >
        ⏱ {formatTime(testTimeLeft)}
      </div>
    </div>

    <div
      style={{
        width: "100%",
        height: "8px",
        borderRadius: "99px",
        overflow: "hidden",
        background: itachiMode
          ? "#242424"
          : "#e2e8f0",
        marginBottom: "25px",
      }}
    >
      <div
        style={{
          width: `${progress}%`,
          height: "100%",
          borderRadius: "99px",
          background: itachiMode
            ? "#ffffff"
            : "#111827",
          transition: "width 0.2s ease",
        }}
      />
    </div>

    <div style={cardStyle}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "15px",
          marginBottom: "25px",
        }}
      >
        <span
          style={{
            fontSize: "14px",
            fontWeight: "800",
            color: itachiMode
              ? "#bbbbbb"
              : "#64748b",
          }}
        >
          QUESTION {currentQuestion + 1} OF{" "}
          {testQuestions.length}
        </span>

        {selectedAnswer !== undefined && (
          <span
            style={{
              fontSize: "13px",
              fontWeight: "700",
              color: itachiMode
                ? "#ffffff"
                : "#475569",
            }}
          >
            Answer selected
          </span>
        )}
      </div>

      <h2
        style={{
          margin: "0 0 28px",
          fontSize: "clamp(22px, 4vw, 30px)",
          lineHeight: 1.4,
        }}
      >
        {question.question ||
          question.text ||
          "Question"}
      </h2>

      <div
        style={{
          display: "grid",
          gap: "12px",
        }}
      >
        {(question.options || []).map(
          (option, optionIndex) => {
            const isSelected =
              selectedAnswer === option;

            return (
              <button
                key={optionIndex}
                type="button"
                onClick={() =>
                  selectAnswer(
                    currentQuestion,
                    option
                  )
                }
                style={{
                  width: "100%",
                  padding: "17px",
                  borderRadius: "13px",
                  border: isSelected
                    ? "2px solid"
                    : itachiMode
                    ? "1px solid #333"
                    : "1px solid #e2e8f0",
                  borderColor: isSelected
                    ? itachiMode
                      ? "#ffffff"
                      : "#111827"
                    : undefined,
                  background: isSelected
                    ? itachiMode
                      ? "#292929"
                      : "#f1f5f9"
                    : itachiMode
                    ? "#111111"
                    : "#ffffff",
                  color: itachiMode
                    ? "#ffffff"
                    : "#111827",
                  textAlign: "left",
                  cursor: "pointer",
                  fontSize: "15px",
                  fontWeight: isSelected
                    ? "800"
                    : "600",
                }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: "12px",
                    background: isSelected
                      ? itachiMode
                        ? "#ffffff"
                        : "#111827"
                      : itachiMode
                      ? "#292929"
                      : "#f1f5f9",
                    color: isSelected
                      ? itachiMode
                        ? "#111111"
                        : "#ffffff"
                      : itachiMode
                      ? "#bbbbbb"
                      : "#475569",
                  }}
                >
                  {String.fromCharCode(
                    65 + optionIndex
                  )}
                </span>

                {option}
              </button>
            );
          }
        )}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "10px",
          marginTop: "30px",
          flexWrap: "wrap",
        }}
      >
        <button
          type="button"
          disabled={currentQuestion === 0}
          onClick={goToPreviousQuestion}
          style={{
            ...buttonStyle,
            background: itachiMode
              ? "#222222"
              : "#ffffff",
            color: itachiMode
              ? "#ffffff"
              : "#111827",
            border: itachiMode
              ? "1px solid #333"
              : "1px solid #e2e8f0",
            opacity:
              currentQuestion === 0 ? 0.45 : 1,
            cursor:
              currentQuestion === 0
                ? "not-allowed"
                : "pointer",
          }}
        >
          ← Previous
        </button>

        <button
          type="button"
          onClick={() => {
            if (isLastQuestion) {
              finishTest();
            } else {
              goToNextQuestion();
            }
          }}
          style={{
            ...buttonStyle,
            background: itachiMode
              ? "#ffffff"
              : "#111827",
            color: itachiMode
              ? "#111111"
              : "#ffffff",
          }}
        >
          {isLastQuestion
            ? "Finish test"
            : "Next question →"}
        </button>
      </div>
    </div>
  </main>
);


};

/* =======================================================
RESULT SCREEN
======================================================= */

const renderResult = () => {
if (!testResult) {
return (
<main
style={{
maxWidth: "900px",
margin: "0 auto",
padding: "60px 20px",
}}
> <div style={cardStyle}> <h2>No test result available</h2>


        <button
          type="button"
          onClick={() =>
            navigateTo("dashboard")
          }
          style={{
            ...buttonStyle,
            background: itachiMode
              ? "#ffffff"
              : "#111827",
            color: itachiMode
              ? "#111111"
              : "#ffffff",
          }}
        >
          Return home
        </button>
      </div>
    </main>
  );
}

const percentage =
  Number(testResult.percentage) || 0;

let resultTitle = "Keep practicing";

if (percentage >= 80) {
  resultTitle = "Excellent work!";
} else if (percentage >= 60) {
  resultTitle = "Good job!";
} else if (percentage >= 40) {
  resultTitle = "You're getting there";
}

return (
  <main
    style={{
      maxWidth: "1000px",
      margin: "0 auto",
      padding: "40px 20px 70px",
    }}
  >
    <div
      style={{
        textAlign: "center",
        marginBottom: "30px",
      }}
    >
      <p
        className="eyebrow"
        style={{ marginBottom: "7px" }}
      >
        TEST COMPLETE
      </p>

      <h1
        style={{
          margin: 0,
          fontSize: "clamp(34px, 6vw, 52px)",
          letterSpacing: "-2px",
        }}
      >
        {resultTitle}
      </h1>

      <p
        style={{
          marginTop: "12px",
          color: itachiMode
            ? "#999999"
            : "#64748b",
        }}
      >
        Here is your performance summary.
      </p>
    </div>

    <section
      style={{
        ...cardStyle,
        textAlign: "center",
        marginBottom: "20px",
      }}
    >
      <div
        style={{
          width: "150px",
          height: "150px",
          borderRadius: "50%",
          margin: "0 auto 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "10px solid",
          borderColor: itachiMode
            ? "#ffffff"
            : "#111827",
          fontSize: "34px",
          fontWeight: "900",
        }}
      >
        {percentage}%
      </div>

      <h2
        style={{
          margin: "0 0 8px",
        }}
      >
        {testResult.correctAnswers} /{" "}
        {testResult.totalQuestions} correct
      </h2>

      <p
        style={{
          margin: 0,
          color: itachiMode
            ? "#999999"
            : "#64748b",
        }}
      >
        {testResult.unitName}
      </p>
    </section>

    <section
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "15px",
        marginBottom: "25px",
      }}
    >
      <div style={cardStyle}>
        <p
          style={{
            margin: 0,
            color: itachiMode
              ? "#999999"
              : "#64748b",
          }}
        >
          Correct
        </p>

        <h3
          style={{
            margin: "8px 0 0",
            fontSize: "30px",
          }}
        >
          {testResult.correctAnswers}
        </h3>
      </div>

      <div style={cardStyle}>
        <p
          style={{
            margin: 0,
            color: itachiMode
              ? "#999999"
              : "#64748b",
          }}
        >
          Incorrect
        </p>

        <h3
          style={{
            margin: "8px 0 0",
            fontSize: "30px",
          }}
        >
          {testResult.wrongAnswers}
        </h3>
      </div>

      <div style={cardStyle}>
        <p
          style={{
            margin: 0,
            color: itachiMode
              ? "#999999"
              : "#64748b",
          }}
        >
          Score
        </p>

        <h3
          style={{
            margin: "8px 0 0",
            fontSize: "30px",
          }}
        >
          {percentage}%
        </h3>
      </div>
    </section>

    <section style={cardStyle}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "15px",
          flexWrap: "wrap",
          marginBottom: "20px",
        }}
      >
        <div>
          <p
            className="eyebrow"
            style={{ marginBottom: "5px" }}
          >
            ANSWER REVIEW
          </p>

          <h2 style={{ margin: 0 }}>
            Review your answers
          </h2>
        </div>

        <button
          type="button"
          onClick={() =>
            navigateTo("review")
          }
          style={{
            ...buttonStyle,
            background: itachiMode
              ? "#ffffff"
              : "#111827",
            color: itachiMode
              ? "#111111"
              : "#ffffff",
          }}
        >
          Review answers →
        </button>
      </div>

      <p
        style={{
          margin: 0,
          lineHeight: 1.6,
          color: itachiMode
            ? "#999999"
            : "#64748b",
        }}
      >
        Go through the questions you missed
        and identify the areas you need to
        improve.
      </p>
    </section>

    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "10px",
        flexWrap: "wrap",
        marginTop: "25px",
      }}
    >
      <button
        type="button"
        onClick={() => {
          resetTest();
          navigateTo("dashboard");
        }}
        style={{
          ...buttonStyle,
          background: itachiMode
            ? "#222222"
            : "#ffffff",
          color: itachiMode
            ? "#ffffff"
            : "#111827",
          border: itachiMode
            ? "1px solid #333"
            : "1px solid #e2e8f0",
        }}
      >
        Back to dashboard
      </button>

      <button
        type="button"
        onClick={() => {
          setTestAnswers({});
          setCurrentQuestion(0);
          setTestTimeLeft(TEST_DURATION);
          setTestStarted(true);
          setTestResult(null);
          setScreen("test");
        }}
        style={{
          ...buttonStyle,
          background: itachiMode
            ? "#ffffff"
            : "#111827",
          color: itachiMode
            ? "#111111"
            : "#ffffff",
        }}
      >
        Try again
      </button>
    </div>
  </main>
);


};

/* =======================================================
ANSWER REVIEW SCREEN
======================================================= */

const renderReview = () => {
const filteredQuestions =
getFilteredReviewQuestions();


return (
  <main
    style={{
      maxWidth: "1000px",
      margin: "0 auto",
      padding: "40px 20px 70px",
    }}
  >
    <button
      type="button"
      onClick={() =>
        navigateTo("result")
      }
      style={{
        ...buttonStyle,
        background: "transparent",
        color: itachiMode
          ? "#bbbbbb"
          : "#64748b",
        padding: 0,
        marginBottom: "18px",
      }}
    >
      ← Back to result
    </button>

    <div
      style={{
        marginBottom: "25px",
      }}
    >
      <p
        className="eyebrow"
        style={{ marginBottom: "6px" }}
      >
        ANSWER REVIEW
      </p>

      <h1
        style={{
          margin: 0,
          fontSize: "clamp(32px, 5vw, 46px)",
          letterSpacing: "-1.5px",
        }}
      >
        Review your test
      </h1>

      <p
        style={{
          marginTop: "10px",
          color: itachiMode
            ? "#999999"
            : "#64748b",
        }}
      >
        Focus on the questions that need more
        attention.
      </p>
    </div>

    <div
      style={{
        display: "flex",
        gap: "8px",
        flexWrap: "wrap",
        marginBottom: "22px",
      }}
    >
      {[
        ["failed", "Needs review"],
        ["passed", "Correct"],
        ["all", "All questions"],
      ].map(([value, label]) => (
        <button
          key={value}
          type="button"
          onClick={() =>
            setReviewFilter(value)
          }
          style={{
            ...buttonStyle,
            background:
              reviewFilter === value
                ? itachiMode
                  ? "#ffffff"
                  : "#111827"
                : itachiMode
                ? "#202020"
                : "#ffffff",
            color:
              reviewFilter === value
                ? itachiMode
                  ? "#111111"
                  : "#ffffff"
                : itachiMode
                ? "#ffffff"
                : "#334155",
            border:
              reviewFilter === value
                ? "none"
                : itachiMode
                ? "1px solid #333"
                : "1px solid #e2e8f0",
          }}
        >
          {label}
        </button>
      ))}
    </div>

    {filteredQuestions.length === 0 ? (
      <div style={cardStyle}>
        <div
          style={{
            textAlign: "center",
            padding: "35px 15px",
          }}
        >
          <div
            style={{
              fontSize: "45px",
              marginBottom: "10px",
            }}
          >
            🎉
          </div>

          <h2 style={{ margin: "0 0 8px" }}>
            Nothing to review
          </h2>

          <p
            style={{
              margin: 0,
              color: itachiMode
                ? "#999999"
                : "#64748b",
            }}
          >
            There are no questions in this
            category.
          </p>
        </div>
      </div>
    ) : (
      <div
        style={{
          display: "grid",
          gap: "18px",
        }}
      >
        {filteredQuestions.map(
          (question) => (
            <div
              key={question.questionIndex}
              style={cardStyle}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "15px",
                }}
              >
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: "800",
                    color: itachiMode
                      ? "#aaaaaa"
                      : "#64748b",
                  }}
                >
                  QUESTION{" "}
                  {question.questionIndex +
                    1}
                </span>

                <span
                  style={{
                    padding: "6px 10px",
                    borderRadius: "999px",
                    fontSize: "12px",
                    fontWeight: "800",
                    background:
                      question.isCorrect
                        ? "#dcfce7"
                        : "#fee2e2",
                    color:
                      question.isCorrect
                        ? "#166534"
                        : "#991b1b",
                  }}
                >
                  {question.isCorrect
                    ? "Correct"
                    : "Needs review"}
                </span>
              </div>

              <h3
                style={{
                  margin: "0 0 20px",
                  fontSize: "20px",
                  lineHeight: 1.5,
                }}
              >
                {question.question ||
                  question.text}
              </h3>

              <div
                style={{
                  display: "grid",
                  gap: "9px",
                }}
              >
                {(question.options ||
                  []).map(
                  (
                    option,
                    optionIndex
                  ) => {
                    const isCorrect =
                      option ===
                      question.answer;

                    const isUserAnswer =
                      option ===
                      question.userAnswer;

                    return (
                      <div
                        key={optionIndex}
                        style={{
                          padding:
                            "13px 14px",
                          borderRadius:
                            "10px",
                          border:
                            isCorrect
                              ? "2px solid #16a34a"
                              : isUserAnswer
                              ? "2px solid #dc2626"
                              : itachiMode
                              ? "1px solid #333"
                              : "1px solid #e2e8f0",
                          background:
                            isCorrect
                              ? "#f0fdf4"
                              : isUserAnswer
                              ? "#fef2f2"
                              : itachiMode
                              ? "#111111"
                              : "#ffffff",
                          color:
                            isCorrect
                              ? "#166534"
                              : isUserAnswer
                              ? "#991b1b"
                              : itachiMode
                              ? "#dddddd"
                              : "#334155",
                        }}
                      >
                        <strong>
                          {String.fromCharCode(
                            65 +
                              optionIndex
                          )}
                          .
                        </strong>{" "}
                        {option}

                        {isCorrect && (
                          <span
                            style={{
                              marginLeft:
                                "8px",
                              fontSize:
                                "12px",
                              fontWeight:
                                "800",
                            }}
                          >
                            ✓ Correct
                          </span>
                        )}

                        {isUserAnswer &&
                          !isCorrect && (
                            <span
                              style={{
                                marginLeft:
                                  "8px",
                                fontSize:
                                  "12px",
                                fontWeight:
                                  "800",
                              }}
                            >
                              Your answer
                            </span>
                          )}
                      </div>
                    );
                  }
                )}
              </div>

              {!question.isCorrect && (
                <div
                  style={{
                    marginTop: "17px",
                    padding: "14px",
                    borderRadius: "11px",
                    background:
                      itachiMode
                        ? "#202020"
                        : "#f8fafc",
                  }}
                >
                  <strong>
                    Correct answer:
                  </strong>{" "}
                  {question.answer}
                </div>
              )}
            </div>
          )
        )}
      </div>
    )}
  </main>
);


};

/* =======================================================
FINISH TEST CONFIRMATION
======================================================= */

const confirmFinishTest = () => {
const answeredCount =
Object.keys(testAnswers).length;


const unansweredCount =
  testQuestions.length - answeredCount;

let confirmationMessage =
  "Are you sure you want to finish the test?";

if (unansweredCount > 0) {
  confirmationMessage =
    `You have ${unansweredCount} unanswered ${
      unansweredCount === 1
        ? "question"
        : "questions"
    }.\n\nAre you sure you want to finish the test?`;
} else {
  confirmationMessage =
    "You have answered all the questions.\n\nAre you sure you want to finish the test?";
}

const confirmed = window.confirm(
  confirmationMessage
);

if (!confirmed) {
  return;
}

finishTest();


};

/* =======================================================
HISTORY SCREEN
======================================================= */

const renderHistory = () => {
return (
<main
style={{
maxWidth: "1200px",
margin: "0 auto",
padding: "40px 20px 70px",
}}
>
<div
style={{
display: "flex",
justifyContent: "space-between",
alignItems: "flex-start",
gap: "20px",
flexWrap: "wrap",
marginBottom: "30px",
}}
> <div>
<p
className="eyebrow"
style={{ marginBottom: "7px" }}
>
PERFORMANCE </p>


        <h1
          style={{
            margin: 0,
            fontSize: "clamp(32px, 5vw, 46px)",
            letterSpacing: "-1.5px",
          }}
        >
          Test History
        </h1>

        <p
          style={{
            marginTop: "10px",
            color: itachiMode
              ? "#999999"
              : "#64748b",
          }}
        >
          Track your progress and see how your
          performance changes over time.
        </p>
      </div>

      {history.length > 0 && (
        <button
          type="button"
          onClick={handleClearHistory}
          style={{
            ...buttonStyle,
            background: itachiMode
              ? "#241414"
              : "#fff1f2",
            color: "#b91c1c",
            border: "1px solid #fecdd3",
          }}
        >
          Clear history
        </button>
      )}
    </div>

    {history.length === 0 ? (
      <div style={cardStyle}>
        <div
          style={{
            textAlign: "center",
            padding: "55px 20px",
          }}
        >
          <div
            style={{
              fontSize: "55px",
              marginBottom: "15px",
            }}
          >
            📊
          </div>

          <h2
            style={{
              margin: "0 0 9px",
            }}
          >
            No tests completed yet
          </h2>

          <p
            style={{
              maxWidth: "500px",
              margin: "0 auto 20px",
              lineHeight: 1.6,
              color: itachiMode
                ? "#999999"
                : "#64748b",
            }}
          >
            Complete your first test and your
            results will appear here.
          </p>

          <button
            type="button"
            onClick={() =>
              navigateTo("units")
            }
            style={{
              ...buttonStyle,
              background: itachiMode
                ? "#ffffff"
                : "#111827",
              color: itachiMode
                ? "#111111"
                : "#ffffff",
            }}
          >
            Start studying
          </button>
        </div>
      </div>
    ) : (
      <div
        style={{
          display: "grid",
          gap: "15px",
        }}
      >
        {history.map((item, index) => {
          const percentage =
            Number(item.percentage) || 0;

          return (
            <div
              key={
                item.id ||
                `${item.date}-${index}`
              }
              style={{
                ...cardStyle,
                display: "flex",
                alignItems: "center",
                justifyContent:
                  "space-between",
                gap: "20px",
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "15px",
                }}
              >
                <div
                  style={{
                    width: "58px",
                    height: "58px",
                    borderRadius: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background:
                      percentage >= 80
                        ? "#dcfce7"
                        : percentage >= 50
                        ? "#fef3c7"
                        : "#fee2e2",
                    color:
                      percentage >= 80
                        ? "#166534"
                        : percentage >= 50
                        ? "#92400e"
                        : "#991b1b",
                    fontWeight: "900",
                    fontSize: "15px",
                  }}
                >
                  {percentage}%
                </div>

                <div>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: "18px",
                    }}
                  >
                    {item.unitName ||
                      "General Test"}
                  </h3>

                  <p
                    style={{
                      margin:
                        "5px 0 0",
                      fontSize: "13px",
                      color: itachiMode
                        ? "#999999"
                        : "#64748b",
                    }}
                  >
                    {item.date
                      ? new Date(
                          item.date
                        ).toLocaleString()
                      : "Unknown date"}
                  </p>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "20px",
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <strong>
                    {item.correctAnswers}
                  </strong>{" "}
                  correct
                </div>

                <div
                  style={{
                    color: itachiMode
                      ? "#999999"
                      : "#64748b",
                  }}
                >
                  {item.wrongAnswers} incorrect
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setTestResult(item);
                    setReviewFilter(
                      "failed"
                    );
                    setScreen("review");
                  }}
                  style={{
                    ...buttonStyle,
                    padding:
                      "9px 13px",
                    background:
                      itachiMode
                        ? "#222222"
                        : "#f8fafc",
                    color: itachiMode
                      ? "#ffffff"
                      : "#111827",
                    border:
                      itachiMode
                        ? "1px solid #333"
                        : "1px solid #e2e8f0",
                  }}
                >
                  Review
                </button>
              </div>
            </div>
          );
        })}
      </div>
    )}
  </main>
);


};

/* =======================================================
SETTINGS SCREEN
======================================================= */

const updateSetting = (
settingName,
value
) => {
setSettings((previous) => ({
...previous,
[settingName]: value,
}));
};

const renderSettings = () => {
return (
<main
style={{
maxWidth: "900px",
margin: "0 auto",
padding: "40px 20px 70px",
}}
>
<div
style={{
marginBottom: "30px",
}}
>
<p
className="eyebrow"
style={{ marginBottom: "7px" }}
>
PREFERENCES </p>


      <h1
        style={{
          margin: 0,
          fontSize: "clamp(32px, 5vw, 46px)",
          letterSpacing: "-1.5px",
        }}
      >
        Settings
      </h1>

      <p
        style={{
          marginTop: "10px",
          color: itachiMode
            ? "#999999"
            : "#64748b",
        }}
      >
        Customize your StudyMate experience.
      </p>
    </div>

    <div
      style={{
        display: "grid",
        gap: "15px",
      }}
    >
      <section style={cardStyle}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <div>
            <h2
              style={{
                margin: "0 0 6px",
                fontSize: "19px",
              }}
            >
              Sound effects
            </h2>

            <p
              style={{
                margin: 0,
                color: itachiMode
                  ? "#999999"
                  : "#64748b",
                lineHeight: 1.5,
              }}
            >
              Enable sounds for important study
              actions.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              updateSetting(
                "sound",
                !settings.sound
              )
            }
            style={{
              width: "58px",
              height: "32px",
              border: "none",
              borderRadius: "99px",
              cursor: "pointer",
              background: settings.sound
                ? "#111827"
                : "#cbd5e1",
              position: "relative",
              flexShrink: 0,
            }}
            aria-label="Toggle sound"
          >
            <span
              style={{
                position: "absolute",
                top: "4px",
                left: settings.sound
                  ? "30px"
                  : "4px",
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                background: "#ffffff",
                transition:
                  "left 0.2s ease",
              }}
            />
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <div>
            <h2
              style={{
                margin: "0 0 6px",
                fontSize: "19px",
              }}
            >
              Animations
            </h2>

            <p
              style={{
                margin: 0,
                color: itachiMode
                  ? "#999999"
                  : "#64748b",
                lineHeight: 1.5,
              }}
            >
              Enable interface animations.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              updateSetting(
                "animations",
                !settings.animations
              )
            }
            style={{
              width: "58px",
              height: "32px",
              border: "none",
              borderRadius: "99px",
              cursor: "pointer",
              background:
                settings.animations
                  ? "#111827"
                  : "#cbd5e1",
              position: "relative",
              flexShrink: 0,
            }}
            aria-label="Toggle animations"
          >
            <span
              style={{
                position: "absolute",
                top: "4px",
                left: settings.animations
                  ? "30px"
                  : "4px",
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                background: "#ffffff",
                transition:
                  "left 0.2s ease",
              }}
            />
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h2
              style={{
                margin: "0 0 6px",
                fontSize: "19px",
              }}
            >
              Itachi mode
            </h2>

            <p
              style={{
                margin: 0,
                color: itachiMode
                  ? "#999999"
                  : "#64748b",
                lineHeight: 1.5,
              }}
            >
              Switch to the dark Sharingan-inspired
              StudyMate appearance.
            </p>
          </div>

          <button
            type="button"
            onClick={toggleItachiMode}
            style={{
              ...buttonStyle,
              background: itachiMode
                ? "#ffffff"
                : "#111827",
              color: itachiMode
                ? "#111111"
                : "#ffffff",
            }}
          >
            {itachiMode
              ? "Disable mode"
              : "Enable mode"}
          </button>
        </div>
      </section>

      <section
        style={{
          ...cardStyle,
          borderColor: "#fecaca",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h2
              style={{
                margin: "0 0 6px",
                fontSize: "19px",
              }}
            >
              Reset StudyMate
            </h2>

            <p
              style={{
                margin: 0,
                color: itachiMode
                  ? "#999999"
                  : "#64748b",
                lineHeight: 1.5,
              }}
            >
              Delete saved units, test history,
              and preferences from this browser.
            </p>
          </div>

          <button
            type="button"
            onClick={
              handleResetStudyMate
            }
            style={{
              ...buttonStyle,
              background: "#fee2e2",
              color: "#991b1b",
              border:
                "1px solid #fecaca",
            }}
          >
            Reset data
          </button>
        </div>
      </section>
    </div>
  </main>
);


};

/* =======================================================
FOOTER
======================================================= */

const renderFooter = () => {
return (
<footer
style={{
maxWidth: "1200px",
margin: "0 auto",
padding: "30px 20px 40px",
borderTop: itachiMode
? "1px solid #252525"
: "1px solid #e5e7eb",
color: itachiMode
? "#777777"
: "#94a3b8",
fontSize: "13px",
textAlign: "center",
}}
>
<p style={{ margin: 0 }}>
StudyMate · Learn smarter. Practice better. </p> </footer>
);
};

/* =======================================================
MAIN APPLICATION RENDER
======================================================= */

if (!isAuthenticated) {
return ( <div style={pageStyle}>
{renderAuthScreen()} </div>
);
}

return (
<div
style={{
...pageStyle,
display: "flex",
flexDirection: "column",
}}
>
{renderNavbar()}

  {renderMessages()}

  <div
    style={{
      flex: 1,
    }}
  >
    {screen === "dashboard" &&
      renderDashboard()}

    {screen === "units" &&
      renderUnits()}

    {screen === "unit" &&
      renderUnit()}

    {screen === "test" &&
      renderTest()}

    {screen === "result" &&
      renderResult()}

    {screen === "review" &&
      renderReview()}

    {screen === "history" &&
      renderHistory()}

    {screen === "settings" &&
      renderSettings()}
  </div>

  {renderFooter()}
</div>

);
}

export default App;
