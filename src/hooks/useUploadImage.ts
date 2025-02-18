import { ref } from "vue";
import { addPic } from '@/api/posts'
import { showLoadingToast, closeToast } from "vant"; // 引入 Vant 的 Loading 组件类型

// 自定义 Hook - 用于图片上传
export function useUploadImage() {
  const loading = ref(false);
  const imageList = ref<string[]>([]); // 存储图片的 URL 列表

  // 压缩图片函数
  const compressImage = (file: File): Promise<Blob> => {
    console.log("🚀 ~ compressImage ~ file:", file)
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = function (e) {
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;

      reader.readAsDataURL(file);

      img.onload = function () {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const maxWidth = 1024;
        const maxHeight = 1024;

        let width = img.width;
        let height = img.height;

        // 按比例缩放图片
        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject("压缩失败");
            }
          },
          "image/jpeg",
          0.9
        );
      };
    });
  };

  // 处理上传的图片
  const afterUpload = async (files: { file: File }[]): Promise<void> => {
    if (loading.value) return;
    showLoadingToast({
      message: "上传中...",
      duration: 0,
    });

    const compressedFiles: Blob[] = [];

    const filesToProcess = Array.isArray(files) ? files : [files];

    // 压缩图片
    for (const fileObj of filesToProcess) {
      const file = fileObj.file;

      const compressedFile = await compressImage(file);
      console.log("🚀 ~ afterUpload ~ compressedFile:", compressedFile)
      compressedFiles.push(compressedFile);
    }

    const formData = new FormData();
    compressedFiles.forEach((file) => {
      formData.append("files", file);
    });

    try {
      // 调用上传接口
      const { data } = await addPic(formData);
      imageList.value = [...imageList.value, ...data.urls];
      console.log("🚀 ~ afterUpload ~ imageList.value:", imageList.value)
      closeToast();
    } catch (error) {
      closeToast();
      console.error("上传失败", error);
    }
  };
  // 头像上传方法
  const uploadImg = async (file: File): Promise<string> => {
    if (loading.value) return;
    showLoadingToast({
      message: "上传图片中...",
      duration: 0,
    });

    try {
      // 压缩头像图片
      const compressedFile = await compressImage(file);
      const formData = new FormData();
      formData.append("files", compressedFile, file.name);

      // 调用更新头像接口
      const { data } = await addPic(formData);
      // 假设返回的 data.urls 里面包含了新上传的头像 URL
      const avatarUrl = data.urls[0];  // 获取头像的 URL
      console.log("🚀 ~ uploadAvatar ~ avatarUrl:", avatarUrl);

      // 返回头像 URL，或者可以设置到其他地方
      return avatarUrl;
    } catch (error) {
      closeToast();
      console.error("上传头像失败", error);
      throw error; // 让调用者知道上传失败
    } finally {
      closeToast();
    }
  };
  return {
    loading,
    imageList,
    afterUpload,
    uploadImg
  };
}
