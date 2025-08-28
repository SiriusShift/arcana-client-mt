import { decryptString } from "./CustomFunctions";

export const downloadFile = async (fileUrl, params, name) => {
  console.log(fileUrl, params, name);
  try {
    console.log(`${import.meta.env.VITE_BASEURL}${fileUrl}${params}`)
    const response = await fetch(
      `${import.meta.env.VITE_BASEURL}${fileUrl}${params}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${decryptString(
            sessionStorage.getItem("token")
          )}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to download Excel file.");
    }

    console.log("test");

    const blob = await response.blob();
    const link = document.createElement("a");
    const url = window.URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute("download", `${name}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    snackbar({
      message: "File downloaded successfully",
      variant: "success",
    });
  } catch (err) {
    console.log(err)
  }
};
