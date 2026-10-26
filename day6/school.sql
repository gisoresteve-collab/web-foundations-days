PRAGMA foreign_keys = ON;

-- Reset tables so this script can be tested from a clean database.
DROP TABLE IF EXISTS enrolments;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS students;

-- 1. Create students table
CREATE TABLE students (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
);

-- 2. Create courses table
CREATE TABLE courses (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT
);

-- 3. Create enrolments bridge table
CREATE TABLE enrolments (
    id INTEGER PRIMARY KEY,
    student_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    grade TEXT NOT NULL DEFAULT 'Not graded',
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (course_id) REFERENCES courses(id),
    UNIQUE (student_id, course_id)
);

-- Insert sample students
INSERT INTO students (name, email) VALUES
('Amina Otieno', 'amina@example.com'),
('Brian Kamau', 'brian@example.com'),
('Chao Mwangi', 'chao@example.com'),
('Diana Wanjiku', 'diana@example.com');

-- Insert sample courses
INSERT INTO courses (name, description) VALUES
('Database Fundamentals', 'Learn database design and SQL'),
('Web Development', 'Learn HTML, CSS and JavaScript'),
('Computer Networks', 'Learn networking fundamentals');

-- Insert sample enrolments
INSERT INTO enrolments (student_id, course_id, grade) VALUES
(1, 1, 'A'),
(1, 2, 'B'),
(2, 1, 'B'),
(2, 3, 'A'),
(3, 2, 'A');

-- Query 1: All courses taken by one student
SELECT s.name AS student_name, c.name AS course_name
FROM enrolments AS e
JOIN students AS s ON e.student_id = s.id
JOIN courses AS c ON e.course_id = c.id
WHERE s.name = 'Amina Otieno';

-- Query 2: All students taking one course
SELECT s.name AS student_name
FROM enrolments AS e
JOIN students AS s ON e.student_id = s.id
JOIN courses AS c ON e.course_id = c.id
WHERE c.name = 'Database Fundamentals';

-- Query 3: Number of students per course, including courses with none
SELECT c.name AS course_name,
       COUNT(e.student_id) AS student_count
FROM courses AS c
LEFT JOIN enrolments AS e ON c.id = e.course_id
GROUP BY c.id, c.name;

-- Query 4: Students with no enrolments
SELECT s.name
FROM students AS s
LEFT JOIN enrolments AS e ON s.id = e.student_id
WHERE e.id IS NULL;

-- Query 5: Update one enrolment's grade
UPDATE enrolments
SET grade = 'A'
WHERE student_id = 2 AND course_id = 1;

-- Verify the grade update
SELECT s.name AS student_name,
       c.name AS course_name,
       e.grade
FROM enrolments AS e
JOIN students AS s ON e.student_id = s.id
JOIN courses AS c ON e.course_id = c.id
WHERE s.id = 2 AND c.id = 1;

-- Index for course enrolment lookups
CREATE INDEX idx_enrolments_course_id
ON enrolments(course_id);

-- Check referential integrity
PRAGMA foreign_key_check;