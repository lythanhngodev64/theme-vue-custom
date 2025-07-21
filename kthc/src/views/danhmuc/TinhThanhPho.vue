<template>
  <div class="coloum-12">
      <NtsSidebarVertical />
  </div>
  <div class="coloum-9">
    <div class="p-6">
        <h1 class="text-2xl font-bold mb-4">Danh sách Sản phẩm</h1>

        <NtsGrid
        :columns="columnsTinhThanhPho"
        :data="dataGridTinhThanhPho"
        :show-footer="true"
        :total-columns="['price', 'quantity']"
        :frozen-rows="[0, 1]"
        class="max-h-[600px]"
        />
    </div>
  </div>

</template>

<script>
import NtsGrid from '@/components/layout/NtsGrid.vue'; // Thay đổi đường dẫn cho phù hợp
import NtsSidebarVertical from '@/components/layout/NtsSidebarVertical.vue';

export default {
  components: {
    NtsGrid,
    NtsSidebarVertical
  },
  data() {
    return {
      columnsTinhThanhPho: [
        { field: 'TinhID', header: 'ID' /*, frozen: 'left'*/ },
        { field: 'TenTinh', header: 'Tên tỉnh', align: 'left' },
        { field: 'TenVietTat', header: 'Viết tắt', align: 'left' },
        { field: 'DienGiai', header: 'Diễn giải', align: 'right' },
        { field: 'DangSD', header: 'Đang sử dụng', align: 'center' },
      ],
      dataGridTinhThanhPho: [
        { "TinhID": 1, "TenTinh": "Hà Nội", "TenVietTat": "HN", "DienGiai": "Thủ đô của Việt Nam", "DangSD": true },
        { "TinhID": 2, "TenTinh": "Hồ Chí Minh", "TenVietTat": "HCM", "DienGiai": "Thành phố lớn nhất Việt Nam", "DangSD": true },
        { "TinhID": 3, "TenTinh": "Đà Nẵng", "TenVietTat": "ĐN", "DienGiai": "Thành phố trực thuộc trung ương", "DangSD": true },
        { "TinhID": 4, "TenTinh": "Hải Phòng", "TenVietTat": "HP", "DienGiai": "Thành phố cảng", "DangSD": true },
        { "TinhID": 5, "TenTinh": "Cần Thơ", "TenVietTat": "CT", "DienGiai": "Thành phố trung tâm Đồng bằng sông Cửu Long", "DangSD": true },
        { "TinhID": 6, "TenTinh": "An Giang", "TenVietTat": "AG", "DienGiai": "Tỉnh thuộc Đồng bằng sông Cửu Long", "DangSD": true },
        { "TinhID": 7, "TenTinh": "Bà Rịa - Vũng Tàu", "TenVietTat": "BRVT", "DienGiai": "Tỉnh thuộc vùng Đông Nam Bộ", "DangSD": true },
        { "TinhID": 8, "TenTinh": "Bắc Giang", "TenVietTat": "BG", "DienGiai": "Tỉnh thuộc vùng Đông Bắc", "DangSD": true },
        { "TinhID": 9, "TenTinh": "Bắc Kạn", "TenVietTat": "BK", "DienGiai": "Tỉnh thuộc vùng Đông Bắc", "DangSD": true },
        { "TinhID": 10, "TenTinh": "Bạc Liêu", "TenVietTat": "BL", "DienGiai": "Tỉnh thuộc Đồng bằng sông Cửu Long", "DangSD": true },
        { "TinhID": 11, "TenTinh": "Bắc Ninh", "TenVietTat": "BN", "DienGiai": "Tỉnh thuộc vùng Đồng bằng sông Hồng", "DangSD": true },
        { "TinhID": 12, "TenTinh": "Bến Tre", "TenVietTat": "BT", "DienGiai": "Tỉnh thuộc Đồng bằng sông Cửu Long", "DangSD": true },
        { "TinhID": 13, "TenTinh": "Bình Định", "TenVietTat": "BĐ", "DienGiai": "Tỉnh thuộc vùng Duyên hải Nam Trung Bộ", "DangSD": true },
        { "TinhID": 14, "TenTinh": "Bình Dương", "TenVietTat": "BD", "DienGiai": "Tỉnh thuộc vùng Đông Nam Bộ", "DangSD": true },
        { "TinhID": 15, "TenTinh": "Bình Phước", "TenVietTat": "BP", "DienGiai": "Tỉnh thuộc vùng Đông Nam Bộ", "DangSD": true },
        { "TinhID": 16, "TenTinh": "Bình Thuận", "TenVietTat": "BT", "DienGiai": "Tỉnh thuộc vùng Duyên hải Nam Trung Bộ", "DangSD": true },
        { "TinhID": 17, "TenTinh": "Cà Mau", "TenVietTat": "CM", "DienGiai": "Tỉnh cực Nam của Việt Nam", "DangSD": true },
        { "TinhID": 18, "TenTinh": "Cao Bằng", "TenVietTat": "CB", "DienGiai": "Tỉnh thuộc vùng Đông Bắc", "DangSD": true },
        { "TinhID": 19, "TenTinh": "Đắk Lắk", "TenVietTat": "ĐL", "DienGiai": "Tỉnh thuộc vùng Tây Nguyên", "DangSD": true },
        { "TinhID": 20, "TenTinh": "Đắk Nông", "TenVietTat": "ĐN", "DienGiai": "Tỉnh thuộc vùng Tây Nguyên", "DangSD": true },
        { "TinhID": 21, "TenTinh": "Điện Biên", "TenVietTat": "ĐB", "DienGiai": "Tỉnh thuộc vùng Tây Bắc", "DangSD": true },
        { "TinhID": 22, "TenTinh": "Đồng Nai", "TenVietTat": "ĐN", "DienGiai": "Tỉnh thuộc vùng Đông Nam Bộ", "DangSD": true },
        { "TinhID": 23, "TenTinh": "Đồng Tháp", "TenVietTat": "ĐT", "DienGiai": "Tỉnh thuộc Đồng bằng sông Cửu Long", "DangSD": true },
        { "TinhID": 24, "TenTinh": "Gia Lai", "TenVietTat": "GL", "DienGiai": "Tỉnh thuộc vùng Tây Nguyên", "DangSD": true },
        { "TinhID": 25, "TenTinh": "Hà Giang", "TenVietTat": "HG", "DienGiai": "Tỉnh thuộc vùng Đông Bắc", "DangSD": true },
        { "TinhID": 26, "TenTinh": "Hà Nam", "TenVietTat": "HN", "DienGiai": "Tỉnh thuộc vùng Đồng bằng sông Hồng", "DangSD": true },
        { "TinhID": 27, "TenTinh": "Hà Tĩnh", "TenVietTat": "HT", "DienGiai": "Tỉnh thuộc vùng Bắc Trung Bộ", "DangSD": true },
        { "TinhID": 28, "TenTinh": "Hải Dương", "TenVietTat": "HD", "DienGiai": "Tỉnh thuộc vùng Đồng bằng sông Hồng", "DangSD": true },
        { "TinhID": 29, "TenTinh": "Hậu Giang", "TenVietTat": "HG", "DienGiai": "Tỉnh thuộc Đồng bằng sông Cửu Long", "DangSD": true },
        { "TinhID": 30, "TenTinh": "Hòa Bình", "TenVietTat": "HB", "DienGiai": "Tỉnh thuộc vùng Tây Bắc", "DangSD": true },
        { "TinhID": 31, "TenTinh": "Hưng Yên", "TenVietTat": "HY", "DienGiai": "Tỉnh thuộc vùng Đồng bằng sông Hồng", "DangSD": true },
        { "TinhID": 32, "TenTinh": "Khánh Hòa", "TenVietTat": "KH", "DienGiai": "Tỉnh thuộc vùng Duyên hải Nam Trung Bộ", "DangSD": true },
        { "TinhID": 33, "TenTinh": "Kiên Giang", "TenVietTat": "KG", "DienGiai": "Tỉnh thuộc Đồng bằng sông Cửu Long", "DangSD": true },
        { "TinhID": 34, "TenTinh": "Kon Tum", "TenVietTat": "KT", "DienGiai": "Tỉnh thuộc vùng Tây Nguyên", "DangSD": true },
        { "TinhID": 35, "TenTinh": "Lai Châu", "TenVietTat": "LC", "DienGiai": "Tỉnh thuộc vùng Tây Bắc", "DangSD": true },
        { "TinhID": 36, "TenTinh": "Lâm Đồng", "TenVietTat": "LĐ", "DienGiai": "Tỉnh thuộc vùng Tây Nguyên", "DangSD": true },
        { "TinhID": 37, "TenTinh": "Lạng Sơn", "TenVietTat": "LS", "DienGiai": "Tỉnh thuộc vùng Đông Bắc", "DangSD": true },
        { "TinhID": 38, "TenTinh": "Lào Cai", "TenVietTat": "LC", "DienGiai": "Tỉnh thuộc vùng Tây Bắc", "DangSD": true },
        { "TinhID": 39, "TenTinh": "Long An", "TenVietTat": "LA", "DienGiai": "Tỉnh thuộc Đồng bằng sông Cửu Long", "DangSD": true },
        { "TinhID": 40, "TenTinh": "Nam Định", "TenVietTat": "NĐ", "DienGiai": "Tỉnh thuộc vùng Đồng bằng sông Hồng", "DangSD": true },
        { "TinhID": 41, "TenTinh": "Nghệ An", "TenVietTat": "NA", "DienGiai": "Tỉnh thuộc vùng Bắc Trung Bộ", "DangSD": true },
        { "TinhID": 42, "TenTinh": "Ninh Bình", "TenVietTat": "NB", "DienGiai": "Tỉnh thuộc vùng Đồng bằng sông Hồng", "DangSD": true },
        { "TinhID": 43, "TenTinh": "Ninh Thuận", "TenVietTat": "NT", "DienGiai": "Tỉnh thuộc vùng Duyên hải Nam Trung Bộ", "DangSD": true },
        { "TinhID": 44, "TenTinh": "Phú Thọ", "TenVietTat": "PT", "DienGiai": "Tỉnh thuộc vùng Đông Bắc", "DangSD": true },
        { "TinhID": 45, "TenTinh": "Phú Yên", "TenVietTat": "PY", "DienGiai": "Tỉnh thuộc vùng Duyên hải Nam Trung Bộ", "DangSD": true },
        { "TinhID": 46, "TenTinh": "Quảng Bình", "TenVietTat": "QB", "DienGiai": "Tỉnh thuộc vùng Bắc Trung Bộ", "DangSD": true },
        { "TinhID": 47, "TenTinh": "Quảng Nam", "TenVietTat": "QN", "DienGiai": "Tỉnh thuộc vùng Duyên hải Nam Trung Bộ", "DangSD": true },
        { "TinhID": 48, "TenTinh": "Quảng Ngãi", "TenVietTat": "QNg", "DienGiai": "Tỉnh thuộc vùng Duyên hải Nam Trung Bộ", "DangSD": true },
        { "TinhID": 49, "TenTinh": "Quảng Ninh", "TenVietTat": "QN", "DienGiai": "Tỉnh thuộc vùng Đông Bắc", "DangSD": true },
        { "TinhID": 50, "TenTinh": "Quảng Trị", "TenVietTat": "QT", "DienGiai": "Tỉnh thuộc vùng Bắc Trung Bộ", "DangSD": true },
        { "TinhID": 51, "TenTinh": "Sóc Trăng", "TenVietTat": "ST", "DienGiai": "Tỉnh thuộc Đồng bằng sông Cửu Long", "DangSD": true },
        { "TinhID": 52, "TenTinh": "Sơn La", "TenVietTat": "SL", "DienGiai": "Tỉnh thuộc vùng Tây Bắc", "DangSD": true },
        { "TinhID": 53, "TenTinh": "Tây Ninh", "TenVietTat": "TN", "DienGiai": "Tỉnh thuộc vùng Đông Nam Bộ", "DangSD": true },
        { "TinhID": 54, "TenTinh": "Thái Bình", "TenVietTat": "TB", "DienGiai": "Tỉnh thuộc vùng Đồng bằng sông Hồng", "DangSD": true },
        { "TinhID": 55, "TenTinh": "Thái Nguyên", "TenVietTat": "TN", "DienGiai": "Tỉnh thuộc vùng Đông Bắc", "DangSD": true },
        { "TinhID": 56, "TenTinh": "Thanh Hóa", "TenVietTat": "TH", "DienGiai": "Tỉnh thuộc vùng Bắc Trung Bộ", "DangSD": true },
        { "TinhID": 57, "TenTinh": "Thừa Thiên Huế", "TenVietTat": "TTH", "DienGiai": "Tỉnh thuộc vùng Bắc Trung Bộ", "DangSD": true },
        { "TinhID": 58, "TenTinh": "Tiền Giang", "TenVietTat": "TG", "DienGiai": "Tỉnh thuộc Đồng bằng sông Cửu Long", "DangSD": true },
        { "TinhID": 59, "TenTinh": "Thái Nguyên", "TenVietTat": "TN", "DienGiai": "Tỉnh thuộc vùng Đông Bắc", "DangSD": true },
        { "TinhID": 60, "TenTinh": "Trà Vinh", "TenVietTat": "TV", "DienGiai": "Tỉnh thuộc Đồng bằng sông Cửu Long", "DangSD": true },
        { "TinhID": 61, "TenTinh": "Tuyên Quang", "TenVietTat": "TQ", "DienGiai": "Tỉnh thuộc vùng Đông Bắc", "DangSD": true },
        { "TinhID": 62, "TenTinh": "Vĩnh Long", "TenVietTat": "VL", "DienGiai": "Tỉnh thuộc Đồng bằng sông Cửu Long", "DangSD": true },
        { "TinhID": 63, "TenTinh": "Vĩnh Phúc", "TenVietTat": "VP", "DienGiai": "Tỉnh thuộc vùng Đồng bằng sông Hồng", "DangSD": true },
        { "TinhID": 64, "TenTinh": "Yên Bái", "TenVietTat": "YB", "DienGiai": "Tỉnh thuộc vùng Tây Bắc", "DangSD": true }
    ]
    };
  }
}
</script>