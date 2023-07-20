const axios = require('axios');
const fs = require('fs');
const path = require('path');
import 'dotenv';

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GOOGLE_CX_ID = process.env.GOOGLE_CX_ID;

const downloadFolder = 'download';

if (!fs.existsSync(downloadFolder)) {
  fs.mkdirSync(downloadFolder);
}

const downloadImage = async (imageUrl, imagePath) => {
  try {
    const response = await axios({
      method: 'get',
      url: imageUrl,
      responseType: 'stream'
    });

    response.data.pipe(fs.createWriteStream(imagePath));

    return new Promise((resolve, reject) => {
      response.data.on('end', () => {
        resolve();
      });

      response.data.on('error', (error) => {
        reject(error);
      });
    });
  } catch (error) {
    throw new Error(`Lỗi khi tải xuống ảnh: ${error}`);
  }
};

const searchImages = async (keyword) => {
  const params = {
    key: GOOGLE_API_KEY,
    cx: GOOGLE_CX_ID,
    q: keyword,
    searchType: "image",
  };

  const response = await axios.get("https://www.googleapis.com/customsearch/v1", {
    params: params
  });

  return response.data.items;
};

const createFolder = (keyword) => {
  const now = new Date();
  const formattedDate = `${now.getDate()}_${now.getMonth() + 1}_${now.getFullYear()}_${now.getHours()}_${now.getMinutes()}_${now.getSeconds()}`;
  return `${keyword}_${formattedDate}`;
};

const isValidImageExtension = (extension) => {
  const validExtensions = ['.jpg', '.jpeg', '.png'];
  return validExtensions.includes(extension.toLowerCase());
};

const searchAndDownloadImages = async (keyword) => {
  try {
    const imageResults = await searchImages(keyword);

    const downloadPath = path.join(downloadFolder, createFolder(keyword));

    if (!fs.existsSync(downloadPath)) {
      fs.mkdirSync(downloadPath);
    }

    const imagesToDownload = Math.min(imageResults.length, 5);

    for (let i = 0; i < imagesToDownload; i++) {
      const image = imageResults[i];
      const imageUrl = image.link;
      const imageExtension = path.extname(imageUrl).split('?')[0];

      if (isValidImageExtension(imageExtension)) {
        const imageName = `${keyword}_${i + 1}${imageExtension}`;
        const imagePath = path.join(downloadPath, imageName);
        
        try {
          await downloadImage(imageUrl, imagePath);
          console.log('Đã tải xuống ảnh:', imageName);
        } catch (error) {
          console.log('Lỗi khi tải xuống ảnh:', imageUrl);
          // Xóa ảnh không tải xuống thành công
          fs.unlinkSync(imagePath);
          continue
        }
      } else {
        console.log('Ảnh không hợp lệ:', imageUrl);
        // fs.unlinkSync(imagePath);
      }
    }
  } catch (error) {
    console.log('Lỗi:', error);
  }
};

module.exports = searchAndDownloadImages;