<template>
  <div class="p-4 bg-gray-50 min-h-full">
    <h1 class="text-2xl font-bold text-primary-600 mb-6 border-b-2 border-b-primary-600 border-solid">TỔNG QUAN</h1>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <DashboardSummary
        :title="summaryData.budgetPlan.title"
        icon="fas fa-chart-pie"
        :date="summaryData.budgetPlan.date"
        :unit="summaryData.budgetPlan.unit"
      >
        <div class="flex items-center justify-around space-x-4">
          <div class="relative w-40 h-40 flex-shrink-0">
            <div
              class="w-full h-full rounded-full"
              :style="{ background: `conic-gradient(#4f46e5 ${summaryData.budgetPlan.usedPercentage}%, #e5e7eb 0)` }"
            >
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="w-28 h-28 bg-white rounded-full flex items-center justify-center">
                  <div class="text-center">
                    <p class="text-xs text-gray-500">dự toán được giao</p>
                    <p class="text-2xl font-bold text-indigo-700">
                      {{ summaryData.budgetPlan.allocatedBudget.toLocaleString('de-DE') }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="flex-1">
            <div class="flex items-center mb-2">
              <span class="w-3 h-3 bg-indigo-600 rounded-full mr-2"></span>
              <span class="text-sm text-gray-700">Dự toán đã sử dụng: {{ summaryData.budgetPlan.usedPercentage }}%</span>
              <span class="ml-auto font-semibold">{{ summaryData.budgetPlan.usedAmount.toLocaleString('de-DE') }}</span>
            </div>
            <div class="flex items-center">
              <span class="w-3 h-3 bg-gray-300 rounded-full mr-2"></span>
              <span class="text-sm text-gray-700">Dự toán còn lại: {{ 100 - summaryData.budgetPlan.usedPercentage }}%</span>
              <span class="ml-auto font-semibold">{{ summaryData.budgetPlan.remainingAmount.toLocaleString('de-DE') }}</span>
            </div>
          </div>
        </div>
      </DashboardSummary>

      <DashboardSummary
        :title="summaryData.budgetExecution.title"
        icon="fas fa-chart-bar"
        :date="summaryData.budgetExecution.date"
        :unit="summaryData.budgetExecution.unit"
      >
        <div class="h-40 flex items-end justify-around space-x-8 px-4 border-b border-gray-200">
            <div class="text-center">
                <div class="text-lg font-bold text-blue-600">{{ summaryData.budgetExecution.provisional.toLocaleString('de-DE') }}</div>
                <div class="h-16 w-12 bg-blue-500 rounded-t-md"></div>
                <div class="text-xs text-gray-500 mt-1 font-semibold">Sổ tạm ứng</div>
            </div>
             <div class="text-center">
                <div class="text-lg font-bold text-orange-500">0</div>
                <div class="h-2 w-12 bg-orange-400 rounded-t-md"></div>
                <div class="text-xs text-gray-500 mt-1 font-semibold">Sổ phát sinh</div>
            </div>
             <div class="text-center">
                <div class="text-lg font-bold text-green-600">{{ summaryData.budgetExecution.actual.toLocaleString('de-DE') }}</div>
                <div class="h-28 w-12 bg-green-500 rounded-t-md"></div>
                <div class="text-xs text-gray-500 mt-1 font-semibold">Sổ thực chi</div>
            </div>
             <div class="text-center">
                <div class="text-lg font-bold text-gray-700">0</div>
                <div class="h-2 w-12 bg-gray-400 rounded-t-md"></div>
                <div class="text-xs text-gray-500 mt-1 font-semibold">Số dư</div>
            </div>
        </div>
      </DashboardSummary>

      <DashboardSummary
        :title="summaryData.cashBalance.title"
        icon="fas fa-wallet"
        :date="summaryData.cashBalance.date"
        :unit="summaryData.cashBalance.unit"
      >
        <div class="space-y-3">
          <div class="bg-indigo-50 p-3 rounded-lg flex justify-between items-center">
            <div class="flex items-center"><span class="w-3 h-3 bg-indigo-600 rounded-full mr-3"></span><span class="font-bold text-gray-700">Tổng số dư</span></div>
            <span class="font-bold text-lg text-indigo-700">{{ summaryData.cashBalance.totalBalance.toLocaleString('de-DE') }}</span>
          </div>
          <div class="bg-yellow-50 p-3 rounded-lg flex justify-between items-center">
            <div class="flex items-center"><span class="w-3 h-3 bg-yellow-500 rounded-full mr-3"></span><span class="font-bold text-gray-700">Tiền mặt</span></div>
            <span class="font-bold text-lg text-yellow-600">{{ summaryData.cashBalance.cashAmount.toLocaleString('de-DE') }}</span>
          </div>
          <div class="bg-green-50 p-3 rounded-lg flex justify-between items-center">
             <div class="flex items-center"><span class="w-3 h-3 bg-green-500 rounded-full mr-3"></span><span class="font-bold text-gray-700">Tiền gửi</span></div>
            <span class="font-bold text-lg text-green-600">{{ summaryData.cashBalance.bankAmount.toLocaleString('de-DE') }}</span>
          </div>
        </div>
        <div class="mt-4 border-t pt-3 space-y-2">
           <div v-for="account in summaryData.cashBalance.accounts" :key="account.label" class="flex items-center text-sm">
            <span class="w-2.5 h-2.5 rounded-full mr-3" :style="{ backgroundColor: account.color }"></span>
            <span class="text-gray-600">{{ account.label }}:</span>
            <span class="ml-auto font-semibold">{{ account.value.toLocaleString('de-DE') }}</span>
          </div>
        </div>
        <div class="mt-4 text-right">
          <button class="px-4 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-md hover:bg-blue-700 shadow">
            Xem chi tiết
          </button>
        </div>
      </DashboardSummary>

      <DashboardSummary
            :title="summaryData.activityTracking.title"
            icon="fas fa-chart-line"
            :period="summaryData.activityTracking.period"
            :unit="summaryData.activityTracking.unit"
        >
            <div class="grid grid-cols-2 gap-x-6 gap-y-3">
                <div class="flex justify-between items-center text-sm">
                    <div class="flex items-center"><span class="w-3 h-3 bg-cyan-500 rounded-full mr-2"></span>Doanh thu <span class="text-gray-400 ml-1">100%</span></div>
                    <span class="font-bold">{{ summaryData.activityTracking.revenueAmount.toLocaleString('de-DE') }}</span>
                </div>
                <div class="flex justify-between items-center text-sm">
                    <div class="flex items-center"><span class="w-3 h-3 bg-purple-500 rounded-full mr-2"></span>Thặng dư <span class="text-gray-400 ml-1">0%</span></div>
                    <span class="font-bold">{{ summaryData.activityTracking.surplusAmount.toLocaleString('de-DE') }}</span>
                </div>
                <div class="flex justify-between items-center text-sm">
                    <div class="flex items-center"><span class="w-3 h-3 bg-orange-500 rounded-full mr-2"></span>Chi phí <span class="text-gray-400 ml-1">149%</span></div>
                    <span class="font-bold">{{ summaryData.activityTracking.expenseAmount.toLocaleString('de-DE') }}</span>
                </div>
                <div class="flex justify-between items-center text-sm">
                    <div class="flex items-center"><span class="w-3 h-3 bg-red-500 rounded-full mr-2"></span>Thâm hụt <span class="text-gray-400 ml-1">49%</span></div>
                    <span class="font-bold text-red-600">{{ summaryData.activityTracking.deficitAmount.toLocaleString('de-DE') }}</span>
                </div>
            </div>
            <div class="h-32 mt-4 bg-gray-50 rounded-md flex items-end justify-around p-2 border">
                <div class="w-8 bg-cyan-400 rounded-t-sm" :style="{ height: `${(summaryData.activityTracking.revenueAmount / 800) * 100}%` }"></div>
                <div class="w-8 bg-orange-400 rounded-t-sm" :style="{ height: `${(summaryData.activityTracking.expenseAmount / 800) * 100}%` }"></div>
            </div>
        </DashboardSummary>

      <DashboardSummary
            :title="summaryData.revenue.title"
            icon="fas fa-money-bill-wave"
            :period="summaryData.revenue.period"
            :unit="summaryData.revenue.unit"
        >
            <div class="h-48 w-full relative">
                <div class="absolute w-full h-full top-0 left-0 grid grid-rows-4">
                    <div v-for="i in 4" :key="i" class="border-b border-gray-200 border-dashed"></div>
                </div>
                <div class="absolute w-full h-full border-l border-b border-gray-300"></div>

                <div class="absolute w-full h-full top-0 left-0 flex justify-between items-end">
                    <div v-for="(point, index) in summaryData.revenue.chartData" :key="index" class="relative" :style="{ flex: 1 }">
                        <div class="absolute w-3 h-3 bg-purple-600 border-2 border-white rounded-full"
                             :style="{ bottom: `${(point.value / 3500) * 100}%`, left: '50%', transform: 'translate(-50%, 50%)' }">
                        </div>
                        <div v-if="point.label === 'Th3'"
                             class="absolute bg-purple-700 text-white text-xs font-bold px-2 py-1 rounded-md shadow-lg"
                             :style="{ bottom: `${(point.value / 3500) * 100 + 5}%`, left: '50%', transform: 'translateX(-50%)' }">
                            Th3: {{ point.value.toLocaleString('de-DE') }}
                        </div>
                    </div>
                </div>
                 <div class="absolute w-full h-full top-0 left-0 flex items-center justify-center text-gray-300 font-bold text-6xl opacity-20 select-none">SỐ LIỆU MẪU</div>
            </div>
        </DashboardSummary>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import DashboardSummary from '../../components/dashboard/DashboardSummary.vue';
import axios from 'axios'; // Giả sử bạn dùng axios

// --- Dữ liệu khởi tạo (Mock Data) ---
const summaryData = ref({
  budgetPlan: {
    title: 'Tình hình thực hiện kế hoạch ngân sách',
    date: '23/03/2025',
    unit: 'Triệu đồng',
    allocatedBudget: 2548,
    usedAmount: 2548,
    remainingAmount: 449,
    usedPercentage: 85,
  },
  budgetExecution: {
    title: 'Tình hình thực hiện kế hoạch ngân sách',
    date: '23/03/2025',
    unit: 'Triệu đồng',
    provisional: 1875,
    actual: 2654,
  },
  cashBalance: {
    title: 'Số dư tiền mặt, tiền gửi',
    date: '20/03/2025',
    unit: 'Triệu đồng',
    totalBalance: 65000,
    cashAmount: 38000,
    bankAmount: 26000,
    accounts: [
      { label: 'STK 3713.0.1098588', value: 12000, color: '#3b82f6' },
      { label: 'STK 110011968889', value: 10000, color: '#f97316' },
      { label: 'STK 28471927158', value: 4000, color: '#16a34a' },
      { label: 'STK 1598743210', value: 0, color: '#ef4444' },
    ],
  },
  activityTracking: {
    title: 'Theo dõi kết quả hoạt động',
    period: 'Kỳ: Năm 2025',
    unit: 'Triệu đồng',
    revenueAmount: 419,
    expenseAmount: 626,
    surplusAmount: 0,
    deficitAmount: -207,
  },
  revenue: {
    title: 'Doanh thu',
    period: 'Kỳ: Năm 2024',
    unit: 'Triệu đồng',
    chartData: [
      { label: 'Th1', value: 1500 }, { label: 'Th2', value: 1800 }, { label: 'Th3', value: 2178 },
      { label: 'Th4', value: 1900 }, { label: 'Th5', value: 2300 }, { label: 'Th6', value: 2000 },
      { label: 'Th7', value: 2500 }, { label: 'Th8', value: 2200 }, { label: 'Th9', value: 2700 },
      { label: 'Th10', value: 2400 }, { label: 'Th11', value: 2900 }, { label: 'Th12', value: 2600 }
    ]
  }
});

// --- Computed properties ---
const revenuePath = computed(() => {
  const data = summaryData.value.revenue.chartData;
  const maxVal = 3000;
  return data.map((point, i) => `${i},${maxVal - point.value}`).join(' ');
});

// --- CÁC HÀM NẠP DỮ LIỆU TỪ SERVER ---

/**
 * Nạp dữ liệu cho khối "Tình hình thực hiện kế hoạch ngân sách" (biểu đồ tròn).
 */
const fetchBudgetPlanData = async () => {
  try {
    // const response = await axios.get('/api/dashboard/budget-plan');
    // const data = response.data;

    // // Gán dữ liệu từ API vào ref
    // summaryData.value.budgetPlan = {
    //   ...summaryData.value.budgetPlan, // Giữ lại title, unit nếu API không trả về
    //   date: data.date,
    //   allocatedBudget: data.allocatedBudget,
    //   usedAmount: data.usedAmount,
    //   remainingAmount: data.remainingAmount,
    //   usedPercentage: data.usedPercentage,
    // };
    console.log('Đã gọi hàm fetchBudgetPlanData (chưa có API thực tế)');

  } catch (error) {
    console.error('Lỗi khi tải dữ liệu kế hoạch ngân sách:', error);
    // Xử lý lỗi, ví dụ: hiển thị thông báo cho người dùng
  }
};

/**
 * Nạp dữ liệu cho khối "Tình hình thực hiện kế hoạch ngân sách" (biểu đồ cột).
 */
const fetchBudgetExecutionData = async () => {
  try {
    // const response = await axios.get('/api/dashboard/budget-execution');
    // const data = response.data;
    
    // summaryData.value.budgetExecution = {
    //   ...summaryData.value.budgetExecution,
    //   date: data.date,
    //   provisional: data.provisional,
    //   actual: data.actual,
    //   // Cập nhật các giá trị khác nếu có
    // };
    console.log('Đã gọi hàm fetchBudgetExecutionData (chưa có API thực tế)');

  } catch (error) {
    console.error('Lỗi khi tải dữ liệu thực hiện ngân sách:', error);
  }
};

/**
 * Nạp dữ liệu cho khối "Số dư tiền mặt, tiền gửi".
 */
const fetchCashBalanceData = async () => {
  try {
    // const response = await axios.get('/api/dashboard/cash-balance');
    // const data = response.data;

    // summaryData.value.cashBalance = {
    //   ...summaryData.value.cashBalance,
    //   date: data.date,
    //   totalBalance: data.totalBalance,
    //   cashAmount: data.cashAmount,
    //   bankAmount: data.bankAmount,
    //   accounts: data.accounts, // API cần trả về một mảng các tài khoản
    // };
    console.log('Đã gọi hàm fetchCashBalanceData (chưa có API thực tế)');

  } catch (error) {
    console.error('Lỗi khi tải dữ liệu số dư tiền mặt:', error);
  }
};

/**
 * Nạp dữ liệu cho khối "Theo dõi kết quả hoạt động".
 */
const fetchActivityTrackingData = async () => {
  try {
    // const response = await axios.get('/api/dashboard/activity-tracking');
    // const data = response.data;
    
    // summaryData.value.activityTracking = {
    //    ...summaryData.value.activityTracking,
    //    period: data.period,
    //    revenueAmount: data.revenueAmount,
    //    expenseAmount: data.expenseAmount,
    //    surplusAmount: data.surplusAmount,
    //    deficitAmount: data.deficitAmount,
    // };
    console.log('Đã gọi hàm fetchActivityTrackingData (chưa có API thực tế)');

  } catch (error) {
    console.error('Lỗi khi tải dữ liệu kết quả hoạt động:', error);
  }
};

/**
 * Nạp dữ liệu cho khối "Doanh thu".
 */
const fetchRevenueData = async () => {
  try {
    // const response = await axios.get('/api/dashboard/revenue');
    // const data = response.data;
    
    // summaryData.value.revenue = {
    //   ...summaryData.value.revenue,
    //   period: data.period,
    //   chartData: data.chartData, // API cần trả về một mảng dữ liệu cho biểu đồ
    // };
    console.log('Đã gọi hàm fetchRevenueData (chưa có API thực tế)');

  } catch (error) {
    console.error('Lỗi khi tải dữ liệu doanh thu:', error);
  }
};

/**
 * Nạp tất cả dữ liệu cho trang tổng quan.
 */
const loadAllDashboardData = async () => {
  // Gọi tất cả các hàm fetch song song để tăng tốc độ tải trang
  await Promise.all([
    fetchBudgetPlanData(),
    fetchBudgetExecutionData(),
    fetchCashBalanceData(),
    fetchActivityTrackingData(),
    fetchRevenueData()
  ]);
};


// --- Lifecycle Hooks ---
onMounted(() => {
  // Gọi hàm nạp tất cả dữ liệu khi component được tạo
  loadAllDashboardData();
});

</script>

<style scoped>
/* Không cần CSS tùy chỉnh vì đã dùng Tailwind */
</style>