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
            nodes: status,
          }
        : null,
  };
}

export function useTasks(clusterId) {
  const { data: task, error: taskError } = useSWR(
    () => (clusterId ? `/api/cluster/${clusterId}/tasks?all=true`: null),
    fetcher,
    { refreshInterval: 6000 }
  );

  return {
    error: taskError,
    data:
      task
        ? {
            ...task,
            nodes: task,
          }
        : null,
  };


}

export function useClusterList() {
  return useSWR("/api/clusters", fetcher);
}
