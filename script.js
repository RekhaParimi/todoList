document.addEventListener("DOMContentLoaded", function () {
    const taskInput = document.getElementById("task");
    const addTaskButton = document.getElementById("addTask");
    const taskList = document.getElementById("taskList");
    const completedTasksList = document.getElementById("completedTasks");
    const productiveTimeElement = document.getElementById("productiveTime");
    let productiveTimeToday = 0;
    let timerInterval;
    let isTimerRunning = false;
    let remainingTime = 0;

    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText === "") return;

        const listItem = document.createElement("li");
        listItem.innerHTML = `
            <input type="checkbox">
            <span>${taskText}</span>
            <button class="start-button">Start</button>
            <button class="pause-button">Pause</button>
        `;

        taskList.appendChild(listItem);
        taskInput.value = "";

        const checkbox = listItem.querySelector("input[type='checkbox']");
        const startButton = listItem.querySelector(".start-button");
        const pauseButton = listItem.querySelector(".pause-button");

        // Event listener for starting or resuming Pomodoro timer
        startButton.addEventListener("click", () => {
            startOrResumePomodoroTimer(listItem, checkbox);
        });

        // Event listener for pausing Pomodoro timer
        pauseButton.addEventListener("click", () => {
            pausePomodoroTimer();
        });

        // Event listener for marking task as completed
        checkbox.addEventListener("change", () => {
            if (checkbox.checked) {
                markTaskAsCompleted(listItem);
                updateProductiveTime(25); // 25 minutes for each work session
                showNotification("Take a 5-minute break!");
            }
        });
    }

    function startOrResumePomodoroTimer(listItem, checkbox) {
        const workDuration = 25 * 60; // 25 minutes in seconds
        const breakDuration = 5 * 60; // 5 minutes in seconds
        const timerDisplay = document.createElement("span");
        listItem.appendChild(timerDisplay);

        let timeRemaining = remainingTime || workDuration;

        function updateTimerDisplay() {
            const minutes = Math.floor(timeRemaining / 60);
            const seconds = timeRemaining % 60;
            timerDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        }

        function startWorkSession() {
            isTimerRunning = true;
            timeRemaining = remainingTime || workDuration;
            remainingTime = 0;
            clearInterval(timerInterval);
            updateTimerDisplay();
            timerInterval = setInterval(() => {
                timeRemaining--;
                updateTimerDisplay();
                if (timeRemaining === 0) {
                    clearInterval(timerInterval);
                    startBreakSession();
                }
            }, 1000);
        }

        function startBreakSession() {
            isTimerRunning = true;
            timeRemaining = breakDuration;
            clearInterval(timerInterval);
            updateTimerDisplay();
            timerInterval = setInterval(() => {
                timeRemaining--;
                updateTimerDisplay();
                if (timeRemaining === 0) {
                    clearInterval(timerInterval);
                    timerDisplay.textContent = "Done!";
                    isTimerRunning = false;
                }
            }, 1000);
        }

        startWorkSession();
    }

    function pausePomodoroTimer() {
        if (isTimerRunning) {
            clearInterval(timerInterval);
            remainingTime = timeRemaining;
            isTimerRunning = false;
        }
    }

    function markTaskAsCompleted(listItem) {
        const taskText = listItem.querySelector("span").textContent;
        const completedTaskItem = document.createElement("li");
        completedTaskItem.textContent = taskText;
        completedTasksList.appendChild(completedTaskItem);
    }

    function updateProductiveTime(minutes) {
        productiveTimeToday += minutes;
        productiveTimeElement.textContent = productiveTimeToday + " min";
    }

    function showNotification(message) {
        // Replace this with your preferred way of showing notifications
        alert(message);
    }

    addTaskButton.addEventListener("click", addTask);
});
