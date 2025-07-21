<template>
  <div class="w-64 bg-gray-800 text-white min-h-screen">
    <div class="p-4 text-2xl font-bold border-b border-gray-700">
      Dashboard
    </div>
    <nav class="mt-4">
      <ul class="text-left">
        <MenuItem
          v-for="item in menuItems"
          :key="item.name"
          :item="item"
          :level="1"
          :active-menu="activeMenu"
          @toggle-menu="toggleMenu"
        />
      </ul>
    </nav>
  </div>
</template>

<script>
import MenuItem from './MenuItem.vue'; // Import component MenuItem

export default {
  name: 'NtsSidebarVertical',
  components: {
    MenuItem // Đăng ký component con
  },
  data() {
    return {
      activeMenu: [], // Mảng lưu trữ các menu đang mở
      menuItems: [
        {
          label: 'Tổng quan',
          name: 'tongQuan',
          path: '/tong-quan'
        },
        {
          label: 'Quản lý',
          name: 'quanLy',
          children: [
            {
              label: 'Người dùng',
              name: 'nguoiDung',
              path: '/quan-ly/nguoi-dung'
            },
            {
              label: 'Sản phẩm',
              name: 'sanPham',
              children: [
                {
                  label: 'Danh sách sản phẩm',
                  name: 'danhSachSanPham',
                  path: '/quan-ly/san-pham/danh-sach'
                },
                {
                  label: 'Thêm sản phẩm mới',
                  name: 'themSanPhamMoi',
                  path: '/quan-ly/san-pham/them-moi'
                },
                {
                  label: 'Kho hàng',
                  name: 'khoHang',
                  children: [
                    {
                      label: 'Tồn kho',
                      name: 'tonKho',
                      path: '/quan-ly/san-pham/kho-hang/ton-kho'
                    },
                    {
                      label: 'Nhập xuất',
                      name: 'nhapXuat',
                      children: [
                        {
                          label: 'Phiếu nhập',
                          name: 'phieuNhap',
                          path: '/quan-ly/san-pham/kho-hang/nhap-xuat/phieu-nhap'
                        },
                        {
                          label: 'Phiếu xuất',
                          name: 'phieuXuat',
                          path: '/quan-ly/san-pham/kho-hang/nhap-xuat/phieu-xuat'
                        },
                        {
                          label: 'Thống kê tồn kho',
                          name: 'thongKeTonKho',
                          children: [
                            {
                              label: 'Theo ngày',
                              name: 'theoNgay',
                              path: '/quan-ly/san-pham/kho-hang/nhap-xuat/thong-ke-ton-kho/theo-ngay'
                            },
                            {
                              label: 'Theo tháng',
                              name: 'theoThang',
                              path: '/quan-ly/san-pham/kho-hang/nhap-xuat/thong-ke-ton-kho/theo-thang'
                            },
                            {
                              label: 'Báo cáo chi tiết',
                              name: 'baoCaoChiTiet',
                              children: [
                                {
                                  label: 'Theo loại sản phẩm',
                                  name: 'theoLoaiSanPham',
                                  path: '/quan-ly/san-pham/kho-hang/nhap-xuat/thong-ke-ton-kho/bao-cao-chi-tiet/theo-loai-san-pham'
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          label: 'Báo cáo',
          name: 'baoCao',
          children: [
            {
              label: 'Doanh thu',
              name: 'doanhThu',
              path: '/bao-cao/doanh-thu'
            },
            {
              label: 'Lợi nhuận',
              name: 'loiNhuan',
              path: '/bao-cao/loi-nhuan'
            }
          ]
        },
        {
          label: 'Cài đặt',
          name: 'caiDat',
          path: '/cai-dat'
        }
      ]
    };
  },
  methods: {
    toggleMenu(menuName) {
      const index = this.activeMenu.indexOf(menuName);
      if (index > -1) {
        this.activeMenu.splice(index, 1); // Đóng menu nếu đã mở
      } else {
        this.activeMenu.push(menuName); // Mở menu nếu chưa mở
      }
    }
  }
}
</script>

<style scoped>
/* Có thể thêm các style tùy chỉnh nếu cần, nhưng Tailwind đã xử lý phần lớn */
</style>