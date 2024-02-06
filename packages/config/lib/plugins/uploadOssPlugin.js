var OSS = require("ali-oss");
const glob = require("glob");
const fs = require("fs");
const path = require("path");
// const getEntry = require("../util").getEntry;
const constVar = require("../const.js");
const from = "dist";
const { OSS_CONFIG } = constVar;

class UploadOssPlugin {
  apply(compiler) {
    const _this = this;
    compiler.hooks.done.tap("after-emit", function () {
      const entryMap = getEntry();
      Object.keys(entryMap).forEach((fileName) => {
        const files = fs.readdirSync(`${from}/${fileName}`);
        files.forEach((file) => {
          _this.readDir(`${from}/${fileName}/${file}`, file);
        });
      });
    });
  }
  readDir(path, fileName) {
    const _this = this;
    // 如果是文件夹
    if (fs.statSync(path).isDirectory()) {
      fs.readdir(path, (err, files) => {
        if (err) {
          throw err;
        }
        files.forEach((file) => {
          // 递归读取文件夹
          _this.readDir(path + "/" + file, file);
        });
      });
    } else if (!fileName.includes("html")) {
      _this.uploadOss(path, fileName);
    }
  }
  async uploadOss(path, fileName) {
    const client = new OSS(OSS_CONFIG);
    const uploadPath = path.replace(/dist\//, "user/", fileName);
    fs.readFile(path, async (err, data) => {
      if (err) {
        throw err;
      }
      try {
        const { res } = await client.put(uploadPath, data);
        if (res.status === 200) {
          console.log("上传成功：", uploadPath);
        } else {
          console.log("status !== 200, 上传失败:", res);
        }
      } catch (err) {
        console.log("上传失败：", uploadPath);
      }
    });
  }
}

module.exports = UploadOssPlugin;
