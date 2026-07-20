let socket = null;

const tokenInput = document.getElementById("token");
const status = document.getElementById("status");
const socketId = document.getElementById("socketId");
const notifications = document.getElementById("notifications");

document.getElementById("connectBtn").addEventListener("click", connectSocket);

document.getElementById("disconnectBtn").addEventListener("click", disconnectSocket);

document.getElementById("clearBtn").addEventListener("click", () => {
        notifications.innerHTML = "";
    });

function connectSocket() {
    if (socket && socket.connected) {
        alert("Already connected.");
        return;
    }

    const token = tokenInput.value.trim();
    if (!token) {
        alert("Please paste a JWT token.");
        return;
    }

    socket = io({auth: { token } });

    socket.on("connect", () => {
        status.textContent = "Connected";
        socketId.textContent = socket.id;
        appendNotification({
            type: "SYSTEM",
            message: "Socket connected.",
            data: {},
        });
    });

    socket.on("disconnect", () => {
        status.textContent = "Disconnected";
        socketId.textContent = "-";
        appendNotification({
            type: "SYSTEM",
            message: "Socket disconnected.",
            data: {},
        });
    });

    socket.on("connect_error", (err) => {
        status.textContent = "Connection Failed";
        appendNotification({
            type: "ERROR",
            message: err.message,
            data: {},
        });
    });

    socket.on("notification", (notification) => {
        console.log("========== NOTIFICATION ==========");
        console.log(notification);
        appendNotification(notification);
    });

}

function disconnectSocket() {
    if (!socket) return;
    socket.disconnect();
}

function appendNotification(notification) {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = `
        <hr>
        <p><strong>Time:</strong> ${new Date().toLocaleTimeString()}</p>
        <p><strong>Type:</strong> ${notification.type}</p>
        <p><strong>Message:</strong></p>
        <pre>${notification.message}</pre>
        <p><strong>Data:</strong></p>
        <pre>${JSON.stringify(notification.data || {}, null, 2)}</pre>
    `;
    notifications.appendChild(wrapper);
    window.scrollTo(0, document.body.scrollHeight);
}