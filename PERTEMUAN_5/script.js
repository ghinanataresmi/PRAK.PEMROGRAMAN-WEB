// File: script.js
document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // 1. Ambil Elemen DOM
    // ==========================================
    const todoForm = document.querySelector("#todoForm");
    const taskInput = document.querySelector("#taskInput");
    const inputError = document.querySelector("#inputError");
    const todoList = document.querySelector("#todoList");

    // Elemen tambahan untuk Tugas Mandiri
    const taskCounter = document.querySelector("#taskCounter");
    const clearCompletedBtn = document.querySelector("#clearCompletedBtn");

    // ==========================================
    // 2. Fungsi LocalStorage
    // Perbaikan typo modul: getItem diganti menjadi setItem
    // ==========================================
    const getTasks = () => JSON.parse(localStorage.getItem("todo_tasks")) || [];
    const saveTasks = (tasks) => localStorage.setItem("todo_tasks", JSON.stringify(tasks));

    // ==========================================
    // FITUR 1: Penghitung Jumlah Tugas (Task Counter)
    // ==========================================
    const updateCounter = () => {
        const tasks = getTasks();
        const total = tasks.length;
        const completed = tasks.filter(task => task.completed).length;
        const uncompleted = total - completed;

        taskCounter.textContent = `Total: ${total} Tugas | Selesai: ${completed} | Belum Selesai: ${uncompleted}`;
    };

    // ==========================================
    // 3. Fungsi Menampilkan Daftar Tugas ke Layar
    // Perbaikan typo modul: penulisan template literal (backtick) dan className
    // ==========================================
    const renderTasks = () => {
        const tasks = getTasks();
        todoList.innerHTML = "";

        if (tasks.length === 0) {
            todoList.innerHTML = "<p style='text-align:center; color:#64748b; font-size:13px; padding:10px;'>Belum ada tugas tersimpan.</p>";
            updateCounter(); // Panggil update counter saat kosong
            return;
        }

        tasks.forEach((task, index) => {
            const li = document.createElement("li");

            // Perbaikan class dan template string
            li.className = `todo-item ${task.completed ? 'completed' : ''}`;

            li.innerHTML = `
                <span class="todo-text">${task.text}</span>
                <div class="todo-actions">
                    <button class="action-btn complete-btn" data-index="${index}">
                        ${task.completed ? 'Batal' : 'Selesai'}
                    </button>
                    <button class="action-btn delete-btn" data-index="${index}">Hapus</button>
                </div>
            `;
            todoList.appendChild(li);
        });

        // Panggil update counter setiap kali merender daftar
        updateCounter();
    };

    // ==========================================
    // 4. Tambah Tugas Saat Formulir Dikirim
    // ==========================================
    todoForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const taskText = taskInput.value.trim();

        // Validasi input sederhana
        if (taskText.length < 3) {
            taskInput.classList.add("error");
            inputError.style.display = "block";
            return;
        }

        // Jika valid, hilangkan pesan error
        taskInput.classList.remove("error");
        inputError.style.display = "none";

        // Simpan tugas baru ke array LocalStorage
        const tasks = getTasks();
        tasks.push({ text: taskText, completed: false });
        saveTasks(tasks);

        taskInput.value = ""; // Kosongkan input
        renderTasks();        // Render ulang
    });

    // ==========================================
    // 5. Event Listener pada todoList (Selesai, Hapus, & Konfirmasi)
    // ==========================================
    todoList.addEventListener("click", (e) => {
        const index = e.target.getAttribute("data-index");

        // Abaikan jika yang diklik bukan tombol (tidak ada data-index)
        if (index === null) return;

        const tasks = getTasks();

        // Jika tombol Selesai / Batal diklik
        if (e.target.classList.contains("complete-btn")) {
            tasks[index].completed = !tasks[index].completed; // Toggle status
            saveTasks(tasks);
            renderTasks();
        }

        // FITUR 3: Konfirmasi Sebelum Menghapus (Confirm Dialog)
        if (e.target.classList.contains("delete-btn")) {
            const konfirmasi = confirm("Apakah Anda yakin ingin menghapus tugas ini?");

            if (konfirmasi) {
                tasks.splice(index, 1); // Hapus 1 data dari array
                saveTasks(tasks);
                renderTasks();
            }
        }
    });

    // ==========================================
    // FITUR 2: Tombol 'Bersihkan Tugas Selesai'
    // ==========================================
    clearCompletedBtn.addEventListener("click", () => {
        const tasks = getTasks();

        // Filter: Ambil hanya tugas yang belum selesai (completed == false)
        const activeTasks = tasks.filter(task => !task.completed);

        // Jika tidak ada tugas yang selesai (array lama sama dengan array baru)
        if (tasks.length === activeTasks.length) {
            alert("Tidak ada tugas selesai yang bisa dibersihkan.");
            return;
        }

        const konfirmasi = confirm("Apakah Anda yakin ingin menghapus semua tugas yang sudah selesai?");
        if (konfirmasi) {
            saveTasks(activeTasks); // Simpan tugas yang belum selesai saja
            renderTasks();          // Render ulang layar
        }
    });

    // ==========================================
    // Inisialisasi Awal
    // ==========================================
    // Panggil renderTasks saat halaman pertama kali dimuat
    renderTasks();
});