import { fetcher } from "./utils";
import useSWR from "swr";

export function useCluster(clusterId) {
  const { data: cluster, error: clusterError } = useSWR(
    () => (clusterId ? `/api/cluster/${clusterId}` : null),
    fetcher
  );

  const { data: status, error: statusError } = useSWR(
    () => (clusterId ? `/api/cluster/${clusterId}/status` : null),
    fetcher,
    { refreshInterval: 6000 }
  );

  return {
    error: clusterError || statusError,
    data:
      cluster && status
        ? {
            ...cluster,
            dataCenters: status,
          }
        : null,
  };
}

export function useClusterList() {
  return useSWR("/api/clusters", fetcher);
}
