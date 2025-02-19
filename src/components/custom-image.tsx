import React from 'react';

interface ICustomImageProps {
    imageId?: string,
    imageLink?: string,
    isBookDetails?: boolean,
    isBookType?: boolean
}

export default function CustomImage({
                                        imageId,
                                        imageLink,
                                        isBookDetails,
                                        isBookType
                                    }: ICustomImageProps) {
    function getEmptySrcImage() {
        if (isBookDetails) {
            return '/book_details_empty.png';
        } else if (isBookType) {
            return '/book_type_empty.png';
        }
    }

    function getImage() {
        if (imageId) {
            return `https://drive.google.com/thumbnail?id=${imageId}&sz=w1000`;
        } else if (imageLink) {
            return imageLink;
        } else {
            return getEmptySrcImage();
        }
    }

    return (
        getImage() &&
        <img alt="Image" width="100%" height="100%" src={getImage()}/>
    );
}
