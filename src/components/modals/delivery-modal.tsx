import { DeliveryEntity } from '@/lib/data/types';
import { FormContainer, useForm } from 'react-hook-form-mui';
import { useCreateDelivery, useUpdateDelivery } from '@/lib/graphql/queries/delivery/hook';
import CustomModal from '@/components/modals/custom-modal';
import CustomTextField from '@/components/form-fields/custom-text-field';
import ErrorNotification from '@/components/error-notification';
import { useAuth } from '@/components/auth-context';
import { Box, Button } from '@mui/material';
import CustomImage from '@/components/custom-image';
import React from 'react';
import { parseImageFromLink } from '@/utils/utils';

interface IDeliveryModalProps {
    open: boolean,
    item?: DeliveryEntity,
    isSubmitDisabled?: boolean,
    isAdmin?: boolean,
    onClose: (updated?: boolean) => void
}

const imageBoxStyles = { height: '150px', maxHeight: '50vw' };

export default function DeliveryModal({ open, item, onClose, isAdmin }: IDeliveryModalProps) {
    const formContext = useForm<{
        name: string,
        imageId: string,
        imageLink: string
    }>({ defaultValues: { name: item?.name, imageId: item?.imageId } });
    const { update, updating, updatingError } = useUpdateDelivery();
    const { create, creating, creatingError } = useCreateDelivery();
    const { checkAuth } = useAuth();
    const { imageLink } = formContext.watch();

    async function onSubmit() {
        try {
            if (item) {
                await update(new DeliveryEntity({ ...item, ...formContext.getValues() }));
            } else {
                await create(new DeliveryEntity(formContext.getValues()));
            }

            onClose(true);
        } catch (err) {
            checkAuth(err);
        }
    }

    function parseImage() {
        if (!!imageLink) {
            formContext.setValue('imageId', parseImageFromLink(imageLink));
            formContext.setValue('imageLink', null);
        }
    }

    return (
        <CustomModal title={(!item ? 'Додати' : (!isAdmin ? 'Подивитися' : 'Відредагувати')) + ' спосіб доставки'}
                     open={open}
                     disableBackdropClick={true}
                     onClose={() => onClose()}
                     loading={updating || creating}
                     isSubmitDisabled={!formContext.formState.isValid}
                     onSubmit={isAdmin ? onSubmit : null}>
            <FormContainer formContext={formContext}>
                <CustomTextField fullWidth
                                 required
                                 autoFocus
                                 id="delivery-name"
                                 label="Назва"
                                 name="name"/>

                <CustomTextField fullWidth
                                 disabled={!isAdmin}
                                 id="imageLink"
                                 label="Посилання на фото"
                                 name="imageLink"/>
                {!!imageLink &&
                  <Box mt={2}><Button fullWidth variant="outlined" onClick={parseImage}>Додати фото</Button></Box>}

                <CustomTextField fullWidth
                                 disabled={!isAdmin}
                                 id="imageId"
                                 label="ID фото"
                                 name="imageId"/>

                <Box sx={imageBoxStyles} my={1}>
                    <CustomImage isBookType={true} imageId={formContext.getValues('imageId')}></CustomImage>
                </Box>
            </FormContainer>

            {(creatingError || updatingError) &&
              <ErrorNotification error={creatingError || updatingError}></ErrorNotification>
            }
        </CustomModal>
    );
}