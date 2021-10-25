import {useRouter} from "next/router";
import Link from "next/link";
import Image from "next/image";
import Layout from "components/Layout";
import {useBackups} from "utils/hooks";
import {
  MdRepeat,
} from "react-icons/md";

import StatusBox from "components/StatusBox";
import {statusType} from "utils/utils";
import {StatusContainer} from "components/StatusBox";

function ClusterBackupsPage() {
  const router = useRouter();
  const { clusterId } = router.query;

  const getBackupsUrl = (clusterId, taskId, runId) => `/cluster/${clusterId}/backup/${taskId}/${runId}`;

  const { data, error } = useBackups(clusterId);
  console.log(data);
  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  return (
    <Layout>
      <h1 className="text-6xl font-normal leading-normal mt-0 mb-2 text-blue-400">
        <Image
          className="mt-2 pr-2"
          src="/scylla-manager.svg"
          alt="manager"
          width={120}
          height={100}
        />

        <span className="relative -top-3 font-bold">Backups</span>
      </h1>
      <StatusContainer>
        {data?.map(
          ({
             cluster_id,
             task_id,
             units,
             snapshot_info
           }) => (
            <div
              key={cluster_id}
              className="bg-gray-400 bg-opacity-30 shadow-md rounded-xl p-2 m-2 w-min"
            >
              <div className="flex justify-between">
                <h2 className="text-base pr-4 font-normal leading-normal m-2 text-blue-400 whitespace-nowrap">
                  <span className="font-bold">Backup:</span>{" "}
                  <Link href={getBackupsUrl(clusterId, id, 0)}>
                    <a href="#">
                      <span>{task_id}</span>
                    </a>
                  </Link>
                </h2>
              </div>
              <div className="flex">
                <StatusBox
                  title="Snapshot"
                  icon={<MdRepeat />}
                  description={snapshot_info.snapshot_tag}
                  status={statusType.neutral}
                />
              </div>
              <div className="flex justify-between">
              </div>
            </div>
          )
        )}
      </StatusContainer>
    </Layout>
  );
}

export default ClusterBackupsPage;
