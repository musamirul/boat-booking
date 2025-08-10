import { Fragment } from "react";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext";
import defaultAvatar from "../../assets/default-avatar.svg";

export default function UserHeader() {
  const { username, logout } = useAuth();
  const location = useLocation();

  // Generate breadcrumb segments from URL
  const segments = location.pathname
    .split("/")
    .filter(Boolean)
    .map((seg, index, arr) => {
      const path = "/" + arr.slice(0, index + 1).join("/");
      return { name: seg.charAt(0).toUpperCase() + seg.slice(1), path };
    });

  return (
    <header className="border-b bg-white shadow-sm">
      {/* Top bar: breadcrumbs + profile */}
      <div className="flex justify-between items-center px-6 py-3">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-gray-600">
          <Link to="/" className="hover:underline">
            Home
          </Link>
          {segments.map((seg, idx) => (
            <Fragment key={idx}>
              <span className="text-gray-400">/</span>
              {idx === segments.length - 1 ? (
                <span className="font-medium text-gray-800">{seg.name}</span>
              ) : (
                <Link to={seg.path} className="hover:underline">
                  {seg.name}
                </Link>
              )}
            </Fragment>
          ))}
        </nav>

        {/* Right side: login or user menu */}
        {!username ? (
          <Link
            to="/login"
            className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            Login
          </Link>
        ) : (
          <Menu as="div" className="relative inline-block text-left">
            <div>
              <MenuButton className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                <img
                  src={defaultAvatar}
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full"
                />
                <span>{username}</span>
              </MenuButton>
            </div>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <MenuItems
                anchor="bottom end"
                className="absolute right-0 mt-2 w-40 origin-top-right bg-white border border-gray-200 rounded-md shadow-lg focus:outline-none"
              >
                <div className="py-1">
                  <MenuItem as={Fragment}>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm data-[focus]:bg-gray-100"
                    >
                      Profile
                    </Link>
                  </MenuItem>
                  <MenuItem as={Fragment}>
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm data-[focus]:bg-gray-100"
                    >
                      Logout
                    </button>
                  </MenuItem>
                </div>
              </MenuItems>
            </Transition>
          </Menu>
        )}
      </div>

      {/* Navigation bar */}
      <nav className="flex gap-6 px-6 py-2 bg-gray-50 border-t text-sm font-medium text-gray-700">
        <Link to="/" className="hover:text-gray-900">
          Dashboard
        </Link>
        <Link to="/" className="hover:text-gray-900">
          My Bookings
        </Link>
        <Link to="/book" className="hover:text-gray-900">
          Booking Schedule
        </Link>
        <Link to="/profile" className="hover:text-gray-900">
          Profile
        </Link>
      </nav>
    </header>
  );
}