import multer from "multer";
import { Request } from "express";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) {
    // Use absolute path for uploads directory
    const uploadsDir = path.join(process.cwd(), "uploads");

    // Ensure uploads directory exists
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
  filename: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: function (req: Request, file: Express.Multer.File, cb: any) {
    // Add file type validation
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"));
    }
  },
});

export default upload;
