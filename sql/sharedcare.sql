-- Proyecto: Cuidadores compartidos (sharedcare)

drop database if exists sharedcare;
create database sharedcare CHARACTER SET UTF8MB4 COLLATE UTF8MB4_general_ci;
use sharedcare;

-- Tabla de ciudades donde residen los usuarios y donde se realizan las ofertas
drop table if exists city;
CREATE TABLE city (
    city_id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
    city_name VARCHAR(50) NOT NULL UNIQUE,
    create_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_modify TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (city_id)
);

-- Tabla de categorías (necesidades de los usuarios)
-- Artributo statusx = atributo de estado de cada categoría: 0 - desctivada, 1 - activa
drop table if exists category;
CREATE TABLE category (
    category_id TINYINT UNSIGNED NOT NULL AUTO_INCREMENT,
    category_name VARCHAR(50) UNIQUE NOT NULL,
    category_description VARCHAR(255) DEFAULT '',
    statusx TINYINT UNSIGNED NOT NULL DEFAULT 1,
    create_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_modify TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (category_id)
);

-- Tabla de horarios
drop table if exists availability;
CREATE TABLE availability (
    availability_id TINYINT UNSIGNED NOT NULL AUTO_INCREMENT,
    av_name VARCHAR(50) NOT NULL,
    create_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_modify TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (availability_id)
);

-- Tabla de usuarios ya sean clientes o proveedores
-- Atributo statusx = estado del usuario: -1 - baja, 0 - bloqueado, 1 - activo 
-- Atributo kind = tipo d usuario: 1 - cliente, 2 - proveedor, 3 - administrador
drop table if exists user;
CREATE TABLE user (
    user_id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    birth_date DATE NOT NULL,
    gender ENUM('Female', 'Male'),
    city_id SMALLINT UNSIGNED NOT NULL,
    email VARCHAR(255) NOT NULL,
    pass VARCHAR(255),
    statusx TINYINT NOT NULL DEFAULT 1,
    kind TINYINT UNSIGNED NOT NULL,
    image VARCHAR(255) DEFAULT NULL,
    phone VARCHAR(15) NOT NULL,
    create_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_modify TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id),
    CONSTRAINT FK_user_city FOREIGN KEY (city_id)
        REFERENCES city (city_id)
        ON DELETE RESTRICT ON UPDATE CASCADE
);

--  Tabla de proveedores con los atributos específicos de esta entidad
drop table if exists provider;
CREATE TABLE provider (
    provider_id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id SMALLINT UNSIGNED UNIQUE NOT NULL,
    xp_years DATE NOT NULL,
    rating_count INT UNSIGNED NOT NULL DEFAULT 0,
    score_total INT UNSIGNED NOT NULL DEFAULT 0,
    score_avg DECIMAL(7 , 1 ) NOT NULL DEFAULT 0,
    biography TEXT DEFAULT NULL,
    speciality VARCHAR(255) NOT NULL,
    create_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_modify TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (provider_id),
    CONSTRAINT FK_provider_user FOREIGN KEY (user_id)
        REFERENCES user (user_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tabla de ofertas de proveedor
-- Atributo statusx = estado de la oferta: 0 - borrador, 1 - publicada, 2 - finalizada, 3 - archivada 
-- Atributo customer_min = numero mínimo de clientes para activar la oferta
-- Atributo actived = indica si la oferta ha llegado al número mínimo de consultas y está activada, se utiliza para agilizar las consultas
-- Atributo price = precio mensual por usuario para el número mínimo de participantes
drop table if exists offer;
CREATE TABLE offer (
    offer_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    provider_id SMALLINT UNSIGNED NOT NULL,
    city_id SMALLINT UNSIGNED NOT NULL,
    title VARCHAR(255) NOT NULL,
    offer_text TEXT NOT NULL,
    icon VARCHAR(255) NOT NULL DEFAULT '',
    statusx TINYINT NOT NULL DEFAULT 1,
    actived BOOLEAN NOT NULL DEFAULT 0,
    customer_min TINYINT UNSIGNED NOT NULL CHECK (customer_min > 0),
    price DECIMAL(6 , 2 ) NOT NULL DEFAULT 0,
    create_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_modify TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (offer_id),
    CONSTRAINT FK_offer_provider FOREIGN KEY (provider_id)
        REFERENCES provider (provider_id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT FK_offer_city FOREIGN KEY (city_id)
        REFERENCES city (city_id)
        ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Tabla de valoraciones y comentarios sobre los proveedores
drop table if exists rating;
CREATE TABLE rating (
    user_id SMALLINT UNSIGNED NOT NULL,
    provider_id SMALLINT UNSIGNED NOT NULL,
    score TINYINT UNSIGNED NOT NULL DEFAULT 0,
    review TEXT,
    create_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_modify TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id , provider_id),
    CONSTRAINT FK_rating_user FOREIGN KEY (user_id)
        REFERENCES user (user_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT FK_rating_provider FOREIGN KEY (provider_id)
        REFERENCES provider (provider_id)
        ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Tabla de relaciones entre usuarios y ofertas (reservas)
-- Atributo statusx = estado de la reserva: 0 - anulada, 1 - activada
drop table if exists booking ;
CREATE TABLE booking (
    booking_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    offer_id INT UNSIGNED NOT NULL,
    user_id SMALLINT UNSIGNED NOT NULL,
    statusx TINYINT NOT NULL DEFAULT 1,
    create_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_modify TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (booking_id),
    CONSTRAINT FK_booking_offer FOREIGN KEY (offer_id)
        REFERENCES offer (offer_id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT FK_booking_user FOREIGN KEY (user_id)
        REFERENCES user (user_id)
        ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Tabla de relaciones entre las ofertas y las categorias
drop table if exists offer_category;
CREATE TABLE offer_category (
    offer_id INT UNSIGNED NOT NULL,
    category_id TINYINT UNSIGNED NOT NULL,
    create_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_modify_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (offer_id , category_id),
    CONSTRAINT FK_offer_category_offer FOREIGN KEY (offer_id)
        REFERENCES offer (offer_id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT FK_offer_category_category FOREIGN KEY (category_id)
        REFERENCES category (category_id)
        ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Tabla relaciones entre ofertas y disponibilidades horarias
drop table if exists offer_availability;
CREATE TABLE offer_availability (
    offer_id INT UNSIGNED NOT NULL,
    availability_id TINYINT UNSIGNED NOT NULL,
    create_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_modify TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (offer_id , availability_id),
    CONSTRAINT FK_offer_availability_offer FOREIGN KEY (offer_id)
        REFERENCES offer (offer_id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT FK_offer_availability_availability FOREIGN KEY (availability_id)
        REFERENCES availability (availability_id)
        ON DELETE RESTRICT ON UPDATE CASCADE
);
 
 -- Tabla de configuracion de la aplicacion para futuros usos
 -- Atributo config_name = Nombre de la variable de configuracion
 -- Atributo config_type = Tipo de variable: 1 - Numero, 2 - Texto, 3 - Buleano (0 o 1)
 drop table if exists config;
CREATE TABLE config (
    config_id TINYINT UNSIGNED NOT NULL AUTO_INCREMENT,
    config_name VARCHAR(255) NOT NULL UNIQUE,
    config_type TINYINT UNSIGNED NOT NULL,
    config_value VARCHAR(255) NOT NULL,
    PRIMARY KEY (config_id)
);


-- INSERTS 

-- Ciudades (10)
INSERT INTO city(city_name) VALUES ("A Coruña"),("Cambre"),("Culleredo"),("Ferrol"),("Pontedeume"),("Narón"),("Ares"),("Miño"),("Santiago"),("Sada");

-- Categorias (10)
INSERT INTO category(category_name)
VALUES('Limpieza del hogar'),('Compañía'),('Compras y aprovisionamientos'),('Acompañamiento médico'),('Control de medicación'),('Cuidado e higiene personal'),('Rehabilitación'),('Enfermería'),('Servicio de cocina');

-- Horarios (3)
insert into availability(av_name) values('Mañana'),('Tarde'),('Noche');

-- Usuarios (10)
INSERT INTO `user` (`user_name`,`last_name`,`birth_date`,`gender`,`city_id`,`email`,`pass`,`statusx`,`kind`,`image`,`phone`) VALUES ("Lamar","Pacheco","2019-06-08","Female",4,"Nunc@etarcuimperdiet.com","nibh",1,1,"aliquam,","01 42 78 81 96"),("Rashad","Cannon","2019-11-14","Female",6,"non.magna@Phasellusin.com","consectetuer,",1,1,"urna","09 35 26 01 80"),("Brianna","Brown","2020-03-28","Male",10,"commodo@scelerisquescelerisquedui.ca","facilisi.",1,1,"sem","08 63 28 07 87"),("Hayley","Cote","2019-11-23","Female",7,"fringilla.porttitor@leoin.net","convallis",1,1,"Vestibulum","09 83 54 78 46"),("Aidan","Blackwell","2019-10-07","Female",8,"laoreet.ipsum.Curabitur@ipsum.edu","Quisque",1,1,"vehicula","07 87 42 75 48"),("Stuart","Hahn","2019-12-14","Male",5,"Nam.tempor@tempor.co.uk","Nunc",1,1,"nec,","05 12 83 43 37"),("Dillon","Head","2019-06-22","Male",4,"volutpat@sedhendrerita.co.uk","Nulla",1,1,"nulla.","06 27 50 94 53"),("Jennifer","Hatfield","2020-04-01","Female",10,"amet.nulla@sedpede.org","dictum",1,2,"dolor","02 50 85 80 86"),("Teegan","Petty","2019-10-06","Female",1,"orci.consectetuer.euismod@utsem.ca","ullamcorper.",1,2,"In","09 84 69 75 74"),("Yeo","French","2020-12-29","Female",7,"tempus.non.lacinia@lobortisrisusIn.com","Donec",1,2,"ligula.","02 76 83 69 77");

-- Proveedores (3)
insert into provider(user_id, xp_years, biography, speciality) values(8,"2005-10-01","Enfermero durante 3 años en el CHUAC, en cirujía general","Enfermería"), (9,"1995-01-31","Persona ordenada y meticulosa. Hijo de farmaceúticos. Prácticas en farmacia.","Farmacia"),(10,"2010-03-10","Sin comentarios","Puericultura");
 
 -- Ofertas (3)
 insert into offer(provider_id, city_id, title, offer_text, icon, statusx, actived, customer_min, price) 
values 	(1, 1, "Cuidados enfermería", "Curas y cuidados de enfermería. Seguimiento y acompañamiento de citas médicas", "xxxxxxxxxxxx", 1, 0, 5, 100),
		(2, 4, "Compañía y estimulación cognitiva", "Servicio de acompañamiento de la persona dependiente. Ejercicios de memoria", "xxxxxxxxx", 1, 0, 6, 50),
        (3, 7, "Compras y asistencia","Abastecimientos del hogar. Servicio de cocina","yyyyyyyyyyyyyyy", 1, 1, 3, 150);

-- Ratings (2)
insert into rating(user_id, provider_id, score, review) values(1,1,4,"Gran profesional"), (2,1,5,"Atento y amable");

-- Reservas (8)
insert into booking(offer_id, user_id, statusx) values (1, 1, 1), (1, 2, 1), (1, 2, 1), (2, 1, 1), (2, 3, 1), (3, 4, 1), (3, 5, 1), (3, 6, 1);


-- Categorías de cada oferta (5)
insert into offer_category(offer_id, category_id) values(1, 8), (1, 4), (2, 2), (3, 3), (3, 9);

-- Horario de cada oferta (3)
insert into offer_availability(offer_id, availability_id) values(1, 1), (2, 2), (3, 1);

-- Configuracion de la aplicacion
 insert into config(config_name, config_type, config_value) values("Permitir borrar ofertas", 3, 0);