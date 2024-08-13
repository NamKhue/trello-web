import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "~/hooks/useAuth";

const useRedirect = (redirectPath) => {
  const { auth, checkAuth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAuth = async () => {
      if (auth.isAuthenticated) {
        navigate(redirectPath);
      }
    };
    verifyAuth();
  }, [auth.isAuthenticated, checkAuth, navigate, redirectPath]);
};

export default useRedirect;
