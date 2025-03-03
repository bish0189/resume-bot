import React, { useState } from "react";
import { useSquid } from '@squidcloud/react';
import './uploadResume.css';  // Import custom CSS for styling

const FileUploadTest: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [responseMessage, setResponseMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);  // To manage loading state
  const [error, setError] = useState<string>('');  // For error handling
  
  const squid = useSquid();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files ? event.target.files[0] : null;
    if (uploadedFile) {
      setFile(uploadedFile);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const uploadedFile = event.dataTransfer.files ? event.dataTransfer.files[0] : null;
    if (uploadedFile) {
      setFile(uploadedFile);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  // Convert the ArrayBuffer to a Base64 string
  const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
    const binary = String.fromCharCode(...new Uint8Array(buffer));
    return window.btoa(binary);
  };

  const handleFileUpload = async (file: File) => {
    if (!file || !squid) return;

    setLoading(true); // Start the loading spinner
    setError('');  // Clear any previous errors

    try {
      setUploadStatus('Uploading...');
      
      const otherParams = { additionalInfo: 'Optional extra parameter' };
      const arrayBuffer = await file.arrayBuffer();
      const base64Data = arrayBufferToBase64(arrayBuffer);
      
      const squidFile = {
        originalName: file.name,
        lastModified: file.lastModified,
        data: base64Data, // Send base64 string instead of ArrayBuffer
        size: file.size,
        mimetype: file.type,
      };

      console.log('SquidFile object being sent:', squidFile);

      const response = await squid.executeFunction('processResume', {
        files: [squidFile],
        otherParams,
      });

      console.log('Response from Squid AI:', response);

      if (response) {
        setUploadStatus('File uploaded and processed successfully!');
        setResponseMessage(response.message); // Assuming the formatted text is inside response.message
      } else {
        setUploadStatus('File upload failed.');
        setResponseMessage('There was an error with the file upload.');
      }
    } catch (error) {
      setUploadStatus('Error uploading file: ');
      setError('Error during upload: ');
    } finally {
      setLoading(false);  // End the loading spinner
    }
  };

  return (
    <div className="file-upload-container">
      <h2 className="header">Upload Your Resume</h2>

      <div
        className="drag-area"
        onClick={() => document.getElementById("fileInput")?.click()}
        onDrop={handleDrop}  // Handle drop event
        onDragOver={handleDragOver}  // Handle drag over event
      >
        {file ? (
          <div className="file-preview">
            <p className="file-name">{file.name}</p>
            <p className="file-size">{(file.size / 1024).toFixed(2)} KB</p>
          </div>
        ) : (
          <div className="upload-prompt">
            <p className="drag-text">Drag & Drop Your Resume Here</p>
            <p>OR</p>
            <button className="browse-button">Browse Files</button>
          </div>
        )}
      </div>
      <input
        type="file"
        id="fileInput"
        className="hidden"
        accept=".pdf, .doc, .docx, .txt"
        onChange={handleFileChange}
      />

      {file && (
        <div className="upload-button-container">
          <button
            onClick={() => handleFileUpload(file)}
            className="upload-button"
            disabled={loading}
          >
            {loading ? 'Uploading...' : 'Upload to Squid AI'}
          </button>
        </div>
      )}

      {uploadStatus && (
        <p className={`status-message ${loading ? 'loading' : error ? 'error' : 'success'}`}>
          {uploadStatus}
        </p>
      )}

      {responseMessage && (
        <div className="response-message-container">
          <h3>Formatted Resume</h3>
          <div
            className="formatted-text"
            dangerouslySetInnerHTML={{ __html: responseMessage.replace(/\n/g, "<br />") }} // This replaces newlines with <br />
          />
        </div>
      )}

      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default FileUploadTest;
