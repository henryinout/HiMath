// Redirect if not logged in
const token = localStorage.getItem("token");
if (!token) {
    alert("您需要先登录！");
    window.location.href = "index.html"; // Redirect to login page
}

let questions = {}; // To store questions fetched from the backend

// Dynamically load questions into dropdown menu
function loadQuestionsIntoDropdown() {
    const dropdownMenu = document.getElementById("dropdown-menu");
    dropdownMenu.innerHTML = ""; // Clear existing items

    Object.keys(questions).forEach((questionNumber) => {
        const menuItem = document.createElement("div");
        menuItem.classList.add("menu-item");
        menuItem.textContent = `题目 ${questionNumber}`;
        menuItem.onclick = () => selectQuestion(questionNumber);
        dropdownMenu.appendChild(menuItem);
    });
}

// Dropdown Logic
function setupDropdown() {
    const dropdownBtn = document.querySelector(".dropdown-btn");
    const dropdownMenu = document.getElementById("dropdown-menu");

    dropdownBtn.addEventListener("click", (e) => {
        e.stopPropagation(); // Prevent click from closing menu immediately
        dropdownMenu.classList.toggle("active");
        dropdownBtn.classList.toggle("active");
    });

    document.addEventListener("click", () => {
        dropdownMenu.classList.remove("active");
        dropdownBtn.classList.remove("active");
    });
}

// Select a question
function selectQuestion(questionNumber) {
    const question = questions[questionNumber];
    if (question) {
        document.getElementById("question-title").textContent = question.title;
        document.getElementById("question-content").textContent = question.content;
    } else {
        alert("未找到所选题目！");
    }

    // Close dropdown
    const dropdownMenu = document.getElementById("dropdown-menu");
    const dropdownBtn = document.querySelector(".dropdown-btn");
    dropdownMenu.classList.remove("active");
    dropdownBtn.classList.remove("active");
}

// Handle answer submission
function submitAnswer() {
    const answerInput = document.getElementById("answer-input");
    const answer = answerInput.value.trim();
    const currentQuestionId = Object.keys(questions).find(
        (id) => questions[id].title === document.getElementById("question-title").textContent
    );

    if (answer === "") {
        alert("请输入答案！");
        return;
    }

    fetch("http://localhost:3000/api/submit", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: token,
        },
        body: JSON.stringify({ questionId: currentQuestionId, answer }),
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.correct) {
                alert("答案正确！");
            } else {
                alert("答案错误，请再试一次！");
            }
        })
        .catch((err) => {
            console.error("提交答案失败：", err);
            alert("提交失败，请稍后再试！");
        });

    answerInput.value = ""; // Clear input field
}

// Countdown timer
function setupTimer(durationInSeconds, timerElementId) {
    let remainingTime = durationInSeconds;

    function updateTimer() {
        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;
        document.getElementById(timerElementId).textContent = `剩余时间: ${minutes}:${seconds
            .toString()
            .padStart(2, "0")}`;
        if (remainingTime > 0) {
            remainingTime--;
            setTimeout(updateTimer, 1000);
        } else {
            alert("时间到了！");
        }
    }

    updateTimer();
}

// Fetch questions from backend
function fetchQuestions() {
    fetch("http://localhost:3000/api/questions", {
        headers: { Authorization: token },
    })
        .then((res) => res.json())
        .then((data) => {
            questions = data; // Store fetched questions
            loadQuestionsIntoDropdown(); // Populate dropdown menu
            selectQuestion(Object.keys(questions)[0]); // Show the first question by default
        })
        .catch((err) => {
            console.error("获取题目失败：", err);
            alert("无法加载题目，请稍后再试！");
        });
}

// Initialize the exam page
function initializeExamPage() {
    setupDropdown(); // Set up dropdown logic
    fetchQuestions(); // Fetch questions from backend
    setupTimer(32 * 60 + 49, "time-remaining"); // Start countdown timer
}

// Initialize the page on load
document.addEventListener("DOMContentLoaded", initializeExamPage);