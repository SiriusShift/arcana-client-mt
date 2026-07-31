import { Box } from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { setFullname, setRoleName, setToken, setUserDetails } from "../features/authentication/reducers/loginSlice";
import { setPermissisons } from "../features/authentication/reducers/permissionsSlice";

const Redirect = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { search } = useLocation();
    const query = new URLSearchParams(search);
    const rawData = query.get("data");

    useEffect(() => {
        try {
            const data = JSON.parse(decodeURIComponent(rawData));
            dispatch(setUserDetails(data?.value));
            dispatch(setFullname(data?.value?.fullname));
            dispatch(setToken(data?.value?.token));
            dispatch(setPermissisons(data?.value?.permission));
            dispatch(setRoleName(data?.value?.roleName));
            navigate("/");
        } catch (e) {
            window.location.href = `https://one.rdfmis.com/`;
        }
    }, [rawData]);

    return;
};

export default Redirect;