import { useEffect, type ReactNode } from "react";
import { setUser } from "../../slices/authSlice";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../server/firebase";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../slices/store";
import { useNavigate } from "react-router-dom";

const ProtectedRoutes = ({ children }: { children: ReactNode }) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      dispatch(
        setUser({
          email: user?.email || "",
          uid: user?.uid || "",
          name: user?.displayName || "",
        })
      );
    });

    return () => unsubscribe();
  }, [dispatch]);
  if (!user.uid) {
    navigate("/login");
    return;
  }
  return <div>{children}</div>;
};

export default ProtectedRoutes;
