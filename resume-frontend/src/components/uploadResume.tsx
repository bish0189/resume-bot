import React, { useState } from "react";
import { useSquid } from '@squidcloud/react';

const FileUpload: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [uploadStatus, setUploadStatus] = useState<string>('');
    const [responseMessage, setResponseMessage] = useState<string>('');  // Store the AI response message
  
    // Use the Squid AI hook to get the Squid client
    const squid = useSquid();
  
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const uploadedFile = event.target.files ? event.target.files[0] : null;
      if (uploadedFile) {
        setFile(uploadedFile);
      }
    };
  
    const handleFileUpload = async (file: File) => {
      if (!file || !squid) return;  // Ensure file and squid client are available
  
      try {
        setUploadStatus('Uploading...');
  
        // Additional parameters you may want to send
        const otherParams = { additionalInfo: 'Optional extra parameter' };
  
        const squidFile = {
          originalName: file.name,
          lastModified: file.lastModified,
          data: file.arrayBuffer(),
          size: file.size,
          mimetype: file.type
        };

        console.log('SquidFile object being sent:', squidFile);

        // Call Squid AI backend function using executeFunction
        const response = await squid.executeFunction('processResume', {
          files: [squidFile],  // Send the file(s) in an array
          otherParams,  // Any other parameters you want to send
        });

        // Log the full response to check if it's correct
        console.log('Response from Squid AI:', response);

        if (response) {
          setUploadStatus('File uploaded and processed successfully!');
          setResponseMessage(response.message);  // Display the message from backend
        } else {
          setUploadStatus('File upload failed.');
          setResponseMessage('There was an error with the file upload.');
        }
      } catch (error) {
        setUploadStatus('Error uploading file: ');
        setResponseMessage('Error during upload: ');
      }
    };
  
    return (
      <div>
        <h2>Upload Your Resume</h2>
        <input type="file" accept=".pdf, .doc, .docx, .txt" onChange={handleFileChange} />
        
        {file && (
          <div>
            <p>File Name: {file.name}</p>
            <p>File Size: {(file.size / 1024).toFixed(2)} KB</p>
            <button onClick={() => handleFileUpload(file)}>Upload to Squid AI</button>
          </div>
        )}
        
        <p>{uploadStatus}</p>
        {responseMessage && <p>{responseMessage}</p>}
      </div>
    );
  };
  
  export default FileUpload;