<template>
  <div class="min-h-screen h-full flex flex-col justify-center bg-gray-800">
    <div class="w-100">
      <div
        class="bg-white rounded-xl shadow-card-shadow max-w-md mx-auto px-8 py-9 text-center"
      >
        <h2 class="text-lg sm:text-xl font-medium text-gray-800">Upload your image</h2>
        <p class="text-xs sm:text-sm text-gray-400 font-normal">
          File should be jpg, jpeg, png...
        </p>
        <div class="mt-8">
          <div class="border-dashed border rounded-xl border-blue-300 bg-blue-500 bg-opacity-5 py-9">
            <div class="flex items-center justify-center">
              <img src="@/assets/image.svg" alt="Upload image" />
            </div>
            <p class="text-xs sm:text-sm leading-5 font-medium text-gray-500 mt-6">
              Drag & Drop your image here
            </p>
          </div>
          <div class="mt-4">
            <p class="text-xs sm:text-sm leading-5 font-medium text-gray-500">Or</p>
            <div class="mt-2 sm:mt-4">
              <button
                class="btn btn-blue"
              >
               <label for="files" class="cursor-pointer">Choose a file</label>
              </button>
              <!-- File input -->
              <input class="hidden" type="file" name="files" id="files">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "Home",
};
</script>
