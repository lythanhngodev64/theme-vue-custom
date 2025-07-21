import { reactive } from 'vue';

// Định nghĩa cấu trúc cho thông tin người dùng
const defaultUserState = {
  username: null,
  maDonVi: null,
  tenDonVi: null,
  diaChi: null
  // Thêm các trường thông tin khác nếu cần
};

// Trạng thái xác thực và thông tin người dùng, có tính phản ứng (reactive)
const authState = reactive({
  isAuthenticated: false,
  user: { ...defaultUserState }, // Khởi tạo với cấu trúc defaultUserState
  token: null, // Để lưu trữ token xác thực
});

// Hàm để cập nhật trạng thái xác thực và thông tin người dùng
export function setAuthenticated(status, userData = null, token = null) {
  authState.isAuthenticated = status;
  authState.token = token;

  if (userData) {
    // Gán thông tin người dùng. Sử dụng Object.assign để giữ reactive link.
    Object.assign(authState.user, { ...defaultUserState, ...userData });
  } else {
    // Reset thông tin người dùng nếu không được cung cấp hoặc đăng xuất
    Object.assign(authState.user, defaultUserState);
  }

  // Lưu trạng thái vào Local Storage để duy trì sau khi tải lại trang
  // [Suy luận] Nên lưu trữ token và một phần thông tin người dùng (không nhạy cảm)
  // để tự động đăng nhập lại hoặc hiển thị thông tin ngay lập tức.
  if (status && token) {
    localStorage.setItem('userToken', token);
    localStorage.setItem('userData', JSON.stringify(userData));
  } else {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
  }
}

// Hàm kiểm tra trạng thái xác thực
export function getAuthenticated() {
  return authState.isAuthenticated;
}

// Hàm lấy thông tin người dùng đã đăng nhập
export function getUser() {
  return authState.user;
}

// Hàm lấy token xác thực
export function getToken() {
  return authState.token;
}

// Hàm xử lý đăng xuất
export function logout() {
  setAuthenticated(false);
}

// Khôi phục trạng thái từ Local Storage khi ứng dụng khởi động
// [Suy luận] Việc này giúp người dùng không phải đăng nhập lại mỗi khi tải lại trang.
const storedToken = localStorage.getItem('userToken');
const storedUserData = localStorage.getItem('userData');
if (storedToken && storedUserData) {
  try {
    const userData = JSON.parse(storedUserData);
    setAuthenticated(true, userData, storedToken);
  } catch (e) {
    console.error('Lỗi khi phân tích dữ liệu người dùng từ localStorage:', e);
    // Xóa dữ liệu lỗi để tránh vấn đề lặp lại
    setAuthenticated(false);
  }
}

export default authState;