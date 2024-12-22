import { fetchDanceCourses } from "./utils/fetchDanceCourses.js";

document.addEventListener("DOMContentLoaded", async () => {
    // header submenu
    const dance_courses = await fetchDanceCourses();
    const topDanceCourses = dance_courses.toSorted((a, b) => b.rating - a.rating).slice(3, 6);
    const dance_coursesSubmenu = document.querySelector(".header__submenu.dance_courses ul")

    topDanceCourses.forEach(dance_course => {
        let link = document.createElement("li");
        link.className = "header__link";
        link.innerHTML = `
            <a href="./dancecourses.html?id=${dance_course.id}">
                ${dance_course.title}
                <i class="fi fi-rr-angle-small-right"></i>
            </a>
        `;
        dance_coursesSubmenu.append(link);
    });

    // bookings count
    const bookings = JSON.parse(localStorage.getItem("bookings")) || [];

    if(bookings.length) {
        const myBookingsLink = document.querySelector(".header__cart");
        const myBookingsCount = document.createElement("span");
        myBookingsCount.className = "header__cart-count";
        myBookingsCount.textContent = `(${bookings.length})`;
        myBookingsLink.append(myBookingsCount);
    }
});
