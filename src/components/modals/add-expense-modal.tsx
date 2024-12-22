import { useForm } from 'react-hook-form-mui';
import CustomModal from '@/components/modals/custom-modal';
import CustomTextField from '@/components/form-fields/custom-text-field';
import ErrorNotification from '@/components/error-notification';
import { useAuth } from '@/components/auth-context';
import { Box } from '@mui/material';
import React from 'react';
import { useUpdateBalance } from '@/lib/graphql/queries/balance/hook';

interface IAuthorModalProps {
    open: boolean,
    onClose: (updated?: boolean) => void
}

export default function AddExpenseModal({ open, onClose }: IAuthorModalProps) {
    const formContext = useForm<{ expense: number }>({
        defaultValues: { expense: 0 }
    });
    const { update, updating, updatingError } = useUpdateBalance();
    const { checkAuth } = useAuth();

    function onSubmit() {
        const { expense } = formContext.getValues();

        update(expense)
            .then(() => onClose(true))
            .catch(err => checkAuth(err));
    }

    function isInvalid() {
        return !formContext.getValues()?.expense && formContext.getValues()?.expense > 0;
    }

    return (
        <CustomModal title="Додати витрати"
                     open={open}
                     disableBackdropClick={true}
                     onClose={() => onClose()}
                     loading={updating}
                     isSubmitDisabled={isInvalid()}
                     formContext={formContext}
                     onSubmit={onSubmit}>
            <Box display="flex" gap={2} flexDirection="column">
                <CustomTextField fullWidth
                                 type="number"
                                 id="expense"
                                 label="Витрати"
                                 name="expense"/>
            </Box>

            {updatingError && <ErrorNotification error={updatingError}></ErrorNotification>}
        </CustomModal>
    );
}