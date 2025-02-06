import { defineStore } from 'pinia';
import { ref } from 'vue';
import { POSITION, useToast } from 'vue-toastification';

type AlertType = 'warning' | 'success' | 'info' | 'error';

export const useUIStore = defineStore('ui', () => {
  const toast = useToast();
  const isLoading = ref<boolean>(false);

  const showAlert = (type: AlertType, message: string) => {
    toast[type](message, {
      position: POSITION.TOP_RIGHT,
      timeout: 3000,
    });
  };

  return { isLoading, showAlert };
});
