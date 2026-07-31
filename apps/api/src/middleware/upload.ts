import multer from "multer";
import { env } from "../config/env.js";
import { AppError } from "../lib/errors.js";
import { APPROVED_MIME_TYPES } from "../lib/file-validation.js";

/** Memory storage — validated and written through the storage provider (never public static). */
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: env.MAX_UPLOAD_SIZE_MB * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, cb) => {
    if (!APPROVED_MIME_TYPES.has(file.mimetype) && file.mimetype !== "image/jpg") {
      cb(AppError.badRequest("Unsupported file type. Allowed: JPEG, PNG, WebP, PDF, DOCX."));
      return;
    }
    cb(null, true);
  },
});
