"use client";

import useSWR from "swr";

interface AuthFetcherOptions {
  url: string;
  token: string;
}

async function authFetcher({ url, token }: AuthFetcherOptions) {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  return fetch(url, {
    method: "GET",
    headers,
    cache: "no-store",
  }).then((res) => res.json());
}

export const useAuthDataFetch = <T>(
  path: string | null,
  token: string | null
) => {
  const shouldFetch = path && token;

  return useSWR<T>(shouldFetch ? { url: path, token } : null, authFetcher);
};
