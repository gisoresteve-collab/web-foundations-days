const loadButton = document.getElementById("load-users");
const filterInput = document.getElementById("filter-input");
const statusMessage = document.getElementById("status");
const usersList = document.getElementById("users-list");

let users = [];

async function loadUsers() {
  statusMessage.textContent = "Loading users...";
  loadButton.disabled = true;

  try {
    const response = await fetch(
      "https://jsonplaceholder.typicode.com/users"
    );

    if (!response.ok) {
      throw new Error("Failed to load users.");
    }

    users = await response.json();

    renderUsers(users);
    statusMessage.textContent = `Loaded ${users.length} users successfully.`;
  } catch (error) {
    statusMessage.textContent = "Unable to load users. Please try again.";
    console.error("Error loading users:", error);
  } finally {
    loadButton.disabled = false;
  }
}

function renderUsers(userList) {
  usersList.textContent = "";

  if (userList.length === 0) {
    statusMessage.textContent = "No users match your filter.";
    return;
  }

  userList.forEach((user) => {
    const listItem = document.createElement("li");
    const name = document.createElement("h2");
    const email = document.createElement("p");
    const city = document.createElement("p");
    const company = document.createElement("p");

    name.textContent = user.name;
    email.textContent = `Email: ${user.email}`;
    city.textContent = `City: ${user.address.city}`;
    company.textContent = `Company: ${user.company.name}`;

    listItem.append(name, email, city, company);
    usersList.appendChild(listItem);
  });
}

loadButton.addEventListener("click", loadUsers);

filterInput.addEventListener("input", () => {
  const searchText = filterInput.value.toLowerCase();

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchText)
  );

  renderUsers(filteredUsers);
});