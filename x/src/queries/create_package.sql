CREATE TABLE users (
    id int(11) NOT NULL AUTO_INCREMENT,
    name varchar(100) NOT NULL,
    password_hash LONGTEXT NOT NULL,
    created_at timestamp NOT null default current_timestamp,
    PRIMARY KEY (id)
) DEFAULT CHARSET = utf8;