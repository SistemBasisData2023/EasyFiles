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
    filelink TEXT UNIQUE NOT NULL
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
    namapengguna text NOT NULL
);


ALTER TABLE public.usertable OWNER TO "zaki.za.ananda";

--
-- Data for Name: files; Type: TABLE DATA; Schema: public; Owner: zaki.za.ananda
--

COPY public.files (fileid, namafile, skemaakses, ukuran, tanggalupload, directoryid, userpemilik) FROM stdin;
\.


--
-- Data for Name: folder; Type: TABLE DATA; Schema: public; Owner: zaki.za.ananda
--

COPY public.folder (folderid, namafolder, skemaakses, tanggalpembuatan, rootfolderid, userpemilik) FROM stdin;
\.


--
-- Data for Name: usertable; Type: TABLE DATA; Schema: public; Owner: zaki.za.ananda
--

COPY public.usertable (username, hashedpass, namapengguna) FROM stdin;
userTest5	$2b$10$oIKugRWO4adV5udWJr5nSuelp2Z2SeaMoj646sxYwU.bcnszwbSYe	Test User 5
userTest	$2b$10$liZpZCqafj.46Iu3XGbSNO5ae9nVXJcNNxr/mteyx/gxRRzF2QWZC	Test User 5
\.


--
-- Name: files files_pkey; Type: CONSTRAINT; Schema: public; Owner: zaki.za.ananda
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_pkey PRIMARY KEY (fileid);


--
-- Name: folder folder_pkey; Type: CONSTRAINT; Schema: public; Owner: zaki.za.ananda
--

ALTER TABLE ONLY public.folder
    ADD CONSTRAINT folder_pkey PRIMARY KEY (folderid);


--
-- Name: usertable usertable_username_key; Type: CONSTRAINT; Schema: public; Owner: zaki.za.ananda
--

ALTER TABLE ONLY public.usertable
    ADD CONSTRAINT usertable_username_key UNIQUE (username);


--
-- Name: files files_directoryid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: zaki.za.ananda
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_directoryid_fkey FOREIGN KEY (directoryid) REFERENCES public.folder(folderid);


--
-- Name: files files_userpemilik_fkey; Type: FK CONSTRAINT; Schema: public; Owner: zaki.za.ananda
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_userpemilik_fkey FOREIGN KEY (userpemilik) REFERENCES public.usertable(username);


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

