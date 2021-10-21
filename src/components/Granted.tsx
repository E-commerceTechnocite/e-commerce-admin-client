import { FC } from "react";
import { auth, Permission } from "../util/helpers/auth";

interface GrantedPropsInterface {
  permissions: Permission[];
}

const Granted: FC<GrantedPropsInterface> = ({ children, permissions }) =>
  auth.hasEachPermissions(permissions) && <>{children}</>;

export default Granted;
