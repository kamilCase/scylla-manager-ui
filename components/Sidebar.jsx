import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { BsInfoSquareFill, BsTerminalFill, BsListTask } from "react-icons/bs";

function Sidebar() {
  const router = useRouter();
  const { clusterId } = router.query;

  function getClassesForRouteLink(subroute) {
    const activeLinkClasses =
      "text-blue-500 bg-gradient-to-r from-white to-blue-100 border-r-4 border-blue-500 dark:from-gray-700 dark:to-gray-800 border-r-4 border-blue-500";
    const inactiveLinkClasses =
      "text-gray-500 dark:text-gray-200 hover:text-blue-500";

    return router.asPath.includes(subroute)
      ? activeLinkClasses
      : inactiveLinkClasses;
  }

  return (
    <div className="h-screen hidden lg:block my-4 ml-4 shadow-lg relative w-80">
      <div className="bg-white h-full rounded-2xl dark:bg-gray-700">
        <div className="flex items-center justify-center pt-6">
          <Image src="/logo-scylla.svg" height={40} width={200} />
        </div>
        <nav className="mt-6">
          <div>
            <Link href={`/cluster/${clusterId}/status`}>
              <a
                className={`w-full font-thin uppercase flex items-center p-4 my-2 transition-colors duration-200 justify-start ${getClassesForRouteLink(
                  "status"
                )}`}
                href="#"
              >
                <BsInfoSquareFill />
                <span className="mx-4 text-sm font-normal">Status</span>
              </a>
            </Link>
            <Link href={`/cluster/${clusterId}/tasks`}>
              <a
                className={`w-full font-thin uppercase flex items-center p-4 my-2 transition-colors duration-200 justify-start ${getClassesForRouteLink(
                  "tasks"
                )}`}
                href="#"
              >
                <span className="text-left">
                  <BsListTask />
                </span>
                <span className="mx-4 text-sm font-normal">Tasks</span>
              </a>
            </Link>
            <Link href={`/cluster/${clusterId}/terminal`}>
              <a
                className={`w-full font-thin uppercase flex items-center p-4 my-2 transition-colors duration-200 justify-start ${getClassesForRouteLink(
                  "terminal"
                )}`}
                href="#"
              >
                <BsTerminalFill />
                <span className="mx-4 text-sm font-normal">Terminal</span>
              </a>
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
}

export default Sidebar;
