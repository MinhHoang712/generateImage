# Dự án tạo ảnh và xóa văn bản

Dự án này sử dụng công nghệ xử lý ngôn ngữ tự nhiên và hình ảnh để tạo ra ảnh mới dựa trên mô tả văn bản và xóa văn bản từ các ảnh tải xuống từ Google Images.

## Cài đặt

1. Sao chép mã nguồn từ kho lưu trữ:

   ```
   git clone https://github.com/your-username/your-repo.git
   ```

2. Di chuyển vào thư mục dự án:

   ```
   cd your-repo
   ```

3. Cài đặt các gói phụ thuộc:

   ```
   npm install
   ```

## Sử dụng

1. Tìm ảnh liên quan từ Google Images:
   - Cung cấp api từ serpapi của bạn https://serpapi.com
   - Sửa đổi giá trị `q` trong file `ggsearch.js` để đặt từ khóa tìm kiếm của bạn.
   - Chạy lệnh sau để tìm ảnh liên quan từ Google Images:

     ```
     node ggsearch.js
     ```
   - Ảnh được tìm thấy sẽ được lưu trong các thư mục con của thư mục download, tên các thư mục con là nội dung tìm kiếm(giá trị 'q' trong params)

2. Trích xuất mô tả từ ảnh:
   - Cung cấp access token(API KEY) của huggingface từ: https://huggingface.co/settings/tokens
   - Sử dụng mô hình Huggingface để trích xuất mô tả từ các ảnh đã tải xuống.
   - Chạy lệnh sau để trích xuất mô tả từ ảnh:

     ```
     node image_to_text.js
     ```
   - Mô tả và ảnh tương ứng được lưu trong file image_to_text.json

3. Tạo ảnh nền dựa trên từ khóa và mô tả:
   - Cung cấp apikey của OpenAi, prompts(Mô tả tạo được từ bước 2 + keyword custom tự thêm), số lượng ảnh tạo ra và size ảnh tạo ra. Prompts nên đưa danh từ và tính từ bổ trợ danh từ đó.
   - Sử dụng mô hình DALLE để tạo ảnh nền dựa trên từ khóa và mô tả đã trích xuất.
   - Chạy lệnh sau để tạo ảnh nền:

     ```
     node generate_img.js
     ```
   - Ảnh được tạo ra nằm trong thư mục generated nằm trong các thư mục con của thư mục download

4. Xóa văn bản từ ảnh:

   - Cung cấp apikey của Clipdrop từ https://clipdrop.co/apis/account
   - Sử dụng API của Clipdrop để xóa văn bản từ các ảnh đã tạo ra.
   - Chạy lệnh sau để xóa văn bản từ ảnh:

     ```
     node clipdrop.js
     ```
   - Ảnh được tạo ra nằm trong thư mục remove_text nằm trong các thư mục con của thư mục download

5. Ghép ảnh đã xóa văn bản và ảnh chứa văn bản phù hợp:

   - Sử dụng phần mềm Photoshop hoặc các công cụ khác để ghép ảnh đã xóa văn bản và ảnh chứa văn bản phù hợp.
   - Tạo một ảnh hoàn chỉnh với văn bản đã được xóa.

## Cấu trúc thư mục

- **download**: Thư mục chứa các ảnh tải xuống từ Google Images.
- **<folder-name>** Thư mục con chứa các ảnh dựa trên từ khóa tìm kiếm.
 - **generated**: Thư mục chứa các ảnh nền đã được tạo ra từ mô hình DALLE.
 - **remove_text**: Thư mục chứa các ảnh đã xóa văn bản bằng Clipdrop.




## Yêu cầu

- Node.js (phiên bản 14 trở lên)

## Tài liệu tham khảo

- [OpenAI API Documentation](https://docs.openai.com/)
- [Clipdrop API Documentation](https://clipdrop.co/developers/)
- [Google Search Results API for Node.js](https://github.com/serpapi/google-search-results-nodejs)
- [Hugging face](https://huggingface.co/Salesforce/blip-image-captioning-large)


