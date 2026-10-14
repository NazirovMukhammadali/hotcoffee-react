import React, { ReactNode, useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { Member } from "../../lib/types/member";
import { GlobalContext } from "../hooks/useGlobals";
import MemberService from "../services/MemberService";


const ContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const cookies = new Cookies();
  if (!cookies.get("accessToken")) localStorage.removeItem("memberData");

  const [authMember, setAuthMember] = useState<Member | null>(
    localStorage.getItem("memberData")
      ? JSON.parse(localStorage.getItem("memberData") as string)
      : null
  );

  const [orderBuilder, setOrderBuilder] = useState<Date>(new Date());

  // localStorage'dagi nusxa eskirgan bo'lishi mumkin: serverdan yangilaymiz
  useEffect(() => {
    if (!authMember) return;
    new MemberService()
      .getMemberDetail()
      .then((member) => setAuthMember(member))
      .catch((err) => {
        if (err?.response?.status === 401 || err?.response?.status === 404) {
          localStorage.removeItem("memberData");
          setAuthMember(null);
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderBuilder]);

  return (<GlobalContext.Provider value={{
    authMember,
    setAuthMember,
    orderBuilder,
    setOrderBuilder
  }}>
    {children}
  </GlobalContext.Provider>
  );
};

export default ContextProvider;
