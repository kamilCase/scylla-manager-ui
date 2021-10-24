import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "components/Layout";
import { useTasks } from "utils/hooks";
import {
  MdStop,
  MdPlayArrow,
  MdSchedule,
  MdRepeat,
  MdHomeRepairService,
  MdBackup,
} from "react-icons/md";
import { FaHeartbeat } from "react-icons/fa";
import { AiFillApi } from "react-icons/ai";

import StatusBox from "components/StatusBox";
import { statusType } from "utils/utils";
import { StatusContainer } from "components/StatusBox";
import { IconContainer } from "components/StatusBox";

const DateDescription = ({ date }) => (
  <div className="text-sm">
    <span>{new Date(date).toLocaleDateString()}</span>{" "}
    <span>{new Date(date).toLocaleTimeString()}</span>
  </div>
);

export const taskTypeToIcon = {
  healthcheck: (
    <IconContainer>
      <FaHeartbeat className="w-8 mr-2" />
    </IconContainer>
  ),
  healthcheck_alternator: (
    <IconContainer>
      <AiFillApi className="w-8 mr-2" />
    </IconContainer>
  ),
  healthcheck_rest: (
    <IconContainer>
      <AiFillApi className="w-8 mr-2" />
    </IconContainer>
  ),
  repair: (
    <IconContainer>
      <MdHomeRepairService className="w-8 mr-2" />
    </IconContainer>
  ),
  backup: (
    <IconContainer>
      <MdBackup className="w-8 mr-2" />
    </IconContainer>
  ),
};

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
      <StatusContainer>
        {data?.map(
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
              key={id}
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
                {taskTypeToIcon[type]}
              </div>
              <div className="flex">
                <StatusBox
                  title="Enabled"
                  description={enabled ? "Enabled" : "Disabled"}
                  status={enabled ? statusType.positive : statusType.negative}
                />

                <StatusBox
                  title="Schedule"
                  icon={<MdRepeat />}
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
                  icon={<MdPlayArrow />}
                  description={<DateDescription date={start_time} />}
                  status={statusType.neutral}
                />

                <StatusBox
                  title="End"
                  icon={<MdStop />}
                  description={<DateDescription date={end_time} />}
                  status={statusType.neutral}
                />

                <StatusBox
                  title="Next"
                  icon={<MdSchedule />}
                  description={<DateDescription date={next_activation} />}
                  status={statusType.neutral}
                />
              </div>
            </div>
          )
        )}
      </StatusContainer>
    </Layout>
  );
}

export default ClusterTasksPage;
