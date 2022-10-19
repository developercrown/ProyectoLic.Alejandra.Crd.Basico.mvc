use pizzeria;
create database if not exists pizzeria;
use pizzeria;

create table pedidos(
	id int(10) auto_increment not null primary key,
    cliente varchar(200) not null,
    telefono varchar(20) not null,
    pedido varchar(200) not null
);

insert into pedidos (cliente, telefono, pedido) values ("rene", "123123123", "Pizza hawallana"), ("javier", "234234234", "Pizza peperoni"), ("luis", "222222222", "Pizza Vegetariana");

select * from pedidos;