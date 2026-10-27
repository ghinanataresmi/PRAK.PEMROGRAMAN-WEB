let projects = [
    {
        id: 1,
        title: "Sistem Manajemen Inventori",
        category: "Web App",
        budget: 2500000,
        completed: true
    },
    {
        id: 2,
        title: "Aplikasi Kasir",
        category: "Desktop App",
        budget: 5000000,
        completed: false
    },
    {
        id: 3,
        title: "Website Portofolio",
        category: "Web App",
        budget: 1500000,
        completed: false
    }
];

// Mengambil elemen HTML
const formProyek = document.getElementById("formProyek");
const inputJudul = document.getElementById("judul");
const inputKategori = document.getElementById("kategori");
const inputAnggaran = document.getElementById("anggaran");
const inputSelesai = document.getElementById("selesai");
const cariProyek = document.getElementById("cariProyek");
const daftarProyek = document.getElementById("daftarProyek");
const pesanForm = document.getElementById("pesanForm");

// Format angka menjadi Rupiah
function formatRupiah(angka) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(angka);
}

// Fitur statistik project
function renderStatistik() {
    const total = projects.length;

    const selesai = projects.filter(
        project => project.completed
    ).length;

    const berjalan = projects.filter(
        project => !project.completed
    ).length;

    const totalAnggaran = projects.reduce(
        (total, project) => total + project.budget,
        0
    );

    document.getElementById("totalProyek").textContent = total;
    document.getElementById("proyekSelesai").textContent = selesai;
    document.getElementById("proyekBerjalan").textContent = berjalan;
    document.getElementById("totalAnggaran").textContent =
        formatRupiah(totalAnggaran);
}

// Fitur pencarian dan render kartu project
function renderProyek() {
    const kataKunci = cariProyek.value.toLowerCase().trim();

    const hasilFilter = projects.filter(project =>
        project.title.toLowerCase().includes(kataKunci)
    );

    daftarProyek.innerHTML = "";

    if (hasilFilter.length === 0) {
        const pesan = document.createElement("p");
        pesan.textContent = "Project tidak ditemukan.";
        daftarProyek.appendChild(pesan);
        return;
    }

    hasilFilter.forEach(project => {
        const kartu = document.createElement("article");

        const judul = document.createElement("h3");
        judul.textContent = project.title;

        const kategori = document.createElement("p");
        kategori.textContent = "Kategori: " + project.category;

        const anggaran = document.createElement("p");
        anggaran.textContent =
            "Estimasi Anggaran: " + formatRupiah(project.budget);

        const status = document.createElement("p");
        status.textContent = project.completed
            ? "Status: Selesai"
            : "Status: Dalam Pengerjaan";

        const tombolStatus = document.createElement("button");
        tombolStatus.textContent = "Ubah Status";
        tombolStatus.dataset.action = "status";
        tombolStatus.dataset.id = project.id;

        const tombolHapus = document.createElement("button");
        tombolHapus.textContent = "Hapus Proyek";
        tombolHapus.dataset.action = "hapus";
        tombolHapus.dataset.id = project.id;

        kartu.append(
            judul,
            kategori,
            anggaran,
            status,
            tombolStatus,
            tombolHapus
        );

        daftarProyek.appendChild(kartu);
    });
}

// Render ulang daftar dan statistik
function renderSemua() {
    renderProyek();
    renderStatistik();
}

// FITUR 1: Form input proyek dinamis
formProyek.addEventListener("submit", function (e) {
    e.preventDefault();

    const judul = inputJudul.value.trim();
    const kategori = inputKategori.value;
    const anggaran = Number(inputAnggaran.value);
    const selesai = inputSelesai.checked;

    // Validasi judul
    if (judul === "") {
        pesanForm.textContent =
            "Judul proyek tidak boleh kosong.";
        inputJudul.focus();
        return;
    }

    // Validasi anggaran
    if (
        inputAnggaran.value.trim() === "" ||
        !Number.isFinite(anggaran) ||
        anggaran <= 0
    ) {
        pesanForm.textContent =
            "Anggaran harus lebih besar dari 0.";
        inputAnggaran.focus();
        return;
    }

    // Validasi kategori
    if (kategori === "") {
        pesanForm.textContent =
            "Silakan pilih kategori proyek.";
        inputKategori.focus();
        return;
    }

    // Membuat objek proyek dengan ID unik
    const proyekBaru = {
        id: Date.now(),
        title: judul,
        category: kategori,
        budget: anggaran,
        completed: selesai
    };

    // Menambahkan proyek menggunakan spread operator
    projects = [...projects, proyekBaru];

    // Reset pencarian dan form
    formProyek.reset();
    cariProyek.value = "";

    pesanForm.textContent = "Proyek berhasil ditambahkan.";

    // Memperbarui tampilan
    renderSemua();
});

// FITUR 2: Pencarian real-time
cariProyek.addEventListener("input", function () {
    renderProyek();
});

// FITUR 3: Ubah status dan hapus proyek
daftarProyek.addEventListener("click", function (e) {
    const tombol = e.target.closest("button[data-action]");

    if (!tombol) {
        return;
    }

    const id = Number(tombol.dataset.id);
    const aksi = tombol.dataset.action;

    // Mengubah status proyek
    if (aksi === "status") {
        projects = projects.map(project =>
            project.id === id
                ? {
                    ...project,
                    completed: !project.completed
                }
                : project
        );
    }

    // Menghapus proyek berdasarkan ID
    if (aksi === "hapus") {
        projects = projects.filter(
            project => project.id !== id
        );
    }

    // Memperbarui kartu dan statistik
    renderSemua();
});

// Menampilkan data saat halaman dibuka
renderSemua();