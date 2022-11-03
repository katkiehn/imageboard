DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS images;

CREATE TABLE images(
    id SERIAL PRIMARY KEY,
    url VARCHAR NOT NULL,
    username VARCHAR NOT NULL,
    title VARCHAR NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE comments(
    id  SERIAL PRIMARY KEY,
    image_id INT NOT NULL REFERENCES images(id),
    comment VARCHAR NOT NULL,
    username VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO images (url, username, title, description) VALUES (
    'https://s3.amazonaws.com/imageboard/jAVZmnxnZ-U95ap2-PLliFFF7TO0KqZm.jpg',
    'funkychicken',
    'Welcome to Spiced and the Future!',
    'This photo brings back so many great memories.'
);


