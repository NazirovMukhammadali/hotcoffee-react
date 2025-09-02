import React, { Children, ReactNode, useState } from "react";
import Cookies from "universal-cookie";
import { Member } from "../../lib/types/member";
import { GlobalContex } from "../hooks/useGlobals";

const ContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const cookies = new Cookies();
    if (!cookies.get("accessToken")) localStorage.removeItem("memberData");

    const [authMember, setAuthMember] = useState<Member | null>(
        localStorage.getItem("memberData")
            ? JSON.parse(localStorage.getItem("memberData") as string)
            : null
    );

    const [orderBuilder, setOrderBuilder] = useState<Date>(new Date());

    console.log("=== verify ===");

    return (
        <GlobalContex.Provider
      value= {{ authMember, setAuthMember, orderBuilder, setOrderBuilder }
}
    >
    { children }
    </GlobalContex.Provider>
  );
};

export default ContextProvider;