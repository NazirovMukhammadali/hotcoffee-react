import { createContext, useContext } from "react";
import { Member } from "../../lib/types/member";

interface GlobalInterface {
    authMember: Member | null;
    setAuthMember: (member: Member | null) => void;
    orderBuilder: Date;
    setOrderBuilder: (input: Date) => void;
}

export const GlobalContex = createContext<GlobalInterface | undefined>(
    undefined
);

export const useGlobals = () => {
    const context = useContext(GlobalContex);
    if (context === undefined) throw new Error("useGlobals within Provider");

    return context;
};