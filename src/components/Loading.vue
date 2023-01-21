<template>
  <div class="loading-component">
    <div class="max-w-xs mx-auto">
      <div class="bg-white rounded-xl shadow-card-shadow max-w-sm w-full p-4 text-sm mb-4">
        First upload might take 15-30 seconds as Rail servers go to sleep when idle😴
      </div>
      <div
        class="bg-white rounded-xl shadow-card-shadow max-w-sm w-full h-36 px-8 flex items-center"
      >
        <div class="flex-1">
          <h3 class="text-gray-800 font-medium text-lg">Uploading...</h3>
          <!-- Progress bar wrapper -->
          <div class="progress-bar overflow-hidden relative w-full bg-gray-200 rounded-lg h-2 mt-6">
            <!-- Progress bar inner -->
            <div class="animation-run rounded-lg h-full w-1/4 bg-blue-500"></div>
          </div>
        </div>
      </div>
      <div class="test"></div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss">
// run animation keyframe
// .progress-bar{
//     &::before{
//         content: "";
//         display: block;
//         border-radius: 8px;
//         background: #2F80ED;
//         height: 100%;
//         max-width: 100px;
//         width: 100%;
//         position: absolute;
//         animation: run 1s infinite ease-out 0s;  
//     }
// }
.animation-run{
  animation: run 1s infinite ease-out 0s;  
}
@keyframes run {
  from {
    transform: translateX(0px);
  }
  to {
    transform: translateX(200px);
  }
}
</style>
