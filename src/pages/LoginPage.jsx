import React, { useState } from "react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    if (!username || !password) {
      setErrorMsg("아이디와 비밀번호를 모두 입력하세요.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // 쿠키 포함
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        // 로그인 성공
        // 예: 홈으로 리다이렉트 또는 상태 업데이트
        window.location.href = "/";
      } else {
        const data = await res.json();
        setErrorMsg(data.error || "로그인 실패");
      }
    } catch (err) {
      setErrorMsg("서버와 통신 중 오류가 발생했습니다.");
    }
    setLoading(false);
  };

  return (
    <main className="container mx-auto p-6 max-w-md">
      <section className="login-form shadow-lg rounded-lg p-8 bg-white">
        <h2 className="text-4xl font-bold mb-6 text-center text-primary">
          로그인
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input
            type="text"
            placeholder="아이디"
            className="px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
          <input
            type="password"
            placeholder="비밀번호"
            className="px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />

          {errorMsg && (
            <p className="text-red-500 text-sm text-center">{errorMsg}</p>
          )}

          <button
            type="submit"
            className="btn btn-primary py-3 rounded-lg font-semibold text-white hover:bg-primary-dark transition-colors"
            disabled={loading}
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          계정이 없으신가요?{" "}
          <a
            href="/signup"
            className="text-primary font-semibold hover:underline"
          >
            회원가입
          </a>
        </p>
      </section>
    </main>
  );
};

export default Login;
