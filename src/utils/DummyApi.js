export const dummyPromise = async ({
  type = "success",
  dummyData = null,
  rejectConditions = [],
}) => {
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  await delay(1000);

  for (const condition of rejectConditions) {
    if (condition.check) {
      throw new Error(condition.message);
    }
  }

  if (type === "success") {
    return {
      data: dummyData,
      message: "Success",
    };
  }

  throw new Error("Error");
};
