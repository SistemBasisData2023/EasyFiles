# EasyFiles
Online File Storage and Management
---

## Overview

Proyek ini bertujuan untuk menciptakan sebuah sistem penyimpanan file secara online yang berbasis pada ExpressJS, PostgreSQL, dan Google Firebase Storage untuk back-end, dan react untuk front-end.

User dapat melakukan register dan login akun. Untuk menangani session, digunakan JWT (JSON Web Token) yang akan diberikan pada saat login, serta akan digunakan untuk verifikasi identitas user selama berada di website.

Setelah login, user dapat melakukan berbagai hal, seperti melakukan upload, download, delete, serta mencari file. Selain itu, mereka juga dapat membuat folder baru untuk memudahkan penyimpanan file. 

----
## Table Explanation
### 1. UserTable

Tabel ini digunakan untuk menyimpan data dari user yang telah mendaftar, yakni terdiri dari

* `` username``
Primary key dari ``userTable``

 * ``hashedPassword``
Berisi password yang sudah di-hash serta di-salt menggunakan ``bcrypt``

 * ``nama``
Berisi nama asli dari user

 * ``personalfolder``
Berisi ID folder root yang spesifik untuk masing-masing user. User yang baru mendaftar dapat mulai melakukan upload dan create new folder pada folder root tersebut.

### 2. Files

Tabel ini digunakan untuk menyimpan data-data dari file yang telah tersimpan, yakni terdiri dari

* `` fileId``
Primary key dari tabel ``files``. Nilainya digenerasikan menggunakan ``nanoid``

* ``namaFile``
Berisi nama file. Ia akan mengikuti nama dari file yang diupload oleh user

* ``skemaAkses``
Bernilai ``FreeAccess`` atau ``Restricted``. File dengan ``FreeAccess``dapat diakses oleh seluruh pengguna, sedangkan ``Restricted`` akan membatasi akses pada user pemilik saja.

* ``ukuran`` 
Berisi ukuran file yang diupload dalam satuan bytes

* ``tanggalUpload``
Berisi tanggal di-upload-nya file

* ``directoryId``
Berisi ID folder yang menyimpan file terkait

* ``userPemilik``
Berisi username pemilik file

* ``fileLink``
Berisi link penyimpanan file pada Google Firebase Storage.

### 3. Folder

Tabel ini digunakan untuk menyimpan data-data dari folder yang ada pada sistem, yakni terdiri dari
* ``folderId``
Primary key dari tabel ``folder``. Nilainya digenerasikan menggunakan ``nanoid``

 * ``namaFolder``
Berisi nama folder

 * ``skemaAkses``
Bernilai ``FreeAccess`` atau ``Restricted``. Folder dengan ``FreeAccess``dapat dibuka oleh seluruh pengguna, sedangkan ``Restricted`` akan membatasi akses pada user pemilik saja.

 * ``tanggalPembuatan``
Berisi tanggal dibuatnya folder

 * ``rootFolderId``
Berisi folder parent yang menyimpan folder terkait. Terdapat pengecualian untuk personal folder, dimana nilai ``rootFolderId`` akan bernilai sama dengan ``folderId``-nya sendiri.

 * ``userPemilik``
Berisi username pemilik folder

## Diagrams
### ER Diagram
![alt text](https://github.com/SistemBasisData2023/EasyFiles/blob/main/resources/ERDiagram_EasyFiles.png)

### UML Chart
![alt text](https://github.com/SistemBasisData2023/EasyFiles/blob/main/resources/UMLDiagram_EasyFiles.png)

### Flowchart
![alt text]()
