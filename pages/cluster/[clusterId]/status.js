/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/router";
import Layout from "components/Layout";
import { useCluster } from "utils/hooks";
import { MdHttps, MdNoEncryption, MdMemory } from "react-icons/md";
import { AiFillDatabase, AiFillApi, AiOutlineFieldTime } from "react-icons/ai";
import { BsCpuFill } from "react-icons/bs";
import StatusBox from "components/StatusBox";
import { statusType } from "utils/utils";
import { StatusContainer } from "components/StatusBox";
import logo from "../../../icons/scylla-enterprise.svg";

function ClusterStatusPage() {
  const router = useRouter();
  const { clusterId } = router.query;

  const { data, error } = useCluster(clusterId);
  console.log(data);
  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  return (
    <Layout>
      <h1 className="text-6xl font-normal leading-normal mt-0 mb-2 text-blue-400">
        <img
          className="mt-2 pr-2 inline"
          src={logo}
          alt="enterprise"
          width={120}
          height={100}
        />
        <span className="relative top-3">
          <span className="font-bold">Cluster:</span> {data.name}
        </span>
      </h1>
      <StatusContainer>
        {data?.nodes.map(
          ({
            ssl,
            cql_status,
            cql_rtt_ms,
            rest_status,
            rest_rtt_ms,
            dc: name,
            status,
            host,
            total_ram,
            uptime,
            cpu_count,
            scylla_version,
            agent_version,
          }) => (
            <div
              key={host}
              className="bg-gray-400 bg-opacity-30 shadow-md rounded-xl p-2 m-2 w-min"
            >
              <div className="flex justify-between">
                <h2 className="text-base pr-4 font-normal leading-normal m-2 text-blue-400 whitespace-nowrap">
                  <span className="font-bold">Host:</span> {host}
                </h2>
                <h2 className="text-base pr-4 font-normal leading-normal m-2 text-blue-400 whitespace-nowrap">
                  <span className="font-bold">Agent Version:</span>{" "}
                  {agent_version}
                </h2>
              </div>
              <div className="flex justify-between">
                <h2 className="text-base font-normal leading-normal m-2 text-blue-400 whitespace-nowrap">
                  <span className="font-bold">Data Center:</span> {name}
                </h2>
                <h2 className="text-base font-normal leading-normal m-2 text-blue-400 whitespace-nowrap">
                  <span className="font-bold">Scylla Version:</span>{" "}
                  {scylla_version}
                </h2>
              </div>
              <div className="flex">
                <StatusBox
                  title="Status"
                  description={status}
                  status={
                    status === "UN" ? statusType.positive : statusType.negative
                  }
                />
                <StatusBox
                  icon={
                    ssl ? (
                      <MdHttps className="text-green-500" />
                    ) : (
                      <MdNoEncryption className="text-red-500" />
                    )
                  }
                  title="SSL"
                  description={ssl ? "ON" : "OFF"}
                  status={ssl ? statusType.positive : statusType.negative}
                />
                <StatusBox
                  icon={
                    cql_status ? (
                      <AiFillDatabase className="text-green-500" />
                    ) : (
                      <AiFillDatabase className="text-red-500" />
                    )
                  }
                  title="CQL"
                  description={cql_status ? "UP" : "DOWN"}
                  status={
                    cql_status ? statusType.positive : statusType.negative
                  }
                  value={cql_rtt_ms}
                  unit="ms"
                />
                <StatusBox
                  icon={
                    rest_status ? (
                      <AiFillApi className="text-green-500" />
                    ) : (
                      <AiFillApi className="text-red-500" />
                    )
                  }
                  title="REST"
                  description={rest_status ? "UP" : "DOWN"}
                  status={
                    rest_status ? statusType.positive : statusType.negative
                  }
                  value={rest_rtt_ms}
                  unit="ms"
                />
              </div>
              <div className="flex ">
                <StatusBox
                  title="ram"
                  description={`${(total_ram / (1000 * 1000 * 1000)).toFixed(
                    2
                  )} GB`}
                  icon={<MdMemory />}
                  status={statusType.neutral}
                />
                <StatusBox
                  title="Uptime"
                  description={uptime.toString()}
                  icon={<AiOutlineFieldTime />}
                  status={statusType.neutral}
                />
                <StatusBox
                  title="CPU #"
                  description={cpu_count.toString()}
                  icon={<BsCpuFill />}
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

export default ClusterStatusPage;
// [
//   {
//       "dc": "datacenter1",
//       "host_id": "fa067623-a1d5-4940-9eac-1303d9e594bb",
//       "host": "192.168.100.100",
//       "status": "UN",
//       "ssl": false,
//       "alternator_status": "",
//       "alternator_rtt_ms": 0,
//       "alternator_cause": "",
//       "cql_status": "UP",
//       "cql_rtt_ms": 2,
//       "cql_cause": "",
//       "rest_status": "UP",
//       "rest_rtt_ms": 2,
//       "rest_cause": "",
//       "total_ram": 5176152064,
//       "uptime": 303158,
//       "cpu_count": 4,
//       "scylla_version": "4.3.0-0.20210110.000585522",
//       "agent_version": "2.5.1-0.20210824.a3da2707"
//   }
// ]
