import { PageTypeEntity } from '@/lib/data/types';
import { useForm } from 'react-hook-form-mui';
import CustomTextField from '@/components/form-fields/custom-text-field';
import CustomModal from '@/components/modals/custom-modal';
import { useCreatePageType, useUpdatePageType } from '@/lib/graphql/queries/page-type/hook';
import ErrorNotification from '@/components/error-notification';
import { useAuth } from '@/components/auth-context';
import { trimValues } from '@/utils/utils';

interface IPageTypeModalProps {
    open: boolean,
    item?: PageTypeEntity,
    isSubmitDisabled?: boolean,
    isAdmin?: boolean,
    onClose: (updated?: boolean) => void
}

export default function PageTypeModal({ open, item, onClose, isAdmin }: IPageTypeModalProps) {
    const formContext = useForm<{ name: string }>({ defaultValues: { name: item?.name } });
    const { update, updating, updatingError } = useUpdatePageType();
    const { create, creating, creatingError } = useCreatePageType();
    const { checkAuth } = useAuth();

    function onSubmit() {
        const data = { ...(item ? item : {}), ...trimValues(formContext.getValues()) } as PageTypeEntity;
        const promise = item ? update(data) : create(data);

        promise
            .then(() => onClose(true))
            .catch(err => checkAuth(err));
    }

    return (
        <CustomModal title={(!item ? 'Додати' : (!isAdmin ? 'Подивитися' : 'Відредагувати')) + ' тип сторінок'}
                     open={open}
                     disableBackdropClick={true}
                     onClose={() => onClose()}
                     formContext={formContext}
                     loading={updating || creating}
                     isSubmitDisabled={!formContext.formState.isValid}
                     onSubmit={isAdmin ? onSubmit : null}>
            <CustomTextField fullWidth
                             required
                             autoFocus={true}
                             id="page-type-name"
                             label="Назва"
                             name="name"/>

            {(creatingError || updatingError) &&
              <ErrorNotification error={creatingError || updatingError}></ErrorNotification>
            }
        </CustomModal>
    );
}