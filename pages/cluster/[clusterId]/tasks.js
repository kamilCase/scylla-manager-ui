import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "components/Layout";
import { useTasks } from "utils/hooks";
import { MdHttps, MdNoEncryption, MdMemory } from "react-icons/md";
import { AiFillDatabase, AiFillApi, AiOutlineFieldTime } from "react-icons/ai";
import { BsCpuFill } from "react-icons/bs";
import StatusBox from "components/StatusBox";
import { statusType } from "utils/utils";

function ClusterTasksPage() {
  const router = useRouter();
  const { clusterId } = router.query;

  const { data, error } = useTasks(clusterId);
  console.log(data);
  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  return (
    <Layout>
      <h1 className="text-6xl font-normal leading-normal mt-0 mb-2 text-blue-400">
        <span className="font-bold">Tasks</span>
      </h1>
      <div className="flex">
        {data?.nodes.map(
          ({
            id,
            type,
            name,
            enabled,
            schedule,
            status,
            start_time,
            end_time,
            next_activation,
          }) => (
            <div
              key="bla"
              className="bg-gray-400 bg-opacity-30 shadow-md rounded-xl p-2 m-2 w-min"
            >
              <div className="flex justify-between">
                <h2 className="text-base pr-4 font-normal leading-normal m-2 text-blue-400 whitespace-nowrap">
                  <span className="font-bold">Task Type:</span>{" "}
                  <Link href={`/cluster/${clusterId}/task/${type}/${id}`}>
                    <a href="#">
                      <span>{type}</span>
                    </a>
                  </Link>
                </h2>
              </div>
              <div className="flex">
                <StatusBox
                  title="Enabled"
                  description={enabled ? "Enabled" : "Disabled"}
                  status={enabled ? statusType.positive : statusType.negative}
                />

                <StatusBox
                  title="Schedule"
                  description={schedule.interval}
                  status={statusType.neutral}
                />

                <StatusBox
                  title="Status"
                  description={status}
                  status={
                    status === "DONE" ||
                    status === "RUNNING" ||
                    status === "NEW"
                      ? statusType.positive
                      : statusType.negative
                  }
                />
              </div>
              <div className="flex justify-between">
                <StatusBox
                  title="Start"
                  description={new Date(start_time)
                    .toISOString()
                    .replace(/T/, " ")
                    .replace(/\..+/, "")}
                  status={statusType.neutral}
                />

                <StatusBox
                  title="End"
                  description={new Date(end_time)
                    .toISOString()
                    .replace(/T/, " ")
                    .replace(/\..+/, "")}
                  status={statusType.neutral}
                />

                <StatusBox
                  title="Next Activation"
                  description={new Date(next_activation)
                    .toISOString()
                    .replace(/T/, " ")
                    .replace(/\..+/, "")}
                  status={statusType.neutral}
                />
              </div>
            </div>
          )
        )}
      </div>
    </Layout>
  );
}

export default ClusterTasksPage;
