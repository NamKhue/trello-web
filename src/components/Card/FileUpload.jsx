import { useState, useRef } from "react";

import { Button, LinearProgress, Typography } from "@mui/material";

// import { uploadFiles, deleteFile } from "~/apis";

const FileUpload = ({ cardId, refreshFiles }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const inputFileUploadRef = useRef(null);

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const onFileChange = async (e) => {
    // setSelectedFiles(Array.from(e.target.files));

    const files = Array.from(e.target.files);
    const base64Files = await Promise.all(
      files.map((file) => convertToBase64(file))
    );
    setSelectedFiles(base64Files);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      alert("Please select files and ensure card ID is present.");
      return;
    }

    const fileSizeLimit = 10 * 1024 * 1024; // 10MB
    const largeFiles = selectedFiles.filter(
      (file) => file.size > fileSizeLimit
    );
    if (largeFiles.length > 0) {
      alert("Some files are too large. Please select each file under 10MB.");
      return;
    }

    setUploading(true);

    try {
      // await uploadFiles(selectedFiles, cardId, (progressEvent) => {
      //   const percentCompleted = Math.round(
      //     (progressEvent.loaded * 100) / progressEvent.total
      //   );
      //   setUploadProgress(percentCompleted);
      // });

      if (onUploadSuccess) refreshFiles(); // Notify parent component of successful upload
    } catch (error) {
      console.error("Error uploading files:", error);
    } finally {
      setUploading(false);
      setUploadProgress(0);
      setSelectedFiles([]);
    }
  };

  const handleDelete = async (filename) => {
    try {
      // await deleteFile(filename, cardId);
      refreshFiles(); // Refresh file list after deletion
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  return (
    <div>
      <input
        type="file"
        ref={inputFileUploadRef}
        onChange={onFileChange}
        multiple
        style={{ display: "none" }}
      />

      <Button
        variant="contained"
        color="primary"
        onClick={() => inputFileUploadRef.current.click()}
        sx={{ marginRight: 1 }}
      >
        Choose Files
      </Button>

      <Button
        variant="contained"
        color="secondary"
        onClick={handleUpload}
        disabled={uploading || selectedFiles.length === 0}
      >
        Upload
      </Button>

      {uploading && (
        <div>
          <Typography variant="body2" color="textSecondary">
            Uploading files...
          </Typography>

          <LinearProgress
            variant="determinate"
            value={uploadProgress}
            sx={{ marginTop: 1, marginBottom: 1 }}
          />
        </div>
      )}
    </div>
  );
};

export default FileUpload;
