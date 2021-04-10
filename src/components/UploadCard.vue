<template>
  <div class="upload-card-component">
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
              <div class="flex items-center justify-center w-40 transition-all">
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
              <p class="text-xs sm:text-sm leading-5 font-medium text-blue-500">
                (10MB max - 10 files at a time)
              </p>
            </div>
            <!-- After Drag state - When one or more than one image has been uploaded -->
            <div class="overflow-y-auto max-h-96" v-if="previewFiles.length">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-4 px-2">
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
  </div>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState(["isDragging", "dragCounter", "previewFiles", "storeFiles","apiURL"]),
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
      this.$store.commit("resetApiState");
      // Start loading
      this.$store.commit("toggleIsUploading", true);
      this.$store.commit("toggleApiIsLoading", true);

      // Submitting file as a form input
      const formData = new FormData();
      this.storeFiles.forEach((file) => {
        formData.append("fileUpload", file);
      });

      // call the api and send file as payload
      try {
        const response = await axios.post(this.apiURL, formData);
        // Loop through response and push the response
        const data = response.data.map((data) => {
          return data;
        });
        // Update 'apiResponse' array
        this.$store.commit("pushToApiResponse", data);
        // Set state to done
        this.$store.commit("toggleApiIsDone", true);
      } catch (error) {
        // When error occurs while uploading file
        console.error(error);
        this.$store.commit("pushToErrMessages", error);
        // this.errMessages.push(error);
        this.$store.commit("toggleApiIsErr", true);
      } finally {
        // Stop loading
        this.$store.commit("toggleApiIsLoading", false);
      }
    },
    // When files are added using input button
    inputFiles($event) {
      // Clear file storage buffer
      this.$store.commit("clearFileBuffer");
      const files = $event.target.files;
      // Convert files to array and iterate through it
      Array.from(files).forEach((file) => this.addImage(file));
    },
    // When a item/s enters the drag area
    onDragEnter() {
      this.$store.commit("incrementDragCounter");
      this.$store.commit("toggleIsDragging", true);
    },
    // When a item/s leaves the drag area
    onDragLeave() {
      this.$store.commit("decrementDragCounter");
      if (this.dragCounter <= 0) {
        this.$store.commit("toggleIsDragging", false);
      }
    },
    // When a item/s are drop in the drag area
    onDrop($event) {
      this.$store.commit("toggleIsDragging", false);
      // Clear file storage buffer
      this.$store.commit("clearFileBuffer");
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
      this.$store.commit("pushToStoreFiles", file);
      // Preview image
      this.previewImage(file);
    },
    // Validate image
    validateImage(file) {
      let isValid = true;
      // Validate file input type
      if (!file.type.match("image.*")) {
        this.$store.commit(
          "pushToErrMessages",
          `${file.name} is not a valid image type`
        );
        isValid = false;
      }
      // Validate file size
      const maxSize = 10240; //(1024 * 10 = 10MB)
      const fileSize = Math.round(file.size / 1024);
      if (fileSize > maxSize) {
        this.$store.commit(
          "pushToErrMessages",
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
      reader.onload = (e) =>
        this.$store.commit("pushToPreviewFiles", e.target.result);
      // Call the onload function by calling 'readAsDataURL'
      reader.readAsDataURL(file);
    },
    // Remove image from array
    removeImage(index) {
      // Remove the image from both file array
      this.$store.commit("removeImage", index);
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
