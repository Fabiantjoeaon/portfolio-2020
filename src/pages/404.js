import { useEffect } from "react";
import { navigate } from "@reach/router";

export default () => {
  useEffect(() => {
    navigate("/your-redirect/");
  }, []);
  return null;
};
