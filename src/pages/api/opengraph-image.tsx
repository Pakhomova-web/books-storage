import { ImageResponse } from 'next/og'
import { getBookImageById } from '@/lib/data/books';
import { NextApiRequest, NextApiResponse } from 'next';
import CustomImage from '@/components/custom-image';

export const contentType = 'image/png';
export const size = {
    width: 1200,
    height: 630,
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;
    const imageId = await getBookImageById(id as string);

    try {
        return new ImageResponse(<CustomImage imageId={imageId}/>, size);
    } catch (e) {
        return new Response(`Failed to generate image`, { status: 500 })
    }
};
