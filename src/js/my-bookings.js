import { createDanceCourseElement } from "./utils/createDanceCourseElement.js";
import { fetchDanceCourses } from "./utils/fetchDanceCourses.js";

document.addEventListener("DOMContentLoaded", async () => {
    // my bookings
    const dance_courses = await fetchDanceCourses();
    const bookingsGrid = document.querySelector(".my-bookings__grid");
    const bookings = JSON.parse(localStorage.getItem("bookings")) || [];

    let bookedDanceCourses = bookings.map(booking => {
        return {
            ...booking,
            dance_course: dance_courses.find(exc => exc.id === booking.dance_courseId)
        };
    });

    bookedDanceCourses = bookedDanceCourses.filter((item) => item.dance_courseId);

    if(bookedDanceCourses.length) {
        document.querySelector(".empty").remove();

        console.log(bookedDanceCourses);

        bookedDanceCourses.forEach(booking => {
            const dance_courseElement = createDanceCourseElement(booking.dance_course);
            bookingsGrid.append(dance_courseElement);
        });
    }

    // calendar
    const calendarContainer = document.querySelector(".calendar__days");
    const calendarDate = document.querySelector(".calendar__date");
    const nextButton = document.querySelector(".calendar__next");
    const prevButton = document.querySelector(".calendar__prev");

    const today = new Date();
    let currentMonth = today.getMonth();
    let currentYear = today.getFullYear();

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const hasBookings = (year, month) => {
        if (month > 11) {
            year++;
            month = 0;
        } else if (month < 0) {
            year--;
            month = 11;
        }

        return bookedDanceCourses.some((booking) => {
            const bookingDate = new Date(booking.dance_course.date);
            return bookingDate.getFullYear() === year && bookingDate.getMonth() === month;
        });
    };

    const renderCalendar = () => {
        calendarContainer.innerHTML = "";

        nextButton.disabled = !hasBookings(currentYear, currentMonth + 1);
        prevButton.disabled = !hasBookings(currentYear, currentMonth - 1);

        // day names
        const dayNamesRow = document.createElement("div");
        dayNamesRow.className = "calendar__week day-names";
        dayNames.forEach((dayName) => {
            const dayElement = document.createElement("div");
            dayElement.className = "calendar__day-name";
            dayElement.textContent = dayName;
            dayNamesRow.append(dayElement);
        });
        calendarContainer.append(dayNamesRow);

        const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
        const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);

        // weeks
        const weeks = [];
        let currentWeek = [];

        for (let i = firstDayOfMonth.getDay() === 0 ? -6 : 1 - firstDayOfMonth.getDay(); i <= lastDayOfMonth.getDate(); i++) {
            const currentDate = new Date(currentYear, currentMonth, i);

            if (i > 0 && i <= lastDayOfMonth.getDate()) {
                const matchingBookings = bookedDanceCourses.filter(
                    (booking) => new Date(booking.dance_course.date).toDateString() === currentDate.toDateString()
                );

                currentWeek.push({
                    date: currentDate,
                    isBooking: matchingBookings.length > 0,
                    bookings: matchingBookings,
                });
            } else {
                currentWeek.push({ date: null });
            }

            if (currentWeek.length === 7 || i === lastDayOfMonth.getDate()) {
                weeks.push(currentWeek);
                currentWeek = [];
            }
        }

        weeks.forEach((week) => {
            const weekRow = document.createElement("div");
            weekRow.className = "calendar__week";

            week.forEach((day) => {
                const dayElement = document.createElement("div");
                dayElement.className = "calendar__day";

                if (day.date) {
                    dayElement.innerText = day.date.getDate();

                    if (day.isBooking) {
                        dayElement.classList.add("booked");
                        dayElement.title = day.bookings.map(b => b.dance_course.title);
                        dayElement.addEventListener("click", () => {
                            dayElement.classList.toggle("active");

                            if(dayElement.classList.contains("active")) {
                                filterBookingsByDate(day.date);
                            } else {
                                bookingsGrid.innerHTML = "";
                                
                                bookedDanceCourses.forEach(booking => {
                                    const dance_courseElement = createDanceCourseElement(booking.dance_course);
                                    bookingsGrid.append(dance_courseElement);
                                });
                            }
                        });

                        console.log(day);
                    }
                } else {
                    dayElement.classList.add("hidden");
                }

                weekRow.append(dayElement);
            });

            if( week.every(day => !day.date) ) {
                weekRow.classList.add("hidden");
            }

            calendarContainer.append(weekRow);
        });

        calendarDate.textContent = `${monthNames[currentMonth]} ${currentYear}`;
    };

    const filterBookingsByDate = (date) => {
        const filteredBookings = bookedDanceCourses.filter(
            (booking) => new Date(booking.dance_course.date).toDateString() === date.toDateString()
        );

        bookingsGrid.innerHTML = "";
        filteredBookings.forEach((booking) => {
            const dance_courseElement = createDanceCourseElement(booking.dance_course);
            bookingsGrid.append(dance_courseElement);
        });
    };


    nextButton.addEventListener("click", () => {
        currentMonth++;

        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }

        renderCalendar();
    });

    prevButton.addEventListener("click", () => {
        currentMonth--;

        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }

        renderCalendar();
    });

    renderCalendar();
});
