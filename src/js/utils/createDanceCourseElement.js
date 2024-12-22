export function createDanceCourseElement(dance_course) {
    const notifications = new Notyf({
        duration: 3000,
        position: {
            x: 'right',
            y: 'top',
        },
    });
    
    // registration modal
    let selectedDanceCourseId = null;

    const modal = document.querySelector(".modal");
    const modalForm = modal.querySelector("form");
    const modalClose = modal.querySelector(".modal__close");

    if(modalForm) modalForm.addEventListener("submit", saveBooking);
    if(modalClose) modalClose.addEventListener("click", closeModal);

    window.addEventListener("click", e => {
        if (e.target === modal) closeModal();
    });

    function openModal(dance_courseId) {
        selectedDanceCourseId = dance_courseId;
        modal.classList.add("open");
        document.body.classList.add("lock");
    }

    function closeModal() {
        modal.classList.remove("open");
        document.body.classList.remove("lock");
        modalForm.reset();
        selectedDanceCourseId = null;
    }

    function saveBooking(event) {
        event.preventDefault();

        let bookings = JSON.parse(localStorage.getItem("bookings")) || [];

        bookings.push({
            dance_courseId: selectedDanceCourseId
        });

        bookings = bookings.filter(item => item.dance_courseId);

        localStorage.setItem("bookings", JSON.stringify(bookings));
        notifications.success('You have successfully registered for the dance_course!');
        closeModal();
        document.location.reload();
    }

    // dance_course card
    const registeredDanceCourses = JSON.parse(localStorage.getItem("bookings")) || [];
    const isRegistered = registeredDanceCourses.find(item => item.dance_courseId === dance_course.id);
    
    const dance_courseElement = document.createElement("div");
    dance_courseElement.className = "dance_course dance_course-card";

    const stars = Array.from({ length: 5 }, (_, i) =>
        `<i class="fi ${i < Math.round(dance_course.rating) ? "fi-sr-star" : "fi-rr-star"}"></i>`
    ).join("");

    const isAvailable = dance_course.availableSeats > 0;
    const isFutureDate = new Date(dance_course.date) >= new Date();
    const showRegisterButton = isAvailable && isFutureDate;

    dance_courseElement.innerHTML = `
        <div class="dance_course__image">
            <div class="dance_course__price">€${dance_course.price}</div>
            <img src="${dance_course.image}" alt="${dance_course.title}">
        </div>

        <div class="dance_course__body">
            <span class="dance_course__date">
                <i class="fi fi-rr-calendar"></i>
                ${dance_course.date}
            </span>

            <h4 class="dance_course__title">${dance_course.title}</h4>

            <p class="dance_course__description">${dance_course.description}</p>

            <div class="dance_course__rating">${stars} - ${dance_course.rating === 5 ? '5.0' : dance_course.rating}</div>

            <div class="dance_course__details">
                <div class="dance_course__seats">
                    <i class="fi fi-sr-user"></i>
                    ${dance_course.totalSeats - dance_course.availableSeats} / ${dance_course.totalSeats}
                </div>
            </div>

            ${
                isRegistered
                    ? '<button class="dance_course__message"><i class="fi fi-br-check"></i>Already registered</button>'
                    : showRegisterButton
                    ? '<button class="dance_course__register">Register</button>'
                    : '<button class="dance_course__register" disabled>Registration closed</button>'
            }
        </div>
    `;

    const registerButton = dance_courseElement.querySelector(".dance_course__register");
    if (registerButton) {
        registerButton.addEventListener("click", () => openModal(dance_course.id));
    }

    return dance_courseElement;
};