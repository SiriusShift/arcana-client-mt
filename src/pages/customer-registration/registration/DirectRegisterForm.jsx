import { yupResolver } from "@hookform/resolvers/yup";
import {
  Check,
  Close,
  Gavel,
  Payment,
  Person
} from "@mui/icons-material";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import moment from "moment";
import { useContext, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { PatternFormat } from "react-number-format";
import { useDispatch, useSelector } from "react-redux";
import "../../../assets/styles/drawerForms.styles.scss";
import CommonDialog from "../../../components/common/CommonDialog";
import CommonDrawer from "../../../components/CommonDrawer";
import DangerButton from "../../../components/DangerButton";
import AgreeTermsModal from "../../../components/modals/registration/AgreeTermsModal";
import SecondaryButton from "../../../components/SecondaryButton";
import RegisterClientFormSkeleton from "../../../components/skeletons/RegisterClientFormSkeleton";
import { AttachmentsContext } from "../../../context/AttachmentsContext";
import { DirectReleaseContext } from "../../../context/DirectReleaseContext";
import {
  usePostListingFeeMutation,
  usePutUpdateListingFeeMutation,
} from "../../../features/listing-fee/api/listingFeeApi";
import { useSendMessageMutation } from "../../../features/misc/api/rdfSmsApi";
import { setSelectedRow } from "../../../features/misc/reducers/selectedRowSlice";
import {
  usePostExpensesMutation,
  usePutUpdateExpensesMutation,
} from "../../../features/otherExpenses/api/otherExpensesRegApi";
import {
  useLazyGetAttachmentsByClientIdQuery,
  useLazyGetListingFeeByClientIdQuery,
  useLazyGetOtherExpensesByClientIdQuery,
  useLazyGetTermsByClientIdQuery,
  usePostDirectRegistrationMutation,
  usePostEditClientRequestMutation,
  usePostValidateClientMutation,
  usePutAddAttachmentsForDirectMutation,
  usePutReleaseFreebiesMutation,
  usePutUpdateClientAttachmentsMutation,
  usePutUpdateClientInformationMutation
} from "../../../features/registration/api/registrationApi";
import {
  resetExpensesForRegistration,
  resetFreebies,
  resetListingFeeForRegistration,
  resetPriceMode,
  resetTermsAndConditions,
  setDirty,
  setExpensesForRegistration,
  setIsExpensesValid,
  setIsListingFeeValid,
  setListingFeeForRegistration,
  setPriceModeId,
  setPriceModeItems,
  setWholeTermsAndConditions,
  toggleFeesToStore
} from "../../../features/registration/reducers/regularRegistrationSlice";
import { useGetAllDistributionQuery } from "../../../features/setup/api/distributionApi";
import { useGetAllOtherExpensesQuery } from "../../../features/setup/api/otherExpensesApi";
import { useGetAllPriceModeForClientsQuery } from "../../../features/setup/api/priceModeSetupApi";
import { useGetAllProductsQuery } from "../../../features/setup/api/productsApi";
import { useGetAllTermDaysQuery } from "../../../features/setup/api/termDaysApi";
import { useGetTerritoryQuery } from "../../../features/setup/api/territoryApi";
import useDisclosure from "../../../hooks/useDisclosure";
import useSnackbar from "../../../hooks/useSnackbar";
import { directRegisterPersonalSchema } from "../../../schema/schema";
import { creditType } from "../../../utils/Constants";
import {
  base64ToBlob,
  convertToTitleCase,
  handleCatchErrorMessage,
  shallowEqual,
} from "../../../utils/CustomFunctions";
import ListingFeeClient from "../prospecting/ListingFeeClient";
import OtherExpensesClient from "../prospecting/OtherExpensesClient";
import PriceMode from "../prospecting/PriceMode";
import TermsAndConditions from "../prospecting/TermsAndConditions";

function DirectRegisterForm({
  open,
  onClose,
  editMode,
  setEditMode,
  clientStatus,
}) {
  const dispatch = useDispatch();
  const {
    setOwnersRequirements,
    setOwnersRequirementsIsLink,
    setRepresentativeRequirements,
    setRepresentativeRequirementsIsLink,
    setRequirementsMode,
  } = useContext(AttachmentsContext);

  const snackbar = useSnackbar();
  const originalItemsRef = useRef(null); // ← use ref so it doesn't cause re-renders

  const [activeTab, setActiveTab] = useState("Personal Info");
  const [sameAsOwnersAddress, setSameAsOwnersAddress] = useState(false);
  const [originalItems, setOriginalItems] = useState();
  const [includeAuthorizedRepresentative, setIncludeAuthorizedRepresentative] =
    useState(false);

  const [isAllApiLoading, setIsAllApiLoading] = useState(false);

  const { ownersRequirements, representativeRequirements, requirementsMode } =
    useContext(AttachmentsContext);


  const {
    signatureDirect,
    photoProofDirect,
    setSignatureDirect,
    setPhotoProofDirect,
  } = useContext(DirectReleaseContext);


  const selectedRowData = useSelector((state) => state.selectedRow.value);
  const userDetails = useSelector((state) => state.login.userDetails);
  const priceModeItems = useSelector((state) => state.regularRegistration.value.priceMode)
  const termsAndConditions = useSelector(
    (state) => state.regularRegistration.value.termsAndConditions
  );
  const freebiesDirect = useSelector(
    (state) => state.regularRegistration.value.directFreebie.freebies
  );
  const listingFees = useSelector(
    (state) =>
      state.regularRegistration.value.listingFeeForRegistration.listingItems
  );
  const expenses = useSelector(
    (state) => state.regularRegistration.value.expensesForRegistration.expenses
  );

  const isListingFeeValid = useSelector(
    (state) => state.regularRegistration.value.listingFeeForRegistration.isValid
  );
  const isExpensesValid = useSelector(
    (state) => state.regularRegistration.value.expensesForRegistration.isValid
  );

  const isPriceModeDirty = useSelector(
    (state) => state.regularRegistration.value.isDirty
  )



  const signatureToCheck =
    requirementsMode === "owner"
      ? ownersRequirements["signature"]
      : representativeRequirements["signature"];

  //Disclosures
  const {
    isOpen: isConfirmOpen,
    onOpen: onConfirmOpen,
    onClose: onConfirmClose,
  } = useDisclosure();

  const {
    isOpen: isCancelConfirmOpen,
    onOpen: onCancelConfirmOpen,
    onClose: onCancelConfirmClose,
  } = useDisclosure();

  // React Hook Form
  const {
    handleSubmit,
    formState: { errors, isValid, isDirty },
    register,
    setValue,
    reset,
    getValues,
    control,
    watch,
    clearErrors,
  } = useForm({
    resolver: yupResolver(directRegisterPersonalSchema.schema),
    mode: "onSubmit",
    defaultValues: directRegisterPersonalSchema.defaultValues,
  });

  console.log(watch())



  // const { watch: watchItems, formState: { isValid: itemsValid }, reset: resetPriceMode, setValue: setValueItems } = itemsMethod
  const priceMode = priceModeItems.priceModeId;

  const isCreditValid = Boolean(
    (termsAndConditions?.creditTypeId?.value === 1 &&
      termsAndConditions?.creditLimit &&
      termsAndConditions?.termDaysId) ||

    (termsAndConditions?.creditTypeId?.value === 2 &&
      termsAndConditions?.termDaysId) ||

    (termsAndConditions?.creditTypeId?.value === 3 &&
      termsAndConditions?.creditLimit) ||

    termsAndConditions?.terms === 1
  );

  const isTermsValid = Object.keys(termsAndConditions).every((key) => {
    const value = termsAndConditions[key];


    // Mode of Payments
    if (key === "modeOfPayments") {
      return value?.length > 0;
    }

    if (key === "termDaysId" || key === "creditTypeId" || key === "creditLimit") {
      if (termsAndConditions?.terms === 1) {
        return true
      }
    }

    // Fixed Discount
    if (key === "fixedDiscount" || key === "variableDiscount") {
      return true;
    }

    if (key === "creditLimit") {
      if (termsAndConditions?.terms === 3) {
        return true
      }
    }

    // Default validation
    return value !== null && value !== "";
  });


  const isDiscountValid =
    priceMode !== 1
      ? true
      : Object.keys(termsAndConditions).every((key) => {
        const value = termsAndConditions[key];

        if (key === "fixedDiscount") {
          return value?.discountPercentage != null &&
            value?.discountPercentage !== "";
        }

        if (key === "variableDiscount") {
          return value != null && value !== "";
        }

        return true;
      });

  const isTDO = userDetails?.roleName === "TDO";
  const isHead = userDetails?.roleName === "Head";

  const isApprovedEdit =
    editMode &&
    (isTDO || isHead) &&
    clientStatus === "Approved";

  const isUnderReviewEdit =
    editMode &&
    isTDO &&
    clientStatus === "Under review";

  const showNextButton =
    // 1. New registration
    (!editMode && activeTab !== "Costs and Fees") ||

    // 2. Under Review edit (stop at Terms & Conditions)
    (isUnderReviewEdit &&
      activeTab !== "Terms & Conditions") ||

    // 3. Other edit modes (except Approved)
    (editMode &&
      !isApprovedEdit &&
      !isUnderReviewEdit &&
      activeTab !== "Costs and Fees");

  const showSubmitButton =
    // New registration
    (!editMode && activeTab === "Costs and Fees") ||

    // Under Review edit submits at Terms & Conditions
    (isUnderReviewEdit &&
      activeTab === "Terms & Conditions") ||

    // Approved edit submits on Price Mode only
    (isApprovedEdit &&
      activeTab === "Price Mode");
  //Constants
  const navigators = [
    {
      label: "Personal Info",
      // isValid: isValid,
      isValid:
        isValid,
      icon: <Person />,
      disabled: false,
    },

    {
      label: "Price Mode",
      isValid: priceModeItems.isValid && isDiscountValid,
      // && !!signatureToCheck,
      icon: <Gavel />,
      disabled: false,
    },
    {
      label: "Terms & Conditions",
      isValid: isTermsValid && isCreditValid,
      // && !!signatureToCheck,
      icon: <Gavel />,
      disabled: false,
    },

    // termsAndConditions["terms"] !== 1 && {
    //   label: "Attachments",
    //   isValid:
    //     requirementsMode === "owner"
    //       ? !Object.values(ownersRequirements).some(
    //         (value) => value === null || value === undefined
    //       )
    //       : requirementsMode === "representative"
    //         ? !Object.values(representativeRequirements).some(
    //           (value) => value === null || value === undefined
    //         )
    //         : false,
    //   icon: <Attachment />,
    //   disabled: false,
    // },

    {
      label: "Costs and Fees",
      isValid: isListingFeeValid && isExpensesValid,
      icon: <Payment />,
      disabled: false,
    },
  ].filter(Boolean);


  navigators[1].disabled = !editMode && activeTab === "Personal Info";
  navigators[2].disabled = !editMode && activeTab === "Personal Info";
  navigators[3].disabled = !navigators[0].isValid || !navigators[1].isValid;
  if (navigators?.length > 3) {
    navigators[3].disabled =
      !navigators[0].isValid ||
      !navigators[1].isValid ||
      !navigators[2].isValid ||
      !navigators[3].isValid;
  }

  //RTK Query
  const [postDirectRegistration] = usePostDirectRegistrationMutation();
  const [postUpdateTDOItems] = usePostEditClientRequestMutation();
  const [putAddAttachmentsForDirect] = usePutAddAttachmentsForDirectMutation();
  const [postListingFee] = usePostListingFeeMutation();
  const [postExpenses] = usePostExpensesMutation();
  const [sendMessage, { isLoading: isSendMessageLoading }] =
    useSendMessageMutation();

  const [putUpdateClientInformation] = usePutUpdateClientInformationMutation();
  const [putUpdateClientAttachments] = usePutUpdateClientAttachmentsMutation();
  const [putUpdateListingFee] = usePutUpdateListingFeeMutation();
  const [putUpdateExpenses] = usePutUpdateExpensesMutation();

  const [putReleaseFreebies] = usePutReleaseFreebiesMutation();

  const { data: distriTypeData, isLoading: isStoreTypeLoading } =
    useGetAllDistributionQuery({ Status: true, Page: 1, PageSize: 1000 });
  const { data: termDaysData } = useGetAllTermDaysQuery({
    Status: true,
    Page: 1,
    PageSize: 1000,
  });

  const { data: territory, isLoading: isTerritoryLoading } = useGetTerritoryQuery({
    Status: true,
    Page: 1,
    PageSize: 1000,
  })
  // const { data: clusterData, isLoading: isClusterDataLoading } =
  //   useGetAllClustersQuery({
  //     Status: true,
  //     ModuleName: "Registration",
  //     Page: 1,
  //     PageSize: 1000,
  //   });
  const { data: productData } = useGetAllProductsQuery({
    Status: true,
    page: 1,
    pageSize: 1000,
  });

  const { data: expensesDataChoices } = useGetAllOtherExpensesQuery({
    Status: true,
    page: 1,
    pageSize: 1000,
  });

  const [postValidateClient, { isLoading: isValidateClientLoading }] =
    usePostValidateClientMutation();

  //Fetch Terms, Attachments, Listing Fee, and OtherExpenses
  const [triggerTerms, { data: termsData, isLoading: isTermsDataLoading }] =
    useLazyGetTermsByClientIdQuery();
  // const { data, isLoading } = useGetFreebiesByClientIdQuery({
  //   id: selectedRowData?.id,
  // });
  const [
    triggerAttachments,
    { data: attachmentsData, isLoading: isAttachmentsDataLoading },
  ] = useLazyGetAttachmentsByClientIdQuery();

  const [
    triggerListingFee,
    { data: listingFeeData, isLoading: isListingFeeLoading },
  ] = useLazyGetListingFeeByClientIdQuery();
  const [
    triggerExpenses,
    { data: expensesData, isLoading: isExpensesLoading },
  ] = useLazyGetOtherExpensesByClientIdQuery();

  const { data: priceModeData, isLoading: isPriceModeLoading } =
    useGetAllPriceModeForClientsQuery();

  // console.log(watch())

  //Drawer Functions
  const onSubmit = async (data) => {
    try {
      setIsAllApiLoading(true);

      const { terms, ...noTerms } = termsAndConditions;


      const transformedData = {
        ...data,
        dateOfBirth: moment(data?.dateOfBirth).format("YYYY-MM-DD"),
        priceModeId: priceModeItems.priceModeId,
        tdoId: data?.territory?.id,
        clientId: selectedRowData?.id,
        distriTypeId: data?.distriTypeId?.id
      };

      const transformedTermsAndConditions = {
        ...noTerms,
        termDaysId: termsAndConditions?.termDaysId?.id,
        termsId: termsAndConditions?.terms,
        creditType: termsAndConditions?.creditTypeId?.value,
      };

      // const mappedFreebies =
      //   freebiesDirect?.length > 0
      //     ? {
      //       freebies: freebiesDirect.map((freebie) => ({
      //         itemId: freebie.itemId.itemId,
      //         quantity: freebie.quantity,
      //       })),
      //     }
      //     : {};

      const mappedClientItems = {
        clientItems: priceModeItems?.items?.map((item) => ({
          itemId: item.itemCode.itemId,
          price: item.price,
        })),
      };

      const originalItems = originalItemsRef.current; // ← read from ref

      const isExistingItem = (item) =>
        originalItems?.some(
          (data) =>
            data.itemCode?.itemCode === item.itemCode?.itemCode
        );

      const addedItems = priceModeItems.items
        ?.filter((item) => !isExistingItem(item))
        ?.map((item) => ({
          itemId: item.itemCode?.itemId,
          price: item.price,
        }));

      const changedItems = priceModeItems.changedItems
        ?.filter((item) => !isExistingItem(item))
        ?.map((item) => ({
          itemId: item?.itemId,
          price: item.price,
        }));

      const removedItems = priceModeItems.removedItems
        ?.filter((item) => !isExistingItem(item))
        ?.map((item) => ({
          itemId: item.itemId,
        }));


      let response;

      if (editMode) {
        const newDisc = termsAndConditions?.fixedDiscount?.discountPercentage / 100
        if ((isTDO || isHead) && clientStatus === "Approved" && editMode) {
          const payload = {
            clientId: selectedRowData?.id,

            ...(isHead && (newDisc !== termsData?.fixedDiscount?.discountPercentage) && {
              discount: termsData?.fixedDiscount?.discountPercentage !== newDisc ? (newDisc * 100) : null,
            }),
            ...(isTDO &&
              addedItems?.length > 0 && {
              addItems: addedItems,
            }),

            ...(isHead &&
              changedItems?.length > 0 && {
              changeItemPrices: changedItems,
            }),

            ...(isHead &&
              removedItems?.length > 0 && {
              removeItems: removedItems,
            }),
          };


          response = await postUpdateTDOItems(payload).unwrap();

        } else {
          response = await putUpdateClientInformation({
            clientId: selectedRowData?.id,
            ...transformedData,
            ...transformedTermsAndConditions,
            ...mappedClientItems,
          }).unwrap();
        }
      } else {
        response = await postDirectRegistration({
          ...transformedData,
          ...transformedTermsAndConditions,
          ...mappedClientItems,
        }).unwrap();


        const clientId = editMode
          ? selectedRowData?.id
          : response?.value?.id;

        if (
          listingFees &&
          (listingFees?.length > 0 ||
            listingFeeData?.listingFees?.length > 0)
        ) {
          await addListingFee(clientId);
        }

        if (
          expenses &&
          (expenses?.length > 0 ||
            expensesData?.expenses?.length > 0)
        ) {
          await addExpenses(clientId);
        }
      }


      snackbar({
        message: `Client ${editMode ? "updated" : "registered"
          } successfully`,
        variant: "success",
      });

      onClose();
      handleResetForms();
    } catch (error) {
      console.log(error);

      if (error.function !== "sendMessage") {
        snackbar({
          message: handleCatchErrorMessage(error),
          variant: "error",
        });
      } else {
        snackbar({
          message:
            "Client registered successfully but failed to send message to approver.",
          variant: "warning",
        });

        onClose();

        setPhotoProofDirect(null);
        setSignatureDirect(null);

        dispatch(resetFreebies());

        handleResetForms();
      }
    } finally {
      onConfirmClose();
      setIsAllApiLoading(false);
    }
  };

  const addAttachmentsSubmit = async (clientId) => {
    const formData = new FormData();
    let attachmentsObject = null;

    if (
      requirementsMode === "owner" &&
      ownersRequirements["signature"] &&
      !(ownersRequirements["signature"] instanceof Blob)
    ) {
      let convertedSignature;
      if (ownersRequirements["signature"]?.includes("data:")) {
        convertedSignature = new File(
          [base64ToBlob(ownersRequirements["signature"])],
          `signature_${Date.now()}.jpg`,
          { type: "image/jpeg" }
        );
      } else {
        convertedSignature = ownersRequirements["signature"];
      }

      // setOwnersRequirements((prevOwnersRequirements) => ({
      //   ...prevOwnersRequirements,
      //   signature: convertedSignature,
      // }));
      attachmentsObject = {
        ...ownersRequirements,
        signature: convertedSignature,
      };
    } else if (
      requirementsMode === "representative" &&
      representativeRequirements["signature"] &&
      !(representativeRequirements["signature"] instanceof Blob)
    ) {
      let convertedSignature;
      if (representativeRequirements["signature"]?.includes("data:")) {
        convertedSignature = new File(
          [base64ToBlob(representativeRequirements["signature"])],
          `signature_${Date.now()}.jpg`,
          { type: "image/jpeg" }
        );
      } else {
        convertedSignature = representativeRequirements["signature"];
      }

      setRepresentativeRequirements((prevRepresentativeRequirements) => ({
        ...prevRepresentativeRequirements,
        signature: convertedSignature,
      }));
      attachmentsObject = {
        ...representativeRequirements,
        signature: convertedSignature,
      };
    }



    if (attachmentsObject) {
      if (termsAndConditions["terms"] !== 1) {
        Object.keys(attachmentsObject).forEach((key, index) => {
          const attachment = attachmentsObject[key];


          formData.append(`Attachments[${index}].Attachment`, attachment);
          formData.append(
            `Attachments[${index}].DocumentType`,
            convertToTitleCase(key)
          );
        });
      } else {
        formData.append(
          "Attachments[0].Attachment",
          attachmentsObject["signature"]
        );
        formData.append("Attachments[0].DocumentType", "Signature");
      }
    }
    for (const [key, value] of formData.entries()) {
    }
    if (editMode) {
      await putUpdateClientAttachments({
        id: selectedRowData?.id,
        // id: clientId,
        formData,
      }).unwrap();
    } else {
      await putAddAttachmentsForDirect({
        // id: selectedRowData?.id,
        id: clientId,
        formData,
      }).unwrap();
    }
  };

  const addListingFee = async (clientId) => {
    const totalAmount = listingFees.reduce(
      (acc, listingItem) => acc + parseFloat(listingItem.unitCost),
      0
    );

    if (editMode) {
      //Check if there is a listing fee request
      if (listingFeeData?.listingFees?.length > 0) {
        await putUpdateListingFee({
          id: selectedRowData?.id,
          params: { listingFeeId: listingFeeData?.listingFees?.[0]?.id },
          total: parseInt(totalAmount),
          listingItems: listingFees.map((listingItem) => ({
            itemId: listingItem.itemId.itemId,
            sku: listingItem.sku,
            unitCost: parseFloat(listingItem.unitCost),
          })),
        }).unwrap();
      } else {
        //If there is no listing fee request
        await postListingFee({
          clientId,
          total: parseInt(totalAmount),
          listingItems: listingFees.map((listingItem) => ({
            itemId: listingItem.itemId.itemId,
            sku: listingItem.sku,
            unitCost: parseFloat(listingItem.unitCost),
          })),
        }).unwrap();
      }
    } else {
      await postListingFee({
        clientId,
        total: parseInt(totalAmount),
        listingItems: listingFees.map((listingItem) => ({
          itemId: listingItem.itemId.itemId,
          sku: listingItem.sku,
          unitCost: parseFloat(listingItem.unitCost),
        })),
      }).unwrap();
    }
  };

  const addExpenses = async (clientId) => {
    if (editMode) {
      //Check if there is an expense request
      if (expensesData?.expenses?.length > 0) {
        await putUpdateExpenses({
          id: expensesData?.expenses?.[0]?.id,
          expenses: expenses.map((expense) => ({
            otherExpenseId: expense.otherExpenseId.id,
            remarks: expense.remarks,
            amount: parseFloat(expense.amount),
            id: expense.id || 0,
          })),
        });
      } else {
        //If there is no expense request
        await postExpenses({
          clientId: clientId,
          expenses: expenses.map((expense) => ({
            otherExpenseId: expense.otherExpenseId.id,
            remarks: expense.remarks,
            amount: parseFloat(expense.amount),
          })),
        }).unwrap();
      }
    } else {
      await postExpenses({
        clientId: clientId,
        expenses: expenses.map((expense) => ({
          otherExpenseId: expense.otherExpenseId.id,
          remarks: expense.remarks,
          amount: parseFloat(expense.amount),
        })),
      }).unwrap();
    }
  };

  const handleDrawerClose = () => {
    onClose();
    onCancelConfirmClose();
    handleResetForms();
  };

  const handleResetForms = () => {
    reset();
    setOriginalItems(null)
    dispatch(resetPriceMode());
    clearErrors();
    // setValue("phoneNumber", "");

    setSameAsOwnersAddress(false);
    setIncludeAuthorizedRepresentative(false);

    setOwnersRequirements({
      signature: null,
      storePhoto: null,
      businessPermit: null,
      photoIdOwner: null,
    });
    setOwnersRequirementsIsLink({
      signature: false,
      storePhoto: false,
      businessPermit: false,
      photoIdOwner: false,
    });
    setRepresentativeRequirements({
      signature: null,
      storePhoto: null,
      businessPermit: null,
      photoIdOwner: null,
      photoIdRepresentative: null,
      authorizationLetter: null,
    });
    setRepresentativeRequirementsIsLink({
      signature: false,
      storePhoto: false,
      businessPermit: false,
      photoIdOwner: false,
      photoIdRepresentative: false,
      authorizationLetter: false,
    });

    setRequirementsMode(null);
    dispatch(resetTermsAndConditions());
    dispatch(resetListingFeeForRegistration());
    dispatch(resetExpensesForRegistration());
    dispatch(resetFreebies());
    dispatch(setDirty(false));
    setEditMode(false);
    setActiveTab("Personal Info");
  };

  const customRibbonContent = (
    <Box sx={{ display: "flex", flex: 1, gap: "10px" }}>
      <Box
        className={"register__headers"}
      >
        {navigators
          .filter((item) => {
            if (isTDO && clientStatus === "Under review" && editMode) {
              return item.label !== "Costs and Fees"
            }

            else if ((isTDO || isHead) && clientStatus === "Approved" && editMode) {
              return item.label === "Price Mode";
            }



            return true;
          })
          .map((item, i) => {
            return isTermsDataLoading ||
              isAttachmentsDataLoading ||
              isListingFeeLoading ||
              isExpensesLoading ? (
              <Skeleton key={i} sx={{ transform: "none" }} />
            ) : (
              <Button
                key={i}
                disabled={item.disabled}
                className={
                  "register__headers__item" +
                  (activeTab === item.label ? " active" : "")
                }
                onClick={() => {
                  setActiveTab(item.label);
                }}
              >
                {item.isValid && (
                  <Check
                    sx={{
                      color: "white !important",
                      stroke: "white",
                      strokeWidth: 1,
                    }}
                  />
                )}

                <Typography className="register__headers__item__label">
                  {item.label}
                </Typography>

                <span className="register__headers__item__icon">
                  {item.icon}
                </span>
              </Button>
            );
          })}
      </Box>

      <IconButton
        sx={{ color: "white !important" }}
        onClick={isDirty ? onCancelConfirmOpen : handleDrawerClose}
      >
        <Close />
      </IconButton>
    </Box>
  );

  //Misc Functions
  const handleNext = async () => {
    if (activeTab === "Personal Info") {
      //Temporary only to disable it on editMode
      if (!editMode) {
        try {
          await postValidateClient({
            clientId: editMode ? selectedRowData?.id : 0,
            businessName: watch("businessName"),
            branchName: watch("branchName"),
            // distriTypeId: watch("distriTypeId")?.id,
          }).unwrap();
        } catch (error) {
          if (error?.data?.error?.message) {
            snackbar({
              message: error?.data?.error?.message,
              variant: "error",
            });
          } else {
            snackbar({ message: "Business already exists", variant: "error" });
          }
          return;
        }
      }

      setActiveTab("Price Mode");
      dispatch(
        setSelectedRow({
          id: selectedRowData?.id,
          currentApprover: selectedRowData?.currentApprover,
          currentApproverPhoneNumber:
            selectedRowData?.currentApproverPhoneNumber,
          ...getValues(),
          dateOfBirth: getValues().dateOfBirth.format("YYYY-MM-DD"),
          clusterId: watch("clusterId"),
          // priceModeId: watch("priceModeId"),
          storeType: watch("storeTypeId"),
        })
      );
    } else if (activeTab === "Price Mode") {
      setActiveTab("Terms & Conditions")
    } else if (
      activeTab === "Terms & Conditions" &&
      termsAndConditions["terms"] === 1
    ) {
      setActiveTab("Costs and Fees");
    } else if (
      activeTab === "Terms & Conditions" &&
      termsAndConditions["terms"] !== 1
    ) {
      setActiveTab("Costs and Fees");
    }
    // else if (activeTab === "Attachments") {
    //   setActiveTab("Costs and Fees");
    // }
  };

  const handleBack = () => {
    if (activeTab === "Price Mode") {
      setActiveTab("Personal Info");
    } else if (activeTab === "Terms & Conditions") {
      setActiveTab("Price Mode")
    }
    // else if (activeTab === "Attachments") {
    //   setActiveTab("Terms & Conditions");
    // } 
    else if (
      activeTab === "Costs and Fees"
    ) {
      setActiveTab("Terms & Conditions");
    } else if (
      activeTab === "Costs and Fees" &&
      termsAndConditions["terms"] !== 1
    ) {
      setActiveTab("Attachments");
    }
  };

  const handleDisableNext = () => {
    if (activeTab === "Personal Info") {
      if (navigators[0].isValid === false) {
        return true;
      } else if (isValidateClientLoading) {
        return true;
      }
    } else if (activeTab === "Price Mode" && navigators[1].isValid === false) {
      return true
    } else if (
      activeTab === "Terms & Conditions" &&
      navigators[2].isValid === false
    ) {
      return true;
    }
    // else if (activeTab === "Attachments" && navigators[2].isValid === false) {
    //   return true;
    // }

    return false;
  };

  const handleSameAsOwnersAddress = () => {
    setSameAsOwnersAddress((prev) => !prev);
    if (!sameAsOwnersAddress) {
      setValue(
        "deliveryAddress.houseNumber",
        watch("businessAddress.houseNumber"),
        { shouldValidate: true }
      );
      setValue(
        "deliveryAddress.streetName",
        watch("businessAddress.streetName"),
        { shouldValidate: true }
      ),
        setValue(
          "deliveryAddress.barangayName",
          watch("businessAddress.barangayName"),
          { shouldValidate: true }
        );
      setValue("deliveryAddress.city", watch("businessAddress.city"), {
        shouldValidate: true,
      }),
        setValue("deliveryAddress.province", watch("businessAddress.province"), {
          shouldValidate: true,
        });
    } else {
      setValue("deliveryAddress.houseNumber", "", { shouldValidate: true });
      setValue("deliveryAddress.streetName", "", { shouldValidate: true });
      setValue("deliveryAddress.barangayName", "", { shouldValidate: true });
      setValue("deliveryAddress.city", "", { shouldValidate: true });
      setValue("deliveryAddress.province", "", { shouldValidate: true });
    }
  };

  //UseEffects
  useEffect(() => {
    if (editMode) {
      //Personal Info
      setValue("branchName", selectedRowData?.branchName);
      setValue("emailAddress", selectedRowData?.emailAddress);
      setValue("tinNumber", selectedRowData?.tinNumber);
      setValue("dateOfBirth", moment(selectedRowData?.dateOfBirth));
      setValue("phoneNumber", selectedRowData?.phoneNumber);
      setValue("businessAddress", selectedRowData?.businessAddress);
      setValue("businessName", selectedRowData?.businessName);
      setValue(
        "distriTypeId",
        distriTypeData?.distributionTypes?.find(
          (item) =>
            item.name === selectedRowData?.distriType
        )
      );
      setValue("deliveryAddress", selectedRowData?.deliveryAddress);
      dispatch(setPriceModeId(selectedRowData?.priceModeId));
      dispatch(setPriceModeItems(selectedRowData?.clientItems?.map((item) => ({
        itemCode: productData?.items?.find((data) => data.itemCode === item.itemCode),
        itemDescription: item.itemDescription,
        price: item.price,
      }))))
      // setValue(
      //   "clusterId",
      //   clusterData?.cluster?.find(
      //     (item) =>
      //       selectedRowData?.clusterId === item.id ||
      //       selectedRowData.clusterId.id === item.id
      //   )
      // );
      // setValue(
      //   "priceModeId",
      //   priceModeData.find(
      //     (item) =>
      //       selectedRowData?.priceModeId === item.id
      //   )
      // );
      setValue(
        "authorizedRepresentative",
        selectedRowData?.authorizedRepresentative
      );
      setValue(
        "authorizedRepresentativePosition",
        selectedRowData?.authorizedRepresentativePosition
      );
      if (
        shallowEqual(
          selectedRowData?.businessAddress,
          selectedRowData?.deliveryAddress
        )
      ) {
        setSameAsOwnersAddress(true);
      }


      // dispatch(
      //   setFreebies(
      //     data?.freebies?.[0]?.freebies?.map((freebie) => ({
      //       itemId: productData?.items?.find(
      //         (item) => item.itemCode === freebie.itemCode
      //       ),
      //       quantity: freebie.quantity,
      //       uom: freebie?.uom,
      //       itemDescription: freebie?.itemDescription,
      //     }))
      //   )
      // );


      // setSignatureDirect(data?.freebies?.[0]?.eSignature);
      // setPhotoProofDirect(data?.freebies?.[0]?.photoProof);

      // Terms & Conditions
      dispatch(
        setWholeTermsAndConditions({
          // freezer: termsData?.freezer ? true : false,
          // freezerAssetTag: termsData?.freezer ? termsData?.freezer : "",
          // typeOfCustomer: termsData?.typeOfCustomer,
          // directDelivery: termsData?.directDelivery,
          // bookingCoverageId: parseInt(
          //   termsData?.bookingCoverage.substring(1),
          //   10
          // ),
          // withholdingIssuance: termsData?.withholdingIssuance,
          // terms: termsData?.termId,
          terms: termsData?.termId,
          termDaysId: termDaysData?.termDays?.find(
            (day) => day.id === termsData?.termDaysId
          ),
          modeOfPayments: termsData?.modeofPayments?.map((payment) => ({
            modeOfPaymentId: payment.id,
          })),
          creditLimit: termsData?.creditLimit,
          creditTypeId: (termsData?.creditLimit !== -1 && termsData?.termDays) ? creditType[0] : termsData?.termDaysId === null ? creditType[2] : creditType[1],
          variableDiscount: !termsData?.variableDiscount
            ? false
            : termsData?.variableDiscount,
          fixedDiscount:
            termsData?.fixedDiscount === null
              ? {
                discountPercentage: null,
              }
              : {
                discountPercentage:
                  termsData?.fixedDiscount?.discountPercentage * 100,
                originalPercentage: termsData?.fixedDiscount?.discountPercentage * 100,

              },
        })
      );

      // Attachments
      // API Version
      if (attachmentsData?.attachments?.length === 1) {
        if (includeAuthorizedRepresentative) {
          setRequirementsMode("representative");

          setRepresentativeRequirements({
            signature: attachmentsData?.attachments?.find(
              (item) => item.documentType === "Signature"
            )?.documentLink,
            // storePhoto: attachmentsData?.attachments?.find(
            //   (item) => item.documentType === "Store Photo"
            // )?.documentLink,
            // businessPermit: attachmentsData?.attachments?.find(
            //   (item) => item.documentType === "Business Permit"
            // )?.documentLink,
            // photoIdOwner: attachmentsData?.attachments?.find(
            //   (item) => item.documentType === "Photo ID Owner"
            // )?.documentLink,
            // photoIdRepresentative: attachmentsData?.attachments?.find(
            //   (item) => item.documentType === "Photo ID Representative"
            // )?.documentLink,
            // authorizationLetter: attachmentsData?.attachments?.find(
            //   (item) => item.documentType === "Authorization Letter"
            // )?.documentLink,
          });
          setRepresentativeRequirementsIsLink({
            signature: true,
            // storePhoto: true,
            // businessPermit: true,
            // photoIdOwner: true,
            // photoIdRepresentative: true,
            // authorizationLetter: true,
          });
        } else {
          setRequirementsMode("owner");

          setOwnersRequirements({
            signature: attachmentsData?.attachments?.find(
              (item) => item.documentType === "Signature"
            )?.documentLink,
            // storePhoto: attachmentsData?.attachments?.find(
            //   (item) => item.documentType === "Store Photo"
            // )?.documentLink,
            // businessPermit: attachmentsData?.attachments?.find(
            //   (item) => item.documentType === "Business Permit"
            // )?.documentLink,
            // photoIdOwner: attachmentsData?.attachments?.find(
            //   (item) => item.documentType === "Photo ID Owner"
            // )?.documentLink,
          });
          setOwnersRequirementsIsLink({
            signature: true,
            // storePhoto: true,
            // businessPermit: true,
            // photoIdOwner: true,
          });
        }
      } else if (attachmentsData?.attachments?.length > 4) {
        if (includeAuthorizedRepresentative) {
          setRequirementsMode("representative");
        } else {
          setRequirementsMode("owner");
        }

        setRepresentativeRequirements({
          signature: attachmentsData?.attachments?.find(
            (item) => item.documentType === "Signature"
          )?.documentLink,
          storePhoto: attachmentsData?.attachments?.find(
            (item) => item.documentType === "Store Photo"
          )?.documentLink,
          businessPermit: attachmentsData?.attachments?.find(
            (item) => item.documentType === "Business Permit"
          )?.documentLink,
          photoIdOwner: attachmentsData?.attachments?.find(
            (item) => item.documentType === "Photo ID Owner"
          )?.documentLink,
          photoIdRepresentative: attachmentsData?.attachments?.find(
            (item) => item.documentType === "Photo ID Representative"
          )?.documentLink,
          authorizationLetter: attachmentsData?.attachments?.find(
            (item) => item.documentType === "Authorization Letter"
          )?.documentLink,
        });
        setRepresentativeRequirementsIsLink({
          signature: true,
          storePhoto: true,
          businessPermit: true,
          photoIdOwner: true,
          photoIdRepresentative: true,
          authorizationLetter: true,
        });
      } else if (attachmentsData?.attachments?.length <= 4) {
        if (includeAuthorizedRepresentative) {
          setRequirementsMode("representative");
        } else {
          setRequirementsMode("owner");
        }

        setOwnersRequirements({
          signature: attachmentsData?.attachments?.find(
            (item) => item.documentType === "Signature"
          )?.documentLink,
          storePhoto: attachmentsData?.attachments?.find(
            (item) => item.documentType === "Store Photo"
          )?.documentLink,
          businessPermit: attachmentsData?.attachments?.find(
            (item) => item.documentType === "Business Permit"
          )?.documentLink,
          photoIdOwner: attachmentsData?.attachments?.find(
            (item) => item.documentType === "Photo ID Owner"
          )?.documentLink,
        });
        setOwnersRequirementsIsLink({
          signature: true,
          storePhoto: true,
          businessPermit: true,
          photoIdOwner: true,
        });
      }

      // Listing Fee
      dispatch(
        setListingFeeForRegistration(
          listingFeeData?.listingFees?.[0]?.listingItems?.map((item) => ({
            itemId: productData?.items?.find(
              (product) => product.itemCode === item.itemCode
            ),
            itemDescription: item.itemDescription,
            uom: item.uom,
            sku: item.sku,
            unitCost: item.unitCost,
          }))
        )
      );
      dispatch(setIsListingFeeValid(true));

      // Other Expenses
      dispatch(
        setExpensesForRegistration(
          expensesData?.expenses?.[0]?.expenses?.map((item) => ({
            otherExpenseId: expensesDataChoices?.otherExpenses?.find(
              (expense) => expense.expenseType === item.expenseType
            ),
            remarks: item.remarks,
            amount: item.amount,
            id: item.id || 0,
          }))
        )
      );
      dispatch(setIsExpensesValid(true));
    }
  }, [
    open,
    termDaysData,
    termsData,
    attachmentsData,
    // clusterData,
    dispatch,
    editMode,
    priceModeData,
  selectedRowData?.id,   
    setOwnersRequirements,
    setOwnersRequirementsIsLink,
    setRepresentativeRequirements,
    setRepresentativeRequirementsIsLink,
    setRequirementsMode,
    setValue,
    distriTypeData,
    listingFeeData,
    productData,
    expensesData,
    expensesDataChoices,
    includeAuthorizedRepresentative,
  ]);

  useEffect(() => {
    if (!isDirty) return;
    dispatch(setDirty(true))
  }, [isDirty])


  useEffect(() => {
    if (!open) return;
    if ((isTDO || isHead) && clientStatus === "Approved" && editMode) {
      setActiveTab("Price Mode");
    }
  }, [isTDO, open]);

  useEffect(() => {
    if (
      editMode &&
      selectedRowData?.authorizedRepresentative &&
      selectedRowData?.authorizedRepresentativePosition
    ) {
      setIncludeAuthorizedRepresentative(true);
    }
  }, [
    selectedRowData?.authorizedRepresentative,
    selectedRowData?.authorizedRepresentativePosition,
    editMode,
  ]);

  useEffect(() => {
    if (includeAuthorizedRepresentative) {
      setRequirementsMode("representative");
    } else if (!includeAuthorizedRepresentative) {
      setValue("authorizedRepresentative", "");
      setValue("authorizedRepresentativePosition", "");
      setRequirementsMode("owner");
    }
  }, [includeAuthorizedRepresentative, setRequirementsMode, setValue, open]);

  useEffect(() => {
    if (!editMode && territory && open) {
      setValue("tdoId", territory?.territories?.[0]);
    }
  }, [open, territory, editMode, setValue]);

  // useEffect(() => {
  //   if (!editMode && priceModeData && open) {
  //     setValue(
  //       "priceModeId",
  //       priceModeData?.find(
  //         (item) => item.priceModeDescription?.toLowerCase() === "regular"
  //       )
  //     );
  //   }
  // }, [open, priceModeData, editMode, setValue]);

// trigger effect
useEffect(() => {
  if (editMode) {
    triggerTerms({ id: selectedRowData?.id }, { preferCacheValue: true });
    triggerAttachments({ id: selectedRowData?.id }, { preferCacheValue: true });
    triggerListingFee({ id: selectedRowData?.id }, { preferCacheValue: true });
    triggerExpenses({ id: selectedRowData?.id }, { preferCacheValue: true });
  }
}, [
  open,
  editMode,
  selectedRowData?.id, 
  triggerAttachments,
  triggerTerms,
  triggerListingFee,
  triggerExpenses,
]);

  useEffect(() => {
    if (open && !editMode) {
      dispatch(resetListingFeeForRegistration());
      dispatch(resetExpensesForRegistration());
    }
  }, [editMode, open, dispatch]);

  return (
    <>
      <CommonDrawer
        drawerHeader="Direct Registration"
        open={
          open
          // true
        }
        // onClose={onCancelConfirmOpen}
        onClose={isDirty ? onCancelConfirmOpen : handleDrawerClose}
        width="1000px"
        responsiveBreakpoint="999px"
        paddingSmall
        // noRibbon
        customRibbonContent={customRibbonContent}
        removeButtons
        submitLabel={"Register"}
        disableSubmit={
          termsAndConditions["terms"] === 1
            ? navigators.some(
              (obj) => obj.isValid === false && obj.label !== ""
            )
            : navigators.some((obj) => obj.isValid === false)
        }
        onSubmit={onConfirmOpen}
        zIndex={editMode && "1300"}
      >
        {isTermsDataLoading || isAttachmentsDataLoading ? (
          <RegisterClientFormSkeleton />
        ) : (
          <>
            {activeTab === "Personal Info" && (
              <Box className="register">
                <Box className="register__firstRow">
                  <Box className="register__firstRow__customerInformation">
                    <Typography className="register__title">
                      Sales&apos;s Invoice Information
                    </Typography>

                    <Box className="register__firstRow__customerInformation__row">
                      <Controller
                        control={control}
                        name="businessName"
                        render={({
                          field: { onChange, onBlur, value, ref },
                        }) => (
                          <TextField
                            label="Business Name"
                            size="small"
                            autoComplete="off"
                            required
                            className="register__textField"
                            onChange={(e) =>
                              onChange(e.target.value.toUpperCase())
                            }
                            onBlur={onBlur}
                            value={value}
                            inputRef={ref}
                            helperText={errors?.ownersName?.message}
                            error={!!errors?.ownersName}
                          />
                        )}
                      />

                      <TextField
                        label="Email Address"
                        size="small"
                        autoComplete="off"
                        // required
                        className="register__textField"
                        {...register("emailAddress")}
                        helperText={errors?.emailAddress?.message}
                        error={!!errors?.emailAddress}
                      />
                      <Controller
                        control={control}
                        name={"tinNumber"}
                        render={({ field: { onChange, onBlur, value, ref } }) => {
                          const formattedValue = value.replace(/-/g, ""); // Remove existing dashes
                          // let format = "###-###-###-###";
                          let format = "###-###-###-###";

                          if (formattedValue.length <= 3) {
                            format = "####";
                          } else if (formattedValue.length <= 6) {
                            format = "###-####";
                          } else if (formattedValue.length <= 9) {
                            format = "###-###-####";
                          }
                          //  else if (formattedValue.length <= 9) {
                          //   format = "###-###-####";
                          // }

                          return (
                            <PatternFormat
                              format={format}
                              label="TIN Number"
                              type="text"
                              size="small"
                              customInput={TextField}
                              autoComplete="off"
                              valueIsNumericString
                              inputRef={ref}
                              onValueChange={(e) => {
                                onChange(e.value);
                              }}
                              onBlur={onBlur}
                              value={value || ""}
                              // required
                              helperText={errors?.tinNumber?.message}
                              error={!!errors?.tinNumber}
                            />
                          );
                        }}
                      />
                      <Controller
                        control={control}
                        name={"phoneNumber"}
                        render={({
                          field: { onChange, onBlur, value, ref },
                        }) => {
                          const formattedValue = value.replace(/-/g, "");
                          let format = "###-###-####";

                          if (formattedValue.length <= 3) {
                            format = "####";
                          } else if (formattedValue.length <= 6) {
                            format = "###-####";
                          } else if (formattedValue.length <= 10) {
                            format = "###-###-####";
                          }

                          return (
                            <PatternFormat
                              format={format}
                              label="Phone Number"
                              type="text"
                              size="small"
                              customInput={TextField}
                              autoComplete="off"
                              inputRef={ref}
                              valueIsNumericString
                              onValueChange={(e) => {
                                onChange(e.value);
                              }}
                              onBlur={onBlur}
                              value={value || ""}
                              required
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    +63
                                  </InputAdornment>
                                ),
                              }}
                              prefix="+63"
                              className="register__textField"
                              helperText={errors?.phoneNumber?.message}
                              error={!!errors?.phoneNumber}
                            />
                          );
                        }}
                      />
                    </Box>
                  </Box>
                </Box>
                <Box className="register__thirdRow">
                  <>
                    <Box className="register__thirdRow__column">
                      <Typography className="register__title">
                        Branch Name
                      </Typography>

                      <Controller
                        control={control}
                        name="branchName"
                        render={({ field: { onChange, onBlur, value, ref } }) => (
                          <TextField
                            label="Branch Name"
                            size="small"
                            autoComplete="off"
                            required
                            className="register__textField"
                            onChange={(e) =>
                              onChange(e.target.value.toUpperCase())
                            }
                            onBlur={onBlur}
                            value={value}
                            inputRef={ref}
                            helperText={errors?.branchName?.message}
                            error={!!errors?.branchName}
                          />
                        )}
                      />
                    </Box>
                    {/* <Box className="register__thirdRow__column">
                      <Typography className="register__title">
                        Price Mode
                      </Typography>

                      <ControlledAutocomplete
                        name="priceModeId"
                        control={control}
                        options={priceModeData || []}
                        getOptionLabel={(option) =>
                          `${option.priceModeCode?.toUpperCase()} -  ${option.priceModeDescription?.toUpperCase()}`
                        }
                        disableClearable
                        isOptionEqualToValue={(option, value) =>
                          option.id === value.id
                        }
                        loading={isPriceModeLoading}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            size="small"
                            label="Price Mode"
                            required
                            helperText={errors?.priceModeId?.message}
                            error={!!errors?.priceModeId}
                          />
                        )}
                      />
                    </Box> */}
                  </>
                </Box>
                <Box className="register__secondRow">
                  <Box className="register__secondRow">
                    <Typography className="register__title">
                      Business Address
                    </Typography>
                    <Box className="register__secondRow">
                      <Box className="register__secondRow__content">
                        <Controller
                          name="businessAddress.houseNumber"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <TextField
                              label="Unit No."
                              size="small"
                              autoComplete="off"
                              className="register__textField"
                              {...field}
                              onChange={(e) =>
                                field.onChange(e.target.value.toUpperCase())
                              }
                              helperText={
                                errors?.businessAddress?.houseNumber?.message
                              }
                              error={!!errors?.businessAddress?.houseNumber}
                            />
                          )}
                        />

                        <Controller
                          name="businessAddress.streetName"
                          control={control}
                          defaultValue="" // Set your default value here if needed
                          render={({ field }) => (
                            <TextField
                              label="Street Name"
                              size="small"
                              autoComplete="off"
                              className="register__textField"
                              {...field}
                              onChange={(e) =>
                                field.onChange(e.target.value.toUpperCase())
                              }
                              helperText={
                                errors?.businessAddress?.streetName?.message
                              }
                              error={!!errors?.businessAddress?.streetName}
                            />
                          )}
                        />

                        <Controller
                          name="businessAddress.barangayName"
                          control={control}
                          defaultValue="" // Set your default value here if needed
                          rules={{ required: "Barangay is required" }} // Add your validation rules here
                          render={({ field }) => (
                            <TextField
                              label="Barangay"
                              size="small"
                              autoComplete="off"
                              required
                              className="register__textField"
                              {...field}
                              onChange={(e) =>
                                field.onChange(e.target.value.toUpperCase())
                              }
                              helperText={
                                errors?.businessAddress?.barangayName?.message
                              }
                              error={!!errors?.businessAddress?.barangayName}
                            />
                          )}
                        />
                      </Box>
                      <Box className="register__secondRow__content">
                        <Controller
                          name="businessAddress.city"
                          control={control}
                          defaultValue="" // Set your default value here if needed
                          rules={{ required: "Municipality/City is required" }} // Add your validation rules here
                          render={({ field }) => (
                            <TextField
                              label="Municipality/City"
                              size="small"
                              autoComplete="off"
                              required
                              className="register__textField"
                              {...field}
                              onChange={(e) =>
                                field.onChange(e.target.value.toUpperCase())
                              }
                              helperText={errors?.businessAddress?.city?.message}
                              error={!!errors?.businessAddress?.city}
                            />
                          )}
                        />

                        <Controller
                          name="businessAddress.province"
                          control={control}
                          defaultValue="" // Set your default value here if needed
                          rules={{ required: "Province is required" }} // Add your validation rules here
                          render={({ field }) => (
                            <TextField
                              label="Province"
                              size="small"
                              autoComplete="off"
                              required
                              className="register__textField"
                              {...field}
                              onChange={(e) =>
                                field.onChange(e.target.value.toUpperCase())
                              }
                              helperText={
                                errors?.businessAddress?.province?.message
                              }
                              error={!!errors?.businessAddress?.province}
                            />
                          )}
                        />
                      </Box>
                    </Box>
                  </Box>
                </Box>




                <Box className="register__secondRow">
                  <Box className="register__titleBox">
                    <Typography className="register__title">
                      Delivery Address
                    </Typography>
                    <Checkbox
                      sx={{ ml: "10px" }}
                      checked={sameAsOwnersAddress}
                      onChange={() => {
                        // setSameAsOwnersAddress((prev) => !prev);
                        handleSameAsOwnersAddress();
                      }}
                      // disabled={Object.values(watch("ownersAddress")).some(
                      //   (value) => !value
                      // )}
                      disabled={Object.entries(watch("businessAddress")).some(
                        ([key, value]) =>
                          key !== "houseNumber" &&
                          key !== "streetName" &&
                          !value
                      )}
                      title={
                        !Object.values(watch("businessAddress")).some(
                          (value) => !value
                        )
                          ? "Fill up owner's address first"
                          : ""
                      }
                    />
                    <Typography variant="subtitle2">
                      Same as business address
                    </Typography>
                  </Box>

                  <Box className="register__secondRow__content">
                    <Controller
                      control={control}
                      name="deliveryAddress.houseNumber"
                      render={({ field: { onChange, onBlur, value, ref } }) => (
                        <TextField
                          disabled={sameAsOwnersAddress}
                          label="Unit No."
                          size="small"
                          autoComplete="off"
                          // required
                          className="register__textField"
                          onChange={(e) =>
                            onChange(e.target.value.toUpperCase())
                          }
                          onBlur={onBlur}
                          value={value}
                          inputRef={ref}
                          helperText={
                            errors?.deliveryAddress?.houseNumber?.message
                          }
                          error={!!errors?.deliveryAddress?.houseNumber}
                        />
                      )}
                    />

                    <Controller
                      control={control}
                      name="deliveryAddress.streetName"
                      render={({ field: { onChange, onBlur, value, ref } }) => (
                        <TextField
                          disabled={sameAsOwnersAddress}
                          label="Street Name"
                          size="small"
                          autoComplete="off"
                          className="register__textField"
                          helperText={
                            errors?.deliveryAddress?.streetName?.message
                          }
                          error={!!errors?.deliveryAddress?.streetName}
                          onChange={(e) =>
                            onChange(e.target.value.toUpperCase())
                          }
                          onBlur={onBlur}
                          value={value}
                          inputRef={ref}
                        />
                      )}
                    />

                    <Controller
                      control={control}
                      name="deliveryAddress.barangayName"
                      render={({ field: { onChange, onBlur, value, ref } }) => (
                        <TextField
                          disabled={sameAsOwnersAddress}
                          label="Barangay"
                          size="small"
                          autoComplete="off"
                          required
                          className="register__textField"
                          helperText={
                            errors?.deliveryAddress?.barangayName?.message
                          }
                          error={!!errors?.deliveryAddress?.barangayName}
                          onChange={(e) =>
                            onChange(e.target.value.toUpperCase())
                          }
                          onBlur={onBlur}
                          value={value}
                          inputRef={ref}
                        />
                      )}
                    />
                  </Box>

                  <Box className="register__secondRow__content">
                    <Controller
                      control={control}
                      name="deliveryAddress.city"
                      render={({ field: { onChange, onBlur, value, ref } }) => (
                        <TextField
                          disabled={sameAsOwnersAddress}
                          label="Municipality/City"
                          size="small"
                          autoComplete="off"
                          required
                          className="register__textField"
                          helperText={errors?.deliveryAddress?.city?.message}
                          error={!!errors?.deliveryAddress?.city}
                          onChange={(e) =>
                            onChange(e.target.value.toUpperCase())
                          }
                          onBlur={onBlur}
                          value={value}
                          inputRef={ref}
                        />
                      )}
                    />

                    <Controller
                      control={control}
                      name="deliveryAddress.province"
                      render={({ field: { onChange, onBlur, value, ref } }) => (
                        <TextField
                          disabled={sameAsOwnersAddress}
                          label="Province"
                          size="small"
                          autoComplete="off"
                          required
                          className="register__textField"
                          helperText={
                            errors?.deliveryAddress?.province?.message
                          }
                          error={!!errors?.deliveryAddress?.province}
                          onChange={(e) =>
                            onChange(e.target.value.toUpperCase())
                          }
                          onBlur={onBlur}
                          value={value}
                          inputRef={ref}
                        />
                      )}
                    />

                    {/* <SecondaryButton
                  sx={{ maxHeight: "40px" }}
                  onClick={onPinLocationOpen}
                >
                  Pin Location &nbsp; <PushPin />
                </SecondaryButton> */}
                  </Box>
                </Box>

                {/* <Box className="register__secondRow">
                  <Box className="register__titleBox">
                    <Typography className="register__title">
                      Authorized Representative Details
                    </Typography>
                    <Checkbox
                      sx={{ ml: "10px" }}
                      checked={includeAuthorizedRepresentative}
                      onChange={() => {
                        setIncludeAuthorizedRepresentative((prev) => !prev);
                      }}
                    />
                    <Typography variant="subtitle2">
                      Include authorized representative
                    </Typography>
                  </Box>
                  <Box className="register__secondRow">
                    <Box className="register__secondRow__content">
                      <Controller
                        control={control}
                        name="authorizedRepresentative"
                        render={({
                          field: { onChange, onBlur, value, ref },
                        }) => (
                          <TextField
                            label="Full Name"
                            size="small"
                            autoComplete="off"
                            required={includeAuthorizedRepresentative}
                            disabled={!includeAuthorizedRepresentative}
                            className="register__textField"
                            onChange={(e) =>
                              onChange(e.target.value.toUpperCase())
                            }
                            onBlur={onBlur}
                            value={value}
                            inputRef={ref}
                            helperText={
                              errors?.authorizedRepresentative?.message
                            }
                            error={!!errors?.authorizedRepresentative}
                          />
                        )}
                      />

                      <Controller
                        control={control}
                        name="authorizedRepresentativePosition"
                        render={({
                          field: { onChange, onBlur, value, ref },
                        }) => (
                          <TextField
                            label="Position"
                            size="small"
                            autoComplete="off"
                            required={includeAuthorizedRepresentative}
                            disabled={!includeAuthorizedRepresentative}
                            className="register__textField"
                            onChange={(e) =>
                              onChange(e.target.value.toUpperCase())
                            }
                            onBlur={onBlur}
                            value={value}
                            inputRef={ref}
                            helperText={
                              errors?.authorizedRepresentativePosition?.message
                            }
                            error={!!errors?.authorizedRepresentativePosition}
                          />
                        )}
                      />
                    </Box>
                  </Box>
                </Box> */}
              </Box>
            )}
            {activeTab === "Price Mode" && (
              <PriceMode clientStatus={clientStatus} editMode={editMode} onOriginalItemsReady={(items) => {
                originalItemsRef.current = items; // ← store it silently
              }} />
            )}

            {activeTab === "Terms & Conditions" && (
              <TermsAndConditions
                direct
                editMode={editMode}
                storeType={watch("storeTypeId")?.storeTypeName}
              />
            )}

            {/* {activeTab === "Attachments" && <Attachments />} */}

            {activeTab === "Costs and Fees" && (
              <Box className="feesClient">
                <ListingFeeClient />
                <Divider variant="inset" />
                <OtherExpensesClient />
              </Box>
            )}

            <Box
              className={
                activeTab === "Personal Info" || ((isTDO || isHead) && clientStatus === "Approved" && editMode)
                  ? "commonDrawer__actionsNoMarginBottom"
                  : "commonDrawer__actionsSpread"
              }
            >
              {(activeTab !== "Personal Info" && !((isTDO || isHead) && clientStatus === "Approved" && editMode)) && (
                <DangerButton onClick={handleBack}>Back</DangerButton>
              )}

              {showNextButton && (
                <SecondaryButton
                  onClick={handleNext}
                  disabled={handleDisableNext()}
                >
                  {isValidateClientLoading ? (
                    <CircularProgress size="20px" color="white" />
                  ) : (
                    "Next"
                  )}
                </SecondaryButton>
              )}

              {showSubmitButton && (
                <SecondaryButton
                  onClick={() => {
                    dispatch(toggleFeesToStore());
                    onConfirmOpen();
                  }}
                  disabled={
                    termsAndConditions["terms"] === 1
                      ? navigators.some(
                        (obj) => obj.isValid === false && obj.label !== ""
                      )
                      : navigators.some((obj) => obj.isValid === false) ||
                      (!isPriceModeDirty && editMode)
                  }
                >
                  {editMode ? "Update" : "Register"}
                </SecondaryButton>
              )}
            </Box>
          </>
        )}
      </CommonDrawer >

      <AgreeTermsModal
        open={isConfirmOpen && !editMode}
        onClose={onConfirmClose}
        onRegister={handleSubmit(onSubmit)}
        isLoading={isAllApiLoading || isSendMessageLoading}
      />

      <CommonDialog
        open={isConfirmOpen && editMode}
        onClose={onConfirmClose}
        onYes={handleSubmit(onSubmit)}
        isLoading={isAllApiLoading || isSendMessageLoading}
        question
      >
        Confirm {editMode ? "update" : "registration"} of{" "}
        <span style={{ textTransform: "uppercase", fontWeight: "bold" }}>
          {watch("businessName") || "CLIENT"}
        </span>
        {((isTDO || isHead) && clientStatus !== "Under review")
          ? "'s items?"
          : " as a regular customer?"}
      </CommonDialog>

      <CommonDialog
        open={isCancelConfirmOpen}
        onYes={handleDrawerClose}
        onClose={onCancelConfirmClose}
      >
        Confirm cancel of{" "}
        <span style={{ textTransform: "uppercase", fontWeight: "bold" }}>
          {watch("businessName") ? watch("businessName") : "client"}
        </span>{" "}
        as a business? <br />
        <span style={{ textTransform: "uppercase", fontWeight: "bold" }}>
          (Fields will be reset)
        </span>
      </CommonDialog>
    </>
  );
}

export default DirectRegisterForm;
