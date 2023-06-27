const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { Configuration, OpenAIApi } = require("openai");

const OPENAI_API_KEY = "";

const configuration = new Configuration({
    apiKey: OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const imageToTextPath = path.join(__dirname, 'image_to_text.json');
const imageToTextData = fs.readFileSync(imageToTextPath, 'utf-8');
const imageToText = JSON.parse(imageToTextData);
const downloadPath = "download";

async function generateImage(prompt, imageName, folder) {
  try {
    const response = await openai.createImage({
      prompt: prompt,
      n: 1,
      size: "256x256",
    });
    const imageUrl = response.data.data[0].url;
    // console.log("Generated image URL:", imageUrl);

    const generatedPath = path.join(downloadPath, folder, "generated");

    // Kiểm tra và tạo thư mục generated cho từng thư mục con nếu chưa tồn tại

    if (!fs.existsSync(generatedPath)) {
      fs.mkdirSync(generatedPath);
    }

    const generatedImageName = imageName.replace('.jpg', '_generated.jpg');
    const imagePath = path.join(generatedPath, generatedImageName);

    const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const imageData = Buffer.from(imageResponse.data, 'binary');
    fs.writeFileSync(imagePath, imageData);

    console.log(`Đã tạo và lưu ảnh thành công: ${generatedImageName}`);
  } catch (error) {
    console.log("Lỗi khi tạo ảnh từ OpenAI:", error);
  }
}

imageToText.forEach(({ image, huggingface }) => {
  const prompt = huggingface;
  const imageName = image;
  const folderName = imageName.split('_')[0]; // Lấy tên thư mục con từ tên ảnh

  generateImage(prompt, imageName, folderName);
});
