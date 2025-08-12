import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // 로그인 상태 확인
  useEffect(() => {
    fetch("http://localhost:3000/me", {
      credentials: "include",
    })
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null));
  }, []);

  const handleLogout = async () => {
    await fetch("http://localhost:3000/logout", {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
    navigate("/");
  };

  return (
    <header className="bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* 로고 */}
        <div className="text-2xl font-bold text-primary flex">
          <Link to="/">급식평가</Link>
          <p className="text-sm ml-2 mt-3">beta</p>
        </div>

        {/* 데스크탑 메뉴 */}
        <nav className="hidden md:flex space-x-8">
          <Link
            to="/"
            className="text-medium hover:text-primary font-medium transition-colors"
          >
            Home
          </Link>
        </nav>

        {/* 인증 및 햄버거 아이콘 */}
        <div className="flex items-center space-x-3">
          {/* 데스크탑 로그인 상태 */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <span className="font-semibold text-primary">
                  {user.username}님 안녕하세요!
                </span>
                <button
                  className="btn btn-secondary"
                  onClick={handleLogout}
                  type="button"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <button
                  className="btn btn-secondary"
                  onClick={() => navigate("/login")}
                  type="button"
                >
                  로그인
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate("/signup")}
                  type="button"
                >
                  회원가입
                </button>
              </>
            )}
          </div>

          {/* 모바일 햄버거 메뉴 버튼 */}
          <button
            className="md:hidden focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="메뉴 토글"
            type="button"
          >
            {/* 햄버거 아이콘 */}
            <svg
              className="w-8 h-8 text-primary"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* 모바일 메뉴 드롭다운 */}
      {menuOpen && (
        <nav className="md:hidden bg-white shadow-md border-t border-gray-200">
          <ul className="flex flex-col space-y-4 p-4">
            <li>
              <Link
                to="/"
                onClick={() => setMenuOpen(false)}
                className="block text-lg font-medium text-primary hover:text-primary-dark"
              >
                Home
              </Link>
            </li>

            {user ? (
              <>
                <li className="text-primary font-semibold">
                  {user.username}님 안녕하세요!
                </li>
                <li>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                    className="w-full btn btn-secondary"
                    type="button"
                  >
                    로그아웃
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <button
                    onClick={() => {
                      navigate("/login");
                      setMenuOpen(false);
                    }}
                    className="w-full btn btn-secondary"
                    type="button"
                  >
                    로그인
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      navigate("/signup");
                      setMenuOpen(false);
                    }}
                    className="w-full btn btn-primary"
                    type="button"
                  >
                    회원가입
                  </button>
                </li>
              </>
            )}
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;
