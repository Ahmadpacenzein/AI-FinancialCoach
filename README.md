# AI Financial Coach

## Deskripsi Proyek

AI Financial Coach adalah aplikasi berbasis Natural Language Processing (NLP) dan Large Language Model (LLM) yang dirancang untuk membantu pengguna melakukan analisis terhadap kondisi keuangan pribadi secara terperinci. Sistem ini mengintegrasikan teknologi pemrosesan bahasa alami untuk menghasilkan laporan keuangan terpersonalisasi, perhitungan skor kesehatan keuangan, serta evaluasi pola pengeluaran secara otomatis. Dengan menggunakan model bahasa yang berjalan secara lokal, aplikasi ini menjamin keamanan privasi data finansial pengguna.

## Fitur Utama

Aplikasi AI Financial Coach memiliki beberapa fitur utama sebagai berikut:

* **Financial Summary**: Melakukan kalkulasi otomatis terhadap pemasukan, pengeluaran total, sisa saldo bulanan, dan rasio tabungan (*saving rate*).
* **Spending Analysis**: Menganalisis kategori pengeluaran terbesar dan mengidentifikasi pengeluaran yang tidak efisien atau melebihi batas wajar.
* **Financial Health Score**: Memberikan penilaian kesehatan finansial dengan rentang skor 0-100 berdasarkan indikator rasio tabungan, rasio pengeluaran, dan potensi risiko finansial.
* **Goal Planning**: Menghitung estimasi waktu pencapaian target keuangan tertentu berdasarkan sisa uang bulanan serta menyusun rencana alokasi dana.
* **AI Financial Consultation**: Fitur chat interaktif yang memungkinkan pengguna berkonsultasi mengenai kondisi keuangan mereka menggunakan bahasa alami.
* **Local LLM using Ollama**: Pemrosesan inferensi bahasa alami dilakukan secara lokal menggunakan model Gemma 3 4B untuk efisiensi dan keamanan data.
* **LangSmith Monitoring**: Integrasi pemantauan penuh untuk melacak seluruh proses eksekusi agen AI secara transparan.

## Teknologi yang Digunakan

| Komponen | Teknologi | Keterangan |
| :--- | :--- | :--- |
| **Frontend** | HTML, CSS, JavaScript | Digunakan untuk membangun antarmuka pengguna yang responsif dan interaktif. |
| **Backend** | Python, Flask | Digunakan sebagai server utama untuk memproses permintaan API dan menghubungkan sistem dengan modul AI. |
| **LLM Engine** | Ollama, Gemma 3 4B | Mesin inferensi model bahasa lokal yang bertugas memproses bahasa alami dan menghasilkan rekomendasi. |
| **Orchestration** | LangChain | Framework untuk mengelola model bahasa, template prompt, serta integrasi input-output. |
| **Workflow Management** | LangGraph | Framework untuk menyusun logika alur kerja AI menggunakan konsep *state graph* yang terstruktur. |
| **Observability** | LangSmith | Platform pemantauan yang digunakan untuk melakukan penelusuran (*tracing*) eksekusi model. |

## Arsitektur Sistem

Alur komunikasi dan pengolahan data dalam sistem AI Financial Coach berjalan sesuai dengan diagram arsitektur berikut:

```
User (Pengguna)
  │
  ▼
HTML Interface (Frontend)
  │
  ▼
Flask Backend (Python)
  │
  ▼
LangGraph Workflow (State Management)
  │
  ▼
LangChain (Orchestrator LLM)
  │
  ▼
Gemma 3 4B via Ollama (Model AI Lokal)
  │
  ▼
Response (Feedback)
  │
  ▼
User (Pengguna)
```

## Implementasi LangChain

LangChain berperan sebagai fondasi untuk mengelola interaksi dengan model bahasa besar (LLM). Beberapa implementasi utama dari LangChain dalam proyek ini meliputi:

* **ChatOllama / Ollama API Wrapper**: Digunakan untuk menginisialisasi model bahasa lokal Gemma 3 4B dengan parameter suhu (*temperature*) tertentu guna menjaga stabilitas respons.
* **Prompt Template**: Menyusun struktur instruksi sistem yang formal dan terpersonalisasi. Template ini menggabungkan data dinamis pengguna (seperti total pemasukan, pengeluaran, dan target tabungan) untuk dikirim ke LLM.
* **Message Management**: Mengelola riwayat percakapan (*chat history*) antara pengguna dan AI Financial Coach untuk mempertahankan konteks diskusi secara relevan.
* **Structured Output**: Memandu format respons dari model agar tetap terstruktur dalam format Markdown agar mudah dibaca di antarmuka pengguna.

## Implementasi LangGraph

LangGraph digunakan untuk menyusun workflow pengolahan data keuangan berbasis status (*state-driven development*). Alur workflow LangGraph dalam sistem ini didefinisikan sebagai berikut:

```
  START
    │
    ▼
[Input Financial Data]  (Node 1: Validasi data input pengguna)
    │
    ▼
[Financial Summary]     (Node 2: Kalkulasi total pengeluaran dan saving rate)
    │
    ▼
[Spending Analysis]     (Node 3: Evaluasi pola pengeluaran non-primer)
    │
    ▼
[Goal Planning]         (Node 4: Estimasi waktu pencapaian target menabung)
    │
    ▼
[AI Recommendation]     (Node 5: Pemrosesan saran dari LLM berdasarkan profil data)
    │
    ▼
[Generate Response]     (Node 6: Kompilasi seluruh laporan ke dalam state akhir)
    │
    ▼
   END
```

Melalui LangGraph, setiap node merepresentasikan satu fungsi spesifik yang memperbarui objek status keuangan (*FinancialState*), sehingga seluruh alur pemrosesan data dapat dikontrol secara presisi dan modular.

## Implementasi LangSmith

LangSmith diterapkan untuk memastikan transparansi dan keandalan sistem kecerdasan buatan. Melalui integrasi LangSmith, sistem memperoleh kemampuan untuk:

* **Monitoring Workflow**: Memantau jalannya graf LangGraph dari node awal hingga akhir secara visual untuk mendeteksi adanya keterlambatan atau kegagalan eksekusi pada node tertentu.
* **Prompt Tracing**: Merekam setiap prompt yang telah diisi dengan variabel dinamis sebelum dikirim ke model Gemma 3 4B.
* **Input and Output Inspection**: Menganalisis ketepatan input pengguna dan memeriksa kesesuaian output yang dihasilkan oleh model untuk proses evaluasi kualitas.
* **Execution Trace**: Mengukur metrik latensi (waktu respons) dan konsumsi token pada setiap pemanggilan LLM guna mempermudah proses optimasi performa backend.

## Tampilan Sistem

Berikut adalah tangkapan layar dari antarmuka aplikasi AI Financial Coach:

### 1. Antarmuka Utama Aplikasi
![Tampilan utama AI Financial Coach](gambar/Tampilan%20keseluruhan%20sistem%20ai%20financial%20coach.png)
*Gambar 1: Tampilan utama AI Financial Coach yang terdiri dari parameter input, dashboard finansial, dan AI Chat Assistant.*

### 2. Dashboard Detail Finansial
![Hasil perhitungan finansial](gambar/Ringkasan%20detail%20pengeluaran%20dan%20pemasukan%20pengguna.png)
*Gambar 2: Menampilkan hasil perhitungan pemasukan, pengeluaran, dan kondisi finansial.*

### 3. Modul Konsultasi Interaktif AI
![Interaksi dengan AI Financial Coach](gambar/chatbot%20dengan%20konsultasi%20ai%20coach%20terintegrasi%20dengan%20data%20finansial%20pengguna.png)
*Gambar 3: Menampilkan interaksi pengguna dengan AI Financial Coach menggunakan bahasa alami.*

### 4. Laporan Rekomendasi Cerdas AI
![Rekomendasi finansial AI](gambar/rekomendasi%20cerdas%20ai%20untuk%20finansial.png)
*Gambar 4: Menampilkan rekomendasi yang dihasilkan AI berdasarkan kondisi finansial pengguna.*

## Monitoring LangSmith

Berikut adalah visualisasi integrasi monitoring sistem pada dashboard LangSmith:

### 1. Konfigurasi Kunci API LangSmith
![Konfigurasi API LangSmith](gambar/konfigurasi%20api%20langsmith%20untuk%20projek.png)
*Gambar 5: Konfigurasi API LangSmith yang digunakan untuk melakukan monitoring workflow AI.*

### 2. Penelusuran (Tracing) Eksekusi AI
![Trace eksekusi AI di LangSmith](gambar/monitoring%20trace%20dari%20ai%20di%20langsmith.png)
*Gambar 6: Trace proses eksekusi AI yang meliputi input, workflow LangGraph, prompt, dan output model.*

## Struktur Folder

Berikut adalah visualisasi struktur repositori proyek:

![Struktur folder proyek](gambar/struktur%20folder.png)

```
AI-Financial-Coach/
├── static/
│   ├── css/
│   ├── js/
│   └── svg/
├── templates/
│   └── index.html
├── app.py
├── agent.py
├── graph.py
├── requirements.txt
└── README.md
```

## Cara Instalasi

Ikuti langkah-langkah berikut untuk menjalankan proyek AI Financial Coach secara lokal:

1. Klon repositori proyek ini:
   ```bash
   git clone https://github.com/username/AI-Financial-Coach.git
   cd AI-Financial-Coach
   ```

2. Instal seluruh dependensi yang diperlukan:
   ```bash
   pip install -r requirements.txt
   ```

3. Pastikan Ollama telah terinstal, lalu unduh model Gemma 3:
   ```bash
   ollama pull gemma3:4b
   ```

4. Konfigurasikan kredensial LangSmith pada file `.env` di direktori utama:
   ```env
   LANGCHAIN_TRACING_V2=true
   LANGCHAIN_API_KEY=your_langsmith_api_key
   LANGCHAIN_PROJECT=ai-financial-coach
   ```

5. Jalankan aplikasi Flask:
   ```bash
   python app.py
   ```

## Kesimpulan

Sistem AI Financial Coach telah berhasil diimplementasikan dengan memanfaatkan Natural Language Processing menggunakan Large Language Model lokal yang terintegrasi secara harmonis dengan framework LangChain, LangGraph, dan LangSmith. Penggunaan LangGraph memungkinkan pemrosesan status finansial secara deterministik dan terarah, sementara LangChain menyederhanakan komunikasi dengan LLM lokal. Keberadaan LangSmith memastikan bahwa keseluruhan operasi model bahasa dapat diawasi, dianalisis, dan dievaluasi secara real-time guna mendukung pengembangan sistem kecerdasan buatan yang transparan dan andal.
