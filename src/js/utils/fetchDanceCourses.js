export async function fetchDanceCourses() {
    try {
        const response = await fetch("backend/dance_courses.json");
        return await response.json();
    } catch (err) {
        console.error("Failed to fetch dance_courses");
        return [];
    }
}