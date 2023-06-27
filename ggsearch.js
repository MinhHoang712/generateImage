const SerpApi = require('google-search-results-nodejs');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
//api của serpapi. đăng nhập và lấy từ https://serpapi.com/
const search = new SerpApi.GoogleSearch("");

const params = {
  q: "Dog", // Từ khóa tìm kiếm
  engine: "google_images", // Bộ máy tìm kiếm (google_images để tìm ảnh trên Google)
  ijn: "0",//tìm kiếm ở trang đầu tiên
  tbm: "isch"
};

const downloadFolder = 'download';

// Kiểm tra và tạo thư mục download nếu chưa tồn tại
if (!fs.existsSync(downloadFolder)) {
  fs.mkdirSync(downloadFolder);
}

// Hàm tải xuống ảnh từ URL và lưu vào đường dẫn cụ thể
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

// Hàm callback được gọi khi nhận được kết quả từ API tìm kiếm
const callback = async function(data) {
  const images = data["images_results"];
  var images_num = 0; // Số lượng ảnh đã tải xuống
  try {
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      const imageUrl = image.original;
      const imageExtension = path.extname(imageUrl).split('?')[0];
      const downloadPath = path.join(downloadFolder, params.q)
      
      // Kiểm tra và tạo thư mục download cho từng từ khóa nếu chưa tồn tại
      if (!fs.existsSync(downloadPath)) {
        fs.mkdirSync(downloadPath);
      }
      
      // Kiểm tra định dạng ảnh và chỉ tải xuống ảnh có định dạng jpg, jpeg, png
      if ([".jpg", ".jpeg", ".png"].includes(imageExtension.toLowerCase())) {
        const imageName = `${params.q}_${images_num + 1}${imageExtension}`;
        const imagePath = path.join(downloadPath, imageName);
    
        if (images_num < 5) { // Chỉ tải xuống 5 ảnh
          images_num += 1;
          await downloadImage(imageUrl, imagePath);
          console.log('Đã tải xuống ảnh:', imageName);
        } else {
          break;
        }
      }
    }
  } catch (error) {
    console.log('Lỗi:', error);
  }
};

// Gửi yêu cầu tìm kiếm và gọi hàm callback khi có kết quả trả về
search.json(params, callback);
