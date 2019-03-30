CREATE DATABASE `facet`;

/* Users are the primary entries in the database */
DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
    `id` int NOT NULL AUTO_INCREMENT,

    /* Pulled from phone on initial app load */
    `phone_hash` varchar(255) NOT NULL UNIQUE,
    `access_token` varchar(255) NOT NULL UNIQUE,

    /* Prompted after initial login */
    `fname` varchar(255),
    `lname` varchar(255),
    `email` varchar(255) UNIQUE,

    /* Optional information to verify accound and allow addition of customers */
    `vendor_name` varchar(255),
    `vendor_website` varchar(255),
    `vendor_location` int,
    `vendor_type` varchar(255),
    `vendor_flag` int NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1;

/* Network is the connections between users */
DROP TABLE IF EXISTS `customers`;
CREATE TABLE IF NOT EXISTS `customers` (
    `id` int NOT NULL AUTO_INCREMENT,

    `vendor_phone` varchar(255) NOT NULL,
    `customer_phone` varchar(255),
    `customer_fname` varchar(255),
    `customer_lname` varchar(255),
    `customer_email` varchar(255),

    /* 0 is added, 1 is confirmed by customer, 2 is declined by customer */
    `status` int NOT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT FK_vendor FOREIGN KEY (`vendor_phone`) REFERENCES users(`phone_hash`)
        ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1;
