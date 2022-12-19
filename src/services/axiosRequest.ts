import axios from "axios";
import { z } from "zod";

const renderHeaders = (uploadFile?: File) => {
  return {
    "Content-Type": uploadFile ? "multipart/form-data" : "application/json",
  };
};

//generate query based on given object
function generateQueryParams(request: object) {
  let listOfQuery: string[] = [];
  Object.keys(request).forEach((item, index) => {
    let keyObj = item as keyof typeof request;

    listOfQuery.push(`${[item]}=${request[keyObj]}`);
  });

  return listOfQuery;
}

//zod used for validation when using axios
const zodAxiosConfig = z.object({
  method: z.enum(["get", "post", "put", "delete"]),
  baseURL: z.string(),
  url: z.string(),
  data: z.any().optional(),
  headers: z.object({
    "Content-Type": z.string(),
  }),
});

type AxiosSchema = any;

type AxiosConfig = z.infer<typeof zodAxiosConfig>;

function axiosPromise(axiosConfig: AxiosConfig) {
  return new Promise<AxiosSchema | string>((resolve, reject) => {
    axios(axiosConfig)
      .then((resp: unknown) => {
        return resolve(resp as AxiosSchema);
      })
      .catch((error) => {
        return reject(`(${axiosConfig.method.toUpperCase()}): ${error}`);
      });
  });
}

async function Get(baseUrl: string | null, path: string, paramsObj?: object) {
  const headers = renderHeaders();
  let queryParams: string[] = [];
  if (paramsObj) {
    queryParams = generateQueryParams(paramsObj);
  }

  const getAxiosConfig: AxiosConfig = {
    method: "get",
    baseURL: baseUrl ?? process.env.API_URL!,
    url: `${path}?${queryParams.join("&") || ""}`,
    headers,
  };

  const promise = axiosPromise(getAxiosConfig);
  return promise;
}

async function Post(
  baseUrl: string | null,
  path: string,
  sendData: object,
  paramsObj?: object,
  uploadFile?: File
) {
  const headers = renderHeaders(uploadFile);
  let queryParams: string[] = [];
  if (paramsObj) {
    queryParams = generateQueryParams(paramsObj);
  }

  const postAxiosConfig: AxiosConfig = {
    method: "post",
    baseURL: baseUrl ?? process.env.API_URL!,
    url: `${path}?${queryParams.join("&") || ""}`,
    data: sendData,
    headers,
  };

  const promise = axiosPromise(postAxiosConfig);
  return promise;
}

async function Put(
  baseUrl: string | null,
  path: string,
  sendData: object,
  paramsObj?: object,
  uploadFile?: File
) {
  const headers = renderHeaders(uploadFile);
  let queryParams: string[] = [];
  if (paramsObj) {
    queryParams = generateQueryParams(paramsObj);
  }

  const putAxiosConfig: AxiosConfig = {
    method: "put",
    baseURL: baseUrl ?? process.env.API_URL!,
    url: `${path}?${queryParams.join("&") || ""}`,
    data: sendData,
    headers,
  };

  const promise = axiosPromise(putAxiosConfig);

  return promise;
}

async function Delete(
  baseUrl: string | null,
  path: string,
  paramsObj?: object
) {
  const headers = renderHeaders();
  let queryParams: string[] = [];
  if (paramsObj) {
    queryParams = generateQueryParams(paramsObj);
  }

  const deleteAxiosConfig: AxiosConfig = {
    method: "delete",
    baseURL: baseUrl ?? process.env.API_URL!,
    url: `${path}?${queryParams.join("&") || ""}`,
    headers,
  };

  const promise = axiosPromise(deleteAxiosConfig);

  return promise;
}

export const axiosRequest = {
  Get,
  Post,
  Put,
  Delete,
};
