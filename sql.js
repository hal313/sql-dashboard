// Default query
export const DEFAULT_QUERY = 'SELECT * FROM Fibs';

// The init statments
export const INIT_STATEMENTS = `
DROP TABLE IF EXISTS Fibs;
CREATE TABLE Fibs (
    ID INTEGER PRIMARY KEY,
    FibsContent VARCHAR(60)
);

INSERT INTO Fibs VALUES (1, 'Fibs Only');
INSERT INTO Fibs VALUES (2, 'Both');
INSERT INTO Fibs VALUES (3, 'Fibs Only');
INSERT INTO Fibs VALUES (5, 'Fibs Only');
INSERT INTO Fibs VALUES (8, 'Both');
INSERT INTO Fibs VALUES (13, 'Fibs Only');
INSERT INTO Fibs VALUES (21, 'Fibs Only');
INSERT INTO Fibs VALUES (34, 'Both');
INSERT INTO Fibs VALUES (55, 'Fibs Only');

DROP TABLE IF EXISTS Evens;
CREATE TABLE Evens (
    ID INTEGER PRIMARY KEY,
    EvensContent VARCHAR(60)
);

INSERT INTO Evens VALUES (2, 'Both');
INSERT INTO Evens VALUES (4, 'Evens Only');
INSERT INTO Evens VALUES (6, 'Evens Only');
INSERT INTO Evens VALUES (8, 'Both');
INSERT INTO Evens VALUES (10, 'Evens Only');
INSERT INTO Evens VALUES (12, 'Evens Only');
INSERT INTO Evens VALUES (14, 'Evens Only');
INSERT INTO Evens VALUES (16, 'Evens Only');
INSERT INTO Evens VALUES (18, 'Evens Only');
INSERT INTO Evens VALUES (20, 'Evens Only');
INSERT INTO Evens VALUES (22, 'Evens Only');
INSERT INTO Evens VALUES (24, 'Evens Only');
INSERT INTO Evens VALUES (26, 'Evens Only');
INSERT INTO Evens VALUES (28, 'Evens Only');
INSERT INTO Evens VALUES (30, 'Evens Only');
INSERT INTO Evens VALUES (32, 'Evens Only');
INSERT INTO Evens VALUES (34, 'Both');
INSERT INTO Evens VALUES (36, 'Evens Only');
`
// Split on ';'
.split(';')
// Remove whitespace and trim
.map(statement => statement.replace(/\s/gi, ' '))
.map(statement => statement.replace(/( )+/gi, ' '))
.map(statement => statement.trim())
// Filter empty strings
.filter(statement => !!statement)
;