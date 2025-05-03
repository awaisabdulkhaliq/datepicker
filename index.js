const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

let selectedDate = new Date();
let currentMonth = selectedDate.getMonth();
let currentYear = selectedDate.getFullYear();

function generateCalendar(month, year) {
    const calendarDays = $('#calendar-days');
    calendarDays.empty();

    const firstDay = new Date(year, month).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
        calendarDays.append('<div></div>');
    }
    for (let d = 1; d <= daysInMonth; d++) {
        const dayDiv = $('<div>' + d + '</div>');
        dayDiv.click(function () {
            const formatted = ('0' + d).slice(-2) + '/' + ('0' + (month + 1)).slice(-2) + '/' + year;
            $('#selected-date').text(formatted);
        });
        calendarDays.append(dayDiv);
    }

    $('#month-label').text(monthNames[month] + ' ' + year);
}

$(document).ready(function () {
    generateCalendar(currentMonth, currentYear);

    $('#prev-month').click(function (e) {
        e.stopPropagation();
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        generateCalendar(currentMonth, currentYear);
    });

    $('#next-month').click(function (e) {
        e.stopPropagation();
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        generateCalendar(currentMonth, currentYear);
    });
});