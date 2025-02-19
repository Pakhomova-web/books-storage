import { DeliveryEntity } from '@/lib/data/types';
import { useForm } from 'react-hook-form-mui';
import { useCreateDelivery, useUpdateDelivery } from '@/lib/graphql/queries/delivery/hook';
import CustomModal from '@/components/modals/custom-modal';
import CustomTextField from '@/components/form-fields/custom-text-field';
import ErrorNotification from '@/components/error-notification';
import { useAuth } from '@/components/auth-context';
import { Box, Button } from '@mui/material';
import CustomImage from '@/components/custom-image';
import React from 'react';
import { parseImageFromLink, trimValues } from '@/utils/utils';

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

    function onSubmit() {
        const data = new DeliveryEntity({ ...(item ? item : {}), ...trimValues(formContext.getValues()) });
        const promise = item ? update(data) : create(data);

        promise
            .then(() => onClose(true))
            .catch(err => checkAuth(err));
    }

    function parseImage(e?) {
        if (!e || e.key === 'Enter') {
            e?.preventDefault()
            e?.stopPropagation();

            if (!!imageLink) {
                formContext.setValue('imageId', parseImageFromLink(imageLink));
                formContext.setValue('imageLink', null);
            }
        }
    }

    return (
        <CustomModal title={(!item ? 'Додати' : (!isAdmin ? 'Подивитися' : 'Відредагувати')) + ' спосіб доставки'}
                     open={open}
                     disableBackdropClick={true}
                     onClose={() => onClose()}
                     formContext={formContext}
                     loading={updating || creating}
                     isSubmitDisabled={!formContext.formState.isValid}
                     onSubmit={isAdmin ? onSubmit : null}>
            <Box display="flex" gap={2} flexDirection="column">
                <CustomTextField fullWidth
                                 required
                                 autoFocus={true}
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
                    <CustomImage imageId={formContext.getValues('imageId')}></CustomImage>
                </Box>
            </Box>

            {(creatingError || updatingError) &&
              <ErrorNotification error={creatingError || updatingError}></ErrorNotification>
            }
        </CustomModal>
    );
}