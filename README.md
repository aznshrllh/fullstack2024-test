# MyClient Management App

Aplikasi manajemen data klien dengan arsitektur **terpisah** antara backend dan frontend.

- **Backend:** Node.js + Express + Sequelize + Redis + Amazon S3
- **Frontend:** Vite + TypeScript + React + TailwindCSS + ShadCN UI

---

## 🚀 Fitur Utama

- CRUD data klien menggunakan PostgreSQL
- Penyimpanan file gambar ke Amazon S3
- Cache Redis berdasarkan slug klien (persisten)
- Otomatis hapus dan generate ulang cache saat update/delete
- Soft delete menggunakan kolom `deleted_at`
- Frontend modern dan ringan menggunakan Vite + ShadCN UI

---

## 📁 Struktur Proyek

my-client-app/
├── server/           # Backend menggunakan Node.js, Express, Sequelize
├── frontend/         # Frontend menggunakan Vite, TypeScript, ShadCN


---

## ⚙️ Teknologi

### Backend

- Node.js
- Express.js
- PostgreSQL
- Sequelize CLI
- Redis (persisten)
- Amazon S3
- Multer (upload file)
- CORS
- dotenv

### Frontend

- Vite
- TypeScript
- React
- TailwindCSS
- ShadCN UI

---

## 📦 API Endpoints

### 🔹 Create Client

**POST** `/clients`  
Content-Type: `multipart/form-data`

**Body:**
- `name`: Test Client
- `slug`: test-client
- `is_project`: 1
- `self_capture`: 1
- `client_prefix`: TEST
- `client_logo`: [upload image file]
- `address`: 123 Test Street
- `phone_number`: 123-456-7890
- `city`: Test City

---

### 🔹 Get All Clients

**GET** `/clients`

---

### 🔹 Get Client by ID

**GET** `/clients/:id`

---

### 🔹 Get Client by Slug (from Redis)

**GET** `/clients/slug/:slug`

---

### 🔹 Update Client

**PUT** `/clients/:id`  
Content-Type: `multipart/form-data`

**Body:**
- `name`: Updated Client Name
- `city`: New City

ℹ️ Redis cache akan dihapus dan dibuat ulang.

---

### 🔹 Delete Client (Soft Delete)

**DELETE** `/clients/:id`  
ℹ️ Redis cache akan dihapus, dan kolom `deleted_at` akan diisi secara otomatis.

---

## 🖼️ Upload Logo Klien

- Field `client_logo` adalah gambar yang diupload ke Amazon S3
- URL dari file akan disimpan ke kolom `client_logo` dalam database

---

## 🧠 Redis Cache

- Key: `slug`
- Value: JSON data dari klien
- Otomatis terhapus saat data diupdate atau dihapus

---

## 🗄️ Struktur Tabel PostgreSQL

```sql
CREATE TABLE my_client ( 
  id INT NOT NULL GENERATED ALWAYS AS IDENTITY, 
  name CHAR(250) NOT NULL, 
  slug CHAR(100) NOT NULL, 
  is_project VARCHAR(30) CHECK (is_project IN ('0', '1')) NOT NULL DEFAULT '0', 
  self_capture CHAR(1) NOT NULL DEFAULT '1', 
  client_prefix CHAR(4) NOT NULL, 
  client_logo CHAR(255) NOT NULL DEFAULT 'no-image.jpg', 
  address TEXT DEFAULT NULL, 
  phone_number CHAR(50) DEFAULT NULL, 
  city CHAR(50) DEFAULT NULL, 
  created_at TIMESTAMP(0) DEFAULT NULL, 
  updated_at TIMESTAMP(0) DEFAULT NULL, 
  deleted_at TIMESTAMP(0) DEFAULT NULL, 
  PRIMARY KEY (id) 
);
