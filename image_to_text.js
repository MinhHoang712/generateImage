const axios = require('axios');
const fs = require('fs');
const path = require('path');
import 'dotenv';

const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;
const headers = { "Authorization": `Bearer ${HUGGINGFACE_API_KEY}` };
const API_URL = "https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-base";

// Gửi POST request đến API của Hugging Face để tạo câu miêu tả ảnh
async function query(filename) {
  // Kiểm tra xem filename là một tệp ảnh hợp lệ hay không
  try {
    const stats = fs.statSync(filename);
    if (!stats.isFile()) {
      // console.log('Đây không phải là tệp ảnh:', filename);
      return null;
    }
  } catch (error) {
    console.log('Lỗi khi kiểm tra tệp ảnh:', error);
    return null;
  }

  // Tiếp tục xử lý khi filename là một tệp ảnh hợp lệ
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
    // console.log('Lỗi khi gửi yêu cầu:', error);
    return null;
  }
}

function saveDataToJson(data, folderPath) {
  const jsonData = JSON.stringify(data, null, 2);
  const jsonPath = path.join(folderPath, 'image_to_text.json');
  fs.writeFileSync(jsonPath, jsonData);
}

// Thư mục chứa các tệp ảnh
const downloadPath = 'download';

// Đọc danh sách các thư mục con trong thư mục download
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
    const imageData = []; // Khởi tạo mảng imageData cho mỗi thư mục con
    for (const file of files) {
      const filePath = path.join(folderPath, file);

      const data = await query(filePath);
      if (data) {
        const filename = file;
        const generatedText = data[0]['generated_text'];

        imageData.push({
          image: filename,
          huggingface: generatedText,
          folder: folder // Thêm thông tin về đường dẫn thư mục con vào mỗi cặp filename và generated_text
        });
      }
    }

    // Ghi dữ liệu vào tệp JSON trong thư mục con tương ứng
    saveDataToJson(imageData, folderPath);

    // Xóa dữ liệu trong mảng imageData để tiếp tục với thư mục con tiếp theo
    imageData.length = 0;
  }
});
