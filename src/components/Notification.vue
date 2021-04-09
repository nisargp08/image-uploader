<template>
  <!-- Simple notification -->
  <div>
  <transition
    mode="out-in"
    enter-active-class="animate__animated animate__zoomIn"
    leave-active-class="animate__animated animate__zoomOut"
  >
      <div class="notification" v-if="!isClose">
        <div class="icon">
          <svg
            class="w-6 h-6 text-green-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div class="text">
          <h4 class="text-title">Successfully copied to clipboard!</h4>
          <p class="text-data"><slot></slot></p>
        </div>
        <div class="dismiss">
          <button class="reset-btn" @click="isClose = true">
            <svg
              class="w-4 h-4 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
      </transition>
  </div>
</template>

<script>

export default {
  data() {
    return {
      // To close notification
      isClose: false,
    };
  },
  props : ['message'],
};
</script>

<style lang="scss" scoped>
// Component css
$notification-bg: white;
$shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);

.notification {
  position: absolute;
  z-index: 10;
  // bottom: 10px;
  bottom: 0;
  margin-bottom: 0.75rem;
  display: none;
  max-width: 24rem;
  background-color: $notification-bg;
  border-radius: 0.375rem;
  padding: 1rem 1rem;
  box-shadow: $shadow;
  width: calc(100vw - 6rem);
  // Change position to top at 640
  @media (min-width: 640px) {
    // top: 1.25rem;
    // right: 1.25rem;
    display: flex;
    top: 0;
    right: 0;
    margin-top: 1.25rem;
    margin-right: 1.25rem;
    bottom: auto;
  }
}
// Content design - Not required for component design
.notification {
  --animate-duration: 500ms;
}
.text-green-600 {
  color: #059669;
}
// .text-gray-400 {
//   color: $text-gray-400;
// }
.text {
  flex: 1;
  -ms-flex: 1;
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  .text-title {
    margin: 0;
    font-size: 1rem;
    font-weight: 500;
  }
  .text-data {
      @apply text-gray-500;
    font-size: 0.875rem;
    font-weight: 400;
    word-break: break-word;
    line-height: 1.25rem;
    padding-top: 0.25rem;
  }
}
.reset-btn{
 &:focus{
   svg{
     @apply text-indigo-500;
   }
 }
}
</style>
