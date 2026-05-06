import multer, { memoryStorage } from "multer";

export function multerUploadFile() {
    return multer({storage:memoryStorage()})
}