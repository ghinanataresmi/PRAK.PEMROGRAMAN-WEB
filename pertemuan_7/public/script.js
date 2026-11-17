
document.addEventListener("DOMContentLoaded", () => {

    // 1. Tangkap Elemen DOM
    const mhsForm = document.querySelector("#mhsForm");
    const mhsIdInput = document.querySelector("#mhsId");
    const nimInput = document.querySelector("#nim");
    const namaInput = document.querySelector("#nama");
    const jurusanInput = document.querySelector("#jurusan");
    const emailInput = document.querySelector("#email");
    const btnSubmit = document.querySelector("#btnSubmit");
    const btnCancel = document.querySelector("#btnCancel");
    const formTitle = document.querySelector("#formTitle");
    const mhsTableBody = document.querySelector("#mhsTableBody");
    const alertMessage = document.querySelector("#alertMessage");

    // Elemen tugas mandiri
    const searchInput = document.querySelector("#searchInput");
    const totalMahasiswa = document.querySelector("#totalMahasiswa");

    let listMahasiswa = [];

    // Fungsi Notifikasi
    const showAlert = (text, type = "success") => {
        alertMessage.textContent = text;
        alertMessage.className = `alert alert-${type}`;
        alertMessage.style.display = "block";

        setTimeout(() => {
            alertMessage.style.display = "none";
        }, 3000);
    };

    // 2. READ: Mengambil Data Mahasiswa
    const loadMahasiswa = async () => {
        try {
            const res = await fetch("/api/mahasiswa");

            if (!res.ok) {
                throw new Error("Gagal mengambil data");
            }

            listMahasiswa = await res.json();

            renderTable(listMahasiswa);

        } catch (err) {
            showAlert(
                "Gagal memuat data dari server backend",
                "error"
            );
        }
    };

    // Menampilkan Data ke Tabel
    const renderTable = (data) => {

        mhsTableBody.innerHTML = "";

        // Counter total seluruh mahasiswa
        totalMahasiswa.textContent = listMahasiswa.length;

        if (data.length === 0) {
            mhsTableBody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align:center;">
                        Belum ada data mahasiswa tersimpan.
                    </td>
                </tr>
            `;
            return;
        }

        data.forEach((mhs, idx) => {

            const tr = document.createElement("tr");

            const values = [
                idx + 1,
                mhs.nim,
                mhs.nama,
                mhs.jurusan,
                mhs.email
            ];

            values.forEach(value => {
                const td = document.createElement("td");
                td.textContent = value;
                tr.appendChild(td);
            });

            const aksi = document.createElement("td");

            const btnEdit = document.createElement("button");
            btnEdit.textContent = "Edit";
            btnEdit.className = "btn-action btn-edit";
            btnEdit.dataset.id = mhs.id;

            const btnDelete = document.createElement("button");
            btnDelete.textContent = "Hapus";
            btnDelete.className = "btn-action btn-delete";
            btnDelete.dataset.id = mhs.id;

            aksi.append(btnEdit, document.createTextNode(" "), btnDelete);

            tr.appendChild(aksi);
            mhsTableBody.appendChild(tr);

        });
    };

    // 3. CREATE & UPDATE: Submit Formulir
    mhsForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const payload = {
            nim: nimInput.value.trim(),
            nama: namaInput.value.trim(),
            jurusan: jurusanInput.value,
            email: emailInput.value.trim()
        };

        const id = mhsIdInput.value;
        const isEdit = Boolean(id);

        // TUGAS MANDIRI 2:
        // Validasi NIM Duplikat menggunakan .some()
        const nimDuplikat = listMahasiswa.some(m =>
            m.nim.toLowerCase() === payload.nim.toLowerCase()
            && String(m.id) !== String(id)
        );

        if (nimDuplikat) {
            showAlert("NIM sudah terdaftar!", "error");
            return;
        }

        const url = isEdit
            ? `/api/mahasiswa/${id}`
            : "/api/mahasiswa";

        const method = isEdit ? "PUT" : "POST";

        try {

            const res = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            const result = await res.json();

            if (result.success) {

                showAlert(result.message);

                resetForm();

                await loadMahasiswa();

                // Perbarui tampilan pencarian jika sedang digunakan
                searchInput.dispatchEvent(new Event("input"));

            } else {
                showAlert(
                    "Terjadi kesalahan: " + result.message,
                    "error"
                );
            }

        } catch (err) {
            showAlert("Gagal mengirim data ke server", "error");
        }

    });

    // 4. EDIT & DELETE: Event Delegation
    mhsTableBody.addEventListener("click", async (e) => {

        const id = Number(e.target.dataset.id);

        if (!id) return;

        // Mode Edit
        if (e.target.classList.contains("btn-edit")) {

            const targetMhs = listMahasiswa.find(m => m.id === id);

            if (targetMhs) {

                mhsIdInput.value = targetMhs.id;
                nimInput.value = targetMhs.nim;
                namaInput.value = targetMhs.nama;
                jurusanInput.value = targetMhs.jurusan;
                emailInput.value = targetMhs.email;

                formTitle.textContent = "Edit Data Mahasiswa";
                btnSubmit.textContent = "Perbarui Mahasiswa";
                btnCancel.style.display = "inline-block";

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }

        }

        // Mode Delete
        else if (e.target.classList.contains("btn-delete")) {

            if (confirm(
                "Apakah Anda yakin ingin menghapus data mahasiswa ini?"
            )) {

                try {

                    const res = await fetch(`/api/mahasiswa/${id}`, {
                        method: "DELETE"
                    });

                    const result = await res.json();

                    if (result.success) {

                        showAlert(result.message);

                        await loadMahasiswa();

                        searchInput.dispatchEvent(new Event("input"));

                    } else {
                        showAlert(result.message, "error");
                    }

                } catch (err) {
                    showAlert(
                        "Gagal menghapus data dari server",
                        "error"
                    );
                }

            }

        }

    });

    // 5. Reset Form ke Mode Tambah
    const resetForm = () => {

        mhsForm.reset();

        mhsIdInput.value = "";

        formTitle.textContent = "Tambah Mahasiswa Baru";

        btnSubmit.textContent = "Simpan Mahasiswa";

        btnCancel.style.display = "none";

    };

    btnCancel.addEventListener("click", resetForm);

    // TUGAS MANDIRI 1:
    // Pencarian Real-Time menggunakan .filter()
    searchInput.addEventListener("input", () => {

        const keyword = searchInput.value.toLowerCase();

        const hasilPencarian = listMahasiswa.filter(mhs =>
            mhs.nama.toLowerCase().includes(keyword) ||
            mhs.nim.toLowerCase().includes(keyword)
        );

        renderTable(hasilPencarian);

    });

    // Ambil data pertama kali
    loadMahasiswa();

});
