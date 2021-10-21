import { useRouter } from "next/router";
import Layout from "components/Layout";
import { useCluster } from "utils/hooks";
import { MdHttp, MdNoEncryption } from "react-icons/md";

function ClusterDetailsPage() {
  const router = useRouter();
  const { clusterId } = router.query;

  const { data, error } = useCluster(clusterId);
  console.log(data);
  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  const dc = data?.dataCenters?.[0];
  // const scyllaVersion = scylla_version;
  return (
    <Layout>
      <h1 className="text-6xl font-normal leading-normal mt-0 mb-2 text-blue-400">
        {data.name}
      </h1>

      <div className="flex items-center my-4 text-blue-500 rounded justify-between">
        <span className="rounded-lg p-2 bg-white">
          {dc?.ssl ? <MdHttp /> : <MdNoEncryption />}
        </span>
        <div className="flex flex-col w-full ml-2 items-start justify-evenly">
          <p className="text-red-600 text-lg">SSL</p>
          <p className="text-red-400 text-sm">{dc?.ssl ? "ON" : "OFF"}</p>
        </div>
      </div>

      <div className="bg-white  overflow-hidden shadow rounded-lg w-60 md:w-72 relative">
        {dc?.ssl ? (
          <MdHttp />
        ) : (
          <MdNoEncryption className="h-24 w-24 rounded-full absolute opacity-50 -right-2" />
        )}

        <div className="px-4 py-5 sm:p-6">
          <p className="text-sm leading-5 font-medium text-gray-500 truncate">
            SSL
          </p>
          <p className="mt-1 text-3xl leading-9 font-semibold text-gray-900">
            OFF
          </p>
        </div>
      </div>
    </Layout>
  );
}

export default ClusterDetailsPage;
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
