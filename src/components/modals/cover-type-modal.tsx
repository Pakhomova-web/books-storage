import { CoverTypeEntity } from '@/lib/data/types';
import { useForm } from 'react-hook-form-mui';
import { useCreateCoverType, useUpdateCoverType } from '@/lib/graphql/queries/cover-type/hook';
import CustomModal from '@/components/modals/custom-modal';
import CustomTextField from '@/components/form-fields/custom-text-field';
import ErrorNotification from '@/components/error-notification';
import { useAuth } from '@/components/auth-context';
import { trimValues } from '@/utils/utils';

interface ICoverTypeModalProps {
    open: boolean,
    item?: CoverTypeEntity,
    isSubmitDisabled?: boolean,
    isAdmin?: boolean,
    onClose: (updated?: boolean) => void
}

export default function CoverTypeModal({ open, item, onClose, isAdmin }: ICoverTypeModalProps) {
    const formContext = useForm<{ name: string }>({ defaultValues: { name: item?.name } });
    const { update, updating, updatingError } = useUpdateCoverType();
    const { create, creating, creatingError } = useCreateCoverType();
    const { checkAuth } = useAuth();

    function onSubmit() {
        const data = { ...(item ? item : {}), ...trimValues(formContext.getValues()) } as CoverTypeEntity;
        const promise = item ? update(data) : create(data);

        promise
            .then(() => onClose(true))
            .catch(err => checkAuth(err));
    }

    return (
        <CustomModal title={(!item ? 'Додати' : (!isAdmin ? 'Подивитися' : 'Відредагувати')) + ' обкладинку'}
                     open={open}
                     disableBackdropClick={true}
                     onClose={() => onClose()}
                     loading={updating || creating}
                     formContext={formContext}
                     isSubmitDisabled={!formContext.formState.isValid}
                     onSubmit={isAdmin ? onSubmit : null}>
            <CustomTextField fullWidth
                             required
                             autoFocus={true}
                             id="cover-type-name"
                             label="Назва"
                             name="name"/>

            {(creatingError || updatingError) &&
              <ErrorNotification error={creatingError || updatingError}></ErrorNotification>
            }
        </CustomModal>
    );
}