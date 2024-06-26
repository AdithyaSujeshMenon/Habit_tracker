document.addEventListener('DOMContentLoaded', () => {
    const habitForm = document.getElementById('habit-form');
    const habitInput = document.getElementById('habit-input');
    const habitList = document.getElementById('habit-list');
    const habitChartCanvas = document.getElementById('habit-chart').getContext('2d');
    const notification = document.getElementById('notification');
    let habitChart;

    const loadHabits = () => {
        const habits = JSON.parse(localStorage.getItem('habits')) || [];
        habitList.innerHTML = '';
        habits.forEach((habit, index) => {
            const habitItem = document.createElement('li');
            habitItem.innerHTML = `
                ${habit.name}
                <input type="number" min="0" max="100" value="${habit.progress || 0}" data-index="${index}" class="progress-input">
                <button class="done" data-index="${index}">Update</button>
                <button class="remove" data-index="${index}">Remove</button>
            `;
            habitList.appendChild(habitItem);
        });
        updateChart(habits);
    };

    const saveHabits = (habits) => {
        localStorage.setItem('habits', JSON.stringify(habits));
        loadHabits();
    };

    const showNotification = (message) => {
        notification.textContent = message;
        notification.style.display = 'block';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 2000);
    };

    habitForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const habit = habitInput.value.trim();
        if (habit) {
            const habits = JSON.parse(localStorage.getItem('habits')) || [];
            habits.push({ name: habit, progress: 0 });
            saveHabits(habits);
            habitInput.value = '';
            showNotification('Habit added successfully!');
        }
    });

    habitList.addEventListener('click', (e) => {
        const index = e.target.getAttribute('data-index');
        if (e.target.classList.contains('done')) {
            const progressInput = document.querySelector(`.progress-input[data-index="${index}"]`);
            const progress = parseInt(progressInput.value, 10);
            if (isNaN(progress) || progress < 0 || progress > 100) {
                showNotification('Invalid progress value');
                return;
            }
            const habits = JSON.parse(localStorage.getItem('habits'));
            habits[index].progress = progress;
            saveHabits(habits);
            showNotification('Habit progress updated!');
        } else if (e.target.classList.contains('remove')) {
            const habits = JSON.parse(localStorage.getItem('habits'));
            habits.splice(index, 1);
            saveHabits(habits);
            showNotification('Habit removed successfully!');
        }
    });

    const updateChart = (habits) => {
        const habitNames = habits.map(habit => habit.name);
        const habitData = habits.map(habit => habit.progress);

        if (habitChart) {
            habitChart.destroy();
        }

        habitChart = new Chart(habitChartCanvas, {
            type: 'bar',
            data: {
                labels: habitNames,
                datasets: [{
                    label: 'Habit Progress (%)',
                    data: habitData,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            stepSize: 10
                        }
                    }
                }
            }
        });
    };

    loadHabits();
});
