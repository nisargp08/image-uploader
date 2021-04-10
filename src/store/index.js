import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
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
    apiURL: "",
    apiResponse: [],
    clipboardMessage: "",
  },
  //   Use mutations to update state,so that every update is tracked
  mutations: {
    setApiUrl(state, value) {
      state.apiURL = value;
    },
    // Reset api state trackers
    resetApiState(state) {
      state.apiState.isLoading = false;
      state.apiState.isDone = false;
      state.apiState.isErr = false;
    },
    // Clear file storage and error message arrays
    clearFileBuffer(state) {
      state.storeFiles = [];
      state.previewFiles = [];
      state.errMessages = [];
      state.apiResponse = [];
      state.clipboardMessage = "";
    },
    // Toggle isUploading variable
    toggleIsUploading(state, value) {
      state.isUploading = value;
    },
    // Toggle apiState.isLoading variable
    toggleApiIsLoading(state, value) {
      state.apiState.isLoading = value;
    },
    // Toggle apiState.isDone variable
    toggleApiIsDone(state, value) {
      state.apiState.isDone = value;
    },
    // Toggle apiState.isErr variable
    toggleApiIsErr(state, value) {
      state.apiState.isErr = value;
    },
    // Push the data to apiResonse
    pushToApiResponse(state,value){
      state.apiResponse = value;
    },
    // Push the errors to errMessages
    pushToErrMessages(state,value){
      state.errMessages.push(value);
    },
    // Increment dragCounter
    incrementDragCounter(state) {
      state.dragCounter++;
    },
    // Decrement dragCounter
    decrementDragCounter(state) {
      state.dragCounter--;
    },
    // Toggle isDragging variable
    toggleIsDragging(state, value) {
      state.isDragging = value;
    },
    // Push to storeFiles variable
    pushToStoreFiles(state,value){
      state.storeFiles.push(value);
    },
    // Push to previewFiles variable
    pushToPreviewFiles(state,value){
      state.previewFiles.push(value);
    },
    // Remove file from selection
    removeImage(state,value){
      state.storeFiles.splice(value,1);
      state.previewFiles.splice(value,1);
    },
    setClipboardMessage(state,value){
      state.clipboardMessage = value;
    }
  },
  //   Use actions to commit mutations. Actions can be async,mutations can't be
  actions: {},
});

export default store;
