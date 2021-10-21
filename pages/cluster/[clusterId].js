import Layout from "components/Layout";
import {useRouter} from "next/router";

function ClusterDetailsPage({}) {
  const router = useRouter();
  const {clusterId} = router.query;

  return <Layout>
    <button>{clusterId}</button>
  </Layout>
}

export default ClusterDetailsPage;
