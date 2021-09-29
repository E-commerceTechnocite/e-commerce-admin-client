import { domain } from "../environnement";
import { http, HttpException } from "../http";

const refresh = async (): Promise<HttpException | null> => {
  console.log("hello update");
  const refresh_token = sessionStorage.getItem("refresh");
  const options = {
    headers: { "Content-Type": "application/json" },
  };
  const { data, error } = await http.post<{
    access_token: string;
    refresh_token: string;
  }>(`${domain}/v1/o-auth/refresh`, { refresh_token }, options);

  if (error) {
    const keysToRemove = ["token", "refresh"];
    keysToRemove.forEach((key) => sessionStorage.removeItem(key));
    return error;
  }

  const { access_token, refresh_token: refresh } = data;
  sessionStorage.setItem("token", access_token);
  sessionStorage.setItem("refresh", refresh);
  return error;
};

export default refresh;
