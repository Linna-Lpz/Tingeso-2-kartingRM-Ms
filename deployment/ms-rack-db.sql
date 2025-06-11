-- CONFIGURACIÓN
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

-- TABLA RACK
CREATE TABLE rack (
                      id               BIGINT NOT NULL,
                      booking_date     DATE,
                      booking_status   VARCHAR(255),
                      booking_time     TIME(6),
                      booking_time_end TIME(6),
                      client_name      VARCHAR(255),
                      PRIMARY KEY (id)
);

ALTER TABLE rack OWNER TO postgres;

-- DATOS DE EJEMPLO
INSERT INTO rack (id,
                  booking_date,
                  booking_status,
                  booking_time,
                  booking_time_end,
                  client_name
) VALUES (5, '2025-04-15', 'confirmada', '13:00:00', '13:35:00', 'Lalo'),
         (3, '2025-04-15', 'confirmada', '12:00:00', '12:35:00', 'Lalo'),
         (6, '2025-05-15', 'confirmada', '13:00:00', '13:35:00', 'Lalo');
