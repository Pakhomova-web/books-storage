import { useForm } from 'react-hook-form-mui';

import { PublishingHouseEntity } from '@/lib/data/types';
import { useCreatePublishingHouse, useUpdatePublishingHouse } from '@/lib/graphql/queries/publishing-house/hook';
import CustomModal from '@/components/modals/custom-modal';
import CustomTextField from '@/components/form-fields/custom-text-field';
import ErrorNotification from '@/components/error-notification';
import { useAuth } from '@/components/auth-context';
import { parseImageFromLink, trimValues } from '@/utils/utils';
import { Box, Button } from '@mui/material';
import CustomImage from '@/components/custom-image';
import React from 'react';

interface IPublishingHouseModalProps {
    open: boolean,
    item?: PublishingHouseEntity,
    isSubmitDisabled?: boolean,
    isAdmin?: boolean,
    onClose: (updated?: boolean) => void
}

interface IForm {
    id: string,
    name: string,
    tags: string,
    imageId: string,
    imageLink: string
}

const imageBoxStyles = { height: '150px', maxHeight: '50vw' };

export default function PublishingHouseModal({ open, item, onClose, isAdmin }: IPublishingHouseModalProps) {
    const formContext = useForm<IForm>({
        defaultValues: {
            id: item?.id,
            name: item?.name,
            tags: item?.tags,
            imageId: item?.imageId
        }
    });
    const { update, updating, updatingError } = useUpdatePublishingHouse();
    const { create, creating, creatingError } = useCreatePublishingHouse();
    const { imageLink } = formContext.watch();
    const { checkAuth } = useAuth();

    function onSubmit() {
        let promise;
        const data = new PublishingHouseEntity(trimValues(formContext.getValues()));

        promise = item ? update(data) : create(data);

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
        <CustomModal title={(!item ? 'Додати' : (!isAdmin ? 'Подивитися' : 'Відредагувати')) + ' видавництво'}
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
                                 id="publishing-house-name"
                                 label="Назва"
                                 name="name"/>

                <CustomTextField fullWidth
                                 id="publishing-house-tags"
                                 label="Теги"
                                 name="tags"/>

                <CustomTextField fullWidth
                                 disabled={!isAdmin}
                                 id="imageLink"
                                 onKeyDown={parseImage}
                                 label="Посилання на фото"
                                 name="imageLink"/>
                {!!imageLink &&
                  <Button fullWidth variant="outlined" onClick={parseImage}>Додати фото</Button>}

                <CustomTextField fullWidth
                                 disabled={!isAdmin}
                                 id="imageId"
                                 label="ID фото"
                                 name="imageId"/>

                <Box sx={imageBoxStyles} mb={1}>
                    <CustomImage imageId={formContext.getValues('imageId')}></CustomImage>
                </Box>
            </Box>

            {(creatingError || updatingError) &&
              <ErrorNotification error={creatingError || updatingError}></ErrorNotification>
            }
        </CustomModal>
    );
}