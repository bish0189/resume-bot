import React from 'react';
import './App.css';
import FileUpload from './components/uploadResume';
import FileUploadTest from './components/uploadTest';

const App: React.FC = () => {
  return (
    <div className="App">
      <h1>Resume Upload Portal</h1>
      <FileUploadTest />
    </div>
  );
}

export default App;
