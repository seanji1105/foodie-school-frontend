import React, { useEffect, useState } from "react";

const DateDetailPage = () => {
  // 현재 경로에서 직접 파싱
  const pathname = window.location.pathname; // 예: /school/매탄고/20250821
  const pathParts = pathname.split("/").filter(Boolean); // ["school", "매탄고", "20250821"]

  const schoolNameRaw = pathParts[1] || "";
  const dateRaw = pathParts[2] || "";

  // 학교명은 URL 인코딩 된 상태일 수도 있으니 디코딩
  const school = decodeURIComponent(schoolNameRaw).replace(/-/g, " ");

  // 날짜 포맷팅 함수
  const formattedDate = (() => {
    if (dateRaw && dateRaw.length === 8) {
      const isoString = `${dateRaw.slice(0, 4)}-${dateRaw.slice(
        4,
        6
      )}-${dateRaw.slice(6, 8)}`;
      const d = new Date(isoString);
      if (!isNaN(d)) {
        return d.toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "long",
          day: "numeric",
          weekday: "long",
        });
      }
    }
    return "날짜 정보 없음";
  })();

  const [mealInfo, setMealInfo] = useState("");
  const [originInfo, setOriginInfo] = useState("");
  const [originOpen, setOriginOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [submitMsg, setSubmitMsg] = useState("");
  const [reviews, setReviews] = useState([]);

  // 급식 상세 정보 가져오기
  useEffect(() => {
    if (!school || !dateRaw) {
      setMealInfo("학교명 또는 날짜 정보가 없습니다.");
      setOriginInfo("정보 없음");
      return;
    }

    async function fetchMealDetail() {
      try {
        const res = await fetch(
          `http://localhost:3000/meals/detail?schoolName=${encodeURIComponent(
            school
          )}&date=${dateRaw}`
        );
        if (!res.ok) throw new Error("급식 상세 정보 불러오기 실패");
        const data = await res.json();

        if (!data || !data.meal) {
          setMealInfo("정보 없음");
          setOriginInfo("정보 없음");
          return;
        }

        setMealInfo((data.meal || "정보 없음").replace(/\n/g, "<br/>"));
        setOriginInfo((data.origin || "정보 없음").replace(/\n/g, "<br/>"));
      } catch (error) {
        console.error(error);
        setMealInfo("정보를 불러올 수 없습니다.");
        setOriginInfo("정보를 불러올 수 없습니다.");
      }
    }
    fetchMealDetail();
  }, [school, dateRaw]);

  // 리뷰 목록 가져오기
  useEffect(() => {
    if (!school || !dateRaw) {
      setReviews([]);
      return;
    }

    async function fetchReviews() {
      try {
        const res = await fetch(
          `http://localhost:3000/reviews?schoolName=${encodeURIComponent(
            school
          )}&date=${dateRaw}`
        );
        if (!res.ok) throw new Error("리뷰 불러오기 실패");
        const data = await res.json();
        setReviews(data.reviews || []);
      } catch (error) {
        console.error(error);
        setReviews([]);
      }
    }
    fetchReviews();
  }, [school, dateRaw]);

  // 리뷰 다시 불러오기 (제출 후)
  const fetchReviews = async () => {
    if (!school || !dateRaw) return;

    try {
      const res = await fetch(
        `http://localhost:3000/reviews?schoolName=${encodeURIComponent(
          school
        )}&date=${dateRaw}`
      );
      if (!res.ok) throw new Error("리뷰 불러오기 실패");
      const data = await res.json();
      setReviews(data.reviews || []);
    } catch (error) {
      console.error(error);
      setReviews([]);
    }
  };

  // 제출 함수
  const handleSubmitReview = async () => {
    if (rating === 0) {
      setSubmitMsg("별점을 선택해주세요.");
      return;
    }
    try {
      const res = await fetch("http://localhost:3000/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // 로그인 세션 쿠키 전송
        body: JSON.stringify({
          schoolName: school,
          date: dateRaw,
          rating,
          review,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // 서버에서 에러 메시지 받아서 보여주기
        const errorMsg = data.error || "리뷰 제출 실패";
        throw new Error(errorMsg);
      }

      setSubmitMsg("리뷰가 성공적으로 제출되었습니다.");
      setReview("");
      setRating(0);
      fetchReviews();
    } catch (error) {
      console.error(error);
      setSubmitMsg(error.message || "리뷰 제출 중 오류가 발생했습니다.");
    }
  };

  // 평균 별점 계산
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  // 평균 별점 표시용 별 컴포넌트 (filled는 소수점 반올림)
  const AverageStars = ({ rating }) => {
    const rounded = Math.round(rating);
    return (
      <div className="flex space-x-1 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star key={star} filled={star <= rounded} onClick={() => {}} />
        ))}
        <span className="ml-2 text-gray-700 font-semibold">
          {rating.toFixed(1)} / 5
        </span>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6">
      <div className="text-center my-8">
        <h2 className="text-4xl font-bold capitalize text-primary">{school}</h2>
        <p className="text-2xl text-medium mt-2">{formattedDate}</p>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-lg max-w-xl mx-auto mb-8">
        <h3 className="text-2xl font-semibold mb-4">급식 정보</h3>
        <p className="mb-4" dangerouslySetInnerHTML={{ __html: mealInfo }}></p>

        <h3 className="text-xl font-semibold mb-2 flex items-center">
          원산지 정보
          <button
            className="ml-2 text-sm text-blue-500 focus:outline-none"
            onClick={() => setOriginOpen((prev) => !prev)}
          >
            {originOpen ? "접기 ▲" : "펼치기 ▼"}
          </button>
        </h3>
        {originOpen && (
          <p
            className="mb-6"
            dangerouslySetInnerHTML={{ __html: originInfo }}
          ></p>
        )}

        <h3 className="text-xl font-semibold mb-2">평가 남기기</h3>

        <div className="flex space-x-2 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              filled={star <= rating}
              onClick={() => setRating(star)}
            />
          ))}
        </div>

        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="이 급식에 대한 평가를 작성해 주세요."
          rows={4}
          className="w-full border border-gray-300 rounded p-2 mb-4 resize-none"
        />

        <button
          onClick={handleSubmitReview}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition"
        >
          제출하기
        </button>

        {submitMsg && (
          <p className="mt-4 text-center text-sm text-gray-700">{submitMsg}</p>
        )}
      </div>
      <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-2xl font-semibold mb-4">다른 사람의 리뷰</h3>

        {/* 평균 별점 */}
        <AverageStars rating={averageRating} />

        {reviews.length === 0 ? (
          <p className="text-gray-500 italic">아직 리뷰가 없습니다.</p>
        ) : (
          reviews.map(({ _id, username, rating, review }) => (
            <div
              key={_id}
              className="border-b border-gray-200 py-4 last:border-none"
            >
              <div className="flex items-center mb-1 space-x-2">
                <span className="font-semibold">{username || "익명"}</span>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      filled={star <= rating}
                      onClick={() => {}}
                    />
                  ))}
                </div>
              </div>
              <p className="whitespace-pre-wrap">{review}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const Star = ({ filled, onClick }) => (
  <svg
    onClick={onClick}
    xmlns="http://www.w3.org/2000/svg"
    className={`h-5 w-5 cursor-pointer ${
      filled ? "text-yellow-400" : "text-gray-300"
    }`}
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.945a1 1 0 00.95.69h4.148c.969 0 1.371 1.24.588 1.81l-3.36 2.44a1 1 0 00-.364 1.118l1.286 3.945c.3.92-.755 1.688-1.54 1.118l-3.36-2.44a1 1 0 00-1.175 0l-3.36 2.44c-.784.57-1.838-.197-1.54-1.118l1.286-3.945a1 1 0 00-.364-1.118L2.025 9.372c-.783-.57-.38-1.81.588-1.81h4.148a1 1 0 00.95-.69l1.286-3.945z" />
  </svg>
);

export default DateDetailPage;
