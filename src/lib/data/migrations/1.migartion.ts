// CREATE TABLE IF NOT EXISTS language
// (
//     id   INTEGER PRIMARY KEY AUTOINCREMENT,
//     name TEXT NOT NULL UNIQUE
// );
// INSERT INTO language (name)
// VALUES ('Українська'),
//     ('Англійська'),
//     ('Російська');
//
// CREATE TABLE IF NOT EXISTS pageType
// (
//     id   INTEGER PRIMARY KEY AUTOINCREMENT,
//     name TEXT NOT NULL UNIQUE
// );
// INSERT INTO pageType (name)
// VALUES ('Картонні'),
//     ('Офсетні'),
//     ('Крейдовані');
//
// CREATE TABLE IF NOT EXISTS coverType
// (
//     id   INTEGER PRIMARY KEY AUTOINCREMENT,
//     name TEXT UNIQUE NOT NULL
// );
// INSERT INTO coverType (name)
// VALUES ('М''яка'),
// ('Тверда');
//
// CREATE TABLE IF NOT EXISTS bookType
// (
//     id   INTEGER PRIMARY KEY AUTOINCREMENT,
//     name TEXT NOT NULL UNIQUE
// );
// INSERT INTO bookType (name)
// VALUES ('Історія'),
//     ('Історії'),
//     ('Наліпки'),
//     ('Завдання'),
//     ('Прописи'),
//     ('Розмальовка'),
//     ('Водна розмальовка'),
//     ('Розмальовка з наліпками'),
//     ('Прописи з наліпками'),
//     ('Книжка з віконцями'),
//     ('Книжка з пазлами'),
//     ('Книжка-картинка'),
//     ('Казки'),
//     ('Казка'),
//     ('Картки'),
//     ('Енциклопедія'),
//     ('Абетка'),
//     ('Віммельбух');
//
// CREATE TABLE IF NOT EXISTS publishingHouse
// (
//     id   INTEGER PRIMARY KEY AUTOINCREMENT,
//     name TEXT NOT NULL UNIQUE,
//     tag  TEXT
// );
// INSERT INTO publishingHouse (name, tag)
// VALUES ('Vivat', 'Віват'),
//     ('Ранок', null),
//     ('Пегас', null),
//     ('Видавництво Старого лева', null),
//     ('Абрикос', null),
//     ('Богдан', null),
//     ('Ула', null),
//     ('Талант', null),
//     ('Час Майстрів', null),
//     ('Сова', null),
//     ('Читаріум', null);
//
// CREATE TABLE IF NOT EXISTS author
// (
//     id          INTEGER PRIMARY KEY AUTOINCREMENT,
//     name        TEXT NOT NULL UNIQUE,
//     description TEXT
// );
// INSERT INTO author (name)
// VALUES ('Ірина Сонечко'),
//     ('Аксель Шефлер'),
//     ('Юлія Смаль'),
//     ('Нік Баттерворт'),
//     ('Вольфганг Метцгер'),
//     ('Сюзанна Гернхейзер');
//
// CREATE TABLE bookSeries
// (
//     id                INTEGER PRIMARY KEY AUTOINCREMENT,
//     name              TEXT,
//     publishingHouseId INTEGER,
//     FOREIGN KEY (publishingHouseId) REFERENCES publishingHouse (id),
//     UNIQUE (name, publishingHouseId)
// );
//
// CREATE TABLE IF NOT EXISTS book
// (
//     id            INTEGER PRIMARY KEY AUTOINCREMENT,
//     name          TEXT    NOT NULL,
//     description   TEXT,
//     numberOfPages INTEGER NOT NULL,
//     price         REAL    NOT NULL,
//     numberInStock INTEGER NOT NULL,
//     bookTypeId    INTEGER NOT NULL,
//     seriesId      INTEGER NOT NULL,
//     coverTypeId   INTEGER NOT NULL,
//     pageTypeId    INTEGER NOT NULL,
//     isbn          CHARACTER(13),
//     languageId    INTEGER NOT NULL,
//     format        TEXT,
//     FOREIGN KEY (languageId) REFERENCES language (id),
//     FOREIGN KEY (pageTypeId) REFERENCES pageType (id),
//     FOREIGN KEY (coverTypeId) REFERENCES coverType (id),
//     FOREIGN KEY (seriesId) REFERENCES bookSeries (id),
//     FOREIGN KEY (bookTypeId) REFERENCES bookType (id),
//     UNIQUE (name, seriesId, bookTypeId, coverTypeId, pageTypeId, languageId)
// );
