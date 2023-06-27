const axios = require('axios');
const fs = require('fs');
const path = require('path');
const API_TOKEN = "";
const headers = { "Authorization": `Bearer ${API_TOKEN}` };
const API_URL = "https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-base";

// Gửi POST request đến API của Hugging Face để tạo câu miêu tả ảnh
async function query(filename) {
  const data = fs.readFileSync(filename);

  const options = {
    method: "POST",
    url: API_URL,
    headers: headers,
    data: data,
    responseType: 'json'
  };

  try {
    const response = await axios(options);
    const responseData = response.data;
    return responseData;
  } catch (error) {
    console.log('Lỗi khi gửi yêu cầu:', error);
    return null;
  }
}

function saveDataToJson(data) {
  const jsonData = JSON.stringify(data, null, 2);
  fs.writeFileSync('image_to_text.json', jsonData);
}

// Thư mục chứa các tệp ảnh
const downloadPath = 'download';

// Mảng để lưu các cặp filename và generated_text
const imageData = [];

// Đọc danh sách các thư mục trong thư mục download
fs.readdir(downloadPath, async (err, folders) => {
  if (err) {
    console.log('Lỗi khi đọc thư mục download:', err);
    return;
  }

  // Duyệt qua từng thư mục
  for (const folder of folders) {
    const folderPath = path.join(downloadPath, folder);

    // Đọc danh sách các tệp ảnh trong thư mục
    const files = fs.readdirSync(folderPath);

    // Duyệt qua từng tệp ảnh trong thư mục
    for (const file of files) {
      const filePath = path.join(folderPath, file);

      const data = await query(filePath);
      if (data) {
        const filename = file;
        const generatedText = data[0]['generated_text'];

        imageData.push({
          image: filename,
          huggingface: generatedText
        });
      }
    }
  }

  // Ghi dữ liệu vào tệp JSON
  saveDataToJson(imageData);
});
