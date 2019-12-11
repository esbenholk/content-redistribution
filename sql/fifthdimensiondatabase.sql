DROP TABLE IF EXISTS imageContent;


CREATE TABLE imageContent(
    id SERIAL PRIMARY KEY,
    url VARCHAR(300) NOT NULL,
    title VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
