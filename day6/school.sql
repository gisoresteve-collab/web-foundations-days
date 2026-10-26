-- 4. Students with no enrolments
SELECT students.name
FROM students
LEFT JOIN enrolments ON students.id = enrolments.student_id
WHERE enrolments.id IS NULL;

-- 5. Update an enrolment grade
UPDATE enrolments
SET grade = 'A'
WHERE student_id = 2 AND course_id = 1;

-- Verify the updated grade
SELECT students.name, courses.name AS course_name, enrolments.grade
FROM enrolments
JOIN students ON enrolments.student_id = students.id
JOIN courses ON enrolments.course_id = courses.id
WHERE students.id = 2 AND courses.id = 1;

-- Index to help course enrolment lookups
CREATE INDEX idx_enrolments_course_id
ON enrolments(course_id);