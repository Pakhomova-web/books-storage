import { LanguageEntity } from '@/lib/data/types';
import { FormContainer, useForm } from 'react-hook-form-mui';
import { useCreateLanguage, useUpdateLanguage } from '@/lib/graphql/queries/language/hooks';
import CustomModal from '@/components/modals/custom-modal';
import CustomTextField from '@/components/form-fields/custom-text-field';
import ErrorNotification from '@/components/error-notification';
import { useAuth } from '@/components/auth-context';
import { trimValues } from '@/utils/utils';

interface ILanguageModalProps {
    open: boolean,
    item?: LanguageEntity,
    isSubmitDisabled?: boolean,
    isAdmin?: boolean,
    onClose: (updated?: boolean) => void
}

export default function LanguageModal({ open, item, onClose, isAdmin }: ILanguageModalProps) {
    const formContext = useForm<{ name: string }>({ defaultValues: { name: item?.name } });
    const { update, updating, updatingError } = useUpdateLanguage();
    const { create, creating, creatingError } = useCreateLanguage();
    const { checkAuth } = useAuth();

    function onSubmit() {
        const data = { ...(item ? item : {}), ...trimValues(formContext.getValues()) } as LanguageEntity;
        const promise = item ? update(data) : create(data);

        promise
            .then(() => onClose(true))
            .catch(err => checkAuth(err));
    }

    return (
        <CustomModal title={(!item ? 'Додати' : (!isAdmin ? 'Подивитися' : 'Відредагувати')) + ' мову'}
                     open={open}
                     disableBackdropClick={true}
                     onClose={() => onClose()}
                     loading={updating || creating}
                     isSubmitDisabled={!formContext.formState.isValid}
                     onSubmit={isAdmin ? onSubmit : null}>
            <FormContainer formContext={formContext}>
                <CustomTextField fullWidth
                                 required
                                 autoFocus={true}
                                 id="language-name"
                                 label="Назва"
                                 name="name"/>
            </FormContainer>

            {(creatingError || updatingError) &&
              <ErrorNotification error={creatingError || updatingError}></ErrorNotification>
            }
        </CustomModal>
    );
}