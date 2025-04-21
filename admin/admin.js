import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getDatabase, ref, set, get, onValue } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyCn9oE0KbfTnp5JD8VhuXW-y78xUFH-iRg",
    authDomain: "bai-tap-html.firebaseapp.com",
    databaseURL: "https://bai-tap-html-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "bai-tap-html",
    storageBucket: "bai-tap-html.appspot.com",
    messagingSenderId: "1825688805",
    appId: "1:1825688805:web:0fea5be7f1db7f0339580c",
    measurementId: "G-0QC28N9X9M"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const tableBody = document.getElementById("historyTableBody");
const contactsRef = ref(db, 'contacts');

onValue(contactsRef, (contactsSnapshot) => {
    tableBody.innerHTML = ''; // Clear table

    contactsSnapshot.forEach(careSnapshot => {
        const data = careSnapshot.val();
        const uid = data.userId || 'Không rõ';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${uid}</td>
            <td>${data.description}</td>
            <td>${data.requestType}</td>
            <td>${data.status}</td>
            <td>${new Date(data.timestamp).toLocaleString()}</td>
        `;
        tableBody.appendChild(row);

        // Truy Username từ /users/${uid}/Username
        const userRef = ref(db, `users/${uid}/Username`);
        onValue(userRef, (userSnapshot) => {
            const usernameCell = row.querySelector('.username-cell');
            const username = userSnapshot.exists() ? userSnapshot.val() : 'Không rõ';
            usernameCell.textContent = username;
        }, {
            onlyOnce: true
        });
    });
});
