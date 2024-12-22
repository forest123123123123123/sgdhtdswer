import { fetchDanceCourses } from "./utils/fetchDanceCourses.js";
import { createDanceCourseElement } from "./utils/createDanceCourseElement.js";

document.addEventListener("DOMContentLoaded", async () => {
    // Top block slider
    const slideTexts = [
        { title: "Feel the <br> Rhythm of Dance", caption: "Dive into the rhythm and passion of dance, where every movement tells a story and every style celebrates emotion." },
        { title: "Uncover the <br> Legacy of Dance", caption: "Journey through the evolution of dance, from classical traditions to modern innovation, and uncover the roots of every iconic step." },
        { title: "The Art of <br> Movement and Grace", caption: "Immerse yourself in the harmony of dance and creativity, blending elegance, energy, and artistic expression." },   
    ];

    function updateTextContent(index) {
        const titleElement = document.querySelector(".home__title");
        const captionElement = document.querySelector(".home__caption");

        titleElement.classList.add("fade-out");
        captionElement.classList.add("fade-out");

        setTimeout(() => {
            titleElement.innerHTML = slideTexts[index].title;
            captionElement.textContent = slideTexts[index].caption;

            titleElement.classList.remove("fade-out");
            captionElement.classList.remove("fade-out");
        }, 700);
    }

    const swiper = new Swiper(".home__slider", {
        direction: 'vertical',
        loop: true,
        speed: 1000,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
    });

    swiper.on("slideChange", () => {
        const currentIndex = swiper.realIndex;
        updateTextContent(currentIndex);
    });

    // dance_courses
    const dance_courses = await fetchDanceCourses();
    const popularDanceCoursesGrid = document.querySelector(".popular-dance_courses__grid");
    const bookedDanceCourses = JSON.parse(localStorage.getItem("bookings")) || [];
    const topDanceCourses = dance_courses
        .toSorted((a, b) => b.rating - a.rating)
        .filter(ex => {
            const isFutureDate = new Date(ex.date) >= new Date();
            const haveAvailableSeats = ex.availableSeats > 0;
            const isNotAlreadyBooked = !bookedDanceCourses.find(item => item.dance_courseId === ex.id);

            return isFutureDate && haveAvailableSeats && isNotAlreadyBooked;
        })
        .slice(0, 3);

    // Gallery
    const galleryGrid = document.querySelector(".gallery__grid");
    const prevButton = document.querySelector(".gallery__pagination-btn.prev");
    const nextButton = document.querySelector(".gallery__pagination-btn.next");
    const pageInfo = document.querySelector(".gallery__page");

    let images = [];
    const itemsPerPage = 9;
    let currentPage = 1;

    try {
        const response = await fetch("backend/gallery.json");
        images = await response.json();
    } catch (err) {
        console.error("Failed to load gallery images");
        return;
    }

    const updateGallery = () => {
        galleryGrid.innerHTML = "";

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const visibleImages = images.slice(startIndex, endIndex);

        visibleImages.forEach(image => {
            const imgWrapper = document.createElement("div");
            const imgElement = document.createElement("img");
            imgElement.src = image.src;
            imgElement.alt = image.alt || "gallery image";
            imgWrapper.className = "gallery__image";
            imgWrapper.append(imgElement);
            galleryGrid.append(imgWrapper);
        });

        pageInfo.textContent = `Page ${currentPage} of ${Math.ceil(images.length / itemsPerPage)}`;

        prevButton.disabled = currentPage === 1;
        nextButton.disabled = currentPage === Math.ceil(images.length / itemsPerPage);
    };

    prevButton.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            updateGallery();
        }
    });

    nextButton.addEventListener("click", () => {
        if (currentPage < Math.ceil(images.length / itemsPerPage)) {
            currentPage++;
            updateGallery();
        }
    });

    updateGallery();
});