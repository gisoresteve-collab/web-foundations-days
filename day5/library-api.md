Library Books REST API

1. List all books

Method: GET

Path: /books

Description: Returns a list of all books.

Example success status: 200 OK

Example response: [{"id": 1, "title": "Things Fall Apart", "author": "Chinua Achebe"}]

2. Get one book

Method: GET

Path: /books/1

Description: Returns a book by its ID.

Example success status: 200 OK

3. Create a book

Method: POST

Path: /books

Description: Creates a new book.

Example request body: {"title": "Things Fall Apart", "author": "Chinua Achebe"}

Example success status: 201 Created

4. Update a book

Method: PUT

Path: /books/1

Description: Replaces the details of an existing book.

Example request body: {"title": "Arrow of God", "author": "Chinua Achebe"}

Example success status: 200 OK

5. Delete a book

Method: DELETE

Path: /books/1

Description: Deletes a book by its ID.

Example success status: 204 No Content

6. Find books by author

Method: GET

Path: /books?author=Chinua%20Achebe

Description: Returns books written by the specified author.

Example success status: 200 OK

Error responses

400 Bad Request

Example: POST /books with a missing title.

Description: The request contains invalid or incomplete data.

Example response: {"error": "Title is required"}

404 Not Found

Example: GET /books/999

Description: The requested book does not exist.

Example response: {"error": "Book not found"}