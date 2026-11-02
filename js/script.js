/* ===== Fungsi bantuan ===== */
function angkaDariHarga(teks) {
  return parseInt(String(teks).replace(/\D/g, "")) || 0;
}

function formatRupiah(angka) {
  return "Rp " + angka.toLocaleString("id-ID");
}

function ambilKeranjang() {
  return JSON.parse(sessionStorage.getItem("keranjang")) || [];
}

function simpanKeranjang(data) {
  sessionStorage.setItem("keranjang", JSON.stringify(data));
}

function userAktif() {
  return JSON.parse(sessionStorage.getItem("userAktif"));
}

// Semua halaman selain login harus sudah login
function cekLogin() {
  if (!userAktif()) {
    alert("Silakan login terlebih dahulu.");
    window.location.href = "index.html";
  }
}

function logout() {
  sessionStorage.removeItem("userAktif");
  window.location.href = "index.html";
}

function bukaModal(id) { document.getElementById(id).classList.add("tampil"); }
function tutupModal(id) { document.getElementById(id).classList.remove("tampil"); }

/* ===== Halaman Login ===== */
function initLogin() {
  var form = document.getElementById("formLogin");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var email = document.getElementById("email").value.trim();
    var password = document.getElementById("password").value;

    if (email === "" || password === "") {
      alert("Email dan password harus diisi.");
      return;
    }

    var user = dataPengguna.find(function (u) {
      return u.email === email && u.password === password;
    });

    if (user) {
      sessionStorage.setItem("userAktif", JSON.stringify(user));
      window.location.href = "dashboard.html";
    } else {
      alert("Email/password yang anda masukkan salah");
    }
  });

  // Lupa password
  document.getElementById("formLupa").addEventListener("submit", function (e) {
    e.preventDefault();
    var email = document.getElementById("emailLupa").value.trim();
    var ada = dataPengguna.some(function (u) { return u.email === email; });
    if (ada) {
      alert("Link reset password sudah dikirim ke " + email);
      tutupModal("modalLupa");
    } else {
      alert("Email tidak terdaftar.");
    }
  });

  // Daftar
  document.getElementById("formDaftar").addEventListener("submit", function (e) {
    e.preventDefault();
    var nama = document.getElementById("daftarNama").value.trim();
    var email = document.getElementById("daftarEmail").value.trim();
    var pass = document.getElementById("daftarPass").value;
    var err = document.getElementById("errDaftar");

    if (nama === "" || email === "" || pass.length < 6) {
      err.textContent = "Semua kolom wajib diisi, password minimal 6 karakter.";
      return;
    }
    if (dataPengguna.some(function (u) { return u.email === email; })) {
      err.textContent = "Email sudah terdaftar.";
      return;
    }
    dataPengguna.push({ id: dataPengguna.length + 1, nama: nama, email: email, password: pass, role: "User" });
    err.textContent = "";
    alert("Pendaftaran berhasil, silakan login.");
    this.reset();
    tutupModal("modalDaftar");
  });
}

/* ===== Dashboard ===== */
function initDashboard() {
  var user = userAktif();
  var jam = new Date().getHours();
  var sapaan = "Selamat malam";
  if (jam >= 4 && jam < 11) sapaan = "Selamat pagi";
  else if (jam >= 11 && jam < 15) sapaan = "Selamat siang";
  else if (jam >= 15 && jam < 19) sapaan = "Selamat sore";

  document.getElementById("greeting").textContent = sapaan + ", " + user.nama + "!";
  document.getElementById("peran").textContent = "Anda masuk sebagai " + user.role;

  // Isi tabel history dari data tracking
  var tbody = document.getElementById("isiHistory");
  Object.values(dataTracking).forEach(function (t) {
    var tr = document.createElement("tr");
    tr.innerHTML = "<td>" + t.nomorDO + "</td><td>" + t.nama + "</td><td>" +
                   t.tanggalKirim + "</td><td>" + t.total + "</td>";
    tbody.appendChild(tr);
  });
  // tambahkan transaksi yang dibuat dari halaman checkout
  var riwayat = JSON.parse(sessionStorage.getItem("riwayat")) || [];
  riwayat.forEach(function (t) {
    var tr = document.createElement("tr");
    tr.innerHTML = "<td>" + t.nomor + "</td><td>" + t.nama + "</td><td>" + t.tanggal + "</td><td>" + t.total + "</td>";
    tbody.appendChild(tr);
  });
}

/* ===== Stok ===== */
function tampilStok() {
  var tbody = document.getElementById("isiStok");
  tbody.innerHTML = "";

  dataKatalogBuku.forEach(function (buku, i) {
    var tr = document.createElement("tr");
    tr.innerHTML =
      '<td><img src="' + buku.cover + '" alt="Cover ' + buku.namaBarang + '"></td>' +
      "<td>" + buku.kodeBarang + "</td>" +
      "<td>" + buku.namaBarang + "</td>" +
      "<td>" + buku.jenisBarang + "</td>" +
      "<td>" + buku.edisi + "</td>" +
      "<td>" + buku.stok + "</td>" +
      "<td>" + buku.harga + "</td>" +
      '<td><button class="btn btn-aksen" onclick="pesanBuku(' + i + ')">Pesan</button> ' +
      '<button class="btn btn-hapus" onclick="hapusBuku(' + i + ')">Hapus</button></td>';
    tbody.appendChild(tr);
  });
}

function pesanBuku(i) {
  var buku = dataKatalogBuku[i];
  var keranjang = ambilKeranjang();
  var item = keranjang.find(function (k) { return k.kodeBarang === buku.kodeBarang; });
  if (item) item.jumlah++;
  else keranjang.push({ kodeBarang: buku.kodeBarang, namaBarang: buku.namaBarang, harga: angkaDariHarga(buku.harga), jumlah: 1 });
  simpanKeranjang(keranjang);
  alert('"' + buku.namaBarang + '" ditambahkan ke keranjang.');
}

function hapusBuku(i) {
  if (confirm("Hapus " + dataKatalogBuku[i].namaBarang + " dari katalog?")) {
    dataKatalogBuku.splice(i, 1);
    tampilStok();
  }
}

function initStok() {
  tampilStok();

  document.getElementById("formStok").addEventListener("submit", function (e) {
    e.preventDefault();
    var kode = document.getElementById("kode").value.trim();
    var nama = document.getElementById("nama").value.trim();
    var jenis = document.getElementById("jenis").value.trim();
    var edisi = document.getElementById("edisi").value.trim();
    var stok = parseInt(document.getElementById("stok").value);
    var harga = parseInt(document.getElementById("harga").value);
    var err = document.getElementById("errStok");

    if (!kode || !nama || !jenis || !edisi || isNaN(stok) || isNaN(harga)) {
      err.textContent = "Semua kolom harus diisi.";
      return;
    }
    if (stok < 0 || harga <= 0) {
      err.textContent = "Stok dan harga tidak boleh negatif.";
      return;
    }
    if (dataKatalogBuku.some(function (b) { return b.kodeBarang === kode; })) {
      err.textContent = "Kode barang sudah ada.";
      return;
    }

    dataKatalogBuku.push({
      kodeBarang: kode, namaBarang: nama, jenisBarang: jenis, edisi: edisi,
      stok: stok, harga: formatRupiah(harga), cover: "img/pengantar_komunikasi.jpg"
    });
    err.textContent = "";
    this.reset();
    tampilStok();
  });
}

/* ===== Checkout ===== */
function tampilKeranjang() {
  var keranjang = ambilKeranjang();
  var tbody = document.getElementById("isiKeranjang");
  var total = 0;
  tbody.innerHTML = "";

  if (keranjang.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5">Keranjang masih kosong.</td></tr>';
  }

  keranjang.forEach(function (item, i) {
    var sub = item.harga * item.jumlah;
    total += sub;
    var tr = document.createElement("tr");
    tr.innerHTML =
      "<td>" + item.namaBarang + "</td>" +
      "<td>" + formatRupiah(item.harga) + "</td>" +
      '<td><input type="number" min="1" value="' + item.jumlah + '" onchange="ubahJumlah(' + i + ', this.value)"></td>' +
      "<td>" + formatRupiah(sub) + "</td>" +
      '<td><button class="btn btn-hapus" onclick="hapusItem(' + i + ')">Hapus</button></td>';
    tbody.appendChild(tr);
  });

  document.getElementById("totalBayar").textContent = "Total: " + formatRupiah(total);
  return total;
}

function ubahJumlah(i, nilai) {
  var keranjang = ambilKeranjang();
  var jumlah = parseInt(nilai);
  if (isNaN(jumlah) || jumlah < 1) jumlah = 1;
  keranjang[i].jumlah = jumlah;
  simpanKeranjang(keranjang);
  tampilKeranjang();
}

function hapusItem(i) {
  var keranjang = ambilKeranjang();
  keranjang.splice(i, 1);
  simpanKeranjang(keranjang);
  tampilKeranjang();
}

function initCheckout() {
  // isi pilihan buku
  var pilih = document.getElementById("pilihBuku");
  dataKatalogBuku.forEach(function (b, i) {
    var opt = document.createElement("option");
    opt.value = i;
    opt.textContent = b.namaBarang + " - " + b.harga;
    pilih.appendChild(opt);
  });

  document.getElementById("namaPemesan").value = userAktif().nama;
  tampilKeranjang();

  document.getElementById("btnTambah").addEventListener("click", function () {
    var i = pilih.value;
    if (i === "") { alert("Pilih buku terlebih dahulu."); return; }
    var buku = dataKatalogBuku[i];
    var keranjang = ambilKeranjang();
    var item = keranjang.find(function (k) { return k.kodeBarang === buku.kodeBarang; });
    if (item) item.jumlah++;
    else keranjang.push({ kodeBarang: buku.kodeBarang, namaBarang: buku.namaBarang, harga: angkaDariHarga(buku.harga), jumlah: 1 });
    simpanKeranjang(keranjang);
    tampilKeranjang();
  });

  document.getElementById("formCheckout").addEventListener("submit", function (e) {
    e.preventDefault();
    var nama = document.getElementById("namaPemesan").value.trim();
    var hp = document.getElementById("hp").value.trim();
    var alamat = document.getElementById("alamat").value.trim();
    var bayar = document.getElementById("metode").value;
    var err = document.getElementById("errCheckout");

    if (ambilKeranjang().length === 0) { err.textContent = "Keranjang masih kosong."; return; }
    if (!nama || !hp || !alamat || !bayar) { err.textContent = "Semua data pemesan dan pembayaran wajib diisi."; return; }
    if (!/^[0-9]{10,13}$/.test(hp)) { err.textContent = "Nomor HP harus 10-13 digit angka."; return; }

    var total = tampilKeranjang();
    var nomor = "2023" + String(Math.floor(Math.random() * 9000) + 1000);
    var riwayat = JSON.parse(sessionStorage.getItem("riwayat")) || [];
    riwayat.push({ nomor: nomor, nama: nama, tanggal: new Date().toISOString().slice(0, 10), total: formatRupiah(total) });
    sessionStorage.setItem("riwayat", JSON.stringify(riwayat));

    alert("Pesanan berhasil dibuat!\nNomor pesanan: " + nomor + "\nTotal: " + formatRupiah(total));
    simpanKeranjang([]);
    err.textContent = "";
    this.reset();
    document.getElementById("namaPemesan").value = userAktif().nama;
    tampilKeranjang();
  });
}

/* ===== Tracking ===== */
function initTracking() {
  document.getElementById("formCari").addEventListener("submit", function (e) {
    e.preventDefault();
    var nomor = document.getElementById("nomorDO").value.trim();
    var hasil = document.getElementById("hasil");
    var data = dataTracking[nomor];

    if (nomor === "") { alert("Masukkan nomor Delivery Order."); return; }
    if (!data) {
      hasil.innerHTML = '<div class="card"><p class="error">Nomor DO "' + nomor + '" tidak ditemukan.</p></div>';
      return;
    }

    // progress: status Dikirim dianggap sudah selesai (100%), lainnya 60%
    var persen = data.status === "Dikirim" ? 100 : 60;
    var kelas = data.status === "Dikirim" ? "Dikirim" : "Dalam";

    var html =
      '<div class="card"><h2>' + data.nama + ' <span class="status ' + kelas + '">' + data.status + "</span></h2>" +
      '<div class="progress"><div style="width:' + persen + '%"></div></div>' +
      '<dl class="detail">' +
      "<dt>Nomor DO</dt><dd>" + data.nomorDO + "</dd>" +
      "<dt>Ekspedisi</dt><dd>" + data.ekspedisi + "</dd>" +
      "<dt>Tanggal kirim</dt><dd>" + data.tanggalKirim + "</dd>" +
      "<dt>Jenis paket</dt><dd>" + data.paket + "</dd>" +
      "<dt>Total pembayaran</dt><dd>" + data.total + "</dd></dl></div>" +
      '<div class="card"><h3>Riwayat perjalanan</h3><ul class="timeline">';

    data.perjalanan.forEach(function (p) {
      html += "<li><small>" + p.waktu + "</small>" + p.keterangan + "</li>";
    });
    html += "</ul></div>";
    hasil.innerHTML = html;
  });
}

/* ===== Jalankan sesuai halaman ===== */
document.addEventListener("DOMContentLoaded", function () {
  var halaman = document.body.id;
  if (halaman !== "halamanLogin") cekLogin();

  if (halaman === "halamanLogin") initLogin();
  if (halaman === "halamanDashboard") initDashboard();
  if (halaman === "halamanStok") initStok();
  if (halaman === "halamanCheckout") initCheckout();
  if (halaman === "halamanTracking") initTracking();
});
