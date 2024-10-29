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
        <CustomModal open={props.open} onClose={props.onClose} big={true}>
            <Grid container spacing={2} display="flex" justifyContent="center">
                <Grid item xs={12} md={3} lg={2}>
                    <StyledImageBox>
                        <CustomImage imageId={props.imageIds[0]}></CustomImage>
                    </StyledImageBox>
                </Grid>

                {props.imageIds.map((imageId, index) => (
                    !!index && <Grid key={index} item xs={12} md={8} lg={5}>
                      <StyledImageBox>
                        <CustomImage imageId={imageId}></CustomImage>
                      </StyledImageBox>
                    </Grid>
                ))}
            </Grid>
        </CustomModal>
    );
}