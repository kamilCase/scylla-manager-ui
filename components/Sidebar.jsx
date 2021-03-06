/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import {useRouter} from "next/router";
import {BsInfoSquareFill, BsTerminalFill, BsListTask, BsAlarm} from "react-icons/bs";
import styled from "@emotion/styled";
import logo from "../icons/logo-scylla.svg";

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

  const Container = styled.div`
    height: 96vh;
  `;
  return (
    <Container className=" hidden lg:block my-4 ml-4 shadow-lg relative w-62">
      <div className="bg-white h-full rounded-2xl dark:bg-gray-700">
        <div className="flex items-center justify-center pt-6">
          <img src={logo} alt="scylla" height={40} width={200} />
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
            { /* WIP */}
            {/*<Link href={`/cluster/${clusterId}/backups`}>*/}
            {/*  <a*/}
            {/*    className={`w-full font-thin uppercase flex items-center p-4 my-2 transition-colors duration-200 justify-start ${getClassesForRouteLink(*/}
            {/*      "backups"*/}
            {/*    )}`}*/}
            {/*    href="#"*/}
            {/*  >*/}
            {/*    <span className="text-left">*/}
            {/*      <BsAlarm />*/}
            {/*    </span>*/}
            {/*    <span className="mx-4 text-sm font-normal">Backups</span>*/}
            {/*  </a>*/}
            {/*</Link>*/}
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
    </Container>
  );
}

export default Sidebar;
