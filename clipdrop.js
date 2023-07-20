const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

// Đường dẫn đến thư mục "download"
const downloadPath = path.join(__dirname, 'download');

// Thay thế bằng thông tin xác thực Clipdrop API của bạn https://clipdrop.co/apis/account
const API_KEY = 'a55a2f1b67582ccc992f2c48a5eb87d4b3a04f65d62685836631efb70eab068a0cee9a13378d227e55351c80f9808d3a';

if (!API_KEY) {
  console.log("Hãy cung cấp api_key");
}

// Hàm gửi yêu cầu API Clipdrop để xóa văn bản từ ảnh
async function removeTextFromImage(imagePath, outputDirectory) {
  try {
    const form = new FormData();
    form.append('image_file', fs.createReadStream(imagePath));

    const response = await fetch('https://clipdrop-api.co/remove-text/v1', {
      method: 'POST',
      headers: {
        'x-api-key': API_KEY,
      },
      body: form,
    });

    const buffer = await response.arrayBuffer();

    // Lưu ảnh đã xóa văn bản vào thư mục "remove_text"
    const fileName = path.basename(imagePath);
    const editedFileName = fileName.replace('.jpg', '_rmv.jpg');
    const editedImagePath = path.join(outputDirectory, editedFileName);
    fs.writeFileSync(editedImagePath, Buffer.from(buffer));

    console.log(`Đã xóa văn bản từ ảnh và lưu thành công: ${editedImagePath}`);
  } catch (error) {
    console.log('Lỗi khi xóa văn bản từ ảnh:', error);
  }
}

// Đọc danh sách thư mục con trong thư mục "download"
fs.readdir(downloadPath, (err, folders) => {
  if (err) {
    console.log('Lỗi khi đọc thư mục "download":', err);
    return;
  }

  // Lặp qua từng thư mục con
  folders.forEach(folder => {
    const generatedPath = path.join(downloadPath, folder, 'generated');
    const removeTextPath = path.join(downloadPath, folder, 'remove_text');
    const imageToTextPath = path.join(downloadPath, folder, 'image_to_text.json');

    // Kiểm tra xem file image_to_text.json đã tồn tại trong thư mục con hay không
    const imageToTextExists = fs.existsSync(imageToTextPath);

    // Kiểm tra xem thư mục "generated" và "remove_text" đã tồn tại trong thư mục con hay chưa
    const generatedDirectoryExists = fs.existsSync(generatedPath);
    const removeTextDirectoryExists = fs.existsSync(removeTextPath);

    // Nếu đã tồn tại cả hai "image_to_text.json" và "generated" và chưa có "remove_text"
    if (imageToTextExists && generatedDirectoryExists && !removeTextDirectoryExists) {
      fs.mkdirSync(removeTextPath); // Tạo thư mục "remove_text" nếu chưa tồn tại

      // Đọc danh sách tệp ảnh từ thư mục "generated" và áp dụng xóa văn bản
      fs.readdir(generatedPath, (err, files) => {
        if (err) {
          console.log(`Lỗi khi đọc thư mục "generated" trong ${folder}:`, err);
          return;
        }

        // Lặp qua từng tệp ảnh và áp dụng xóa văn bản
        files.forEach(file => {
          const imagePath = path.join(generatedPath, file);
          removeTextFromImage(imagePath, removeTextPath);
        });
      });
    } else {
      // console.log(`Không thực hiện xóa văn bản trong thư mục ${folder}.`);
    }
  });
});
