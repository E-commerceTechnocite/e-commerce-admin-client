import { FC } from "react";
import { auth } from "../util/helpers/auth";

interface GrantedPropsInterface {
  permissions: string[];
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
