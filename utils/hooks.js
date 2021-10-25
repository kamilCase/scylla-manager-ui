import { fetcher } from "./utils";
import useSWR from "swr";

const REFRESH_INTERVAL = 5000;
export function useCluster(clusterId) {
  const { data: cluster, error: clusterError } = useSWR(
    () => (clusterId ? `/api/v1/cluster/${clusterId}` : null),
    fetcher
  );

  const { data: status, error: statusError } = useSWR(
    () => (clusterId ? `/api/v1/cluster/${clusterId}/status` : null),
    fetcher,
    { refreshInterval: REFRESH_INTERVAL }
  );

  return {
    error: clusterError || statusError,
    data:
      cluster && status
        ? {
            ...cluster,
            nodes: status,
          }
        : null,
  };
}

export function useTasks(clusterId) {
  return useSWR(
    () => (clusterId ? `/api/v1/cluster/${clusterId}/tasks?all=true` : null),
    fetcher,
    { refreshInterval: REFRESH_INTERVAL }
  );
}

export function useClusterList() {
  return useSWR("/api/v1/clusters", fetcher);
}
