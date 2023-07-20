const { exec } = require('child_process');
const ggSearch = require('./ggsearch');
// Hàm chạy file JavaScript
function runScript(scriptName) {
  return new Promise((resolve, reject) => {
    console.log(`Đang chạy script: ${scriptName}`);
    const child = exec(`node ${scriptName}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Lỗi khi chạy ${scriptName}:`, error);
        reject(error);
      } else {
        console.log(stdout);
        console.log(`Hoàn thành chạy script: ${scriptName}`);
        resolve();
      }
    });

    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);
  });
}

// Chạy các file JavaScript lần lượt
async function runAllScripts() {
  try {
    await ggSearch("Gà rán")
    await runScript('image_to_text.js');
    await runScript('generate_img.js');
    await runScript('generate_img_bing.js');
    await runScript('clipdrop.js');
  } catch (error) {
    console.error('Đã xảy ra lỗi khi chạy các file JavaScript:', error);
  }
}

runAllScripts();
