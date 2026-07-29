import React, { useEffect } from "react";
import { AppRoutes } from "./routes/AppRoutes";
import { useAppDispatch, useAppSelector } from "./hooks";
import { getCurrentUserThunk, selectAuth } from "./features/auth";

export const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const { token, user } = useAppSelector(selectAuth);

  useEffect(() => {
    if (token && !user) {
      dispatch(getCurrentUserThunk());
    }
  }, [dispatch, token, user]);

  return <AppRoutes />;
};

export default App;
