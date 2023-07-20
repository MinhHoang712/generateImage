const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { Configuration, OpenAIApi } = require("openai");
import "dotenv/config";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const downloadPath = "download";

async function generateImage(prompt, imageName, folder, imageIndex) {
  try {
    const response = await openai.createImage({
      prompt: prompt,
      n: 1,
      size: "256x256",
    });
    const imageUrl = response.data.data[0].url;

    const generatedPath = path.join(downloadPath, folder, "generated");

    // Kiểm tra và tạo thư mục generated trong thư mục con nếu chưa tồn tại
    if (!fs.existsSync(generatedPath)) {
      fs.mkdirSync(generatedPath);
    }

    const generatedImageName = `${folder}_${imageIndex}_generated.jpg`;
    const imagePath = path.join(generatedPath, generatedImageName);

    const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const imageData = Buffer.from(imageResponse.data, 'binary');
    fs.writeFileSync(imagePath, imageData);

    console.log(`Đã tạo và lưu ảnh thành công: ${generatedImageName}`);
  } catch (error) {
    console.log("Lỗi khi tạo ảnh từ OpenAI:", error);
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
    const generatedPath = path.join(downloadPath, subFolder, "generated");
    if (!fs.existsSync(generatedPath)) {
    // Lặp qua từng cặp ảnh và mô tả trong file image_to_text.json
    imageToText.forEach(({ image, huggingface }, index) => {
      const prompt = huggingface;
      const imageName = image;

      generateImage(prompt, imageName, subFolder, index + 1);
    });
  }
    else {
      console.log(`Thư mục generated đã tồn tại trong thư mục ${subFolder}, bỏ qua tạo ảnh mới.`);
    }
  }
}
