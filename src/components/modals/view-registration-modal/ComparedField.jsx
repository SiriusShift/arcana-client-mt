import { Box, Typography } from "@mui/material";

// `section` matches the tab's BEM block, e.g. "personalInfo", "priceMode", "termsAndConditions"
export function InfoField({ section, label, value }) {
  const className = `viewRegistrationModal__${section}__content__fields__item`;

  return (
    <Box className={className}>
      <Typography className={`${className}__label`}>{label}</Typography>
      <Typography className={`${className}__value`}>{value}</Typography>
    </Box>
  );
}

const isEmpty = (value) => value == null || value === "";

// Shows From/To rows only when the values differ, otherwise NO CHANGES. Without a comparison, shows the regular row.
// When there are no From/To values at all and a regular `value` is given, shows that value instead.
// A null "To" value means unchanged, so it falls back to the "From" value.
function ComparedField({ section, label, value, from, to, isCompared }) {
  if (!isCompared || (isEmpty(from) && isEmpty(to) && value !== undefined)) {
    return <InfoField section={section} label={`${label}:`} value={value} />;
  }

  const toValue = to ?? from;
  if (from === toValue) return <InfoField section={section} label={`${label}:`} value="NO CHANGES" />;

  return (
    <>
      <InfoField section={section} label={`${label} From:`} value={from} />
      <InfoField section={section} label={`${label} To:`} value={toValue} />
    </>
  );
}

export default ComparedField;
