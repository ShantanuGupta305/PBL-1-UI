const loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const tickets = JSON.parse(localStorage.getItem('tickets')) || [];

  // Populate aggregate tables
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

  // Populate logged user data into update form
  document.getElementById('update-email').value = loggedUser?.email || '';
  document.getElementById('update-mobile').value = loggedUser?.mobile || '';

  // Load booked tickets for the logged user
  function loadTickets() {
    const userTickets = tickets.filter(ticket => ticket.aadhaar === loggedUser.aadhaar);
    const ticketsList = document.getElementById('tickets-list');
    ticketsList.innerHTML = '';

    if (userTickets.length > 0) {
      userTickets.forEach(ticket => {
        const div = document.createElement('div');
        div.innerHTML = `
          <p><strong>Ticket ID:</strong> ${ticket.ticket_id}</p>
          <p><strong>Train ID:</strong> ${ticket.train_id}</p>
          <p><strong>Aadhaar:</strong> ${ticket.aadhaar}</p>
          <p><strong>Username:</strong> ${ticket.username}</p>
          <p><strong>Boarding Station:</strong> ${ticket.boarding}</p>
          <p><strong>Destination Station:</strong> ${ticket.destination}</p>
          <p><strong>Number of Tickets:</strong> ${ticket.numberOfTickets}</p>
          <button onclick="cancelTicket('${ticket.ticket_id}')">Cancel Ticket</button>
          <hr>
        `;
        ticketsList.appendChild(div);
      });
    } else {
      ticketsList.innerHTML = '<p>No tickets booked.</p>';
    }
  }

  // Cancel ticket
  function cancelTicket(ticketId) {
    const updatedTickets = tickets.filter(ticket => ticket.ticket_id !== ticketId);
    localStorage.setItem('tickets', JSON.stringify(updatedTickets));
    loadTickets();
    populateAggregates();
  }

  // Toggle password fields visibility
  function togglePasswordFields() {
    const passwordFields = document.getElementById('password-fields');
    passwordFields.classList.toggle('hidden');
  }

  // Update user details
  function updateDetails() {
    const email = document.getElementById('update-email').value;
    const mobile = document.getElementById('update-mobile').value;
    const updatePassword = document.getElementById('update-password-toggle').checked;

    if (updatePassword) {
      const currentPassword = document.getElementById('current-password').value;
      const newPassword = document.getElementById('new-password').value;
      const confirmNewPassword = document.getElementById('confirm-new-password').value;

      if (newPassword !== confirmNewPassword) {
        alert('New password and confirm password do not match.');
        return;
      }

      if (!/^.*(?=.{8,})(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$/.test(newPassword)) {
        alert('New password must meet the required criteria.');
        return;
      }

      if (loggedUser.password !== currentPassword) {
        alert('Current password is incorrect.');
        return;
      }

      loggedUser.password = newPassword;
    }

    loggedUser.email = email;
    loggedUser.mobile = mobile;

    const userIndex = users.findIndex(user => user.username === loggedUser.username);
    if (userIndex !== -1) {
      users[userIndex] = loggedUser;
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('loggedUser', JSON.stringify(loggedUser));
      alert('Details updated successfully!');
    } else {
      alert('Error updating user details.');
    }
  }

  // Log out
  function logout() {
    localStorage.removeItem('loggedUser');
    window.location.href = 'login.html';
  }

  // Load tickets on page load
  loadTickets();
  populateAggregates();