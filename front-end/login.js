document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");
  const errorMessage = document.getElementById("errorMessage");

  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault(); // Ngăn form reload trang

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
      errorMessage.textContent = "Vui lòng nhập đầy đủ thông tin!";
      return;
    }

    try {
      const response = await fetch(
        "https://cdio0-3.onrender.com/api/v1/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Đăng nhập thành công!");
        localStorage.setItem("accessToken", data.data.access_token);
        window.location.href = "dashboard.html"; // Chuyển hướng sau khi đăng nhập
      } else {
        errorMessage.textContent = data.message || "Đăng nhập thất bại!";
      }
    } catch (error) {
      console.error("Lỗi kết nối:", error);
      errorMessage.textContent = "Lỗi hệ thống! Vui lòng thử lại sau.";
    }
  });
});
