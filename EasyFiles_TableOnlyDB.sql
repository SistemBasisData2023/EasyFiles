CREATE TYPE public.access AS ENUM (
    'FreeAccess',
    'Restricted'
);

CREATE TABLE public.files (
    fileid character varying(32) NOT NULL,
    namafile character varying(255) NOT NULL,
    skemaakses public.access NOT NULL,
    ukuran bigint NOT NULL,
    tanggalupload timestamp without time zone NOT NULL,
    directoryid character varying(32) NOT NULL,
    userpemilik character varying(255) NOT NULL,
    filelink text NOT NULL
    path text NOT NULL
);

CREATE TABLE public.folder (
    folderid character varying(32) NOT NULL,
    namafolder character varying(255) NOT NULL,
    skemaakses public.access NOT NULL,
    tanggalpembuatan timestamp without time zone NOT NULL,
    rootfolderid character varying(32) NOT NULL,
    userpemilik character varying(255) NOT NULL
    path text NOT NULL
);

CREATE TABLE public.usertable (
    username character varying(31) NOT NULL,
    hashedpass text NOT NULL,
    namapengguna text NOT NULL,
    personalfolder character varying(32)
);

ALTER TABLE ONLY folder
    ADD CONSTRAINT folder_pkey PRIMARY KEY (folderid);
ALTER TABLE ONLY usertable
    ADD CONSTRAINT usertable_username_pkey PRIMARY KEY (username);
ALTER TABLE ONLY files
    ADD CONSTRAINT files_fileid_pkey PRIMARY KEY (fileid);

ALTER TABLE ONLY folder
    ADD CONSTRAINT folder_rootfolderid_fkey FOREIGN KEY (rootfolderid) REFERENCES folder(folderid);
ALTER TABLE ONLY folder
    ADD CONSTRAINT folder_userpemilik_fkey FOREIGN KEY (userpemilik) REFERENCES usertable(username);
ALTER TABLE ONLY usertable
    ADD CONSTRAINT usertable_personalfolder_fkey FOREIGN KEY (personalfolder) REFERENCES folder(folderid);
ALTER TABLE ONLY files
    ADD CONSTRAINT files_directoryid_fkey FOREIGN KEY (directoryid) REFERENCES folder(folderid);
ALTER TABLE ONLY files
    ADD CONSTRAINT files_userpemilik_fkey FOREIGN KEY (userpemilik) REFERENCES usertable(username);

ALTER TABLE ONLY usertable
    ADD CONSTRAINT usertable_personalfolder_key UNIQUE (personalfolder);
ALTER TABLE ONLY files
    ADD CONSTRAINT files_filelink_key UNIQUE (filelink);




