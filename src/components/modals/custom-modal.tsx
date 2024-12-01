import { Box, Button } from '@mui/material';
import Modal from '@mui/material/Modal';
import React, { ReactNode } from 'react';
import { borderRadius, styleVariables } from '@/constants/styles-variables';
import Loading from '@/components/loading';
import { FormContainer } from 'react-hook-form-mui';

const modalContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
};

const mainContainerStyle = (big = false) => ({
    position: 'relative',
    width: big ? '90vw' : '400px',
    maxWidth: '90vw',
    bgcolor: 'background.paper',
    borderRadius,
    boxShadow: styleVariables.boxShadow,
    p: 2
});

const titleStyles = {
    ...styleVariables.titleFontSize,
    fontWeight: 'bold'
};

const innerContainer = (withActions = true) => ({
    position: 'relative',
    paddingBottom: withActions ? '50px' : 0
});

const childrenContainer = {
    overflow: 'auto',
    position: 'relative',
    maxHeight: 'calc(100svh - 200px)',
    overflowX: 'hidden'
};

const buttonsContainerStyles = {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    marginTop: 2
}

interface ICustomModalProps {
    children?: ReactNode,
    title?: string,
    loading?: boolean,
    open: boolean,
    disableBackdropClick?: boolean,
    isSubmitDisabled?: boolean,
    onClose?: () => void,
    hideSubmit?: boolean,
    formContext?: any,
    onSubmit?: () => void,
    actions?: { title: string, onClick: () => void }[],
    big?: boolean
}

export default function CustomModal(props: ICustomModalProps) {
    function closeModalHandler(_event: {}, reason: 'backdropClick' | 'escapeKeyDown') {
        if (props.disableBackdropClick && reason && reason === 'backdropClick') return;
        if (props.onClose) {
            props.onClose();
        }
    }

    function isWithActions(): boolean {
        return !!props.onClose || (!props.hideSubmit && !!props.onSubmit) || !!props.actions?.length;
    }

    return (
        <Modal open={props.open} onClose={closeModalHandler} disableEscapeKeyDown sx={modalContainerStyle}>
            <Box sx={mainContainerStyle(props.big)}>
                {props.loading && <Loading show={props.loading}></Loading>}

                <Box sx={innerContainer(isWithActions())}>
                    {!!props.title && <Box sx={titleStyles} pb={2}>{props.title}</Box>}

                    <Box sx={childrenContainer} pt={1}>
                        {!!props.formContext ?
                            <FormContainer formContext={props.formContext}
                                           handleSubmit={props.formContext.handleSubmit(props.onSubmit)}>
                                {props.children}

                                <Box display="none">
                                    <Button type="submit">Зберегти</Button>
                                </Box>
                            </FormContainer> :
                            props.children}
                    </Box>

                    {isWithActions() && <Box sx={buttonsContainerStyles} gap={2}>
                        {props.onClose && <Button variant="outlined" onClick={props.onClose}>Закрити</Button>}
                        {!props.hideSubmit && props.onSubmit ?
                            <Button onClick={props.onSubmit} variant="contained" disabled={props.isSubmitDisabled || props.loading}>
                                Зберегти
                            </Button>
                            : null}
                        {props.actions?.length && props.actions.map((action, index) => (
                            <Button key={index}
                                    onClick={action.onClick}
                                    variant="contained"
                                    disabled={props.isSubmitDisabled}>{action.title}</Button>
                        ))}
                    </Box>}
                </Box>
            </Box>
        </Modal>
    );
}