// Ví dụ: Tạo file src/utils/auth.js
import axios from 'axios';

export async function verifyAuthToken() {
  const accessToken = localStorage.getItem('accessToken');

  if (!accessToken) {
    return false; // Không có token
  }

  try {
    // Gửi yêu cầu đến một endpoint được bảo vệ để kiểm tra token.
    // Đây có thể là một endpoint kiểm tra token cụ thể, hoặc đơn giản là một API call bất kỳ
    // mà người dùng đã đăng nhập có quyền truy cập (ví dụ: lấy thông tin người dùng).
    const response = await axios.get('https://localhost:7016/api/User/profile', { // Thay bằng endpoint phù hợp của bạn
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    // Nếu request thành công (ví dụ: status 200), token được coi là hợp lệ
    return response.status === 200;
  } catch (error) {
    // Token không hợp lệ (hết hạn, bị thu hồi, sai định dạng)
    console.error('Token verification failed:', error);
    // Xóa token cũ để buộc người dùng đăng nhập lại
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('tokenExpiresIn');
    localStorage.removeItem('tokenType');
    return false;
  }
}