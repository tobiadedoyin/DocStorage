import { Request, Response, NextFunction, Express } from "express";
import cloudinary from "../config/cloudinaryConfig";
import { handleResponse } from "../utils/handleResponse";
import { apiCodes } from "../utils/apiCodes";
import userFile from "../db/dbconfig";

interface CustomUploadedFile extends Express.Multer.File {
  tempFilePath: string;
}

export const upload_file = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const file = req.files?.image as unknown as Express.Multer.File & {
    tempFilePath: string;
  };

  try {
    const folderName = req.body.folderName;
    if (!file) {
      return handleResponse(res, apiCodes.forbidden, "No file Selected", []);
    }
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      public_id: `${folderName}/${Date.now()}`,
      resource_type: "auto",
    });

    const saveFile = await userFile.query(
      "INSERT INTO files (filename, path) VALUES ($1, $2) returning *",
      [result.public_id, result.secure_url]
    );

    return res.status(200).json({
      public_id: result.public_id,
      url: result.secure_url,
      data: saveFile.rows,
    });
  } catch (error) {
    next(error);
  }
};

export const downloadFile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const publicId = req.params.public_id;
    const folderName = req.params.folderName;
    const cloudinaryUrl = `https://res.cloudinary.com/dpkubt8fq/image/upload/v1693215576/${folderName}/${publicId}`;

    res.redirect(cloudinaryUrl);
  } catch (error) {
    next(error);
  }
};

export const create_folder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const folderName = req.body.folderName;
    const folderResult = await cloudinary.api.create_folder(folderName);

    if (folderResult.result === "ok") {
      res.status(200).json({ message: "Folder created successfully" });
    } else {
      res.status(500).json({ message: "Error creating folder" });
    }
  } catch (error) {
    console.error("An error occurred", error);
    res.status(500).json({ message: "Error creating folder" });
  }
};
