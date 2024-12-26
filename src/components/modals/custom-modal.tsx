import { Box, Button, IconButton } from '@mui/material';
import Modal from '@mui/material/Modal';
import React, { ReactNode } from 'react';
import { borderRadius, styleVariables } from '@/constants/styles-variables';
import Loading from '@/components/loading';
import { FormContainer } from 'react-hook-form-mui';
import { ApolloError } from '@apollo/client';
import ErrorNotification from '@/components/error-notification';
import { CloseIcon } from 'next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon';

const modalContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
};

const mainContainerStyle = (big = false) => ({
    position: 'relative',
    width: big ? '90vw' : '400px',
    maxWidth: '90vw',
    backgroundColor: 'white',
    borderRadius,
    boxShadow: styleVariables.boxShadow,
    px: 2,
    pb: 2,
    pt: 1
});

const titleStyles = {
    ...styleVariables.titleFontSize,
    fontWeight: 'bold',
    alignItems: 'center',
    width: '100%',
    display: 'flex'
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
    title: string,
    open: boolean,
    onClose: () => void,
    children?: ReactNode,
    loading?: boolean,
    error?: ApolloError,
    disableBackdropClick?: boolean,
    isSubmitDisabled?: boolean,
    formContext?: any,
    onSubmit?: () => void,
    submitText?: string,
    actions?: { title: string, onClick: () => void }[],
    big?: boolean
}

export default function CustomModal(props: ICustomModalProps) {
    function closeModalHandler(_event: {}, reason: 'backdropClick' | 'escapeKeyDown') {
        if (props.disableBackdropClick && reason && reason === 'backdropClick') return;
        props.onClose();
    }

    function isWithActions(): boolean {
        return !!props.onSubmit || !!props.actions?.length;
    }

    return (
        <Modal open={props.open} onClose={closeModalHandler} disableEscapeKeyDown sx={modalContainerStyle}>
            <Box sx={mainContainerStyle(props.big)}>
                {props.loading && <Loading show={props.loading}></Loading>}

                <Box sx={innerContainer(isWithActions())}>
                    <Box display="flex" gap={1} mb={1} justifyContent="space-beetwen" flexWrap="nowrap">
                        <Box sx={titleStyles}>{props.title}</Box>

                        <Box>
                            <IconButton onClick={() => props.onClose()}><CloseIcon/></IconButton>
                        </Box>
                    </Box>

                    {!!props.error && <ErrorNotification error={props.error}/>}

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
                        {props.actions?.length && props.actions.map((action, index) => (
                            <Button key={index}
                                    onClick={action.onClick}
                                    variant="outlined"
                                    disabled={props.isSubmitDisabled}>{action.title}</Button>
                        ))}

                        {!!props.onSubmit &&
                          <Button onClick={props.onSubmit} variant="contained"
                                  disabled={props.isSubmitDisabled || props.loading}>
                              {props.submitText || 'Зберегти'}
                          </Button>}
                    </Box>}
                </Box>
            </Box>
        </Modal>
    );
}