School Database Design

1. Tables

students: Stores each student's ID, name, and email. The ID is the primary key, and each email must be unique.

courses: Stores each course's ID, name, and description. The ID is the primary key, and course names must be unique.

enrolments: Connects students to the courses they take. It stores an enrolment ID, student ID, course ID, and grade. The student ID and course ID are foreign keys.

2. Relationships

One-to-many

One student can have many enrolments, but each enrolment belongs to one student. The student_id foreign key in enrolments links each enrolment to its student.

One course can also have many enrolments. The course_id foreign key links each enrolment to its course.

Many-to-many

Students and courses have a many-to-many relationship. A student can take several courses, and each course can have several students.

The enrolments table acts as a join table between students and courses. It also stores the grade for each student's course. The combination of student_id and course_id is unique to prevent duplicate enrolments.

3. Index

The database creates an index named idx_enrolments_course_id on the course_id column in enrolments. This helps the database find enrolments for a particular course more efficiently.

Indexes use additional storage and can make inserts and updates slightly slower, but they can improve query performance.

4. SQL vs NoSQL

SQL databases use structured tables with defined relationships and are suitable for data that needs consistency and reliable transactions. NoSQL databases support different data models, such as documents and key-value pairs, and can be useful when data structures vary or need to scale in different ways. For this school database, SQL is suitable because students, courses, and enrolments have clear relationships and constraints.