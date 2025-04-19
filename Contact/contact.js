let currentUser = null;
let customerId = null;

auth.onAuthStateChanged(async (user) => {
    if (user) {
        currentUser = user;
        const snapshot = await database.ref("users/" + user.uid).get();
        if (snapshot.exists()) {
            customerId = snapshot.val().customerId;
            document.getElementById("customerId").value = customerId;
            loadHistory(currentUser.uid);
        } else {
            alert("Không tìm thấy thông tin khách hàng!");
        }
    }
});

document.getElementById("care-request-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!currentUser || !customerId) {
        alert("Vui lòng đăng nhập trước khi gửi yêu cầu.");
        return;
    }

    const requestType = document.getElementById("requestType").value;
    const description = document.getElementById("description").value;
    const createdAt = new Date().toISOString();

    const snapshot = await database.ref("contacts").once("value");
    const count = snapshot.exists() ? snapshot.size : 0;
    const idCare = 1000 + count;

    const newContact = {
        idCare: idCare,
        userId: currentUser.uid,
        customerId: customerId,
        type: requestType,
        description: description,
        status: "pending",
        createdAt: createdAt
    };

    try {
        await database.ref("contacts").push(newContact);
        alert("Gửi yêu cầu thành công!");
        document.getElementById("care-request-form").reset();
        loadHistory(currentUser.uid);
    } catch (error) {
        console.error("Lỗi khi gửi yêu cầu:", error);
        alert("Gửi yêu cầu thất bại!");
    }
});

// Load lịch sử yêu cầu
async function loadHistory(uid) {
    const historyBody = document.getElementById("history-body");
    const noHistoryMessage = document.getElementById("no-history-message");
    const historyTable = document.getElementById("history-table");

    historyBody.innerHTML = "";
    noHistoryMessage.style.display = "none";
    historyTable.style.display = "none";

    const snapshot = await database.ref("contacts").orderByChild("userId").equalTo(uid).once("value");

    if (snapshot.exists()) {
        snapshot.forEach((child) => {
            const data = child.val();
            const row = `
          <tr>
            <td>${data.customerId}</td>
            <td>${data.type}</td>
            <td>${new Date(data.createdAt).toLocaleString()}</td>
            <td>${data.status}</td>
          </tr>
        `;
            historyBody.innerHTML += row;
        });
        historyTable.style.display = "block";
    } else {
        noHistoryMessage.style.display = "block";
    }
}

// Khi nhấn vào nút "Xem lịch sử chăm sóc"
document.getElementById("toggle-history-btn").addEventListener("click", () => {
    const section = document.getElementById("history-section");
    section.style.display = section.style.display === "none" ? "block" : "none";
});
// Lắng nghe thay đổi trong Firebase (Realtime Database)
database.ref('contacts').on('child_changed', (snapshot) => {
    const updatedData = snapshot.val();
    const updatedContactId = snapshot.key;

    const rows = document.querySelectorAll("#history-table tbody tr");
    rows.forEach(row => {
        const customerIdCell = row.cells[0];
        const statusCell = row.cells[3];

        // Kiểm tra nếu là yêu cầu của user này
        if (customerIdCell && customerIdCell.textContent === updatedData.customerId) {
            statusCell.textContent = updatedData.status;
        }
    });
});
