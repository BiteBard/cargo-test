const cargoList = [
  {
    id: "CARGO001",
    name: "Строительные материалы",
    status: "В пути",
    origin: "Москва",
    destination: "Казань",
    departureDate: "2024-11-24",
  },
  {
    id: "CARGO002",
    name: "Хрупкий груз",
    status: "Ожидает отправки",
    origin: "Санкт-Петербург",
    destination: "Екатеринбург",
    departureDate: "2024-11-26",
  },
];

const statuses = ["Ожидает отправки", "В пути", "Доставлен"];
const cargoTable = document.querySelector(".cargo-table"),
  errorMessage = document.querySelector(".error-message"),
  filter = document.getElementById("filter");

function displayCargoList() {
  cargoTable.innerHTML = "";
  const filteredList = filter.value
    ? cargoList.filter((cargo) => cargo.status === filter.value)
    : cargoList;

  filteredList.forEach((cargo) => {
    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${cargo.id}</td>
        <td>${cargo.name}</td>
        <td class="${getStatusClass(cargo.status)} text-white">${
      cargo.status
    }</td>
        <td>${cargo.origin}</td>
        <td>${cargo.destination}</td>
        <td>${cargo.departureDate}</td>
        <td>
          <select class="form-select" onchange="updateStatus('${
            cargo.id
          }', this.value)">
            ${statuses
              .map(
                (status) =>
                  `<option value="${status}" ${
                    cargo.status === status ? "selected" : ""
                  }>${status}</option>`
              )
              .join("")}
          </select>
        </td>
      `;

    cargoTable.appendChild(row);
  });
}

function getStatusClass(status) {
  switch (status) {
    case "Ожидает отправки":
      return "status-awaiting bg-warning";
    case "В пути":
      return "status-in-transit bg-primary";
    case "Доставлен":
      return "status-delivered bg-success";
    default:
      return "";
  }
}

function updateStatus(id, newStatus) {
  const cargo = cargoList.find((cargo) => cargo.id === id);
  if (newStatus === "Доставлен" && new Date(cargo.departureDate) > new Date()) {
    showError(
      `Груз "${cargo.name}" нельзя пометить как "Доставлен", так как дата отправления в будущем.`
    );
    return;
  }
  cargo.status = newStatus;
  displayCargoList();
  clearError();
}

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.remove("d-none");
}

function clearError() {
  errorMessage.classList.add("d-none");
}

document.getElementById("add-cargo-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("cargo-name").value.trim(),
    origin = document.getElementById("cargo-origin").value,
    destination = document.getElementById("cargo-destination").value,
    departureDate = document.getElementById("cargo-departure-date").value;

  if (!name || !origin || !destination || !departureDate) {
    showError("Заполните все поля формы!");
    return;
  }

  const newId = `CARGO${(cargoList.length + 1).toString().padStart(3, "0")}`;
  cargoList.push({
    id: newId,
    name,
    status: "Ожидает отправки",
    origin,
    destination,
    departureDate,
  });

  displayCargoList();
  e.target.reset();
  clearError();
});

filter.addEventListener("change", displayCargoList);

displayCargoList();
