import React, { useState } from 'react'
import CommonModal from '../../CommonModal'
import { Stack, TextField, Typography } from '@mui/material'
import SecondaryButton from '../../SecondaryButton';
import { useClearPaymentTransactionMutation } from '../../../features/sales-management/api/clearingApi';
import useConfirm from '../../../hooks/useConfirm';

const ATagModal = ({ open, onClose, data }) => {
    const [aTag, setATag] = useState();
    const confirm = useConfirm();

    const [clearPaymentTransaction, { isLoading }] = useClearPaymentTransactionMutation();


    const submitFunction = async () => {
        try {
            const transformedData = data?.map((item) => ({
                aTag,
                paymentAmount: item?.paymentAmount,
                paymentRecordId: item?.paymentRecordId,
                paymentMethod: item?.paymentMethod,
            }))
            await confirm({
                children: "Are you sure you want to tag this transactions?",
                question: true,
                callback: () =>
                    clearPaymentTransaction({
                        paymentRecords: transformedData,
                    }).unwrap(),
            });
        } catch (error) {
            if (error?.isConfirmed) {
                snackbar({
                    message: handleCatchErrorMessage(error),
                    variant: "error",
                });
            }
        }
    }
    return (
        <CommonModal open={open} onClose={onClose} width={400} closeTopRight
            closeOnBackdropClick
        >
            <Stack gap={2} >
                <Typography fontSize="1.2rem" fontWeight="600">
                    Remittance
                </Typography>
                <TextField
                    label="Tag"
                    fullWidth
                    size="small"
                    sx={{ width: "100%" }}
                    value={aTag}
                    onChange={(e) => setATag(e.target.value)}
                />
            </Stack>
            <Stack direction="row" gap={1} marginTop={2} alignSelf="flex-end">
                <SecondaryButton disabled={!aTag} type="submit">
                    Submit
                </SecondaryButton>
            </Stack>
        </CommonModal>
    )
}

export default ATagModal