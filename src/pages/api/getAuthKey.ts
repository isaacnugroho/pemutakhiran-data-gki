import { NextApiRequest, NextApiResponse } from 'next';

type ResponseData = {
  authKey: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  res.status(200).json({ 
    authKey: process.env.PREFILLED_FORM_ID || "Not Set" 
  });
}
