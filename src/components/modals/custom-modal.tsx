import { Box, Button } from '@mui/material';
import Modal from '@mui/material/Modal';
import { ReactNode } from 'react';
import { styleVariables, titleStyles } from '@/constants/styles-variables';
import Loading from '@/components/loading';

const modalStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
};

const mainContainerStyle = {
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: styleVariables.borderRadius,
    boxShadow: styleVariables.boxShadow,
    p: styleVariables.doublePadding
};

const innerContainer = { position: 'relative', paddingBottom: '50px' };
const childrenContainer = {
    overflow: 'auto',
    position: 'relative',
    maxHeight: 'calc(100vh - 175px)'
};

const buttonsContainerStyles = {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    marginTop: styleVariables.margin
}

interface ICustomModalProps {
    children?: ReactNode,
    title: string,
    loading: boolean,
    open: boolean,
    disableBackdropClick?: boolean,
    isSubmitDisabled?: boolean,
    onClose: () => void,
    onSubmit?: () => void
}

export default function CustomModal(props: ICustomModalProps) {
    function closeModalHandler(_event: {}, reason: 'backdropClick' | 'escapeKeyDown') {
        if (props.disableBackdropClick && reason && reason === 'backdropClick') return;
        props.onClose();
    }

    return (
        <Modal open={props.open} onClose={closeModalHandler} disableEscapeKeyDown sx={modalStyle}>
            <Box sx={mainContainerStyle}>
                <Loading show={props.loading} fullHeight={false}>
                    <Box sx={innerContainer}>
                        <Box sx={titleStyles}>{props.title}</Box>
                        <Box sx={childrenContainer}>
                            {props.children}
                        </Box>

                        <Box sx={buttonsContainerStyles}>
                            <Button variant="outlined" onClick={props.onClose}>Close</Button>
                            {props.onSubmit ?
                                <Button onClick={props.onSubmit} variant="contained" disabled={props.isSubmitDisabled}
                                        sx={{ marginLeft: styleVariables.margin }}>Submit</Button>
                                : null}
                        </Box>
                    </Box>
                </Loading>
            </Box>
        </Modal>
    );
}