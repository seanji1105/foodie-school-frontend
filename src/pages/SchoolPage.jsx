import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const SchoolPage = () => {
  const { schoolName } = useParams();
  const navigate = useNavigate();
  const school = schoolName ? schoolName.replace(/-/g, " ") : "My School";

  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();
  const monthName = date.toLocaleString("default", { month: "long" });

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const [meals, setMeals] = useState({}); // { 'YYYYMMDD': '급식 내용' }

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const res = await fetch(
          `https://foodie-school-backend-production.up.railway.app/meals?schoolName=${encodeURIComponent(
            school
          )}`
        );
        const data = await res.json();

        if (Array.isArray(data)) {
          const mapped = {};
          data.forEach((item) => {
            mapped[item.MLSV_YMD] = item.DDISH_NM.replace(/<br\/>/g, "\n");
          });
          setMeals(mapped);
        }
      } catch (err) {
        console.error("급식 데이터 불러오기 실패:", err);
      }
    };

    fetchMeals();
  }, [school]);

  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(
      <div key={`empty-${i}`} className="bg-gray-50 border-r border-b"></div>
    );
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const currentDate = new Date(year, month, day);
    const isToday =
      day === new Date().getDate() && month === new Date().getMonth();
    const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;

    const ymd = `${year}${String(month + 1).padStart(2, "0")}${String(
      day
    ).padStart(2, "0")}`;
    const mealText = meals[ymd] || "";
    const cleanMealText = mealText
      .replace(/\([^)]*\)/g, "") // 괄호 및 내용 제거
      .replace(/\*/g, "") // * 제거
      .trim();

    calendarDays.push(
      <div
        key={day}
        className={`relative p-2 h-36 border-r border-b flex flex-col cursor-pointer transition-all duration-200 hover:bg-blue-50 hover:shadow-inner ${
          isToday ? "bg-blue-100 font-bold" : "bg-white"
        } ${isWeekend ? "bg-gray-50" : ""}`}
        onClick={() => navigate(`/school/${schoolName}/${ymd}`)}
      >
        <div
          className={`text-sm ${isToday ? "text-primary" : "text-gray-700"}`}
        >
          {day}
        </div>
        <div className="text-xs mt-1 text-left flex-grow whitespace-pre-line">
          {cleanMealText ? (
            <p className="text-gray-800">{cleanMealText}</p>
          ) : (
            <p className="text-gray-400 italic">No Data</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="text-center my-8">
        <h2 className="text-4xl font-bold capitalize text-primary">{school}</h2>
        <p className="text-xl text-medium">
          {monthName} {year}
        </p>
      </div>

      <div className="overflow-x-auto -mx-6 px-6">
        {" "}
        {/* 스크롤 가능한 wrapper */}
        <div
          className="min-w-[800px] grid grid-cols-7 text-center font-semibold text-medium border-t border-x"
          style={{ minWidth: "800px" }} // 최소 너비 지정
        >
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, i) => (
            <div
              key={day}
              className={`p-3 bg-gray-100 ${
                i === 0 || i === 6 ? "text-red-500" : ""
              } border-r`}
            >
              {day}
            </div>
          ))}
        </div>
        <div
          className="min-w-[800px] grid grid-cols-7 border-l"
          style={{ minWidth: "800px" }} // 최소 너비 지정
        >
          {calendarDays}
        </div>
      </div>
    </div>
  );
};

export default SchoolPage;
