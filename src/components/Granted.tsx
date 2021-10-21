import { FC } from "react";
import { auth, Permission } from "../util/helpers/auth";

interface GrantedPropsInterface {
  permissions: Permission[];
}

const Granted: FC<GrantedPropsInterface> = ({ children, permissions }) => {
  const actualPermissions = auth.permissions;
  return (
    permissions.every((permission) =>
      actualPermissions.includes(permission)
    ) && <>{children}</>
  );
};

export default Granted;
