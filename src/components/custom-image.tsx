import React from 'react';

interface ICustomImageProps {
    imageId?: string
}

export default function CustomImage({ imageId }: ICustomImageProps) {
    return (
        <img alt="Image" width="100%" height="100%" style={{ objectFit: 'contain' }}
             src={imageId ? `https://drive.google.com/thumbnail?id=${imageId}&sz=w1000` : '/book-empty.jpg'}/>
    );
}
