import { Box } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import FreebiesFormHeader from "../../../components/page-components/inventory-management/freebies/FreebiesFormHeader";
import FreebiesFormDetails from "../../../components/page-components/inventory-management/freebies/FreebiesFormDetails";
import FreebiesFormItems from "../../../components/page-components/inventory-management/freebies/FreebiesFormItems";
import { yupResolver } from "@hookform/resolvers/yup";
import { freebiesSchema } from "../../../schema/schema";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useGetFreebieRequestByIdQuery } from "../../../features/inventory-management/api/freebiesApi";

const ViewFreebies = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const methods = useForm({
    resolver: yupResolver(freebiesSchema.schema),
    defaultValues: freebiesSchema.defaultValues,
  });

  const { data, isFetching, isError } = useGetFreebieRequestByIdQuery(id);

  useEffect(() => {
    if (isError) {
      navigate("/inventory-management/freebies", { replace: true });
    }
  }, [isError, navigate]);

  return (
    <Box className="commonPageLayout">
      <FreebiesFormHeader />

      <FormProvider {...methods}>
        <FreebiesFormDetails details={data} isFetching={isFetching} />

        <FreebiesFormItems items={data?.items} isFetching={isFetching} />
      </FormProvider>
    </Box>
  );
};

export default ViewFreebies;
