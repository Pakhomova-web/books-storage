import React from 'react';

interface ICustomImageProps {
    imageId?: string,
    isBookDetails?: boolean,
    isBookType?: boolean,
    isNoComments?: boolean
}

export default function CustomImage({ imageId, isBookDetails, isBookType, isNoComments }: ICustomImageProps) {
    function getEmptySrcImage() {
        if (isBookDetails) {
            return '/book_details_empty.png';
        } else if (isBookType) {
            return '/book_type_empty.png';
        } else if (isNoComments) {
            return '/no_comments.svg';
        }
    }

    return (
        <img alt="Image" width="100%" height="100%" style={{ objectFit: 'contain' }}
             src={imageId ? `https://drive.google.com/thumbnail?id=${imageId}&sz=w1000` : getEmptySrcImage()}/>
    );
}
