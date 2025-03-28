import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { GetApp } from '@mui/icons-material';
import Report from '../../components/page-components/reports/SOAreport';
import SecondaryButton from "../../components/SecondaryButton";


const SOAPDFDownload = ({
  soaReportData,
  watch,
  soaFetching,
  listingFeeFetching,
  dateTo
}) => {
  // Comprehensive disable condition
  const isDisabled = 
    !watch("clientId") || 
    soaFetching || 
    listingFeeFetching;

  // If disabled, render a non-interactive button
  if (isDisabled) {
    return (
      <SecondaryButton
        disabled
        size="medium"
        variant="contained"
      >
        <GetApp />
      </SecondaryButton>
    );
  }

  // If not disabled, render the download link
  return (
    <PDFDownloadLink
      document={
        <Report
          client={soaReportData?.value}
          dateTo={dateTo}
        />
      }
      fileName={`SOA_${new Date().toISOString().split('T')[0]}.pdf`}
    >
      {({ loading }) => (
        <SecondaryButton
          disabled={loading}
          size="medium"
          variant="contained"
        >
          <GetApp />
        </SecondaryButton>
      )}
    </PDFDownloadLink>
  );
};

export default SOAPDFDownload;