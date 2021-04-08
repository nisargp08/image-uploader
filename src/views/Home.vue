<template>
  <div class="min-h-screen h-full flex flex-col justify-center bg-gray-800">
    <div class="w-100 mx-4 space-y-2">
      <!-- Show when not uploading -->
      <template v-if="!isUploading">
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
                <div
                  class="overflow-y-auto max-h-96"
                  v-if="previewFiles.length"
                >
                  <div
                    class="grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-4 px-2"
                  >
                    <div
                      class="flex relative"
                      v-for="(image, index) in previewFiles"
                      :key="index"
                    >
                      <img class="rounded-md object-cover" :src="image" />
                      <!-- Remove overlay -->
                      <div class="absolute inset-0 remove-overlay rounded-md">
                        <div class="flex items-center justify-end mt-2 mr-2">
                          <!-- Remove button -->
                          <button
                            class="removeIcon btn text-xs py-1 px-2"
                            @click="removeImage(index)"
                            title="Remove image"
                          >
                            <span class="mr-1">Remove</span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              class="h-4 w-4 p-1 font-bold rounded-full inline-block bg-red-500 text-white"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fill-rule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clip-rule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="mt-4">
                <p
                  class="text-xs sm:text-sm leading-5 font-medium text-gray-500"
                >
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
            <!-- Upload button -->
            <div class="mt-4 border-t border-gray-200">
              <div class="pt-4">
                <button
                  class="btn flex justify-center bg-success border border-success ring-success-hover ring-opacity-50 hover:bg-success-hover text-white w-full"
                  :disabled="disableCheck"
                  @click="uploadFiles"
                >
                  <div class="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-4 w-4 sm:w-6 sm:h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                      />
                    </svg>
                    <span class="ml-2">Upload files</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </template>
      <!-- When uploading -->
      <template v-if="apiState.isLoading">
        <loading-component></loading-component>
      </template>
      <!-- When uploading is done and we have date from the api -->
      <template v-else-if="apiState.isDone">
        <!-- Back to home button -->
        <button @click="backToHome" class="btn btn-blue flex items-center px-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          <span class="ml-1">Home</span>
        </button>
        <!-- Display image received in the response -->
        <div v-for="(image,index) in apiResponse" :key="index">
          <p class="text-white">{{ image }}</p>
          <img :src="image.url" :alt="image.name">
        </div>
      </template>
      <!-- Error box -->
      <div
        class="bg-white rounded-xl shadow-card-shadow max-w-xl mx-auto p-4"
        v-if="errMessages.length"
      >
        <ul class="text-sm font-medium">
          <li
            class="list-disc ml-8 text-red-500"
            v-for="(error, index) in errMessages"
            :key="index"
          >
            {{ error }}
          </li>
        </ul>
        <div
          v-if="apiState.isErr"
          class="mt-4 flex border-t border-gray-100 pt-4"
        >
          <!-- Back to home button -->
          <button
            @click="backToHome"
            class="btn btn-blue flex items-center px-6"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span class="ml-1">Home</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from "axios";

export default {
  name: "Home",
  data() {
    return {
      isDragging: false,
      dragCounter: 0,
      previewFiles: [],
      storeFiles: [],
      errMessages: [],
      isUploading: false,
      apiState: {
        isLoading: false,
        isDone: false,
        isErr: false,
      },
      apiURL: "http://localhost:3000/api/file_upload/",
      apiResponse: [],
    };
  },
  components: {
    LoadingComponent: () => import("@/components/Loading.vue"),
  },
  computed: {
    disableCheck() {
      if (this.previewFiles.length > 0 && this.storeFiles.length > 0) {
        // Enable the button
        return false;
      } else {
        // Disable the button
        return true;
      }
    },
  },
  methods: {
    // Upload files to server
    async uploadFiles() {
      // Reset api state
      this.resetApiState();
      // Start loading
      this.isUploading = true;
      this.apiState.isLoading = true;

      // Submitting file as a form input
      const formData = new FormData();
      this.storeFiles.forEach((file) => {
        formData.append("fileUpload", file);
      });

      // call the api and send file as payload
      try {
        const response = await axios.post(this.apiURL, formData);
        // Store response in array
        this.apiResponse.push(response.data);
        console.log(this.apiResponse);
        // Set state to done
        this.apiState.isDone = true;
      } catch (error) {
        // When error occurs while uploading file
        console.error(error);
        this.errMessages.push(error);
        this.apiState.isErr = true;
      } finally {
        // Stop loading
        this.apiState.isLoading = false;
      }
    },
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

      if (files.length) {
        // Convert files to array and iterate through it
        Array.from(files).forEach((file) => this.addImage(file));
      }
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
    // Remove image from array
    removeImage(index) {
      // Remove the image from both file array
      this.storeFiles.splice(index, 1);
      this.previewFiles.splice(index, 1);
    },
    // Clear file storage and error message arrays
    clearFileBuffer() {
      this.storeFiles = [];
      this.previewFiles = [];
      this.errMessages = [];
      this.apiResponse = [];
    },
    // Reset api state trackers
    resetApiState() {
      this.apiState.isLoading = false;
      this.apiState.isDone = false;
      this.apiState.isErr = false;
    },
    // Backto home page
    backToHome() {
      this.clearFileBuffer();
      this.resetApiState();
      this.isUploading = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.remove-overlay {
  .removeIcon {
    display: none;
  }
  &:hover {
    background: linear-gradient(
      to bottom left,
      rgba(31, 41, 55, 1) 0px,
      transparent
    );
    .removeIcon {
      display: flex;
      align-items: center;
    }
  }
}
</style>
