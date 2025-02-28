<template>
  <div class="demo-block">
    <div class="demo-block-actions">
      <button
        class="action-button"
        :class="{ active: activeTab === 'preview' }"
        @click="activeTab = 'preview'"
      >
        预览
      </button>
      <button
        class="action-button"
        :class="{ active: activeTab === 'code' }"
        @click="activeTab = 'code'"
      >
        代码
      </button>
    </div>

    <div class="demo-block-content">
      <div v-show="activeTab === 'preview'" class="preview-container">
        <slot></slot>
      </div>
      <div v-show="activeTab === 'code'" class="code-container">
        <div class="code-actions">
          <button
            class="copy-btn"
            @click="copyCode"
            :class="{ visible: copied }"
          >
            {{ copied ? "已复制" : "复制代码" }}
          </button>
        </div>
        {{ code }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{
  code: string;
}>();

const activeTab = ref("preview");
const copied = ref(false);

const copyCode = async () => {
  await navigator.clipboard.writeText(props.code);
  copied.value = true;
};
</script>

<style scoped>
.demo-block {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  margin: 24px 0;
  background: var(--vp-c-bg);
  overflow: hidden;
}

.demo-block-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 8px 16px;
  border-bottom: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}

.action-button {
  padding: 4px 12px;
  border: 1px solid transparent;
  border-radius: 4px;
  background: transparent;
  color: var(--vp-c-text-2);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-button:hover {
  color: var(--vp-c-brand);
  background: var(--vp-c-bg);
}

.action-button.active {
  color: var(--vp-c-brand);
  background: var(--vp-c-brand-dimm);
}

.demo-block-content {
  position: relative;
}

.preview-container {
  padding: 40px 24px;
  display: flex;
  justify-content: center;
}

.code-container {
  position: relative;
  background: var(--vp-code-block-bg);
  border-radius: 0 0 8px 8px;
  margin: 0;
  padding: 24px;
}

.code-container:hover .copy-btn {
  opacity: 1;
}

.code-container :deep(pre) {
  margin: 0;
  padding: 0 !important;
  background: transparent !important;
}

.code-actions {
  position: absolute;
  right: 16px;
  top: 16px;
  z-index: 2;
}

.copy-btn {
  padding: 4px 12px;
  font-size: 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.2s ease;
  opacity: 0;
}

.copy-btn:hover,
.copy-btn.visible {
  opacity: 1;
  color: var(--vp-c-brand);
  border-color: var(--vp-c-brand);
  background: var(--vp-c-bg-soft);
}
</style>
