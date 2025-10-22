'use client';
import { useSidebar } from '@/context/SidebarContext';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { FaBars, FaTimes } from 'react-icons/fa'; // toggle button icon

function Sidebar() {
  const { items, dynamicTheme, logout } = useSidebar();
  const [toggle, settoggle] = React.useState(false);
  const [checkActive, setActive] = React.useState(false);
  const [openSidebar, setOpenSidebar] = React.useState(false);
  const pathName = usePathname();

  return (
    <>
      {/* 🔹 Mobile Toggle Button */}
      <button
        className="lg:hidden fixed top-20 left-4 z-[999] p-2 rounded-md bg-gray-200 text-red-500 shadow-md"
        onClick={() => setOpenSidebar(!openSidebar)}
      >
        {openSidebar ? <FaTimes /> : <FaBars />}
      </button>

      {/* 🔹 Sidebar */}
      <aside
        className={`${dynamicTheme.bgColor} ${dynamicTheme.textColor}
        lg:relative z-[995] text-base rounded-bl-md lg:h-screen w-full overflow-hidden py-4 bg-blue-500
        ${
          openSidebar
            ? 'translate-x-0 fixed top-16 bottom-0'
            : '-translate-x-full'
        }
        lg:translate-x-0 transition-transform duration-300 ease-in-out shadow-lg`}
      >
        {/* 🔹 Logo Section */}
        <div className="p-3 w-full flex flex-col items-center justify-center mb-6">
          <div className="flex items-center gap-3">
            <Image
              src="/favicon.png"
              alt="Logo"
              width={40}
              height={40}
              className="object-contain w-10 h-10 drop-shadow-md"
            />
            <h1 className="text-lg font-extrabold tracking-wide text-white drop-shadow-md uppercase">
              <span className="text-yellow-300">Sazin</span> Construction
              <span className="text-gray-200"> Ltd.</span>
            </h1>
          </div>
          <div className="h-[2px] w-4/5 bg-gradient-to-r from-yellow-400 via-white to-yellow-400 mt-2 rounded-full"></div>
        </div>

        {/* 🔹 Sidebar Menu */}
        <ul className="space-y-2 pl-4 h-full w-full overflow-auto pb-28">
          {items?.map((item) => (
            <li key={item.id}>
              {item?.categories?.length > 0 ? (
                <div
                  className={`w-full ${
                    toggle ? 'h-auto' : 'h-fit'
                  } transform transition-height duration-800 ease-in-out`}
                >
                  <button
                    onClick={() => {
                      settoggle((itemid) =>
                        item.id === itemid ? false : item.id
                      );
                    }}
                    className={`w-full flex items-center gap-2 p-2 ${
                      checkActive === item?.id
                        ? dynamicTheme?.sidebarActive
                        : 'hover:border border-gray-300'
                    } rounded-tl-md rounded-bl-md cursor-pointer transition-all`}
                  >
                    {item.icon}
                    {item.title}
                  </button>
                  {toggle === item.id && (
                    <ul className="ml-4 mt-2 bg-transparent text-sm space-y-2">
                      {item.categories.map((category) => (
                        <Link
                          href={`${category.path}`}
                          key={category.id}
                          onClick={() => setActive(item?.id)}
                          className={`flex items-center gap-2 p-2 ${
                            pathName === `${category.path}`
                              ? dynamicTheme?.sidebarActive
                              : 'hover:border border-gray-300'
                          } rounded-tl-md rounded-bl-md cursor-pointer transition-all`}
                        >
                          {category.icon}
                          <span>{category.title}</span>
                        </Link>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <Link
                  href={`${item.path}`}
                  className={`flex items-center gap-2 p-2 ${
                    pathName === `${item.path}`
                      ? dynamicTheme?.sidebarActive
                      : 'hover:border border-gray-300'
                  } rounded-tl-md rounded-bl-md cursor-pointer transition-all`}
                >
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>

        {/* 🔹 Logout Button */}
        <div className="absolute bottom-4 left-0 w-full px-4">
          <button
            onClick={() => logout()}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold py-2 rounded-md shadow-md hover:from-red-700 hover:to-red-800 transition-all duration-300"
          >
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
