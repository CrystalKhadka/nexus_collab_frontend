export const modalStyles = `
  .kanban-modal .ant-modal-content {
    @apply bg-gray-800 border border-white/10 rounded-xl;
  }
  .kanban-modal .ant-modal-header {
    @apply bg-transparent border-b border-white/10 pb-4;
  }
  .kanban-modal .ant-modal-title {
    @apply text-white;
  }
  .kanban-modal .ant-modal-close {
    @apply text-gray-400 hover:text-white;
  }
  .kanban-modal .ant-modal-body {
    @apply text-white;
  }
  .kanban-modal .ant-form-item-label > label {
    @apply text-gray-300;
  }
  .kanban-modal .ant-input,
  .kanban-modal .ant-input-textarea,
  .kanban-modal .ant-picker,
  .kanban-modal .ant-select-selector {
    @apply bg-gray-700/50 border-white/10 text-white;
  }
  .kanban-modal .ant-input:hover,
  .kanban-modal .ant-input-textarea:hover,
  .kanban-modal .ant-picker:hover,
  .kanban-modal .ant-select-selector:hover {
    @apply border-white/20;
  }
  .kanban-modal .ant-input:focus,
  .kanban-modal .ant-input-textarea:focus,
  .kanban-modal .ant-picker-focused,
  .kanban-modal .ant-select-focused .ant-select-selector {
    @apply border-white/30 ring-1 ring-white/30;
  }
  .kanban-modal .ant-picker-suffix,
  .kanban-modal .ant-select-arrow {
    @apply text-gray-400;
  }
  .kanban-modal .ant-picker-input > input {
    @apply text-white;
  }
  .kanban-modal .ant-select-selection-placeholder {
    @apply text-gray-400;
  }
`;
