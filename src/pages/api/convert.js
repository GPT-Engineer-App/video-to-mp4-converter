import { exec } from "child_process";
import { promisify } from "util";
import formidable from "formidable";
import fs from "fs";
import path from "path";

const execPromise = promisify(exec);

export const config = {
  api: {
    bodyParser: false,
  },
};

const convertVideo = async (filePath, outputFilePath) => {
  const command = `ffmpeg -i ${filePath} ${outputFilePath}`;
  await execPromise(command);
};

export default async (req, res) => {
  const form = new formidable.IncomingForm();
  form.uploadDir = "./uploads";
  form.keepExtensions = true;

  form.parse(req, async (err, fields, files) => {
    if (err) {
      res.status(500).send("Error parsing the file.");
      return;
    }

    const file = files.file;
    const outputFilePath = path.join("./uploads", "converted.mp4");

    try {
      await convertVideo(file.path, outputFilePath);
      res.download(outputFilePath, "converted.mp4", (err) => {
        if (err) {
          res.status(500).send("Error downloading the file.");
        }

        fs.unlink(file.path, () => {});
        fs.unlink(outputFilePath, () => {});
      });
    } catch (error) {
      res.status(500).send("Error converting the video.");
    }
  });
};