<template>
  <div class="h-screen w-screen flex flex-col items-center justify-center space-y-4">
    <h1 class="text-3xl text-center">Video to MP4 Converter</h1>
    <input type="file" accept="video/*" @change="handleFileChange" />
    <button @click="handleConvert" class="btn btn-primary">Convert to MP4</button>
  </div>
</template>

<script>
import axios from 'axios';
import { ref } from 'vue';
import { useToast } from 'vue-toastification';

export default {
  name: 'Home',
  setup() {
    const file = ref(null);
    const toast = useToast();

    const handleFileChange = (event) => {
      file.value = event.target.files[0];
    };

    const handleConvert = async () => {
      if (!file.value) {
        toast.error('Please upload a video file first.');
        return;
      }

      const formData = new FormData();
      formData.append('file', file.value);

      try {
        const response = await axios.post('/api/convert', formData, {
          responseType: 'blob',
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'converted.mp4';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        toast.success('Video converted successfully!');
      } catch (error) {
        toast.error('Conversion failed.');
      }
    };

    return {
      handleFileChange,
      handleConvert,
    };
  },
};
</script>

<style scoped>
.btn {
  background-color: #1f2937;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
}

.btn-primary {
  background-color: #1d4ed8;
}

.btn-primary:hover {
  background-color: #2563eb;
}
</style>