
const API_URL = "https://YOUR-BACKEND-NAME.onrender.com/students";

let editingRoll = null;

// GET: Load all students
async function loadStudents() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) throw new Error("Loading failed");

        const students = await response.json();

        const tbody = document.getElementById("student-table");
        tbody.innerHTML = "";

        students.forEach(s => {
            const tr = document.createElement("tr");

            [
                s.roll, s.name, s.age, s.email,
                s.session, s.english_score, s.math_score,
                s.history_score, s.average, s.comment
            ].forEach(value => {
                const td = document.createElement("td");
                td.textContent = value ?? "";
                tr.appendChild(td);
            });

            const action = document.createElement("td");

            const edit = document.createElement("button");
            edit.textContent = "Edit";
            edit.className = "btn btn-warning btn-sm";
            edit.onclick = () => editStudent(s.roll);

            const del = document.createElement("button");
            del.textContent = "Delete";
            del.className = "btn btn-danger btn-sm";
            del.onclick = () => deleteStudent(s.roll);

            action.append(edit, del);
            tr.appendChild(action);
            tbody.appendChild(tr);
        });

    } catch (error) {
        console.error(error);
        alert("Could not load students!");
    }
}


// POST / PATCH: Save student
document.getElementById("student-form")
.addEventListener("submit", async function(event) {

    event.preventDefault();

    const student = {
        name: document.getElementById("name").value,
        age: Number(document.getElementById("age").value),
        email: document.getElementById("email").value,
        roll: Number(document.getElementById("roll").value),
        session: document.getElementById("session").value,
        english_score: Number(document.getElementById("english").value),
        math_score: Number(document.getElementById("math").value),
        history_score: Number(document.getElementById("history").value)
    };

    const url = editingRoll !== null
        ? `${API_URL}/${editingRoll}`
        : API_URL;

    const method = editingRoll !== null ? "PATCH" : "POST";

    try {
        const response = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(student)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(JSON.stringify(error.detail));
        }

        alert("Saved successfully!");

        document.getElementById("student-form").reset();
        editingRoll = null;
        document.getElementById("form-title").innerText = "Add Student";

        await loadStudents();

    } catch (error) {
        alert("Error: " + error.message);
    }
});


// GET: Edit student
async function editStudent(roll) {
    try {
        const response = await fetch(`${API_URL}/${roll}`);

        if (!response.ok) throw new Error("Student not found");

        const s = await response.json();

        document.getElementById("name").value = s.name;
        document.getElementById("age").value = s.age;
        document.getElementById("email").value = s.email;
        document.getElementById("roll").value = s.roll;
        document.getElementById("session").value = s.session;
        document.getElementById("english").value = s.english_score;
        document.getElementById("math").value = s.math_score;
        document.getElementById("history").value = s.history_score;

        editingRoll = roll;
        document.getElementById("form-title").innerText =
            `Edit Student (Roll ${roll})`;

    } catch (error) {
        alert(error.message);
    }
}


// DELETE: Delete student
async function deleteStudent(roll) {
    if (!confirm("Delete this student?")) return;

    try {
        const response = await fetch(`${API_URL}/${roll}`, {
            method: "DELETE"
        });

        if (!response.ok) throw new Error("Delete failed");

        alert("Student deleted!");
        await loadStudents();

    } catch (error) {
        alert(error.message);
    }
}


// Load students on page open
loadStudents();
