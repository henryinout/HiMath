// Simulate questions content
const questions = {
    1: {
        title: "Question 1",
        content: "Six consecutive positive integers are written on slips of paper. The slips are handed out to Ethan, Jacob, and Karthik, such that each of them receives two slips. The product of Ethan’s numbers is 20, and the product of Jacob’s numbers is 24. Compute the product of Karthik’s numbers."
    },
    2: {
        title: "Question 2",
        content: "A geometric sequence has a first term of 3 and a common ratio of 2. Find the sum of the first five terms."
    },
    3: {
        title: "Question 3",
        content: "Find the area of a triangle with vertices at (0, 0), (4, 0), and (0, 3)."
    }
};

// Toggle dropdown visibility
function toggleDropdown() {
    const dropdown = document.getElementById("dropdown-menu");
    dropdown.classList.toggle("visible");
}

// Select a question
function selectQuestion(questionNumber) {
    const question = questions[questionNumber];
    document.getElementById("question-title").textContent = question.title;
    document.getElementById("question-content").textContent = question.content;
    toggleDropdown(); // Close the dropdown
}

// Handle answer submission
function submitAnswer() {
    const answer = document.getElementById("answer-input").value;
    if (answer.trim() === "") {
        alert("Please enter an answer.");
        return;
    }
    alert("Your answer has been submitted: " + answer);
    document.getElementById("answer-input").value = ""; // Clear input
}

// Countdown timer
let remainingTime = 32 * 60 + 49; // in seconds
function updateTimer() {
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    document.getElementById("time-remaining").textContent =
        `Time Remaining: ${minutes}:${seconds.toString().padStart(2, '0')}`;
    if (remainingTime > 0) {
        remainingTime--;
        setTimeout(updateTimer, 1000);
    }
}
updateTimer();