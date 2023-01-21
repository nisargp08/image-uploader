<template>
  <div class="min-h-screen h-full flex flex-col bg-gray-800">
    <div class="flex flex-col justify-center flex-1">
      <div class="w-100 p-4 space-y-2">
        <!-- Show when copy to clipboard -->
        <app-notification v-if="clipboardMessage.length > 0">{{
          clipboardMessage
        }}</app-notification>
        <!-- Show when not uploading -->
        <template v-if="!isUploading">
          <app-upload-card></app-upload-card>
        </template>
        <!-- When uploading -->
        <template v-if="apiState.isLoading">
          <app-loading></app-loading>
        </template>
        <!-- When uploading is done and we have date from the api -->
        <template v-else-if="apiState.isDone">
          <div class="mx-auto">
            <!-- Back to home button -->
            <div class="flex items-center justify-center">
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
            <!-- Display image received in the response -->
            <div class="flex flex-wrap justify-center gap-x-4 gap-y-8 mt-8">
              <div
                class="bg-white rounded-xl shadow-card-shadow max-w-xs sm:max-w-md w-100 p-8"
                v-for="(image, index) in apiResponse"
                :key="index"
              >
                <div class="flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-9 w-9 bg-success rounded-full text-white"
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
                <h3 class="text-gray-700 font-medium text-center text-lg mt-3">
                  Uploaded Successfully!
                </h3>
                <div class="mt-6">
                  <div class="relative h-0 pt-60">
                    <img
                      class="absolute inset-0 w-full h-full rounded-xl object-cover"
                      :src="image.url"
                      :alt="image.name"
                    />
                  </div>
                </div>
                <div
                  class="flex items-center bg-gray-100 border border-gray-200 rounded-lg mt-6"
                >
                  <p class="truncate font-medium flex-1 text-xs pl-2 pr-3 py-3">
                    {{ image.url }}
                  </p>
                  <button
                    @click="copyToClipBoard(image.url)"
                    class="btn btn-blue text-xs mr-1"
                  >
                    Copy Link
                  </button>
                </div>
              </div>
            </div>
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
    <app-footer></app-footer>
  </div>
</template>

<script>
// @ is an alias to /src
import { mapState } from "vuex";

export default {
  name: "Home",
  // Set apiURL on mount
  mounted() {
    let url;
    if (process.env.NODE_ENV === "production") {
      url = "https://np-image-uploader.up.railway.app/api/file_upload";
    } else {
      url = "http://localhost:3000/api/file_upload/";
    }
    // Commit mutation in vue store
    this.$store.commit("setApiUrl", url);
  },
  components: {
    appLoading: () => import("@/components/Loading.vue"),
    appUploadCard: () => import("@/components/UploadCard.vue"),
    appNotification: () => import("@/components/Notification.vue"),
    appFooter: () => import("@/views/Footer.vue"),
  },
  computed: {
    ...mapState([
      "errMessages",
      "isUploading",
      "apiState",
      "apiURL",
      "apiResponse",
      "clipboardMessage",
    ]),
  },
  methods: {
    // Function to copy passed text to clipboard
    async copyToClipBoard(data) {
      // Clear previous copied message if any
      this.$store.commit("setClipboardMessage", "");
      // Check if clipboard api is support in the browser or not
      if (!navigator.clipboard) {
        console.log(
          `Clipboard API is not supported in your browser, Please try in a modern browser to copy data. Copied URL - ${data}`
        );
        return;
      } else {
        try {
          await navigator.clipboard.writeText(data);
        } catch (error) {
          console.error(`Failed to copying to clipboard. Copied URL - ${data}`);
        }
      }
      // Show link in notification incase any error while copying
      window.scrollTo(0, 0);
      this.$store.commit("setClipboardMessage", data);
    },
    // Backto home page
    backToHome() {
      this.$store.commit("clearFileBuffer");
      this.$store.commit("resetApiState");
      this.$store.commit("toggleIsUploading", false);
    },
  },
};
</script>
