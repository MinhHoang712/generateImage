// Có thể bạn sẽ cần thêm tham số "--experimental-json-modules" khi chạy Node.js để hỗ trợ ES modules
// Ví dụ: node --experimental-json-modules generate_img_bing.js

import { generateImageFiles } from "bimg";
import fs from 'fs';
import path from 'path';

const downloadPath = "download";

async function generateImage(prompt, imageName, folder, imageIndex) {
  try {
    const imageFiles = await generateImageFiles(prompt);

    // Chỉ lấy ảnh đầu tiên từ mảng imageFiles
    const base64ImageData = imageFiles[0]["data"]; // Replace with your base64-encoded image data

    const imageBuffer = Buffer.from(base64ImageData, 'base64');

    const generatedPath = path.join(downloadPath, folder, "bing_generated");

    // Kiểm tra và tạo thư mục generated trong thư mục con nếu chưa tồn tại
    if (!fs.existsSync(generatedPath)) {
      fs.mkdirSync(generatedPath);
    }

    const generatedImageName = `${folder}_${imageIndex}_generated.jpg`;
    const imagePath = path.join(generatedPath, generatedImageName);

    fs.writeFile(imagePath, imageBuffer, (err) => {
      if (err) {
        console.error('Error while saving the generated image:', err);
      } else {
        console.log(`Đã tạo và lưu ảnh thành công: ${generatedImageName}`);
      }
    });
  } catch (error) {
    console.log("Lỗi khi tạo ảnh từ bimg:", error);
  }
}

// Lấy danh sách các thư mục con trong thư mục download
const subFolders = fs.readdirSync(downloadPath);

// Lặp qua từng thư mục con
for (const subFolder of subFolders) {
  const imageToTextPath = path.join(downloadPath, subFolder, "image_to_text.json");

  // Kiểm tra xem file image_to_text.json đã tồn tại trong thư mục con hay chưa
  if (fs.existsSync(imageToTextPath)) {
    const imageToTextData = fs.readFileSync(imageToTextPath, 'utf-8');
    const imageToText = JSON.parse(imageToTextData);
    const generatedPath = path.join(downloadPath, subFolder, "bing_generated");
    if (!fs.existsSync(generatedPath)) {
      // Lặp qua từng cặp ảnh và mô tả trong file image_to_text.json
      imageToText.forEach(({ image, huggingface }, index) => {
        const prompt = huggingface;
        const imageName = image;

        generateImage(prompt, imageName, subFolder, index + 1);
      });
    } else {
      console.log(`Thư mục generated đã tồn tại trong thư mục ${subFolder}, bỏ qua tạo ảnh mới.`);
    }
  }
}
