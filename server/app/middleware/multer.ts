import multer from "multer";
import { Request } from "express";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: function (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) {
    const uploadsDir = path.join(process.cwd(), "uploads");

    if (!fs.existsSync(uploadsDir)) {
      try {
        fs.mkdirSync(uploadsDir, { recursive: true });
        console.log("Created uploads directory:", uploadsDir);
      } catch (error) {
        console.error("Failed to create uploads directory:", error);
        return cb(error as Error, uploadsDir);
      }
    }

    cb(null, uploadsDir);
  },
  filename: function (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const imageFileFilter = function (
  req: Request,
  file: Express.Multer.File,
  cb: any
) {
  const allowedImageTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedImageTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedImageTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"));
  }
};

const audioFileFilter = function (
  req: Request,
  file: Express.Multer.File,
  cb: any
) {
  const allowedAudioTypes = /mp3|wav|m4a|aac|ogg|flac/;
  const extname = allowedAudioTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = file.mimetype.startsWith("audio/");

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Only audio files are allowed!"));
  }
};

const mediaFileFilter = function (
  req: Request,
  file: Express.Multer.File,
  cb: any
) {
  const allowedImageTypes = /jpeg|jpg|png|gif|webp/;
  const allowedAudioTypes = /mp3|wav|m4a|aac|ogg|flac/;

  const extname =
    allowedImageTypes.test(path.extname(file.originalname).toLowerCase()) ||
    allowedAudioTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype =
    allowedImageTypes.test(file.mimetype) || file.mimetype.startsWith("audio/");

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Only image and audio files are allowed!"));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
  fileFilter: mediaFileFilter,
});

const uploadImage = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: imageFileFilter,
});

const uploadAudio = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
  fileFilter: audioFileFilter,
});

export default upload;
export { uploadImage, uploadAudio };
