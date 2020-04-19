-- Proyecto: Cuidadores compartidos (sharedcare)

drop database if exists sharedcare;
create database sharedcare CHARACTER SET UTF8MB4 COLLATE UTF8MB4_general_ci;
use sharedcare;

-- Tabla de ciudades donde residen los usuarios y donde se realizan las ofertas
drop table if exists city;
create table city(
city_id smallint unsigned not null auto_increment,
city_name varchar(50) not null unique,
create_at timestamp not null default current_timestamp,
last_modify timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
primary key (city_id) 
);

-- Tabla de categorías (necesidades de los usuarios)
-- Artributo statusx = atributo de estado de cada categoría: 0 - desctivada, 1 - activa
drop table if exists category;
create table category(
category_id tinyint unsigned not null auto_increment,
category_name varchar(50) unique not null,
category_description varchar(255) default "",
statusx tinyint unsigned not null default 1,
create_at timestamp not null default current_timestamp,
last_modify timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
primary key(category_id)
);

-- Tabla de horarios
drop table if exists availability;
create table availability(
availability_id tinyint unsigned not null auto_increment,
av_name varchar(50) not null,
create_at timestamp not null default current_timestamp,
last_modify timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
primary key(availability_id)
);

-- Tabla de usuarios ya sean clientes o proveedores
-- Atributo statusx = estado del usuario: -1 - baja, 0 - bloqueado, 1 - activo 
-- Atributo kind = tipo d usuario: 1 - cliente, 2 - proveedor, 3 - administrador
drop table if exists user;
create table user(
user_id smallint unsigned not null auto_increment,
user_name varchar(50) not null,
last_name varchar(50) not null,
birth_date date not null,
gender enum('Female','Male'),
city_id smallint unsigned not null,
email varchar(255) not null,
pass varchar(255),
statusx tinyint not null default 1,
kind tinyint unsigned not null,
image varchar(255) default null,
phone varchar(15) not null,
create_at timestamp not null default current_timestamp,
last_modify timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
primary key (user_id),
constraint FK_user_city foreign key (city_id) references city(city_id) on delete restrict on update cascade
);

--  Tabla de proveedores con los atributos específicos de esta entidad
drop table if exists provider;
create table provider(
provider_id smallint unsigned not null auto_increment,
user_id smallint unsigned unique not null,
xp_years date not null,
rating_count int unsigned not null default 0,
score_total int unsigned not null default 0,
score_avg decimal(7,1) not null default 0,	
biography text default null,
speciality varchar(255) not null,
create_at timestamp not null default current_timestamp,
last_modify timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
primary key (provider_id),
constraint FK_provider_user foreign key(user_id) references user(user_id) on delete cascade on update cascade
);

-- Tabla de ofertas de proveedor
-- Atributo statusx = estado de la oferta: 0 - borrador, 1 - publicada, 2 - finalizada, 3 - archivada 
-- Atributo customer_min = numero mínimo de clientes para activar la oferta
-- Atributo actived = indica si la oferta ha llegado al número mínimo de consultas y está activada, se utiliza para agilizar las consultas
-- Atributo price = precio mensual por usuario para el número mínimo de participantes
drop table if exists offer;
create table offer(
offer_id int unsigned not null auto_increment,
provider_id smallint unsigned not null,
city_id smallint unsigned not null,
title varchar(255) not null,
offer_text text not null,
icon varchar(255) not null default "",
statusx tinyint not null default 1,
actived boolean not null default 0,
customer_min tinyint unsigned not null check (customer_min > 0),
price decimal(6,2) not null default 0,
create_at timestamp not null default current_timestamp,
last_modify timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
constraint PK_offer primary key (offer_id),
constraint FK_offer_provider foreign key (provider_id) references provider(provider_id) on delete restrict on update cascade,
constraint FK_offer_city foreign key (city_id) references city(city_id) on delete restrict on update cascade
);

-- Tabla de valoraciones y comentarios sobre los proveedores
drop table if exists rating;
create table rating(
user_id smallint unsigned not null,
provider_id smallint unsigned not null,
score tinyint unsigned not null default 0,
review text,
create_at timestamp not null default current_timestamp,
last_modify timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
primary key(user_id, provider_id),
constraint FK_rating_user foreign key (user_id) references user(user_id) on delete cascade on update cascade,
constraint FK_rating_provider foreign key (provider_id) references provider(provider_id) on delete restrict on update cascade
);

-- Tabla de relaciones entre usuarios y ofertas (reservas)
-- Atributo statusx = estado de la reserva: 0 - anulada, 1 - activada
drop table if exists booking ;
create table booking(
booking_id int unsigned not null auto_increment,
offer_id int unsigned not null,
user_id smallint unsigned not null,
statusx tinyint not null default 1,
create_at timestamp not null default current_timestamp,
last_modify timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
primary key (booking_id),
constraint FK_booking_offer foreign key (offer_id) references offer(offer_id) on delete restrict on update cascade,
constraint FK_booking_user foreign key (user_id) references user(user_id) on delete restrict on update cascade
);

-- Tabla de relaciones entre las ofertas y las categorias
drop table if exists offer_category;
create table offer_category(
offer_id int unsigned not null,
category_id tinyint unsigned not null,
create_date timestamp not null default current_timestamp,
last_modify_date timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
constraint PK_offer_category primary key (offer_id, category_id),
constraint FK_offer_category_offer foreign key (offer_id) references offer(offer_id) on delete restrict on update cascade,
constraint FK_offer_category_category foreign key (category_id) references category(category_id) on delete restrict on update cascade
);

-- Tabla relaciones entre ofertas y disponibilidades horarias
drop table if exists offer_availability;
create table offer_availability(
offer_id int unsigned not null,
availability_id tinyint unsigned not null,
create_at timestamp not null default current_timestamp,
last_modify timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
primary key(offer_id, availability_id),
constraint FK_offer_availability_offer foreign key(offer_id) references offer(offer_id) on delete restrict on update cascade,
constraint FK_offer_availability_availability foreign key(availability_id) references availability(availability_id) on delete restrict on update cascade
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