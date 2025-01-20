import { ImageResponse } from '@vercel/og'
import { getBookImageById } from '@/lib/data/books';
import { NextApiRequest, NextApiResponse } from 'next';

export const contentType = 'image/png';
export const size = {
    width: 1200,
    height: 630,
};


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { id } = req.query;
    const imageId = await getBookImageById(id as string);

    try {
        return new ImageResponse(<div
            style={{
                fontSize: 128,
                background: 'white',
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
            {imageId}
        </div>, size);
    } catch (e) {
        return new Response(`Failed to generate image`, { status: 500 })
    }
};
