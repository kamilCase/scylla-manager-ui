/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/router";
import Layout from "components/Layout";
import logo from "../../../../icons/scylla-monitor.svg";
import Terminal from "components/Terminal";

function ClusterTerminalPage() {
  const router = useRouter();
  const { clusterId } = router.query;

  if (!clusterId) return <div>loading...</div>;

  return (
    <Layout>
      <h1 className="text-6xl font-normal leading-normal mt-0 mb-2 text-blue-400">
        <img
          className="mt-2 pr-2 inline"
          src={logo}
          alt="monitor"
          width={120}
          height={100}
        />
        <span className="relative top-3 font-bold">Terminal</span>
      </h1>

      <Terminal clusterId={clusterId} />
    </Layout>
  );
}

export default ClusterTerminalPage;
