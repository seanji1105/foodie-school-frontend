import React from "react";

const Main = () => {
  return (
    <main>
      <section className="school-search">
        <h2>학교 찾기</h2>
        <input type="text" placeholder="학교 이름을 입력하세요" />
        <button>검색</button>
      </section>
      <section className="featured-reviews">
        <h2>추천 리뷰</h2>
        {/* Review items will go here */}
      </section>
    </main>
  );
};

export default Main;
