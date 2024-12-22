import { fetchDanceCourses } from "./utils/fetchDanceCourses.js";
import { createDanceCourseElement } from "./utils/createDanceCourseElement.js";

document.addEventListener("DOMContentLoaded", async () => {
    // dance_courses
    const dance_courses = await fetchDanceCourses();
    let filteredDanceCourses = [...dance_courses];
    const dance_coursesGrid = document.querySelector(".dance_courses__grid");
    updateDanceCoursesGrid();

    // search
    const searchInput = document.querySelector(".dance_courses__search input");
    if(searchInput) {
        const debouncedHandleSearch = debounce(handleSearch, 200);
        searchInput.addEventListener("keyup", debouncedHandleSearch);
    }

    // check id param (if redirected)
    const url_params = new URLSearchParams(document.location.search);
    const url_params_id = url_params.get("id");

    if(url_params_id) {
        const matchingDanceCourse = dance_courses.find(item => +item.id === +url_params_id);
        
        if(matchingDanceCourse) {
            searchInput.value = matchingDanceCourse.title;
            filteredDanceCourses = dance_courses.filter(item => item.title === matchingDanceCourse.title);
            updateDanceCoursesGrid();
        }
    }

    // filters

    function handleSearch(event) {
        const searchQuery = event.target.value.trim().toLowerCase();
        filteredDanceCourses = dance_courses.filter(item =>
            item.title.toLowerCase().includes(searchQuery)
        );
        updateDanceCoursesGrid();
    }

    function debounce(callback, ms) {
        let timer;

        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => callback(...args), ms);
        }
    }

    function updateDanceCoursesGrid() {
        dance_coursesGrid.innerHTML = "";
        if( document.querySelector(".empty") ) document.querySelector(".empty").remove();

        filteredDanceCourses.forEach(dance_course => {
            const dance_courseElement = createDanceCourseElement(dance_course);
            dance_coursesGrid.append(dance_courseElement);
        });

        if(filteredDanceCourses.length === 0) {
            const emptyText = document.createElement("p");
            emptyText.className = "empty";
            emptyText.textContent = "No matching dance_courses";
            dance_coursesGrid.parentElement.append(emptyText);
        }
    }
});