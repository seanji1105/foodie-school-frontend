import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [schoolName, setSchoolName] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (schoolName.trim()) {
      // Replace spaces with hyphens for a clean URL
      const urlFriendlyName = schoolName.trim().replace(/\s+/g, "-");
      navigate(`/school/${urlFriendlyName}`);
    }
  };

  return (
    <main className="container mx-auto p-6">
      <section className="school-search text-center my-16">
        <h2 className="text-5xl font-bold mb-4">오늘의 메뉴는?</h2>
        <p className="text-lg text-medium mb-8">
          학생들이 평가한 급식 정보를 제공합니다.
        </p>
        <div className="flex justify-center shadow-lg rounded-lg max-w-xl mx-auto">
          <input
            type="text"
            placeholder="학교 이름을 입력해주세요"
            className="w-full px-5 py-3 border-r-0 border-gray-200 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary"
            value={schoolName}
            onChange={(e) => setSchoolName(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          />
          <button
            className="btn btn-primary rounded-l-none"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
