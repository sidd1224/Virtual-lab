const subjectLists = document.querySelectorAll(".experiment-list");
const firstSubject = document.querySelector(".subject-btn")?.textContent.trim();

function showSubject(subject) {
    // Hide all lists
    subjectLists.forEach(list => list.style.display = "none");

    // Remove 'active' from all buttons
    document.querySelectorAll(".subject-btn").forEach(btn => {
        btn.classList.remove("active");
    });

    // Show the selected list
    const activeList = document.getElementById("list-" + subject);
    if (activeList) activeList.style.display = "flex";

    // Add 'active' class to selected button
    const activeBtn = Array.from(document.querySelectorAll(".subject-btn"))
        .find(btn => btn.textContent.trim() === subject);
    if (activeBtn) activeBtn.classList.add("active");
}

function filterExperiments() {
    const input = document.getElementById('searchInput').value.toLowerCase();
    const visibleList = Array.from(subjectLists).find(list => list.style.display === "flex");

    if (visibleList) {
        const cards = visibleList.querySelectorAll(".experiment-card");
        cards.forEach(card => {
            const title = card.getAttribute("data-title");
            card.style.display = title.includes(input) ? "block" : "none";
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    if (firstSubject) showSubject(firstSubject);
});
