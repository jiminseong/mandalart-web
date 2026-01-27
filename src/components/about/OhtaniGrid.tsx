import React from "react";
import { cn } from "@/utils/cn";

const CELL_DATA = [
  // Row 1
  [
    // Block 0 (몸 만들기)
    [
      "몸관리",
      "영양제\n먹기",
      "FSQ\n90kg",
      "유연성",
      "몸 만들기",
      "RSQ\n130kg",
      "스테미너",
      "가동역",
      "식사\n저녁7숟갈\n아침3숟갈",
    ],
    // Block 1 (제구)
    [
      "인스텝\n개선",
      "몸통 강화",
      "축\n흔들리지\n않기",
      "릴리즈\n포인트\n안정",
      "제구",
      "불안정\n없애기",
      "하체\n강화",
      "몸을\n열지 않기",
      "멘탈을\n컨트롤",
    ],
    // Block 2 (구위)
    [
      "각도를\n만든다",
      "위에서부터\n공을\n던진다",
      "손목\n강화",
      "힘\n모으기",
      "구위",
      "하반신\n주도",
      "볼을\n앞에서\n릴리즈",
      "회전수\n증가",
      "가동력",
    ],
  ],
  // Row 2
  [
    // Block 3 (멘탈)
    [
      "뚜렷한\n목표·목적",
      "일희일비\n하지 않기",
      "머리는\n차갑게\n심장은\n뜨겁게",
      "핀치에\n강하게",
      "멘탈",
      "분위기에\n휩쓸리지\n않기",
      "마음의\n파도를\n안만들기",
      "승리에\n대한\n집념",
      "동료를\n배려하는\n마음",
    ],
    // Block 4 (Core - 8구단 드래프트 1순위)
    [
      "몸 만들기",
      "제구",
      "구위",
      "멘탈",
      "8구단\n드래프트\n1순위",
      "스피드\n160km/h",
      "인간성",
      "운",
      "변화구",
    ],
    // Block 5 (스피드 160km/h)
    [
      "축을\n돌리기",
      "하체\n강화",
      "체중\n증가",
      "몸통\n강화",
      "스피드\n160km/h",
      "어깨주변\n강화",
      "가동력",
      "라이너\n캐치볼",
      "피칭\n늘리기",
    ],
  ],
  // Row 3
  [
    // Block 6 (인간성)
    [
      "감성",
      "사랑받는\n사람",
      "계획성",
      "배려",
      "인간성",
      "감사",
      "예의",
      "신뢰받는\n사람",
      "지속력",
    ],
    // Block 7 (운)
    [
      "인사하기",
      "쓰레기\n줍기",
      "부실 청소",
      "물건을\n소중히\n쓰자",
      "운",
      "심판을\n대하는\n태도",
      "긍정적\n사고",
      "응원받는\n사람",
      "책읽기",
    ],
    // Block 8 (변화구)
    [
      "카운트볼\n늘리기",
      "포크볼\n완성",
      "슬라이더\n구위",
      "늦게\n낙차가 있는\n커브",
      "변화구",
      "좌타자\n결정구",
      "직구와\n같은 폼으로\n던지기",
      "스트라이크\n볼을\n던질 때\n제구",
      "거리를\n상상하기",
    ],
  ],
];

export const OhtaniGrid = () => {
  return (
    <div className="w-full max-w-[600px] mx-auto bg-white border-2 border-slate-300 p-1">
      <div className="grid grid-cols-3 gap-1">
        {CELL_DATA.map((row, rowIndex) => (
          <React.Fragment key={rowIndex}>
            {row.map((block, blockIndex) => {
              const actualBlockIndex = rowIndex * 3 + blockIndex;
              const isCoreBlock = actualBlockIndex === 4;

              return (
                <div
                  key={blockIndex}
                  className="grid grid-cols-3 gap-[1px] bg-slate-200 border border-slate-300"
                >
                  {block.map((text, cellIndex) => {
                    const isCenter = cellIndex === 4;
                    // Colors based on original Ohtani chart
                    let bgColor = "bg-white";

                    if (isCoreBlock) {
                      if (isCenter)
                        bgColor = "bg-[#fab005]"; // Main Core (Orange-ish)
                      else bgColor = "bg-[#fff9db]"; // Sub Goals (Yellow-ish)
                    } else {
                      if (isCenter)
                        bgColor = "bg-[#fff9db]"; // Sub Goals centers
                      else bgColor = "bg-white"; // Actions
                    }

                    // Apply bold to center items
                    const isBold = isCenter;

                    return (
                      <div
                        key={cellIndex}
                        className={cn(
                          "aspect-square flex items-center justify-center text-center p-[2px]",
                          bgColor,
                        )}
                      >
                        <span
                          className={cn(
                            "text-[8px] sm:text-[10px] leading-tight whitespace-pre-wrap break-keep text-slate-800",
                            isBold ? "font-black" : "font-medium",
                          )}
                        >
                          {text}
                        </span>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
