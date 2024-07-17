"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import xml2js from "xml2js"; // xml2js 라이브러리 임포트

interface Tour {
  contentid: string;
  title: string;
  addr1: string;
  firstimage?: string;
}
//apis.data.go.kr/B551011/KorService1/searchStay1?areaCode=&sigunguCode=&ServiceKey=인증키&listYN=Y&MobileOS=ETC&MobileApp=AppTest&arrange=A&numOfRows=12&pageNo=1
//apis.data.go.kr/B551011/KorService1/searchStay1?areaCode=1&sigunguCode=&ServiceKey=인증키&listYN=Y&MobileOS=ETC&MobileApp=AppTest&arrange=A&numOfRows=12&pageNo=1
//apis.data.go.kr/B551011/KorService1/searchStay1?areaCode=6&sigunguCode=&ServiceKey=인증키&listYN=Y&MobileOS=ETC&MobileApp=AppTest&arrange=A&numOfRows=12&pageNo=1
//apis.data.go.kr/B551011/KorService1/searchStay1?areaCode=6&sigunguCode=16&ServiceKey=인증키&listYN=Y&MobileOS=ETC&MobileApp=AppTest&arrange=A&numOfRows=12&pageNo=1

const HomePage: React.FC = () => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiKey =
          "WSCw0k0JOf7SYhiwyAZ1grsvn9QQB3nA%2FPD53LggeDN9G5%2BTQgf46EeKYp%2FLn7jhEsTlHQAht6ahaYGG%2FGwHfg%3D%3D";
        const apiUrl = `http://apis.data.go.kr/B551011/KorService1/areaBasedList1?numOfRows=12&pageNo=1&MobileOS=ETC&MobileApp=AppTest&ServiceKey=${apiKey}&listYN=Y&arrange=A&contentTypeId=15&areaCode=1&sigunguCode=&cat1=A02&cat2=A0207&cat3=`;

        const res = await fetch(apiUrl);

        const text = await res.text();
        console.log("응답 내용:", text); // 응답 내용을 출력하여 확인

        // XML 응답을 JSON으로 변환
        const parser = new xml2js.Parser();
        parser.parseString(text, (err, result) => {
          if (err) {
            throw new Error("Failed to parse XML");
          }

          const data = result.response.body[0].items[0].item.map(
            (item: any) => ({
              contentid: item.contentid[0],
              title: item.title[0],
              addr1: item.addr1[0],
              firstimage: item.firstimage
                ? item.firstimage[0].replace(/<\/?firstimage>/g, "")
                : null,
            })
          );

          setTours(data);
        });
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unknown error occurred");
        }
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Tour Information</h1>
      {error ? (
        <p>Error: {error}</p>
      ) : (
        <ul className="ml-4 grid grid-cols-4">
          {tours.map((tour) => (
            <li key={tour.contentid}>
              <h2 className="mt-4">{tour.title}</h2>
              <p>{tour.addr1}</p>
              {tour.firstimage && (
                <Image
                  src={tour.firstimage}
                  alt={tour.title}
                  width="200"
                  height="200"
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HomePage;
