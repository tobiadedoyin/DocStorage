import { Response } from "express";

export const handleResponse = (
  res: Response,
  statusCode: number,
  message: string,
  data: any,
  extraFields: boolean = true
) => {
  if (extraFields) {
    return res.json({ statusCode, message, data });
  }
  return res.json(data);
};
