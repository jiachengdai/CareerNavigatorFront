<template>
  <div class="job-tracking">
    <h2>职位追踪</h2>
    <!-- 筛选和排序控件 -->
    <div class="filters">
      <label for="status-filter">状态筛选:</label>
      <select v-model="selectedStatus" @change="filterJobs">
        <option value="all">全部</option>
        <option value="applied">已申请</option>
        <option value="interviewing">面试中</option>
        <option value="offered">已获 offer</option>
        <option value="rejected">已拒绝</option>
      </select>
      <label for="sort-order">排序:</label>
      <select v-model="sortOrder" @change="sortJobs">
        <option value="dateAppliedAsc">申请日期升序</option>
        <option value="dateAppliedDesc">申请日期降序</option>
      </select>
    </div>
    <!-- 职位列表 -->
    <table>
      <thead>
      <tr>
        <th>职位名称</th>
        <th>公司名称</th>
        <th>申请日期</th>
        <th>状态</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="job in filteredJobs" :key="job.id">
        <td>{{ job.title }}</td>
        <td>{{ job.company }}</td>
        <td>{{ job.dateApplied }}</td>
        <td>{{ job.status }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// 模拟职位数据
const jobs = ref([
  {
    id: 1,
    title: '前端开发工程师',
    company: 'ABC 科技',
    dateApplied: '2025-05-01',
    status: 'applied'
  },
  {
    id: 2,
    title: '后端开发工程师',
    company: 'XYZ 公司',
    dateApplied: '2025-05-02',
    status: 'interviewing'
  },
  {
    id: 3,
    title: '测试工程师',
    company: '123 软件',
    dateApplied: '2025-05-03',
    status: 'offered'
  },
  {
    id: 4,
    title: '产品经理',
    company: 'DEF 集团',
    dateApplied: '2025-05-04',
    status: 'rejected'
  }
]);

// 筛选状态
const selectedStatus = ref('all');
// 排序顺序
const sortOrder = ref('dateAppliedAsc');

// 计算筛选和排序后的职位列表
const filteredJobs = computed(() => {
  let filtered = jobs.value;
  // 筛选逻辑
  if (selectedStatus.value!== 'all') {
    filtered = filtered.filter(job => job.status === selectedStatus.value);
  }
  // 排序逻辑
  if (sortOrder.value === 'dateAppliedAsc') {
    filtered.sort((a, b) => new Date(a.dateApplied) - new Date(b.dateApplied));
  } else if (sortOrder.value === 'dateAppliedDesc') {
    filtered.sort((a, b) => new Date(b.dateApplied) - new Date(a.dateApplied));
  }
  return filtered;
});

// 筛选职位
const filterJobs = () => {
  // 筛选时自动重新计算 filteredJobs
};

// 排序职位
const sortJobs = () => {
  // 排序时自动重新计算 filteredJobs
};
</script>

<style scoped>
.job-tracking {
  padding: 20px;
}
.filters {
  margin-bottom: 20px;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: left;
}
th {
  background-color: #f0f0f0;
}
</style>