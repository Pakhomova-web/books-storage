import { Box, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';

import CustomModal from '@/components/modals/custom-modal';
import CustomImage from '@/components/custom-image';

const StyledImageBox = styled(Box)(() => ({
    height: '70vh'
}));

interface IImagesModalProps {
    open: boolean,
    imageIds: string[],
    onClose: () => void
}

export default function ImagesModal(props: IImagesModalProps) {
    return (
        <CustomModal open={props.open} onClose={props.onClose} big={true} title="Зображення">
            <Grid container spacing={1} display="flex" justifyContent="center">
                {props.imageIds.map((imageId, index) => (
                    <Grid key={index} item xs={12} md={6}>
                        <StyledImageBox>
                            <CustomImage imageId={imageId}></CustomImage>
                        </StyledImageBox>
                    </Grid>
                ))}
            </Grid>
        </CustomModal>
    );
}