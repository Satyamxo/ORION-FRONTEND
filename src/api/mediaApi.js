const MEDIA_BASE_URL = import.meta.env.VITE_MEDIA_SERVICE_URL;

export const uploadImage = async ({ file, context, token, onProgress }) => {
  if (!file) throw new Error("File is required");


  const formData = new FormData();
  formData.append("file", file);
  formData.append("context", context);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open("POST", `${MEDIA_BASE_URL}/api/media/upload`);

    xhr.setRequestHeader("Authorization", `Bearer ${token}`);

    // upload progress
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        const percent = Math.round((event.loaded / event.total) * 100);
        onProgress(percent);
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject(JSON.parse(xhr.responseText));
      }
    };

    xhr.onerror = () => reject("Upload failed");

    xhr.send(formData);
  });
};
