const projects = [
    {
        id: 1,
        title: "Sistem Inventaris Keuangan",
        category: "Web App",
        budget: 250000,
        completed: true
    },
    {
        id: 2,
        title: "Sistem Kasir Digital POS",
        category: "Desktop App",
        budget: 5000000,
        completed: true
    },
    {
        id: 3,
        title: "Landing Page Perusahaan",
        category: "Web App",
        budget: 150000,
        completed: false
    },
    {
        id: 4,
        title: "Aplikasi Presensi GPS Mobile",
        category: "Mobile App",
        budget: 4500000,
        completed: true
    },
    {
        id: 5,
        title: "Aplikasi Presensi Face Recognition",
        category: "Mobile App",
        budget: 7500000,
        completed: false
    }
];

// Helper function format Rupiah
const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0
    }).format(angka);
};
console.log("\n=== 2. PROYEK KATEGORI WEB APP (filter) ===");

const webProjects = projects.filter(
    proj => proj.category === "Web App"
);
console.log(webProjects);

console.log("\n=== 3. PROYEK KATEGORI Mobile APP ===");

const mobileProjects = projects.filter(
    proj => proj.category === "Mobile App"
);
console.log(mobileProjects);

console.log("\n=== 4. RINGKASAN NAMA & ANGGARAN ===");

const ringkasanProyek = projects.map(proj => ({
    nama: proj.title,
    status: proj.completed ? 'selesai' : 'belum',
    biaya: formatRupiah(proj.budget)
}));

console.table(ringkasanProyek);

console.log("\n=== 5. TOTAL ANGGARAN ===");

const totalAnggaran = projects.reduce(
    (total, proj) => total + proj.budget,
    0
);

console.log(
    `Total estimasi anggaran portofolio: ${formatRupiah(totalAnggaran)}`
);

const totalSelesai = projects
    .filter(proj => proj.completed)
    .reduce((total, proj) => total + proj.budget, 0);

console.log(
    `Total Anggaran Proyek Selesai: ${formatRupiah(totalSelesai)}`
);