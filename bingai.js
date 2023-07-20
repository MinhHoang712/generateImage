import("bimg").then((bimg) => {
  const generateImageFiles = bimg.generateImageFiles;
// import fs from "fs"
// const bingai  = require('bimg');
const fs = require('fs');
const path = require('path');
const downloadPath = "download";
async function generateImg(prompt){
const imageFiles = await generateImageFiles(prompt)
// console.log(imageFiles.);
for (let index = 0; index < imageFiles.length; index++) {
    const base64ImageData = imageFiles[index]["data"]; // Replace with your base64-encoded image data

    const imageBuffer = Buffer.from(base64ImageData, 'base64');

    const ImageName = `./image${index}.jpg`; // Replace with your desired output path and filename

//     fs.writeFile(outputPath, imageBuffer, (err) => {
//         if (err) {
//             console.error('Error while saving the image:', err);
//         } else {
//             console.log('Image saved successfully!');
//         }
//     });
// }

const generatedPath = path.join(downloadPath, folder, "bing_generated");
if (!fs.existsSync(generatedPath)) {
  fs.mkdirSync(generatedPath);
}
}

});

