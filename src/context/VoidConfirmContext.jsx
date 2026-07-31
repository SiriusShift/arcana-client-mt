import { createContext, useCallback, useState } from "react";
import CommonDialog from "../components/common/CommonDialog";
import { Box, TextField, Typography } from "@mui/material";
import { generateCode } from "../utils/CustomFunctions";

const VoidConfirmContext = createContext();

const VoidConfirmProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  const [promise, setPromise] = useState([]);
  const [options, setOptions] = useState({
    children: "Are you sure you want to proceed?",
    inputLabel: "Code",
    requireReason: true,
  });
  const [resolve, reject, callback] = promise;
  const [key, setKey] = useState(0);

  const [value, setValue] = useState("");
  const [code, setCode] = useState(generateCode(3))


  const confirm = useCallback((params = {}) => {
    const { callback, ...options } = params;

    return new Promise((resolve, reject) => {
      setKey((key) => key + 1);
      setOptions((defaultValue) => ({
        ...defaultValue,
        ...options,
        children: (
          <>
            <Typography sx={{fontSize: 30, fontWeight: "bold"}}>Confirmation</Typography>
            <Typography sx={{fontSize: 15}}>Type <span style={{fontWeight: "bold"}}>{code}</span> to proceed</Typography>
            <Box>
              <TextField
                sx={{ mt: 2 }}
                onChange={(e) => setValue(e.target.value)}
                size="small"
                label={options.inputLabel || defaultValue.inputLabel}
                fullWidth
                multiline
                rows={3}
              />
            </Box>
          </>
        ),
      }));
      setPromise([resolve, reject, callback]);
    });
  }, []);

  const handleClose = useCallback(() => {
    setPromise([]);
    setValue("");
  }, []);

  const handleCancel = useCallback(() => {
    if (reject) {
      reject({ isConfirmed: false, isCancelled: true, result: null });
      handleClose();
    }
  }, [reject, handleClose]);

  const handleConfirm = useCallback(async () => {
    if (callback) {
      setIsLoading(true);
      try {
        const result = await callback(value === code);
        resolve({
          isConfirmed: true,
          isCancelled: false,
          ...result,
        });
      } catch (error) {
        console.log(error);
        reject({
          isConfirmed: true,
          isCancelled: false,
          error: error?.data?.error,
        });
      }

      setIsLoading(false);
      handleClose();
    } else if (resolve) {
      resolve({
        isConfirmed: true,
        isCancelled: false,
        result: null,
      });

      handleClose();
    }
  }, [resolve, reject, callback, handleClose, value]);

  return (
    <>
      <VoidConfirmContext.Provider value={confirm}>
        {children}

        <CommonDialog
          key={key}
          noIcon={true}
          open={promise.length === 3}
          onClose={handleCancel}
          onYes={handleConfirm}
          isLoading={isLoading}
          {...options}
          disableYes={value !== code || !value}
        />
      </VoidConfirmContext.Provider>
    </>
  );
};

export { VoidConfirmContext, VoidConfirmProvider };
