import { Controller } from "react-hook-form";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { Visibility } from "@mui/icons-material";

export default function ReceiptInput({
	control,
	errors,
	watch,
	onViewPhotoOpen,
}) {
	return (
		<Controller
			name="invoiceAttachment"
			control={control}
			render={({ field: { value, onChange, ...field } }) => (
				<TextField
					{...field}
					value={value?.fileName}
					onChange={(e) => {
						onChange(e.target.files[0]);
					}}
					type="file"
					size="small"
					label="Receipt"
					helperText={errors?.invoiceAttachment?.message}
					error={errors?.invoiceAttachment}
					InputLabelProps={{ shrink: true }}
					InputProps={{
						endAdornment: watch("invoiceAttachment") && (
							<InputAdornment position="end">
								<IconButton onClick={onViewPhotoOpen}>
									<Visibility />
								</IconButton>
							</InputAdornment>
						),
					}}
				/>
			)}
		/>
	);
}
