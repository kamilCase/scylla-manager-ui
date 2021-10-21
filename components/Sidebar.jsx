import Link from 'next/Link';

function Sidebar() {
  return (
    <div className="bg-gray-800 shadow-xl h-16 fixed bottom-0 mt-12 md:relative md:h-screen z-10 w-full md:w-48">
      <div
        className="md:mt-12 md:w-48 md:fixed md:left-0 md:top-0 content-center md:content-start text-left justify-between">
        <ul className="list-reset flex flex-row md:flex-col py-0 md:py-3 px-1 md:px-2 text-center md:text-left">
          <Link href="">
            <li className="mr-3 flex-1">
              <a href="#"
                 className="block py-1 md:py-3 pl-1 align-middle text-white no-underline hover:text-white border-b-2 border-gray-800 hover:border-pink-500">
              <span
                className="pb-1 md:pb-0 text-xs md:text-base text-gray-600 md:text-gray-400 block md:inline-block">PAGE 1</span>
              </a>
            </li>
          </Link>
          <Link href="">
            <li className="mr-3 flex-1">
              <a href="#"
                 className="block py-1 md:py-3 pl-1 align-middle text-white no-underline hover:text-white border-b-2 border-gray-800 hover:border-purple-500">
              <span
                className="pb-1 md:pb-0 text-xs md:text-base text-gray-600 md:text-gray-400 block md:inline-block">PAGE 2</span>
              </a>
            </li>
          </Link>
          <Link href="">
            <li className="mr-3 flex-1">
              <a href="#"
                 className="block py-1 md:py-3 pl-1 align-middle text-white no-underline hover:text-white border-b-2 border-blue-600">
              <span
                className="pb-1 md:pb-0 text-xs md:text-base text-white md:text-white block md:inline-block">PAGE 3</span>
              </a>
            </li>
          </Link>
        </ul>
      </div>
    </div>
  )
}

export default Sidebar;