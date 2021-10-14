import React from "react";
import ReactDOM from "react-dom";
import "../public/scss/index.scss";
import { App } from "./App";
import { http } from "./util/http";

export interface Configuration {
  api?: string;
  basePath?: string;
}

export let config: Configuration = {};

http.get<Configuration>(`config.json`).then(({ data, error }) => {
  if (error) {
    console.error("Configuration file not found");
  }
  config = {
    ...data,
  };
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById("root")
  );
});
