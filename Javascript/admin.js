const users = JSON.parse(localStorage.getItem('users')) || [];
  const tickets = JSON.parse(localStorage.getItem('tickets')) || [];
  const trains = JSON.parse(localStorage.getItem('trains')) || [];

  function populateAggregates() {
    const categoryCounts = { 'AC-1': 0, 'AC-2': 0, 'AC-3': 0 };
    const quarterCounts = { 'Q1': 0, 'Q2': 0, 'Q3': 0, 'Q4': 0 };

    tickets.forEach(ticket => {
      categoryCounts[ticket.category] = (categoryCounts[ticket.category] || 0) + ticket.numberOfTickets;
      const month = new Date(ticket.date).getMonth() + 1;
      if (month <= 3) quarterCounts['Q1']++;
      else if (month <= 6) quarterCounts['Q2']++;
      else if (month <= 9) quarterCounts['Q3']++;
      else quarterCounts['Q4']++;
    });

    // Populate category table
    const categoryTableBody = document.querySelector('#category-table tbody');
    categoryTableBody.innerHTML = '';
    for (const [category, count] of Object.entries(categoryCounts)) {
      const row = `<tr><td>${category}</td><td>${count}</td></tr>`;
      categoryTableBody.innerHTML += row;
    }

    // Populate quarter table
    const quarterTableBody = document.querySelector('#quarter-table tbody');
    quarterTableBody.innerHTML = '';
    for (const [quarter, count] of Object.entries(quarterCounts)) {
      const row = `<tr><td>${quarter}</td><td>${count}</td></tr>`;
      quarterTableBody.innerHTML += row;
    }
  }

  function loadClients() {
    const clientsTableBody = document.querySelector('#clients-table tbody');
    clientsTableBody.innerHTML = '';

    users.forEach(user => {
      const userTickets = tickets.filter(ticket => ticket.aadhaar === user.aadhaar);
      const row = `
        <tr>
          <td>${user.aadhaar}</td>
          <td>${user.username}</td>
          <td>${user.mobile}</td>
          <td>${userTickets.length}</td>
          <td><button onclick="deleteUser('${user.username}')">Delete</button></td>
        </tr>
      `;
      clientsTableBody.innerHTML += row;
    });
  }

  function deleteUser(username) {
    const updatedUsers = users.filter(user => user.username !== username);
    const updatedTickets = tickets.filter(ticket => ticket.username !== username);

    localStorage.setItem('users', JSON.stringify(updatedUsers));
    localStorage.setItem('tickets', JSON.stringify(updatedTickets));
    loadClients();
    populateAggregates();
  }

  function registerTrain() {
    const trainName = document.getElementById('train-name').value;
    const trainId = document.getElementById('train-id').value;
    const boarding = document.getElementById('boarding').value;
    const destination = document.getElementById('destination').value;

    const newTrain = { trainName, train_id: trainId, boarding, destination };
    trains.push(newTrain);
    localStorage.setItem('trains', JSON.stringify(trains));
    alert('Train registered successfully!');
  }

  function populateAdminDetails() {
    const username = document.getElementById('admin-username').value;
    const admin = users.find(user => user.username === username);

    if (admin) {
      document.getElementById('admin-email').value = admin.email;
      document.getElementById('admin-mobile').value = admin.mobile;
    }
  }

  function updateAdminDetails() {
    const username = document.getElementById('admin-username').value;
    const email = document.getElementById('admin-email').value;
    const mobile = document.getElementById('admin-mobile').value;
    const updatePassword = document.getElementById('update-password-toggle').checked;

    const admin = users.find(user => user.username === username);
    if (admin) {
      if (updatePassword) {
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmNewPassword = document.getElementById('confirm-new-password').value;

        if (newPassword !== confirmNewPassword) {
          alert('New password and confirm password do not match.');
          return;
        }

        if (admin.password !== currentPassword) {
          alert('Current password is incorrect.');
          return;
        }

        admin.password = newPassword;
      }

      admin.email = email;
      admin.mobile = mobile;

      localStorage.setItem('users', JSON.stringify(users));
      alert('Admin details updated successfully!');
    }
  }

  function moveToLoginPage() {
    window.location.href = 'login.html';
  }

  // Initialize page
  function initPage() {
    populateAggregates();
    loadClients();

    const adminUsernameSelect = document.getElementById('admin-username');
    adminUsernameSelect.innerHTML = '';
    users.forEach(user => {
      const option = document.createElement('option');
      option.value = user.username;
      option.textContent = user.username;
      adminUsernameSelect.appendChild(option);
    });

    if (users.length > 0) populateAdminDetails();
  }

  initPage();