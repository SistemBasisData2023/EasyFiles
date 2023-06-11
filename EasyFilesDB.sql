--
-- PostgreSQL database dump
--

-- Dumped from database version 15.2
-- Dumped by pg_dump version 15.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: access; Type: TYPE; Schema: public; Owner: zaki.za.ananda
--

CREATE TYPE public.access AS ENUM (
    'FreeAccess',
    'Restricted'
);


ALTER TYPE public.access OWNER TO "zaki.za.ananda";

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: files; Type: TABLE; Schema: public; Owner: zaki.za.ananda
--

CREATE TABLE public.files (
    fileid character varying(32) NOT NULL,
    namafile character varying(255) NOT NULL,
    skemaakses public.access NOT NULL,
    ukuran bigint NOT NULL,
    tanggalupload timestamp without time zone NOT NULL,
    directoryid character varying(32) NOT NULL,
    userpemilik character varying(255) NOT NULL,
    filelink text NOT NULL
);


ALTER TABLE public.files OWNER TO "zaki.za.ananda";

--
-- Name: folder; Type: TABLE; Schema: public; Owner: zaki.za.ananda
--

CREATE TABLE public.folder (
    folderid character varying(32) NOT NULL,
    namafolder character varying(255) NOT NULL,
    skemaakses public.access NOT NULL,
    tanggalpembuatan timestamp without time zone NOT NULL,
    rootfolderid character varying(32) NOT NULL,
    userpemilik character varying(255) NOT NULL
);


ALTER TABLE public.folder OWNER TO "zaki.za.ananda";

--
-- Name: usertable; Type: TABLE; Schema: public; Owner: zaki.za.ananda
--

CREATE TABLE public.usertable (
    username character varying(31) NOT NULL,
    hashedpass text NOT NULL,
    namapengguna text NOT NULL,
    personalfolder character varying(32)
);


ALTER TABLE public.usertable OWNER TO "zaki.za.ananda";

--
-- Data for Name: files; Type: TABLE DATA; Schema: public; Owner: zaki.za.ananda
--

COPY public.files (fileid, namafile, skemaakses, ukuran, tanggalupload, directoryid, userpemilik, filelink) FROM stdin;
0	Meido1.png	FreeAccess	1000	2023-08-06 02:30:26	0	userTest	https://firebasestorage.googleapis.com/v0/b/easyfiles-1cf32.appspot.com/o/Meido1.png?alt=media&token=c9a4c8ae-4850-40ba-921b-c51ab9bdabb8
M5aZSFy8yW3FM37_9m7dm	Meido36.png	FreeAccess	333781	2023-06-09 01:11:08	0	userTest	https://firebasestorage.googleapis.com/v0/b/easyfiles-1cf32.appspot.com/o/0%2FMeido36.png?alt=media&token=8631d903-e7b9-45a3-8180-30ce2f6abe2c
VNAil4VNjYJhKo4gupd5H	Meido19.png	Restricted	141472	2023-06-10 11:22:26	0	userTestFolder	https://firebasestorage.googleapis.com/v0/b/easyfiles-1cf32.appspot.com/o/0%2FMeido19.png?alt=media&token=5c180ccb-1c05-47c6-918e-f8333d375531
1yxyd9Hl5aAD58aIQhItn	meido000.png	Restricted	145379	2023-06-11 12:10:03	0	gigachad12	https://firebasestorage.googleapis.com/v0/b/easyfiles-1cf32.appspot.com/o/0%2Fmeido000.png?alt=media&token=83b17427-ecc7-492f-825d-021b84f6f862
\.


--
-- Data for Name: folder; Type: TABLE DATA; Schema: public; Owner: zaki.za.ananda
--

COPY public.folder (folderid, namafolder, skemaakses, tanggalpembuatan, rootfolderid, userpemilik) FROM stdin;
0	testroot	FreeAccess	2023-06-08 02:30:26	0	userTest
48HW5l0t0XphvDUuJkKut	Test User With Folder Personal Folder	Restricted	2023-06-10 11:48:51	48HW5l0t0XphvDUuJkKut	userTestFolder
S8gBQRtnOs3leEYIF4CHz	Folder Baru	FreeAccess	2023-06-10 12:42:51	48HW5l0t0XphvDUuJkKut	userTestFolder
\.


--
-- Data for Name: usertable; Type: TABLE DATA; Schema: public; Owner: zaki.za.ananda
--

COPY public.usertable (username, hashedpass, namapengguna, personalfolder) FROM stdin;
userTest5	$2b$10$oIKugRWO4adV5udWJr5nSuelp2Z2SeaMoj646sxYwU.bcnszwbSYe	Test User 5	\N
userTest	$2b$10$liZpZCqafj.46Iu3XGbSNO5ae9nVXJcNNxr/mteyx/gxRRzF2QWZC	Test User 5	\N
userTest7	$2b$10$SaoJlqbjAsuTRj9HiHYz9ukAu1eD5Mz.M/14VDHnwyQIDxH78c.L6	Test User 5	\N
gigachad12	$2b$10$zHXs02KCz2mUDFN.d0rqW.LVNro.Yu1U0rH7iYcJ4VvlulDb8/NtG	chad	\N
userTestFolder	$2b$10$6UP947zg8q8kXsMiqKd0KOlw/GURWC86oQqThZO4Al1Wo85RF3.0G	Test User With Folder	48HW5l0t0XphvDUuJkKut
\.


--
-- Name: files files_filelink_key; Type: CONSTRAINT; Schema: public; Owner: zaki.za.ananda
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_filelink_key UNIQUE (filelink);


--
-- Name: folder folder_pkey; Type: CONSTRAINT; Schema: public; Owner: zaki.za.ananda
--

ALTER TABLE ONLY public.folder
    ADD CONSTRAINT folder_pkey PRIMARY KEY (folderid);


--
-- Name: usertable usertable_personalfolder_key; Type: CONSTRAINT; Schema: public; Owner: zaki.za.ananda
--

ALTER TABLE ONLY public.usertable
    ADD CONSTRAINT usertable_personalfolder_key UNIQUE (personalfolder);


--
-- Name: usertable usertable_username_key; Type: CONSTRAINT; Schema: public; Owner: zaki.za.ananda
--

ALTER TABLE ONLY public.usertable
    ADD CONSTRAINT usertable_username_key UNIQUE (username);


--
-- Name: folder folder_rootfolderid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: zaki.za.ananda
--

ALTER TABLE ONLY public.folder
    ADD CONSTRAINT folder_rootfolderid_fkey FOREIGN KEY (rootfolderid) REFERENCES public.folder(folderid);


--
-- Name: folder folder_userpemilik_fkey; Type: FK CONSTRAINT; Schema: public; Owner: zaki.za.ananda
--

ALTER TABLE ONLY public.folder
    ADD CONSTRAINT folder_userpemilik_fkey FOREIGN KEY (userpemilik) REFERENCES public.usertable(username);


--
-- PostgreSQL database dump complete
--

