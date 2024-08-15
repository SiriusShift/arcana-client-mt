import { Skeleton, Stack } from "@mui/material";

const FormItemsSkeleton = () => {
  return Array.from({ length: 5 }).map((_, index) => (
    <Stack key={index} direction="row" gap={1}>
      <Skeleton sx={{ transform: "none" }} width={200} height={40} />

      <Skeleton sx={{ transform: "none", flex: 1 }} height={40} />

      <Skeleton sx={{ transform: "none" }} width={120} height={40} />

      <Skeleton sx={{ transform: "none" }} width={200} height={40} />

      <Skeleton sx={{ transform: "none" }} width={120} height={40} />
    </Stack>
  ));
};

export default FormItemsSkeleton;
