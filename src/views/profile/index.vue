<template>
  <div class="profile-container" :class="{ 'dark-mode': isDark }">
    <a-card title="个人信息" :bordered="false" class="profile-card">
      <template #extra>
        <a-button
          type="primary"
          @click="isEditing ? handleSave() : startEdit()"
          :loading="loading"
        >
          {{ isEditing ? "保存" : hasProfile ? "编辑" : "创建" }}
        </a-button>
        <a-button v-if="isEditing" class="ml-2" @click="cancelEdit()">取消</a-button>
      </template>

      <div v-if="loading" class="loading-container">
        <a-spin tip="加载中..."></a-spin>
      </div>

      <template v-else>
        <!-- 表单模式 -->
        <a-form v-if="isEditing" :model="profileForm" layout="vertical">
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="用户名" name="username">
                <a-input v-model:value="profileForm.username" disabled />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item
                label="昵称"
                name="nickname"
                :rules="[{ required: true, message: '请输入昵称' }]"
              >
                <a-input v-model:value="profileForm.nickname" placeholder="请输入昵称" />
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="性别" name="sex">
                <a-select v-model:value="profileForm.sex" placeholder="请选择性别">
                  <a-select-option value="男">男</a-select-option>
                  <a-select-option value="女">女</a-select-option>
                  <a-select-option value="保密">保密</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="年龄" name="age">
                <a-input-number
                  v-model:value="profileForm.age"
                  :min="1"
                  :max="100"
                  style="width: 100%"
                />
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="学历" name="education">
                <a-select v-model:value="profileForm.education" placeholder="请选择学历">
                  <a-select-option value="高中">高中</a-select-option>
                  <a-select-option value="专科">专科</a-select-option>
                  <a-select-option value="本科">本科</a-select-option>
                  <a-select-option value="硕士">硕士</a-select-option>
                  <a-select-option value="博士">博士</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="专业" name="major">
                <a-input v-model:value="profileForm.major" placeholder="请输入专业" />
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="联系电话" name="tel">
                <a-input v-model:value="profileForm.tel" placeholder="请输入联系电话" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="电子邮箱" name="email">
                <a-input v-model:value="profileForm.email" placeholder="请输入电子邮箱" />
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="期望工作" name="expectedjob">
                <a-input
                  v-model:value="profileForm.expectedjob"
                  placeholder="请输入期望工作"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="毕业时间" name="graduationtime">
                <a-date-picker
                  v-model:value="profileForm.graduationtime"
                  format="YYYY-MM-DD"
                  style="width: 100%"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>

        <!-- 显示模式 -->
        <template v-else-if="hasProfile">
          <a-descriptions bordered>
            <a-descriptions-item label="用户名" :span="1">{{
              profile.username
            }}</a-descriptions-item>
            <a-descriptions-item label="昵称" :span="1">{{
              profile.nickname || "未设置"
            }}</a-descriptions-item>
            <a-descriptions-item label="性别" :span="1">{{
              profile.sex || "未设置"
            }}</a-descriptions-item>
            <a-descriptions-item label="年龄" :span="1">{{
              profile.age || "未设置"
            }}</a-descriptions-item>
            <a-descriptions-item label="学历" :span="1">{{
              profile.education || "未设置"
            }}</a-descriptions-item>
            <a-descriptions-item label="专业" :span="1">{{
              profile.major || "未设置"
            }}</a-descriptions-item>
            <a-descriptions-item label="联系电话" :span="1">{{
              profile.tel || "未设置"
            }}</a-descriptions-item>
            <a-descriptions-item label="电子邮箱" :span="1">{{
              profile.email || "未设置"
            }}</a-descriptions-item>
            <a-descriptions-item label="期望工作" :span="1">{{
              profile.expectedjob || "未设置"
            }}</a-descriptions-item>
            <a-descriptions-item label="毕业时间" :span="1">{{
              formatDate(profile.graduationtime)
            }}</a-descriptions-item>
            <a-descriptions-item label="注册时间" :span="3">{{
              formatDate(profile.registertime)
            }}</a-descriptions-item>
          </a-descriptions>
        </template>

        <!-- 空状态 -->
        <div v-else class="empty-state">
          <a-empty description="暂无个人信息，请点击创建按钮添加个人信息" />
        </div>
      </template>
    </a-card>

    <!-- 人才画像卡片 -->
    <a-card title="人才画像" :bordered="false" class="profile-card talent-profile-card">
      <div v-if="talentLoading" class="loading-container">
        <a-spin tip="加载中..."></a-spin>
      </div>
      <template v-else>
        <!-- 人才画像存在 -->
        <template v-if="hasTalentProfile">
          <div class="talent-profile-container">
            <!-- 性格特质六边形图 -->
            <div class="talent-chart-section">
              <h3>性格特质分析</h3>
              <div class="radar-chart-container">
                <div class="radar-chart-labels">
                  <div
                    v-for="(value, key) in talentProfile.personalityTraits"
                    :key="key"
                    class="trait-item"
                  >
                    <span class="trait-label">{{ key }}</span>
                    <a-progress
                      :percent="getTrendPercent(String(value))"
                      :stroke-color="'#9c87fe'"
                      :format="formatPercent"
                    />
                  </div>
                  <div v-if="!hasPersonalityValues" class="trait-empty-hint">
                    <a-alert
                      message="暂无性格特质数据，数据将在提交简历后生成"
                      type="info"
                      showIcon
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- 行业趋势 -->
            <div v-if="hasTrends" class="talent-trends-section">
              <h3>行业趋势适配度</h3>
              <div class="trends-container">
                <div
                  v-for="(value, key) in talentProfile.industryTrends"
                  :key="key"
                  class="trend-item"
                >
                  <template v-if="value !== 'NaN'">
                    <span class="trend-label">{{ getTrendLabel(key) }}</span>
                    <a-progress
                      :percent="getTrendPercent(value)"
                      :stroke-color="getTrendColor(key)"
                      :format="formatPercent"
                    />
                  </template>
                </div>
              </div>
            </div>

            <!-- 市场价值 -->
            <div class="talent-market-section">
              <h3>市场价值评估</h3>
              <div class="market-container">
                <div
                  v-for="(value, key) in talentProfile.marketValue"
                  :key="key"
                  class="market-item"
                >
                  <span class="market-label">{{ key }}</span>
                  <span class="market-value" :style="{ color: getMarketColor(value) }">
                    {{ value > 0 ? `${(value * 100).toFixed(0)}%` : "尚未评估" }}
                  </span>
                </div>
              </div>
            </div>

            <!-- 发展建议 -->
            <div
              v-if="
                talentProfile.developmentSuggestions &&
                talentProfile.developmentSuggestions.length > 0
              "
              class="talent-suggestions-section"
            >
              <h3>发展建议</h3>
              <a-list
                :data-source="talentProfile.developmentSuggestions"
                size="small"
                bordered
              >
                <template #renderItem="{ item }">
                  <a-list-item> <a-tag color="blue">建议</a-tag> {{ item }} </a-list-item>
                </template>
              </a-list>
            </div>

            <!-- 薪资预期 -->
            <div class="talent-salary-section">
              <h3>薪资预期</h3>
              <div class="salary-container">
                <div
                  v-for="(value, key) in talentProfile.salaryExpectation"
                  :key="key"
                  class="salary-item"
                >
                  <span class="salary-label">{{ key }}</span>
                  <span class="salary-value">{{
                    value > 0 ? `${value.toLocaleString()}元/月` : "尚未评估"
                  }}</span>
                </div>
              </div>
            </div>

            <!-- 关键词 -->
            <div
              v-if="talentProfile.keywords && talentProfile.keywords.length > 0"
              class="talent-keywords-section"
            >
              <h3>个人标签</h3>
              <div class="keywords-container">
                <a-tag
                  v-for="keyword in talentProfile.keywords"
                  :key="keyword"
                  color="blue"
                  class="keyword-tag"
                >
                  {{ keyword }}
                </a-tag>
              </div>
            </div>
          </div>
        </template>
        <!-- 显示错误信息 -->
        <div v-else class="empty-state">
          <a-empty>
            <template #description>
              <span>{{ talentErrorMsg || "暂无人才画像数据" }}</span>
            </template>
          </a-empty>
        </div>
      </template>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, watch, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import { message } from "ant-design-vue";
import dayjs from "dayjs";
import { getUserByUsernameService, addUserService, updateUserService } from "@/api/user";
import { getUserProfileByUsername } from "@/api/userprofile";
import type { UserProfileDetail } from "@/api/userprofile";
import type { UserInfo } from "@/types/user";
import { useSettingsStore } from "@/store/useSettingsStore";

const route = useRoute();
const router = useRouter();
const settingsStore = useSettingsStore();
const isDark = computed(() => settingsStore.isDark);
const username = computed(() => route.params.username as string);

const loading = ref(false);
const isEditing = ref(false);
const profile = ref<Partial<UserInfo>>({});
const hasProfile = computed(() => profile.value && Object.keys(profile.value).length > 0);

// 人才画像相关数据
const talentLoading = ref(false);
const talentProfile = ref<Partial<UserProfileDetail>>({});
const talentErrorMsg = ref("");
const hasTalentProfile = computed(() => {
  return (
    !!talentProfile.value &&
    (!!talentProfile.value.personalInfo ||
      !!talentProfile.value.summary ||
      (!!talentProfile.value.personalityTraits &&
        Object.keys(talentProfile.value.personalityTraits).length > 0))
  );
});
const hasTrends = computed(() => {
  if (!talentProfile.value || !talentProfile.value.industryTrends) return false;
  return Object.values(talentProfile.value.industryTrends).some(
    (value) => value !== "NaN"
  );
});

// 用于编辑的表单数据
const profileForm = reactive<{
  username: string;
  nickname: string;
  sex: string;
  age?: number;
  education: string;
  major: string;
  tel: string;
  email: string;
  expectedjob: string;
  graduationtime?: any; // 使用any类型来解决Dayjs类型问题
  [key: string]: any; // 添加索引签名
}>({
  username: "",
  nickname: "",
  sex: "",
  age: undefined,
  education: "",
  major: "",
  tel: "",
  email: "",
  expectedjob: "",
  graduationtime: undefined,
});

// 获取用户信息
const fetchUserProfile = async () => {
  if (!username.value) return;

  loading.value = true;
  try {
    const res = await getUserByUsernameService(username.value);
    console.log("获取用户信息结果:", res);

    if (res.code === 0 && res.data) {
      profile.value = res.data;
    } else {
      // 用户信息不存在，可以稍后创建
      console.log("用户信息不存在:", res.message);
      // 确保profile至少是一个空对象
      profile.value = {};
    }
  } catch (error) {
    console.error("获取用户信息失败:", error);
    // 发生错误时也确保profile是一个空对象
    profile.value = {};
  } finally {
    loading.value = false;
  }
};

// 开始编辑
const startEdit = () => {
  // 初始化表单数据，确保profile.value存在
  const profileData = profile.value || {};

  profileForm.username = username.value;
  profileForm.nickname = profileData.nickname || "";
  profileForm.sex = profileData.sex || "";
  profileForm.age = profileData.age;
  profileForm.education = profileData.education || "";
  profileForm.major = profileData.major || "";
  profileForm.tel = profileData.tel || "";
  profileForm.email = profileData.email || "";
  profileForm.expectedjob = profileData.expectedjob || "";

  // 处理日期
  if (profileData.graduationtime) {
    profileForm.graduationtime = dayjs(profileData.graduationtime);
  } else {
    profileForm.graduationtime = undefined;
  }

  isEditing.value = true;
};

// 取消编辑
const cancelEdit = () => {
  isEditing.value = false;
};

// 保存用户信息
const handleSave = async () => {
  if (!profileForm.username) {
    message.error("用户名不能为空");
    return;
  }

  loading.value = true;
  try {
    // 处理日期格式
    const formData = { ...profileForm };
    if (formData.graduationtime && typeof formData.graduationtime !== "string") {
      // 使用as any来避免类型错误
      formData.graduationtime = (formData.graduationtime as any).format("YYYY-MM-DD");
    }

    // 判断是新建还是更新
    const isNew = !profile.value || !profile.value.id;

    let res;
    if (isNew) {
      // 新建时设置注册时间为当前时间
      formData.registertime = dayjs().format("YYYY-MM-DD HH:mm:ss");
      res = await addUserService(formData as Omit<UserInfo, "id">);
      console.log("添加用户信息结果:", res);
    } else {
      // 更新操作，保留原有id和registertime
      formData.id = profile.value.id;
      if (!formData.registertime && profile.value.registertime) {
        formData.registertime = profile.value.registertime;
      }
      res = await updateUserService(formData as UserInfo);
      console.log("更新用户信息结果:", res);
    }

    if (res.code === 0) {
      message.success(isNew ? "个人信息创建成功" : "个人信息更新成功");
      // 先退出编辑模式
      isEditing.value = false;

      // 保存成功后，重新获取用户信息
      setTimeout(async () => {
        try {
          loading.value = true;
          const refreshResult = await getUserByUsernameService(username.value);
          console.log("重新获取用户信息结果:", refreshResult);

          if (refreshResult.code === 0 && refreshResult.data) {
            profile.value = refreshResult.data;
          } else {
            console.log("获取最新用户信息失败:", refreshResult.message);
            profile.value = {}; // 确保至少有一个空对象
          }
        } catch (error) {
          console.error("重新获取用户信息时出错:", error);
          profile.value = {}; // 确保至少有一个空对象
        } finally {
          loading.value = false;
        }
      }, 200); // 稍微延迟一些时间，确保后端数据已更新
    } else {
      message.error(res.message || "保存失败");
    }
  } catch (error: any) {
    console.error("保存用户信息失败:", error);
    if (error.message) {
      message.error(error.message);
    } else {
      message.error("保存失败，请重试");
    }
  } finally {
    if (loading.value) {
      loading.value = false; // 只在没有进行二次请求时才在这里关闭加载状态
    }
  }
};

// 格式化日期显示
const formatDate = (dateStr?: string) => {
  if (!dateStr) return "未设置";
  try {
    return dayjs(dateStr).format("YYYY-MM-DD HH:mm:ss");
  } catch (error) {
    return dateStr; // 如果格式化失败，返回原始字符串
  }
};

// 获取用户画像信息
const fetchUserTalentProfile = async () => {
  if (!username.value) return;

  talentLoading.value = true;
  try {
    // 尝试正常获取用户画像
    const res = await getUserProfileByUsername(username.value);
    console.log("获取用户画像结果:", res);

    // 检查返回值
    if (res && res.code === 0 && res.data) {
      talentProfile.value = res.data;
      talentErrorMsg.value = "";
      return;
    }

    // 如果API返回失败（code不为0），尝试解析可能的数据
    if (res && typeof res === "object") {
      // 如果在res对象中找到了personalInfo字段，说明数据可能是正常的
      if (
        "data" in res &&
        res.data &&
        (res.data.personalInfo || res.data.summary || res.data.personalityTraits)
      ) {
        console.log("使用API返回的data字段:", res.data);
        talentProfile.value = res.data;
        talentErrorMsg.value = "";
        return;
      }

      // 如果res本身包含这些字段（可能是直接返回了数据对象）
      if ("personalInfo" in res || "summary" in res || "personalityTraits" in res) {
        console.log("直接使用返回结果:", res);
        talentProfile.value = (res as unknown) as UserProfileDetail;
        talentErrorMsg.value = "";
        return;
      }

      // 否则使用错误信息
      talentProfile.value = {};
      talentErrorMsg.value = res.message || "暂无人才画像数据";
    } else {
      talentProfile.value = {};
      talentErrorMsg.value = "获取人才画像失败";
    }
  } catch (error: any) {
    console.error("获取用户画像失败:", error);

    // 尝试从错误对象中提取数据
    if (error && typeof error === "object") {
      // 如果错误对象中包含完整数据结构，直接使用
      if ("personalInfo" in error || "summary" in error || "personalityTraits" in error) {
        console.log("从错误对象中提取数据:", error);
        talentProfile.value = (error as unknown) as UserProfileDetail;
        talentErrorMsg.value = "";
        return;
      }

      // 检查错误对象是否有data字段
      if ("data" in error && error.data && typeof error.data === "object") {
        if (
          "personalInfo" in error.data ||
          "summary" in error.data ||
          "personalityTraits" in error.data
        ) {
          console.log("从错误对象的data字段提取数据:", error.data);
          talentProfile.value = error.data as UserProfileDetail;
          talentErrorMsg.value = "";
          return;
        }
      }

      // 检查错误对象是否有response字段
      if ("response" in error && error.response && typeof error.response === "object") {
        // 检查response.data
        if (
          "data" in error.response &&
          error.response.data &&
          typeof error.response.data === "object"
        ) {
          if (
            "personalInfo" in error.response.data ||
            "summary" in error.response.data ||
            "personalityTraits" in error.response.data
          ) {
            console.log("从错误响应中提取数据:", error.response.data);
            talentProfile.value = error.response.data as UserProfileDetail;
            talentErrorMsg.value = "";
            return;
          }
        }
      }

      // 使用错误消息
      talentErrorMsg.value = error.message || "获取人才画像失败";
    } else {
      talentErrorMsg.value = "获取人才画像失败";
    }

    talentProfile.value = {};
  } finally {
    talentLoading.value = false;
  }
};

// 获取行业趋势标签
const getTrendLabel = (key: string): string => {
  const labelMap: { [key: string]: string } = {
    cloud: "云计算",
    bigdata: "大数据",
    blockchain: "区块链",
    ai: "人工智能",
    iot: "物联网",
  };
  return labelMap[key] || key;
};

// 获取行业趋势颜色
const getTrendColor = (key: string): string => {
  const colorMap: { [key: string]: string } = {
    cloud: "#1890ff",
    bigdata: "#722ed1",
    blockchain: "#eb2f96",
    ai: "#52c41a",
    iot: "#fa8c16",
  };
  return colorMap[key] || "#1890ff";
};

// 获取市场价值颜色
const getMarketColor = (value: number): string => {
  if (value <= 0) return isDark.value ? "#cdd6f4" : "#333";
  if (value < 0.3) return "#ff7875";
  if (value < 0.6) return "#ffa940";
  return "#52c41a";
};

// 处理进度条百分比
const getTrendPercent = (value: string): number => {
  if (value === "NaN" || value === "undefined" || value === null || value === undefined) {
    return 0;
  }
  const num = Number(value);
  return isNaN(num) ? 0 : num * 100;
};

// 格式化百分比显示
const formatPercent = (percent: number | undefined): string => {
  if (typeof percent !== "number") return "0%";
  return `${percent.toFixed(0)}%`;
};

// 检查是否有性格特质数据（即使值为0也算有数据）
const hasPersonalityTraits = computed(() => {
  return (
    talentProfile.value &&
    talentProfile.value.personalityTraits &&
    Object.keys(talentProfile.value.personalityTraits).length > 0
  );
});

// 检查性格特质是否有有效值（所有值都是0则认为无有效值）
const hasPersonalityValues = computed(() => {
  if (!hasPersonalityTraits.value) return false;

  // 检查是否至少有一个值不为0
  return Object.values(talentProfile.value.personalityTraits!).some(
    (value) => typeof value === "number" && value > 0
  );
});

onMounted(() => {
  fetchUserProfile();
  fetchUserTalentProfile();
});
</script>

<style scoped>
.profile-container {
  max-width: 1000px;
  margin: 30px auto;
}

.profile-card {
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}

.empty-state {
  padding: 40px 0;
}

.ml-2 {
  margin-left: 8px;
}

/* 暗黑模式样式 */
.dark-mode {
  background-color: #1e1e2e;
  color: #cdd6f4;
}

.dark-mode :deep(.profile-card) {
  background-color: #1e1e2e;
  color: #cdd6f4;
  border-color: #313244;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
}

.dark-mode :deep(.ant-card) {
  background-color: #1e1e2e;
  color: #cdd6f4;
  border-color: #313244;
}

.dark-mode :deep(.ant-card-head) {
  background-color: #313244;
  color: #cdd6f4;
  border-color: #45475a;
}

.dark-mode :deep(.ant-descriptions),
.dark-mode :deep(.ant-descriptions-view) {
  background-color: #1e1e2e;
  color: #cdd6f4;
}

.dark-mode :deep(.ant-descriptions-item-label),
.dark-mode :deep(.ant-descriptions-item-content) {
  background-color: #313244;
  color: #cdd6f4;
  border-color: #45475a;
}

.dark-mode :deep(.ant-empty-description) {
  color: #cdd6f4;
}

.dark-mode :deep(.ant-input),
.dark-mode :deep(.ant-input-number-input) {
  background-color: #2c2e3b;
  border-color: #45475a;
  color: #fff;
}

.dark-mode :deep(.ant-input::placeholder) {
  color: rgba(255, 255, 255, 0.6);
}

.dark-mode :deep(.ant-input-affix-wrapper),
.dark-mode :deep(.ant-input-number),
.dark-mode :deep(.ant-picker) {
  background-color: #2c2e3b;
  border-color: #45475a;
}

.dark-mode :deep(.ant-select-selector) {
  background-color: #2c2e3b !important;
  border-color: #45475a !important;
  color: #fff !important;
}

.dark-mode :deep(.ant-select-selection-placeholder) {
  color: rgba(255, 255, 255, 0.6) !important;
}

.dark-mode :deep(.ant-select-arrow),
.dark-mode :deep(.ant-picker-suffix) {
  color: #9c87fe;
}

.dark-mode :deep(.ant-btn-primary) {
  background-color: #9c87fe;
  border-color: #9c87fe;
}

.dark-mode :deep(.ant-btn-default) {
  background-color: #313244;
  border-color: #45475a;
  color: #cdd6f4;
}

.dark-mode :deep(.ant-form-item-label > label) {
  color: #cdd6f4;
}

.dark-mode :deep(.ant-spin-text) {
  color: #cdd6f4;
}

.dark-mode :deep(.ant-progress-text) {
  color: #cdd6f4;
}

.dark-mode :deep(.ant-alert) {
  background-color: #313244;
  border-color: #45475a;
}

.dark-mode :deep(.ant-alert-message) {
  color: #cdd6f4;
}

.dark-mode :deep(.ant-list) {
  background-color: #1e1e2e;
  color: #cdd6f4;
  border-color: #45475a;
}

.dark-mode :deep(.ant-list-item) {
  border-color: #45475a;
  color: #cdd6f4;
}

.dark-mode :deep(.ant-list-empty-text) {
  color: #cdd6f4;
}

.dark-mode :deep(.ant-tag) {
  border-color: transparent;
}

.talent-profile-card {
  margin-top: 20px;
}

.talent-profile-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.talent-chart-section,
.talent-trends-section,
.talent-market-section,
.talent-suggestions-section,
.talent-salary-section,
.talent-keywords-section {
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

.dark-mode .talent-chart-section,
.dark-mode .talent-trends-section,
.dark-mode .talent-market-section,
.dark-mode .talent-suggestions-section,
.dark-mode .talent-salary-section,
.dark-mode .talent-keywords-section {
  background-color: #2c2e3b;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.3);
}

.talent-chart-section {
  grid-column: 1 / 2;
  grid-row: 1 / 3;
}

.radar-chart-container {
  padding: 20px;
}

.radar-chart-labels {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.trait-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.trait-label {
  width: 80px;
  margin-right: 16px;
  font-size: 14px;
  font-weight: 500;
}

h3 {
  margin-top: 0;
  margin-bottom: 16px;
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.dark-mode h3 {
  color: #cdd6f4;
}

.trends-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.trend-item,
.market-item,
.salary-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.trend-label,
.market-label,
.salary-label {
  width: 80px;
  margin-right: 10px;
  font-size: 14px;
}

.market-value,
.salary-value {
  font-size: 14px;
  font-weight: 500;
}

.keywords-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.keyword-tag {
  margin-right: 0;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .talent-profile-container {
    grid-template-columns: 1fr;
  }

  .talent-chart-section {
    grid-column: 1;
    grid-row: 1;
  }
}

.trait-empty-hint {
  margin-top: 16px;
  width: 100%;
}
</style>
