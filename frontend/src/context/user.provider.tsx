'use client';
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { IUser, IDecodedToken } from "../types/auth.types";
import { getCurrentUser } from "../server/AuthService";

// import { getCurrentUser } from "@/server/AuthService";
// import { IUser } from "@/types/auth.types";
interface IUserProvider {
  user: IUser | IDecodedToken | null;
  setUser: (user: IUser | IDecodedToken | null) => void;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

const UserContext = createContext<IUserProvider | undefined>(undefined);

const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | IDecodedToken | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Run once on mount to fetch current user. Using an empty dependency array
  // prevents repeated calls that can result in many server-action POST requests
  // (Next server actions use POST under the hood). Previously this effect
  // depended on `isLoading` which could cause multiple invocations.
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const userData = await getCurrentUser();
        if (mounted) setUser(userData);
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const values = {
    user,
    setUser,
    isLoading,
    setIsLoading,
  };

  return <UserContext.Provider value={values}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within the UserProvider context");
  }
  return context;
};

export default UserProvider;
