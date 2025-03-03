import { executable, secureDatabase, SquidService, webhook, SquidFile } from '@squidcloud/backend';
import { Buffer } from 'buffer';

/**
 * Here you can define different backend functions that:
 * 1 - Can be called from the frontend
 * 2 - Can secure data access
 * 3 - Can be called as a trigger
 * 4 - Can define a webhook
 * 5 - Can be called as a scheduler
 * 6 - And more
 *
 * Note: This code will be executed in a secure environment and can perform any operation including database access,
 * API calls, etc.
 *
 * For more information and examples see: https://docs.squid.cloud/docs/development-tools/backend/
 */
export class ExampleService extends SquidService {
  // TODO: !!!IMPORTANT!!! - Replace this function with your own granular security rules
  @secureDatabase('all', 'built_in_db')
  allowAllAccessToBuiltInDb(): boolean {
    return true;
  }

  @webhook('example-service-webhook')
  handleExampleServiceWebhook(): object {
    const response = {
      message: `Hello from 'example-service-webhook'`,
      date: new Date().toString(),
      appId: this.context.appId,
    };
    console.log(response); // This message will appear in the "Logs" tab of the Squid Console.
    return response;
  }

  @executable()
  concat(str1: string, str2: string): string {
    return `${str1}${str2}`;
  }


  @executable()
  async processResume(request: { files: Array<SquidFile>, otherParams: any }): Promise<{ status: string, message: string }> {
    try {
      const { files, otherParams } = request;

      if (files.length === 0) {
        return { status: 'failed', message: 'No files uploaded' };
      }

      console.log('Received request:', request);

      const file = files[0];
      console.log('Received SquidFile:', file.data);

      // Check if file.data exists before proceeding
      if (!file.data) {
        return { status: 'failed', message: 'No data found in the uploaded file' };
      }

      // Check the type of file.data
      console.log('Type of file.data:', typeof file.data);      

      // Check if the SquidFile contains the necessary properties
      const fileName = file.originalName || 'default_name.txt';  // Fallback name if originalName is missing pdf
      const mimeType = file.mimetype || '1';  // Fallback MIME type if mimetype is missing application/pdf

      let fileData: Buffer | null = null;  // Initializing with null

      // Check if file.data is a string (base64), process it
      if (typeof file.data === 'string') {
        // Here we assert that file.data is definitely a string.
        const base64Data = (file.data as string).replace(/^data:.+;base64,/, '');  // Remove data URL prefix
        fileData = Buffer.from(base64Data, 'base64');  // Decode the base64 string
      } else if (file.data instanceof ArrayBuffer) {
        fileData = Buffer.from(file.data);  // If it's ArrayBuffer, convert it directly
      } else if (file.data instanceof Uint8Array) {
        fileData = Buffer.from(file.data.buffer);  // If it's Uint8Array, use its buffer
      }
      
      // Check if fileData is null before proceeding
      if (!fileData) {
        return { status: 'failed', message: 'File data is invalid' };
      }

      console.log("Decoded file data:", fileData);

      // Continue processing...
      const convertedFile = new File([fileData], fileName, {
        type: mimeType,
        lastModified: Date.now(),
      });
  
      // Log the entire converted file object to inspect its properties
      console.log("Converted file:", convertedFile);



      // Use Squid AI's built-in storage API to upload the file
      const doc = this.squid.collection('testCollection').doc();  // Use the appropriate collection
      await doc.insert(convertedFile);  // Insert the file into Squid AI's built-in storage

      console.log('File uploaded to Squid AI storage:', convertedFile);


      // Here you would typically process the file, for example:
      // - Parse the resume
      // - Extract information
      // - Send the information to an AI model

      const doc1 = this.squid.collection('test1').doc();
      await doc.insert(convertedFile);

      const data = {
        file: file,  // Pass the file directly (SquidFile type is accepted)
        name: file.originalName,
      };

      const extractionClient = this.squid.extraction();

      const extractedResult = await extractionClient.extractDataFromDocumentFile(convertedFile);
      console.log('Extracted text:' + extractedResult.pages[0].text); // Extracted text of the first page

      // Example response after processing the resume
      return { status: 'success', message: `File ${file.originalName} processed successfully! ${extractedResult.pages[0].text}` };
    } catch (error) {
      return { status: 'failed', message: `Error processing the file: ${error.message}` };
    }
  }

}
