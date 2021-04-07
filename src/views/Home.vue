<template>
  <div class="min-h-screen h-full flex flex-col justify-center bg-gray-800">
    <div class="w-100 mx-4 space-y-2">
      <div
        class="flex bg-white rounded-xl shadow-card-shadow max-w-xl min-h-lg mx-auto px-8 py-9 text-center"
      >
        <div class="flex flex-col flex-1">
          <h2 class="text-lg sm:text-xl font-medium text-gray-800">
            Upload your image
          </h2>
          <p class="text-xs sm:text-sm text-gray-400 font-normal">
            File should be jpg, jpeg, png...
          </p>
          <div class="flex flex-col flex-1 mt-8">
            <!-- Drag area -->
            <div
              @dragenter.prevent.stop="onDragEnter"
              @dragleave.prevent.stop="onDragLeave"
              @dragover.prevent
              @drop.prevent.stop="onDrop"
              class="flex-1 border-dashed border rounded-xl border-blue-300 bg-blue-500 bg-opacity-5 py-9"
              :class="{ 'bg-opacity-20': isDragging }"
            >
              <!-- Default state - When no image has been uploaded -->
              <div
                v-if="!previewFiles.length"
                class="flex flex-col items-center justify-center h-full"
              >
                <div
                  class="flex items-center justify-center w-40 transition-all"
                >
                  <!-- Default - when no dragging -->
                  <img
                    v-if="!isDragging"
                    src="@/assets/image.svg"
                    alt="Upload image"
                  />
                  <!-- Drag state - When item is being dragged -->
                  <img v-else src="@/assets/drop.svg" alt="Drop image" />
                </div>
                <p
                  class="text-xs sm:text-sm leading-5 font-medium text-gray-500 mt-6"
                >
                  Drag & Drop your image here
                </p>
                <p
                  class="text-xs sm:text-sm leading-5 font-medium text-blue-500"
                >
                  (10MB max)
                </p>
              </div>
              <!-- After Drag state - When one or more than one image has been uploaded -->
              <div v-if="previewFiles.length">
                <div v-for="(image, index) in previewFiles" :key="index">
                  <img :src="image" />
                </div>
              </div>
            </div>
            <div class="mt-4">
              <p class="text-xs sm:text-sm leading-5 font-medium text-gray-500">
                Or
              </p>
              <div class="mt-2 sm:mt-4">
                <button class="btn btn-blue p-0">
                  <label for="files" class="px-4 py-2 block cursor-pointer"
                    >Choose a file</label
                  >
                </button>
                <!-- File input -->
                <input
                  @change="inputFiles"
                  class="hidden"
                  type="file"
                  name="files"
                  id="files"
                  multiple
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Error box -->
      <div class="bg-white rounded-xl shadow-card-shadow max-w-xl mx-auto p-4" v-if="errMessages.length">
        <ul class="text-sm font-medium">
          <li class="list-disc ml-8 text-red-500" v-for="(error,index) in errMessages" :key="index">
            {{ error }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "Home",
  data() {
    return {
      isDragging: false,
      dragCounter: 0,
      previewFiles: [],
      storeFiles: [],
      errMessages: [],
    };
  },
  methods: {
    // When files are added using input button
    inputFiles($event) {
      // Clear file storage buffer
      this.clearFileBuffer();
      const files = $event.target.files;
      // Convert files to array and iterate through it
      Array.from(files).forEach((file) => this.addImage(file));
    },
    // When a item/s enters the drag area
    onDragEnter() {
      this.dragCounter++;
      this.isDragging = true;
    },
    // When a item/s leaves the drag area
    onDragLeave() {
      this.dragCounter--;
      if (this.dragCounter <= 0) {
        this.isDragging = false;
      }
    },
    // When a item/s are drop in the drag area
    onDrop($event) {
      this.isDragging = false;
      // Clear file storage buffer
      this.clearFileBuffer();
      const files = $event.dataTransfer.files;
      // Convert files to array and iterate through it
      Array.from(files).forEach((file) => this.addImage(file));
    },
    // Add image to array to preview and store
    addImage(file) {
      // Validate image and return if file is not valid
      if (!this.validateImage(file)) {
        return;
      }
      this.storeFiles.push(file);
      // Preview image
      this.previewImage(file);
    },
    // Validate image
    validateImage(file) {
      let isValid = true;
      // Validate file input type
      if (!file.type.match("image.*")) {
        this.errMessages.push(`${file.name} is not a valid image type`);
        console.log(this.errMessages);
        isValid = false;
      }
      // Validate file size
      const maxSize = 10240; //(1024 * 10 = 10MB)
      const fileSize = Math.round(file.size / 1024);
      if (fileSize > maxSize) {
        this.errMessages.push(
          `${file.name} is greater than ${Math.round(maxSize / 1024)} MB`
        );
        isValid = false;
      }

      // Return file status
      return isValid;
    },
    // Preview an image
    previewImage(file) {
      const reader = new FileReader();
      // Push the file base64 string to the array
      reader.onload = (e) => this.previewFiles.push(e.target.result);
      // Call the onload function by calling 'readAsDataURL'
      reader.readAsDataURL(file);
    },
    // Clear file storage and error message arrays
    clearFileBuffer() {
      this.storeFiles = [];
      this.previewFiles = [];
      this.errMessages = [];
    },
  },
};
</script>
