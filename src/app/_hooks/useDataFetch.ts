"use client";

import useSWR from "swr";

async function fetcher(key: string) {
  return fetch(key).then((res) => res.json());
}

export const useDataFetch = <T>(path: string | null) =>
  useSWR<T>(path, fetcher);