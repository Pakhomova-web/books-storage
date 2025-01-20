import { ImageResponse } from 'next/og'
import CustomImage from '@/components/custom-image';
import { getBookImageById } from '@/lib/data/books';
import { Box } from '@mui/material';

export const size = {
    width: 1200,
    height: 630,
};

export default async function Image({ params }: { params: { id: string } }) {
    const imageId = await getBookImageById(params.id);

    return new ImageResponse(<Box>Test <CustomImage imageId={imageId}/></Box>, size);
};
