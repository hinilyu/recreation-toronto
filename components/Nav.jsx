"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { signIn, signOut, useSession, getProviders } from "next-auth/react";

import GitHubIcon from "@mui/icons-material/GitHub";

const Nav = () => {
  const { data: session } = useSession();

  const [providers, setProviders] = useState(null);
  const [toggleDropdown, setToggleDropdown] = useState(false);

  useEffect(() => {
    const setUpProviders = async () => {
      const response = await getProviders();

      setProviders(response);
    };

    setUpProviders();
  }, []);

  return (
    <nav className="flex-between w-full mb-4 pt-3">
      <Link href="/" className="flex gap-2 flex-center">
        <Image src="/assets/images/logo.svg" alt="Recreation Toronto" width={100} height={50} className="object-contain" />
      </Link>

      {/* {Desktop Navigation} */}
      <div className="sm:flex hidden">
        <Link href={"https://github.com/hinilyu/recreation-toronto"} title="GitHub" target="_blank">
          <GitHubIcon className="w-[37px] h-[37px] mr-5" />
        </Link>
        {session?.user ? (
          <div className="flex gap-3 md:gap-5">
            <Link href="/wishlist" className="black_btn">
              My Wishlist
            </Link>
            <button type="button" onClick={signOut} className="outline_btn">
              Sign Out
            </button>
            <Image src={session?.user.image} width={37} height={37} className="rounded-full" alt="profile" />
          </div>
        ) : (
          <>
            {providers &&
              Object.values(providers).map((provider) => (
                <button className="black_btn" type="button" key={provider.name} onClick={() => signIn(provider.id)}>
                  Sign In
                </button>
              ))}
          </>
        )}
      </div>

      {/* Mobile Navigation */}
      <div className="sm:hidden flex relative">
        <Link href={"https://github.com/hinilyu/recreation-toronto"} title="GitHub" target="_blank">
          <GitHubIcon className="w-[37px] h-[37px] mr-2" />
        </Link>
        {session?.user ? (
          <div className="flex">
            <Image
              src={session?.user.image}
              width={37}
              height={37}
              className="rounded-full hover:cursor-pointer"
              alt="profile"
              title="profile"
              onClick={() => setToggleDropdown((prev) => !prev)}
            />
            {toggleDropdown && (
              <div className="dropdown z-20">
                <Link href="/wishlist" className="black_btn w-full" onClick={() => setToggleDropdown(false)}>
                  My Wishlist
                </Link>

                <button
                  type="button"
                  className="mt-5 w-full outline_btn"
                  onClick={() => {
                    setToggleDropdown(false);
                    signOut();
                  }}
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            {providers &&
              Object.values(providers).map((provider) => (
                <button className="black_btn" type="button" key={provider.name} onClick={() => signIn(provider.id)}>
                  Sign In
                </button>
              ))}
          </>
        )}
      </div>
    </nav>
  );
};

export default Nav;
