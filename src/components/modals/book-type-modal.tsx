import { BookTypeEntity } from '@/lib/data/types';
import { useForm } from 'react-hook-form-mui';
import { useCreateBookType, useUpdateBookType } from '@/lib/graphql/queries/book-type/hook';
import CustomModal from '@/components/modals/custom-modal';
import CustomTextField from '@/components/form-fields/custom-text-field';
import ErrorNotification from '@/components/error-notification';
import { useAuth } from '@/components/auth-context';
import { parseImageFromLink, trimValues } from '@/utils/utils';
import { Box, Button } from '@mui/material';
import CustomImage from '@/components/custom-image';
import React from 'react';

interface IBookTypeModalProps {
    open: boolean,
    item?: BookTypeEntity,
    isSubmitDisabled?: boolean,
    isAdmin?: boolean,
    onClose: (updated?: boolean) => void
}

interface IForm {
    name: string,
    imageLink: string,
    imageId: string
}

const imageBoxStyles = { height: '150px', maxHeight: '50vw' };

export default function BookTypeModal({ open, item, onClose, isAdmin }: IBookTypeModalProps) {
    const formContext = useForm<IForm>({
        defaultValues: {
            name: item?.name,
            imageId: item?.imageId
        }
    });
    const { update, updating, updatingError } = useUpdateBookType();
    const { create, creating, creatingError } = useCreateBookType();
    const { imageLink } = formContext.watch();
    const { checkAuth } = useAuth();

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

    function onSubmit() {
        parseImage();
        const data = { ...(item ? item : {}), ...trimValues(formContext.getValues()) };

        delete data.imageLink;
        const promise = item ? update(data) : create(data);

        promise
            .then(() => onClose(true))
            .catch(err => checkAuth(err));
    }

    return (
        <CustomModal title={(!item ? 'Додати' : (!isAdmin ? 'Подивитися' : 'Відредагувати')) + ' тип книги'}
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
                                 id="book-type-name"
                                 label="Назва"
                                 name="name"/>

                <CustomTextField fullWidth
                                 disabled={!isAdmin}
                                 id="imageLink"
                                 onKeyDown={parseImage}
                                 label="Посилання на фото"
                                 name="imageLink"/>
                {!!imageLink &&
                  <Box mt={2}><Button fullWidth variant="outlined" onClick={() => parseImage()}>Додати
                    фото</Button></Box>}

                <CustomTextField fullWidth
                                 disabled={!isAdmin}
                                 id="imageId"
                                 label="ID фото"
                                 name="imageId"/>

                <Box sx={imageBoxStyles} my={1}>
                    <CustomImage isBookType={true} imageId={formContext.getValues('imageId')}></CustomImage>
                </Box>
            </Box>

            {(creatingError || updatingError) &&
              <ErrorNotification error={creatingError || updatingError}></ErrorNotification>
            }
        </CustomModal>
    );
}