import React, { useState } from "react";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!username || !name || !password || !passwordConfirm) {
      setErrorMsg("모든 필드를 입력하세요.");
      return;
    }
    if (password !== passwordConfirm) {
      setErrorMsg("비밀번호가 일치하지 않습니다.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("https://api.tnesports.kr/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, name, password }),
      });

      if (res.ok) {
        // 회원가입 성공 시 로그인 페이지로 이동
        window.location.href = "/login";
      } else {
        const data = await res.json();
        setErrorMsg(data.error || data.message || "회원가입 실패");
      }
    } catch (err) {
      console.error("회원가입 중 오류:", err);
      setErrorMsg("서버와 통신 중 오류가 발생했습니다.");
    }
    setLoading(false);
  };

  return (
    <main className="container mx-auto p-6 max-w-md">
      <section className="signup-form shadow-lg rounded-lg p-8 bg-white">
        <h2 className="text-4xl font-bold mb-6 text-center text-primary">
          회원가입
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
            type="text"
            placeholder="이름"
            className="px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
          />
          <input
            type="password"
            placeholder="비밀번호"
            className="px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
          <input
            type="password"
            placeholder="비밀번호 확인"
            className="px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            autoComplete="new-password"
          />

          {errorMsg && (
            <p className="text-red-500 text-sm text-center">{errorMsg}</p>
          )}

          <button
            type="submit"
            className="btn btn-primary py-3 rounded-lg font-semibold text-white hover:bg-primary-dark transition-colors"
            disabled={loading}
          >
            {loading ? "회원가입 중..." : "회원가입"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          이미 계정이 있으신가요?{" "}
          <a
            href="/login"
            className="text-primary font-semibold hover:underline"
          >
            로그인
          </a>
        </p>
      </section>
    </main>
  );
};

export default Signup;
