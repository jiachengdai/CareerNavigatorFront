<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { message } from "ant-design-vue";
import { ShopOutlined, CheckCircleFilled } from "@ant-design/icons-vue";
import { getTemplates } from "../../utils/getTemplates";
import type { Template } from "../../types/template";
import { useResumeStore } from "../../store";
import { storeToRefs } from "pinia";
import router from "@/router";

// 模板列表
const templates = ref<Template[]>([]);
const resumeStore = useResumeStore();
const { resumeSetting } = storeToRefs(resumeStore);

// 当前选中的模板ID
const currentTemplate = computed({
  get: () => resumeSetting.value.currentTemplate,
  set: (val) => resumeStore.updateResumeSetting({ currentTemplate: val }),
});

// 获取并初始化模板列表
onMounted(async () => {
  try {
    templates.value = await getTemplates();
  } catch (error) {
    message.error("获取模板列表失败");
    console.error("获取模板列表失败:", error);
  }
});

// 处理模板切换
const handleTemplateChange = (id: String | null) => {
  if (!id) return;
  const selectedTemplate = templates.value.find((t) => t.id === id);
  if (selectedTemplate) {
    currentTemplate.value = selectedTemplate.id;
    message.success(`选择模板: ${selectedTemplate.name}`); // 提示选择成功
    router.push("/resume");
  }
};

// 计算模板图片 URL
const getTemplateImage = (template: Template): string => {
  if (!template.folderPath || !template.thumbnail) {
    return ""; // 处理无图片情况
  }
  return new URL(
    `../../template/${template.folderPath}/${template.thumbnail}`,
    import.meta.url
  ).href;
};
</script>

<template>
  <div class="template-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <a-typography-title :level="2">
        <template #prefix>
          <shop-outlined />
        </template>
        选择一个你喜欢的模版~🤗
      </a-typography-title>
    </div>

    <!-- 模板列表 -->
    <div class="template-grid">
      <div
        v-for="(template, index) in templates"
        :key="index"
        class="template-card-wrapper"
      >
        <a-card
          :bordered="false"
          :class="{ 'selected-template': currentTemplate === template.id }"
          class="template-card"
          :bodyStyle="{ padding: '12px' }"
        >
          <!-- 选中标记 -->
          <div v-if="currentTemplate === template.id" class="selected-badge">
            <check-circle-filled />
          </div>

          <!-- 模板内容 -->
          <div class="template-content">
            <div class="template-image-wrapper">
              <img
                v-lazy="getTemplateImage(template)"
                :alt="template.name"
                class="template-image"
              />
            </div>
            <div class="template-info">
              <div class="template-title">{{ template.name }}</div>
              <div class="template-author">
                <!-- 链接 -->
                作者：<a :href="String(template.link || '')" target="_blank">{{
                  template.author
                }}</a>
              </div>
              <p class="template-description">{{ template.description }}</p>
              <a-button
                :type="currentTemplate === template.id ? 'text' : 'primary'"
                :class="{ 'selected-button': currentTemplate === template.id }"
                @click="handleTemplateChange(template.id)"
                size="small"
                block
              >
                {{ currentTemplate === template.id ? "当前使用中" : "使用此模板" }}
              </a-button>
            </div>
          </div>
        </a-card>
      </div>
    </div>
  </div>
</template>

<style scoped>
.template-container {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 32px;
}

.page-header :deep(.ant-typography) {
  margin-bottom: 16px;
}

.page-header .ant-alert {
  display: inline-flex;
  margin: 0 auto;
}

.template-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
  padding: 8px;
}

.template-card-wrapper {
  position: relative;
}

.template-card {
  border-radius: 12px;
  transition: all 0.3s ease;
  height: 100%;
  background: #fff;
}

.template-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
}

.selected-template {
  border: 2px solid #52c41a;
}

.selected-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #52c41a;
  border-radius: 50%;
  padding: 2px;
  z-index: 1;
  height: 20px;
  width: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.selected-badge :deep(.anticon) {
  color: white;
  font-size: 14px;
}

.template-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.template-image-wrapper {
  position: relative;
  width: 100%;
  padding-top: 141.42%;
  /* A4 比例 */
  overflow: hidden;
  border-radius: 8px;
  background: #fafafa;
}

.template-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.template-info {
  padding: 8px 4px;
}

.template-title {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 4px;
  color: #262626;
}

.template-description {
  color: #8c8c8c;
  font-size: 12px;
  line-height: 1.5;
  margin: 4px 0 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.selected-button {
  background-color: #f6ffed !important;
  border: 1px solid #52c41a !important;
  color: #52c41a !important;
}

/* 响应式设计优化 */
@media (max-width: 1200px) {
  .template-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 992px) {
  .template-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .template-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .template-grid {
    grid-template-columns: 1fr;
    max-width: 280px;
    margin: 0 auto;
  }
}
</style>
