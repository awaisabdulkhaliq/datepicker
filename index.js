const MONTH_NAMES = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];

const WEEKDAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

class DatePicker {
    constructor(element, options = {}) {
        this.root = element;
        this.options = {
            placeholder: options.placeholder || 'Select a date',
            value: options.value || null,
            onChange: typeof options.onChange === 'function' ? options.onChange : null
        };

        this.selectedDate = this.options.value ? this.normalizeDate(this.options.value) : null;
        const initialDate = this.selectedDate || new Date();
        this.viewDate = new Date(initialDate.getFullYear(), initialDate.getMonth(), 1);
        this.isOpen = false;

        this.render();
        this.bindEvents();
        this.update();
    }

    normalizeDate(date) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }

    formatDate(date) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    isSameDate(firstDate, secondDate) {
        return firstDate && secondDate
            && firstDate.getFullYear() === secondDate.getFullYear()
            && firstDate.getMonth() === secondDate.getMonth()
            && firstDate.getDate() === secondDate.getDate();
    }

    render() {
        this.root.className = 'datepicker';
        this.root.innerHTML = `
            <button type="button" class="datepicker-toggle" aria-expanded="false">
                <span class="datepicker-value"></span>
                <span aria-hidden="true">📅</span>
            </button>
            <div class="datepicker-panel" hidden>
                <div class="calendar-header">
                    <button type="button" class="calendar-nav" data-direction="prev" aria-label="Previous month">‹</button>
                    <div class="calendar-title" aria-live="polite"></div>
                    <button type="button" class="calendar-nav" data-direction="next" aria-label="Next month">›</button>
                </div>
                <div class="calendar-weekdays"></div>
                <div class="calendar-days"></div>
            </div>
        `;

        this.toggleButton = this.root.querySelector('.datepicker-toggle');
        this.valueElement = this.root.querySelector('.datepicker-value');
        this.panel = this.root.querySelector('.datepicker-panel');
        this.titleElement = this.root.querySelector('.calendar-title');
        this.weekdaysElement = this.root.querySelector('.calendar-weekdays');
        this.daysElement = this.root.querySelector('.calendar-days');

        this.weekdaysElement.innerHTML = WEEKDAY_NAMES.map((day) => `<span>${day}</span>`).join('');
    }

    bindEvents() {
        this.toggleButton.addEventListener('click', () => {
            this.isOpen ? this.close() : this.open();
        });

        this.root.addEventListener('click', (event) => {
            const navButton = event.target.closest('.calendar-nav');
            if (navButton) {
                const direction = navButton.dataset.direction === 'prev' ? -1 : 1;
                this.viewDate = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() + direction, 1);
                this.updateCalendar();
                return;
            }

            const dayButton = event.target.closest('.calendar-day[data-date]');
            if (dayButton) {
                this.selectedDate = this.normalizeDate(new Date(dayButton.dataset.date));
                this.viewDate = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), 1);
                this.update();
                this.close();

                if (this.options.onChange) {
                    this.options.onChange(this.selectedDate);
                }
            }
        });

        document.addEventListener('click', (event) => {
            if (!this.root.contains(event.target)) {
                this.close();
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                this.close();
            }
        });
    }

    open() {
        this.isOpen = true;
        this.panel.hidden = false;
        this.toggleButton.setAttribute('aria-expanded', 'true');
    }

    close() {
        this.isOpen = false;
        this.panel.hidden = true;
        this.toggleButton.setAttribute('aria-expanded', 'false');
    }

    updateValue() {
        if (this.selectedDate) {
            this.valueElement.textContent = this.formatDate(this.selectedDate);
            this.valueElement.className = 'datepicker-value has-value';
        } else {
            this.valueElement.textContent = this.options.placeholder;
            this.valueElement.className = 'datepicker-value datepicker-placeholder';
        }
    }

    updateCalendar() {
        const month = this.viewDate.getMonth();
        const year = this.viewDate.getFullYear();
        const firstDayIndex = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const today = this.normalizeDate(new Date());
        const dayButtons = [];

        this.titleElement.textContent = `${MONTH_NAMES[month]} ${year}`;

        for (let index = 0; index < firstDayIndex; index += 1) {
            dayButtons.push('<button type="button" class="calendar-day is-empty" tabindex="-1"></button>');
        }

        for (let day = 1; day <= daysInMonth; day += 1) {
            const date = new Date(year, month, day);
            const classes = ['calendar-day'];

            if (this.isSameDate(date, today)) {
                classes.push('is-today');
            }

            if (this.isSameDate(date, this.selectedDate)) {
                classes.push('is-selected');
            }

            dayButtons.push(`
                <button
                    type="button"
                    class="${classes.join(' ')}"
                    data-date="${date.toISOString()}"
                    aria-label="${this.formatDate(date)}"
                >
                    ${day}
                </button>
            `);
        }

        this.daysElement.innerHTML = dayButtons.join('');
    }

    update() {
        this.updateValue();
        this.updateCalendar();
    }
}

const output = document.getElementById('selection-output');
const host = document.getElementById('booking-date');

const picker = new DatePicker(host, {
    placeholder: 'Pick a booking date',
    onChange: (date) => {
        output.textContent = `Selected date: ${picker.formatDate(date)}`;
    }
});
