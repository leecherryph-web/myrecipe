import { PresetTimer, Recipe } from '../types';

export const PRESET_CATEGORIES = [
  "全部",
  "蛋糕",
  "甜品",
  "中式食物",
  "麵包",
  "西式小食",
  "家常料理"
];

export const PRESET_TIMERS: PresetTimer[] = [
  {
    "name": "溏心蛋 / 水煮蛋",
    "minutes": 6,
    "seconds": 30,
    "description": "滾水下蛋計時 6.5 分鐘，蛋白熟蛋黃流心",
    "category": "蛋料理"
  },
  {
    "name": "義大利麵 (Al Dente)",
    "minutes": 8,
    "seconds": 0,
    "description": "標準直麵彈牙口感計時",
    "category": "主食"
  },
  {
    "name": "煎牛排 (靜置醒肉)",
    "minutes": 5,
    "seconds": 0,
    "description": "起鍋後保溫靜置，鎖住鮮甜肉汁",
    "category": "肉類"
  },
  {
    "name": "手沖咖啡 (悶蒸)",
    "minutes": 0,
    "seconds": 30,
    "description": "注入熱水後均勻悶蒸排氣",
    "category": "飲品"
  },
  {
    "name": "烤箱預熱",
    "minutes": 10,
    "seconds": 0,
    "description": "烘焙預熱標準時間",
    "category": "烘焙"
  },
  {
    "name": "綠茶 / 烏龍沖泡",
    "minutes": 2,
    "seconds": 0,
    "description": "85°C 水溫浸泡 2 分鐘萃取最佳香氣",
    "category": "飲品"
  }
];

export const PRESET_IMAGES = [
  {
    "label": "精緻蛋糕",
    "url": "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&q=80&w=800"
  },
  {
    "label": "巧克力甜點",
    "url": "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=800"
  },
  {
    "label": "法式甜點",
    "url": "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&q=80&w=800"
  },
  {
    "label": "烘焙麵包",
    "url": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800"
  },
  {
    "label": "中式糕餅",
    "url": "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&q=80&w=800"
  },
  {
    "label": "家常美食",
    "url": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800"
  },
  {
    "label": "美味料理",
    "url": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800"
  },
  {
    "label": "飲品甜湯",
    "url": "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=80&w=800"
  }
];

export const INITIAL_RECIPES: Recipe[] = [
  {
    "id": "recipe-notes-mango-cheesecake",
    "title": "芒果芝士蛋糕",
    "description": "7 吋模具，濃郁滑順的芒果重乳酪蛋糕，搭配清爽酸甜芒果淋面鏡面層，口感層次極其豐富。",
    "category": "蛋糕",
    "tags": [
      "芒果",
      "芝士蛋糕",
      "7吋",
      "水浴法",
      "烘焙甜點"
    ],
    "servings": 1,
    "prepTime": 30,
    "cookTime": 60,
    "difficulty": "中等",
    "coverImage": "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&q=80&w=800",
    "ingredients": [
      {
        "id": "ing-mg-1",
        "name": "忌廉芝士（室溫軟化）",
        "amount": "280",
        "unit": "g"
      },
      {
        "id": "ing-mg-2",
        "name": "細砂糖",
        "amount": "60",
        "unit": "g"
      },
      {
        "id": "ing-mg-3",
        "name": "全蛋",
        "amount": "2",
        "unit": "隻"
      },
      {
        "id": "ing-mg-4",
        "name": "蛋黃",
        "amount": "1",
        "unit": "隻"
      },
      {
        "id": "ing-mg-5",
        "name": "淡忌廉",
        "amount": "140",
        "unit": "g"
      },
      {
        "id": "ing-mg-6",
        "name": "粟粉（過篩）",
        "amount": "18",
        "unit": "g"
      },
      {
        "id": "ing-mg-7",
        "name": "檸檬汁",
        "amount": "1.5",
        "unit": "茶匙"
      },
      {
        "id": "ing-mg-8",
        "name": "【芒果層】芒果蓉（Kesar）",
        "amount": "200",
        "unit": "g"
      },
      {
        "id": "ing-mg-9",
        "name": "【芒果層】魚膠粉",
        "amount": "3.5",
        "unit": "g"
      },
      {
        "id": "ing-mg-10",
        "name": "【芒果層】冷水",
        "amount": "20",
        "unit": "ml"
      },
      {
        "id": "ing-mg-11",
        "name": "【芒果層】檸檬汁",
        "amount": "1",
        "unit": "茶匙"
      }
    ],
    "steps": [
      {
        "id": "step-mg-1",
        "stepNumber": 1,
        "instruction": "焗爐 fan 預熱至 150°C。模具內部墊好焗爐紙。如果是活底模，外圍請用鋁箔紙（錫紙）嚴密包裹 3 層，防止水浴法時熱水滲入。"
      },
      {
        "id": "step-mg-2",
        "stepNumber": 2,
        "instruction": "烘烤芝士蛋糕主體 - 打發芝士：將軟化的 280g 忌廉芝士加入 60g 細砂糖，用打蛋器中低速打至完全順滑、像絲絨般的乳霜狀。"
      },
      {
        "id": "step-mg-3",
        "stepNumber": 3,
        "instruction": "分次加蛋：先加入第一個全蛋，打勻；再加入第二個全蛋，打勻；最後加入那一個蛋黃，徹底攪打均勻（讓芝士糊完全吸收蛋液後再加下一個）。"
      },
      {
        "id": "step-mg-4",
        "stepNumber": 4,
        "instruction": "加液體與粉類：依序倒入 140g 淡忌廉和 1.5 茶匙檸檬汁拌勻。最後篩入 20g 低筋麵粉，改用刮刀以「由底往上翻」的方式輕柔拌勻至完全沒有粉粒。"
      },
      {
        "id": "step-mg-5",
        "stepNumber": 5,
        "instruction": "水浴烘烤：將芝士糊過篩倒入模中。準備一個大焗盤倒入約 1.5 厘米高的熱水，放上蛋糕模。放入焗爐以 fan 150°C 烘烤 50 - 60 分鐘。烤到表面呈現淡淡的金黃色，邊位已定型，輕晃模具時中心只有微微晃動即可。",
        "timerMinutes": 60
      },
      {
        "id": "step-mg-6",
        "stepNumber": 6,
        "instruction": "冷卻：出爐後在室溫放涼，然後連模具直接送入雪櫃冷藏 2-3 小時，讓蛋糕體中心完全冷卻變結實。",
        "timerMinutes": 180
      },
      {
        "id": "step-mg-7",
        "stepNumber": 7,
        "instruction": "芒果層製作：魚膠粉加入 40ml 冷水拌勻，靜置 5 分鐘吸水。隔熱水融化至透明，先舀 2-3 湯匙芒果蓉與魚膠液混合，再倒回全部芒果蓉中攪勻。待蛋糕至少雪 4 小時才鋪上面雪 6 小時。",
        "timerMinutes": 360
      }
    ],
    "notes": "模具：7 吋模具（活底模外圍需嚴密包裹 3 層鋁箔紙防止滲水）。烤箱 fan 預熱 150°C 水浴烘烤 50-60 分鐘。主體冷藏至少 4 小時後再淋上芒果魚膠層，再冷藏 6 小時定型。",
    "privateNotes": "芝士糊務必過篩以確保絲滑無氣泡；芒果蓉先取少量與融化魚膠液混合，再倒回整體可避免結塊均勻凝固。",
    "rating": 5,
    "source": "Recipe Notes",
    "isFavorite": true,
    "createdAt": 1725083400000,
    "updatedAt": 1725083400000
  },
  {
    "id": "recipe-notes-pandan-chiffon",
    "title": "斑蘭椰香戚風蛋糕",
    "description": "20cm / 8吋模具（不能用牛油紙），充滿天然斑蘭清香與濃郁椰奶香氣的南洋經典戚風，口感輕盈綿密。",
    "category": "蛋糕",
    "tags": [
      "戚風蛋糕",
      "斑蘭",
      "椰香",
      "8吋",
      "烘焙甜點"
    ],
    "servings": 4,
    "prepTime": 25,
    "cookTime": 45,
    "difficulty": "中等",
    "coverImage": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800",
    "ingredients": [
      {
        "id": "ing-pd-1",
        "name": "蛋黃",
        "amount": "75",
        "unit": "g（約 4 個大蛋）"
      },
      {
        "id": "ing-pd-2",
        "name": "椰糖",
        "amount": "30",
        "unit": "g"
      },
      {
        "id": "ing-pd-3",
        "name": "油",
        "amount": "60",
        "unit": "g"
      },
      {
        "id": "ing-pd-4",
        "name": "濃椰奶（或全脂牛奶）",
        "amount": "60",
        "unit": "g"
      },
      {
        "id": "ing-pd-5",
        "name": "斑蘭香精",
        "amount": "1.5–2",
        "unit": "小匙"
      },
      {
        "id": "ing-pd-6",
        "name": "低筋麵粉",
        "amount": "100",
        "unit": "g"
      },
      {
        "id": "ing-pd-7",
        "name": "【蛋白霜】蛋白",
        "amount": "180",
        "unit": "g"
      },
      {
        "id": "ing-pd-8",
        "name": "【蛋白霜】檸檬汁",
        "amount": "9",
        "unit": "g"
      },
      {
        "id": "ing-pd-9",
        "name": "【蛋白霜】砂糖",
        "amount": "75",
        "unit": "g"
      },
      {
        "id": "ing-pd-10",
        "name": "【蛋白霜】粟粉",
        "amount": "9",
        "unit": "g"
      }
    ],
    "steps": [
      {
        "id": "step-pd-1",
        "stepNumber": 1,
        "instruction": "混合液體：將椰奶、油和斑蘭香精先混合均勻。香精先跟液體混好，顏色才會均勻，不會在麵糊裡出現「綠點」。"
      },
      {
        "id": "step-pd-2",
        "stepNumber": 2,
        "instruction": "乳化蛋黃：蛋黃加入椰糖攪拌至略微發白，倒入步驟 1 的液體攪勻。"
      },
      {
        "id": "step-pd-3",
        "stepNumber": 3,
        "instruction": "粉類入模：篩入低筋麵粉，用手動打蛋器以「Z」字形拌勻至無顆粒。切記不要過度攪拌以免起筋。"
      },
      {
        "id": "step-pd-4",
        "stepNumber": 4,
        "instruction": "打發蛋白：蛋白加入檸檬汁，分三次加入砂糖和粟粉混合物。打發至乾性發泡（拉起打蛋頭呈現直立尖角）。"
      },
      {
        "id": "step-pd-5",
        "stepNumber": 5,
        "instruction": "混合麵糊：先取 1/3 蛋白霜混入蛋黃糊撥勻，再將全部麵糊倒入剩餘的蛋白霜中。用刮刀以「切拌」及「翻拌」方式快速拌勻，動作要輕，避免消泡。"
      },
      {
        "id": "step-pd-6",
        "stepNumber": 6,
        "instruction": "烘烤：放入預熱至 165°C 的焗爐，烤約 40-45 分鐘。",
        "timerMinutes": 45
      },
      {
        "id": "step-pd-7",
        "stepNumber": 7,
        "instruction": "倒扣冷卻：出爐後立即從約 10 厘米高處摔一下震出熱氣，然後立即倒扣。必須完全放涼（至少 2 小時）後再脫模。",
        "timerMinutes": 120
      }
    ],
    "notes": "模具：20cm / 8吋模具（戚風專用模絕對不能抹油或鋪牛油紙，麵糊需附著模具內壁爬升）。預熱 165°C 烤 40-45 分鐘。出爐震出熱氣立即倒扣放涼至少 2 小時脫模。",
    "privateNotes": "斑蘭香精先與油奶乳化可保證色澤均勻；蛋白霜加入粟粉可增強氣泡穩定性，使戚風高度更挺立。",
    "rating": 5,
    "source": "Recipe Notes",
    "isFavorite": true,
    "createdAt": 1725083420000,
    "updatedAt": 1725083420000
  },
  {
    "id": "recipe-notes-coconut-traybake",
    "title": "椰香 Traybake 蛋糕",
    "description": "30cm x 40cm 大烤盤（或兩個中型烤盤），重奶油蛋糕體濃郁濕潤，刷上微熱杏桃果醬並鋪滿香脆金黃椰子碎。",
    "category": "蛋糕",
    "tags": [
      "Traybake",
      "椰香蛋糕",
      "大烤盤",
      "英式烘焙",
      "烘焙甜點"
    ],
    "servings": 1,
    "prepTime": 30,
    "cookTime": 45,
    "difficulty": "簡單",
    "coverImage": "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&q=80&w=800",
    "ingredients": [
      {
        "id": "ing-tb-1",
        "name": "Self-raising flour（自發粉）",
        "amount": "600",
        "unit": "g"
      },
      {
        "id": "ing-tb-2",
        "name": "鹽",
        "amount": "0.5",
        "unit": "茶匙"
      },
      {
        "id": "ing-tb-3",
        "name": "無鹽奶油（室溫軟化）",
        "amount": "300",
        "unit": "g"
      },
      {
        "id": "ing-tb-4",
        "name": "細砂糖",
        "amount": "400",
        "unit": "g"
      },
      {
        "id": "ing-tb-5",
        "name": "雞蛋（大型，室溫）",
        "amount": "6",
        "unit": "顆"
      },
      {
        "id": "ing-tb-6",
        "name": "椰汁 / 椰漿（Coconut Cream 或 Coconut Milk）",
        "amount": "250",
        "unit": "ml"
      },
      {
        "id": "ing-tb-7",
        "name": "雙倍鮮奶油（Double Cream）",
        "amount": "150",
        "unit": "ml"
      },
      {
        "id": "ing-tb-8",
        "name": "酸奶油（Sour Cream）",
        "amount": "100",
        "unit": "g"
      },
      {
        "id": "ing-tb-9",
        "name": "杏桃果醬（Apricot Jam）",
        "amount": "4–5",
        "unit": "大湯匙"
      },
      {
        "id": "ing-tb-10",
        "name": "椰子碎（Desiccated Coconut）",
        "amount": "120–150",
        "unit": "g"
      }
    ],
    "steps": [
      {
        "id": "step-tb-1",
        "stepNumber": 1,
        "instruction": "材料回溫：奶油、雞蛋、Sour Cream、Double Cream 必須全部提早拿出來回復室溫。如果材料太冷，攪拌時麵糊容易油水分離。"
      },
      {
        "id": "step-tb-2",
        "stepNumber": 2,
        "instruction": "預熱與鋪紙：烤箱預熱至 170°C（風扇烤箱 150°C）。在大烤盤內鋪上烘焙紙（Baking paper），邊緣留一點高度，方便烤好後整塊提起。"
      },
      {
        "id": "step-tb-3",
        "stepNumber": 3,
        "instruction": "奶油打發：將軟化的奶油和細砂糖放入大盆中，用電動打蛋器高速打發約 3-4 分鐘，直到顏色變白、呈現蓬鬆的絨毛狀。",
        "timerMinutes": 4
      },
      {
        "id": "step-tb-4",
        "stepNumber": 4,
        "instruction": "逐顆加蛋：將 6 顆雞蛋逐顆加入，每加一顆都要徹底攪拌均勻再加下一顆（如果一次加太多，麵糊會結塊）。"
      },
      {
        "id": "step-tb-5",
        "stepNumber": 5,
        "instruction": "液體混合：在另一個碗裡，把椰汁、Double Cream、Sour Cream 混合均勻（這時候就是把家裡的剩料消滅掉）。"
      },
      {
        "id": "step-tb-6",
        "stepNumber": 6,
        "instruction": "交替拌粉：將自發粉和鹽混合過篩。開打蛋機最低速。先倒入 1/3 的自發粉拌勻 → 倒入 1/2 的液體 → 倒入 1/3 的自發粉 → 倒入剩餘液體 → 倒入最後的自發粉。只要攪拌到看不見乾麵粉就要立刻停止（約幾十秒），千萬不要過度攪拌。"
      },
      {
        "id": "step-tb-7",
        "stepNumber": 7,
        "instruction": "入模抹平：將濃稠的麵糊倒入鋪好紙的烤盤中，用刮刀或湯匙背面把表面抹平、推到四個角落。"
      },
      {
        "id": "step-tb-8",
        "stepNumber": 8,
        "instruction": "主體烘烤：放入烤箱中層，烘烤約 35 至 45 分鐘。拿一根牙籤戳入蛋糕正中央，拔出來是乾淨的（沒有黏糊狀物）就是熟了。",
        "timerMinutes": 45
      },
      {
        "id": "step-tb-9",
        "stepNumber": 9,
        "instruction": "香烤椰子碎：當蛋糕在焗爐裡烤到最後 5 分鐘時，把 120g - 150g 的椰子碎平鋪在另一個大烤盤上一起焗，只要看到椰子碎整體變成淡淡的金黃色、飄出濃郁椰香，就立刻拿出來。出爐後要馬上把椰子碎倒進大碗放涼，避免餘溫烤焦變苦。",
        "timerMinutes": 5
      },
      {
        "id": "step-tb-10",
        "stepNumber": 10,
        "instruction": "組合表面：蛋糕與椰子碎同時出爐。蛋糕趁熱抹上加熱微溫的杏桃果醬。立刻撒上剛剛焗好、香噴噴的金黃椰子碎，輕輕壓實。"
      },
      {
        "id": "step-tb-11",
        "stepNumber": 11,
        "instruction": "放涼定型：連同烤盤放在鐵架上冷藏或靜置到完全冷卻後切塊享用。"
      }
    ],
    "notes": "模具：30cm x 40cm 大烤盤（或 2 個中型烤盤）。預熱 170°C（風扇 150°C）烤 35-45 分鐘。出爐趁熱刷上微波加熱 10-15 秒的杏桃果醬，並鋪滿烤至金黃的椰子碎。",
    "privateNotes": "加入 Sour Cream 能鎖住大量水份，使切塊蛋糕即使常溫放置數天依然濕潤鬆軟。",
    "rating": 5,
    "source": "Recipe Notes",
    "isFavorite": true,
    "createdAt": 1725083440000,
    "updatedAt": 1725083440000
  },
  {
    "id": "recipe-notes-matcha-chiffon",
    "title": "日式抹茶戚風",
    "description": "6吋活底模具，經典日式抹茶戚風蛋糕，口感蓬鬆濕潤，散發濃郁抹茶清香與細緻蛋香。",
    "category": "蛋糕",
    "tags": [
      "戚風蛋糕",
      "抹茶",
      "6吋活底",
      "烘焙甜點"
    ],
    "servings": 1,
    "prepTime": 25,
    "cookTime": 45,
    "difficulty": "中等",
    "coverImage": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800",
    "ingredients": [
      {
        "id": "ing-m-1",
        "name": "蛋黃",
        "amount": "3",
        "unit": "個"
      },
      {
        "id": "ing-m-2",
        "name": "無味植物油",
        "amount": "25",
        "unit": "g"
      },
      {
        "id": "ing-m-3",
        "name": "全脂奶",
        "amount": "50",
        "unit": "g"
      },
      {
        "id": "ing-m-4",
        "name": "低筋麵粉",
        "amount": "42",
        "unit": "g"
      },
      {
        "id": "ing-m-5",
        "name": "抹茶粉",
        "amount": "8",
        "unit": "g"
      },
      {
        "id": "ing-m-6",
        "name": "蛋白",
        "amount": "3",
        "unit": "個"
      },
      {
        "id": "ing-m-7",
        "name": "細砂糖",
        "amount": "35",
        "unit": "g"
      },
      {
        "id": "ing-m-8",
        "name": "檸檬汁",
        "amount": "3–5",
        "unit": "滴"
      }
    ],
    "steps": [
      {
        "id": "step-m-1",
        "stepNumber": 1,
        "instruction": "先將牛奶＋抹茶粉，攪至完全滑身。再加入：油 → 攪乳化，最後篩入低粉。"
      },
      {
        "id": "step-m-2",
        "stepNumber": 2,
        "instruction": "蛋白打至「鳥嘴」，提起打蛋頭，尖角站立但尾巴輕微彎。"
      },
      {
        "id": "step-m-3",
        "stepNumber": 3,
        "instruction": "先混 1/3 蛋白。再回倒。看到還有少量白紋時就收手。不要追求完全光滑。"
      },
      {
        "id": "step-m-4",
        "stepNumber": 4,
        "instruction": "145°C 約 45分鐘，表面上色後蓋錫紙（最後15分鐘）。",
        "timerMinutes": 45
      },
      {
        "id": "step-m-5",
        "stepNumber": 5,
        "instruction": "出爐輕震一下。立刻倒扣。放 至少 90分鐘。完全冷先脫模。",
        "timerMinutes": 90
      }
    ],
    "notes": "模具：6吋活底。烤溫：145°C 約 45 分鐘，表面上色後蓋錫紙（最後 15 分鐘）。出爐輕震一下並立即倒扣，放至少 90 分鐘完全冷卻後脫模。",
    "privateNotes": "蛋白打至鳥嘴狀（尖角站立但尾巴微彎），切拌混合時手法輕快以防消泡。",
    "rating": 5,
    "source": "Recipe Notes",
    "isFavorite": true,
    "createdAt": 1725083245000,
    "updatedAt": 1725083245000
  },
  {
    "id": "recipe-notes-ny-cheesecake",
    "title": "紐約起司蛋糕",
    "description": "8吋濃郁經典紐約起司蛋糕（New York Cheesecake），搭配香脆消化餅底與絲滑酸忌廉乳酪餡，水浴烘烤香濃綿密。",
    "category": "蛋糕",
    "tags": [
      "起司蛋糕",
      "芝士蛋糕",
      "8吋",
      "水浴法",
      "烘焙甜點"
    ],
    "servings": 1,
    "prepTime": 35,
    "cookTime": 75,
    "difficulty": "中等",
    "coverImage": "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&q=80&w=800",
    "ingredients": [
      {
        "id": "ing-ny-1",
        "name": "消化餅（原味或朱古力）",
        "amount": "145",
        "unit": "g"
      },
      {
        "id": "ing-ny-2",
        "name": "無鹽牛油（溶化）",
        "amount": "55",
        "unit": "g"
      },
      {
        "id": "ing-ny-3",
        "name": "Cream cheese",
        "amount": "530",
        "unit": "g"
      },
      {
        "id": "ing-ny-4",
        "name": "無鹽牛油（溶化後放涼）",
        "amount": "35",
        "unit": "g"
      },
      {
        "id": "ing-ny-5",
        "name": "細砂糖",
        "amount": "130",
        "unit": "g"
      },
      {
        "id": "ing-ny-6",
        "name": "粟粉",
        "amount": "18",
        "unit": "g"
      },
      {
        "id": "ing-ny-7",
        "name": "雲呢拿香油",
        "amount": "6",
        "unit": "g"
      },
      {
        "id": "ing-ny-8",
        "name": "Whipping cream",
        "amount": "160",
        "unit": "g"
      },
      {
        "id": "ing-ny-9",
        "name": "檸檬汁",
        "amount": "15",
        "unit": "g"
      },
      {
        "id": "ing-ny-10",
        "name": "全蛋",
        "amount": "2",
        "unit": "隻"
      },
      {
        "id": "ing-ny-11",
        "name": "蛋黃",
        "amount": "2",
        "unit": "隻"
      },
      {
        "id": "ing-ny-12",
        "name": "酸忌廉（Soured cream）",
        "amount": "240",
        "unit": "g"
      }
    ],
    "steps": [
      {
        "id": "step-ny-1",
        "stepNumber": 1,
        "instruction": "把餅乾壓成碎粒狀後與溶化牛油拌勻，倒入撲了油／鋪了烘焙紙的 24 cm 蛋糕模底部，壓實。烤箱預熱至約 170℃，先烤 8–10 分鐘定型，取出放涼。",
        "timerMinutes": 10
      },
      {
        "id": "step-ny-2",
        "stepNumber": 2,
        "instruction": "室溫軟化的奶油乳酪放大碗，用電動打蛋器打至順滑。加入 melted butter 混合。分次加糖至糖溶。"
      },
      {
        "id": "step-ny-3",
        "stepNumber": 3,
        "instruction": "一顆顆加入雞蛋，每次攪勻再加下一顆。加蛋黃，最後加入酸忌廉（或 Creme fraiche）。篩入粟粉，轉刮刀拌勻，最後加入 vanilla + lemon juice。"
      },
      {
        "id": "step-ny-4",
        "stepNumber": 4,
        "instruction": "把餡過篩倒進餅底蛋糕模，輕輕敲出氣泡。放進預熱 170℃ 烤箱烤上下火水浴法 約 70–75 分鐘（中途可蓋錫紙避免餅面上色太快）。",
        "timerMinutes": 75
      },
      {
        "id": "step-ny-5",
        "stepNumber": 5,
        "instruction": "烤好後在關火的烤箱內開門一條縫，放置 1 小時讓溫度慢慢降，再取出放涼，然後至少冰入雪櫃冷藏 4–8 小時或隔夜定型。",
        "timerMinutes": 60
      }
    ],
    "notes": "模具：8吋 (約 24cm 模)。採用上下火 170℃ 水浴法烘烤約 70–75 分鐘。烤好後於關火烤箱開縫降溫 1 小時，出爐冷卻後冷藏 4–8 小時以上切塊風味最佳。",
    "privateNotes": "蛋液分次少量加入避免油水分離，過篩倒入模具可使乳酪質地無氣孔更綿密。",
    "rating": 5,
    "source": "Recipe Notes",
    "isFavorite": true,
    "createdAt": 1725083300000,
    "updatedAt": 1725083300000
  },
  {
    "id": "recipe-notes-basque-cheesecake",
    "title": "巴斯克芝士蛋糕",
    "description": "6吋經典巴斯克焦香芝士蛋糕（Basque Burnt Cheesecake），外層焦香金黃、內餡流心軟滑入口即化。",
    "category": "蛋糕",
    "tags": [
      "巴斯克",
      "芝士蛋糕",
      "6吋",
      "焦香乳酪",
      "烘焙甜點"
    ],
    "servings": 1,
    "prepTime": 20,
    "cookTime": 27,
    "difficulty": "簡單",
    "coverImage": "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&q=80&w=800",
    "ingredients": [
      {
        "id": "ing-bq-1",
        "name": "忌廉芝士（室溫軟化）",
        "amount": "310",
        "unit": "g"
      },
      {
        "id": "ing-bq-2",
        "name": "細砂糖",
        "amount": "75",
        "unit": "g"
      },
      {
        "id": "ing-bq-3",
        "name": "雞蛋",
        "amount": "2",
        "unit": "隻"
      },
      {
        "id": "ing-bq-4",
        "name": "蛋黃",
        "amount": "1",
        "unit": "個"
      },
      {
        "id": "ing-bq-5",
        "name": "淡忌廉",
        "amount": "140",
        "unit": "g"
      },
      {
        "id": "ing-bq-6",
        "name": "粟粉",
        "amount": "15",
        "unit": "g"
      },
      {
        "id": "ing-bq-7",
        "name": "雲呢拿精（可選）",
        "amount": "1",
        "unit": "茶匙"
      }
    ],
    "steps": [
      {
        "id": "step-bq-1",
        "stepNumber": 1,
        "instruction": "焗爐預熱 230°C（上下火），圓模鋪兩層牛油紙（要高過模邊，形成自然皺褶，這是它的造型靈魂）。"
      },
      {
        "id": "step-bq-2",
        "stepNumber": 2,
        "instruction": "忌廉芝士 + 糖打至順滑無粒。👉 重點：不要打入太多空氣，否則會爆裂得太誇張。"
      },
      {
        "id": "step-bq-3",
        "stepNumber": 3,
        "instruction": "分 3 次加入雞蛋，攪勻才加下一隻。"
      },
      {
        "id": "step-bq-4",
        "stepNumber": 4,
        "instruction": "加入淡忌廉、鹽、雲呢拿拌勻。"
      },
      {
        "id": "step-bq-5",
        "stepNumber": 5,
        "instruction": "篩入粟粉，輕輕拌至順滑。（拌到無粉粒就停）。"
      },
      {
        "id": "step-bq-6",
        "stepNumber": 6,
        "instruction": "過篩一次，倒入模具中。"
      },
      {
        "id": "step-bq-7",
        "stepNumber": 7,
        "instruction": "225°C 焗 24–27 分鐘。（出爐標準：輕晃模具時，中心約 5cm 範圍仍像布甸般會晃動）。",
        "timerMinutes": 27
      },
      {
        "id": "step-bq-8",
        "stepNumber": 8,
        "instruction": "室溫放涼 1 小時，入雪櫃最少 4 小時（最好過夜）。",
        "timerMinutes": 60
      }
    ],
    "notes": "模具：6吋（牛油紙一定要高過模具邊緣形成皺褶）。烤溫：225°C 焗 24–27 分鐘。出爐時中心約 5cm 晃動為流心最佳狀態，室溫放涼後冷藏至少 4 小時以上食用。",
    "privateNotes": "切忌過度打發拌入過多空氣以避免烘烤時膨脹破裂。",
    "rating": 5,
    "source": "Recipe Notes",
    "isFavorite": true,
    "createdAt": 1725083320000,
    "updatedAt": 1725083320000
  },
  {
    "id": "recipe-box-1-c956c579-a2e9-44e8-bfa7-71e3af58a920",
    "title": "Tiramisu",
    "description": "模具: 20 × 20 公分（正方形） 或 23 × 15 公分（長方形）; 深度： 至少 6 – 7 公分",
    "category": "蛋糕",
    "tags": [
      "已成功"
    ],
    "servings": 4,
    "prepTime": 30,
    "cookTime": 45,
    "difficulty": "中等",
    "coverImage": "https://mriniqvuukgmynunozis.supabase.co/storage/v1/object/public/recipe-images/1784814121736_8wy48y.png",
    "ingredients": [
      {
        "id": "ing-0-0-4kbdq",
        "name": "Mascarpone Cheese （室溫軟化）",
        "amount": "500",
        "unit": "g"
      },
      {
        "id": "ing-0-1-xw549",
        "name": "蛋黃",
        "amount": "4",
        "unit": "隻"
      },
      {
        "id": "ing-0-2-wsoa9",
        "name": "蛋白",
        "amount": "4",
        "unit": "隻"
      },
      {
        "id": "ing-0-3-ds6z7",
        "name": "細砂糖",
        "amount": "35",
        "unit": "g"
      },
      {
        "id": "ing-0-4-0qmw8",
        "name": "熱水",
        "amount": "170",
        "unit": "g"
      },
      {
        "id": "ing-0-5-96ruq",
        "name": "即溶咖啡粉",
        "amount": "12",
        "unit": "g"
      },
      {
        "id": "ing-0-6-8kfdx",
        "name": "Almond Extract",
        "amount": "3",
        "unit": "滴"
      },
      {
        "id": "ing-0-7-0ucuo",
        "name": "Savoiardi 手指餅乾",
        "amount": "16",
        "unit": "條"
      },
      {
        "id": "ing-0-8-pyrxw",
        "name": "無糖可可粉 適量",
        "amount": "",
        "unit": ""
      }
    ],
    "steps": [
      {
        "id": "step-1-5mll9",
        "stepNumber": 1,
        "instruction": "將8 g 糖與咖啡粉先在熱水中完全攪拌溶解，再加入香精。必須徹底放涼至室溫（或冷藏）後才能使用，不用即溶咖啡粉可用Espresso Coffee 120G + 50G 熱水加糖8G。浸泡前可先微嚐一口，液體的味道應為苦甜交織且咖啡味極濃；若覺得太苦，可補 2–3g 糖，但切勿太甜，否則會蓋過起司霜的奶香。"
      },
      {
        "id": "step-2-j1338",
        "stepNumber": 2,
        "instruction": "蛋黃 4 隻加 15g 糖，隔熱水打至淡黃色(中高速 )濃稠（鍋內放約2–3cm水，水加熱至65°C–70° - 熄火，打蛋盆放上去，碗底距離熱水約 1–2cm，打約 3–5分鐘 - 體積增加約一倍，顏色由橙黃色變成淡奶黃色，如果你把蛋液畫一個 8 字，大約 2–3秒才慢慢消失",
        "timerMinutes": 5
      },
      {
        "id": "step-3-pyvsk",
        "stepNumber": 3,
        "instruction": "鋼盆離開熱水後，先用打蛋器持續攪拌 30–60 秒，讓裡面的熱氣稍微散去（降至約 40°C–45°C）加入 500g 軟化的 Mascarpone 攪拌至順滑無顆粒。"
      },
      {
        "id": "step-4-nwm93",
        "stepNumber": 4,
        "instruction": "蛋白 4 隻打至起泡，分次加入 20g 糖，打至硬性發泡（提起有立體尖角）。"
      },
      {
        "id": "step-5-ytxyw",
        "stepNumber": 5,
        "instruction": "分 2–3 次將蛋白霜輕柔翻拌入 Mascarpone 蛋黃糊中，維持空氣感。"
      },
      {
        "id": "step-6-6gyr7",
        "stepNumber": 6,
        "instruction": "手指餅乾快速沾取無酒精咖啡液（單面沾 1 秒即起），鋪於容器底部。"
      },
      {
        "id": "step-7-518uq",
        "stepNumber": 7,
        "instruction": "鋪上一層乳霜，再重複一層餅乾與一層乳霜。"
      },
      {
        "id": "step-8-xmyph",
        "stepNumber": 8,
        "instruction": "密封冷藏 12–24 小時，食用前撒上無糖可可粉即可"
      }
    ],
    "notes": "模具規格：方形 20吋\n\n模具: 20 × 20 公分（正方形） 或 23 × 15 公分（長方形）; 深度： 至少 6 – 7 公分",
    "privateNotes": "模具規格：方形 20吋\n\n模具: 20 × 20 公分（正方形） 或 23 × 15 公分（長方形）; 深度： 至少 6 – 7 公分",
    "rating": 5,
    "source": "Recipe Box",
    "isFavorite": true,
    "createdAt": 1784813428988,
    "updatedAt": 1788171247432
  },
  {
    "id": "recipe-box-2-e0a4d357-910d-4d88-b56a-051e34fb57c1",
    "title": "法式焦糖燉蛋 (Crème Brûlée)",
    "description": "甜品美味手作食譜",
    "category": "甜品",
    "tags": [
      "待改善"
    ],
    "servings": 4,
    "prepTime": 20,
    "cookTime": 35,
    "difficulty": "簡單",
    "coverImage": "https://mriniqvuukgmynunozis.supabase.co/storage/v1/object/public/recipe-images/1785502900115_37n1zn.png",
    "ingredients": [
      {
        "id": "ing-1-0-rcpb6",
        "name": "蛋黃",
        "amount": "4",
        "unit": "隻"
      },
      {
        "id": "ing-1-1-be6dg",
        "name": "double cream",
        "amount": "300",
        "unit": "ml"
      },
      {
        "id": "ing-1-2-739v2",
        "name": "糖",
        "amount": "35",
        "unit": "g"
      },
      {
        "id": "ing-1-3-cu8iw",
        "name": "Vanilla Extract",
        "amount": "1",
        "unit": "tsp"
      }
    ],
    "steps": [
      {
        "id": "step-1-ouimp",
        "stepNumber": 1,
        "instruction": "將焗爐預熱至 150°C。 準備一壺熱水（用於水浴法烘烤）。 準備 3 至 4 個烤缽 (Ramekins) 放在一個深烤盤內。"
      },
      {
        "id": "step-2-7kpdl",
        "stepNumber": 2,
        "instruction": "將300ml 忌廉倒入小鍋中，用小火慢慢加熱。 當忌廉邊緣開始出現微小氣泡，且有蒸汽冒出時（約 65°C），立刻離火。切忌讓忌廉沸騰，否則會破壞乳脂結構。讓忌廉靜置降溫約 2 至 3 分鐘。",
        "timerMinutes": 3
      },
      {
        "id": "step-3-f6ora",
        "stepNumber": 3,
        "instruction": "在一個乾淨的攪拌盆中，加入 4 隻蛋黃和 35g 細砂糖。 用打蛋器輕柔地畫圈攪拌，直��糖粒稍微融化，蛋黃顏色變均勻即可。 關鍵細節： 過程中切勿過度用力打發，要盡量避免捲入空氣產生泡沫，這會導致烤出來的燉蛋內部出現孔洞。"
      },
      {
        "id": "step-4-ac33i",
        "stepNumber": 4,
        "instruction": "加入 1 茶匙雲呢拿精，輕輕拌勻。"
      },
      {
        "id": "step-5-o2o2x",
        "stepNumber": 5,
        "instruction": "左手拿著裝有微熱忌廉的小鍋，右手拿著打蛋器。 將溫熱的忌廉以極細的線條狀（像一條細線般）緩慢倒入蛋黃糊中，同時右手必須快速且持續地攪拌。 這個步驟是為了讓蛋黃慢慢適應溫度，防止蛋黃被瞬間燙熟結塊。"
      },
      {
        "id": "step-6-l5aco",
        "stepNumber": 6,
        "instruction": "將混合好的蛋奶液用極細的網篩過濾 1 至 2 次。這能隔除蛋黃的繫帶（Chalazae）以及未完全溶解的糖粒。 過篩後，如果液體表面仍有細小泡沫，可以用湯匙輕輕撇去"
      },
      {
        "id": "step-7-ln3uk",
        "stepNumber": 7,
        "instruction": "將過濾好的蛋奶液平均倒入烤缽中，約 8 至 9 分滿。 將深烤盤移至焗爐的烤架上，然後小心地將熱水 （約 70-80°C）倒入深烤盤中。熱水的高度需達到烤缽的一半。 關上焗爐門，以 140°C 烘烤 35 至 45 分鐘。 熟度判斷： 輕輕搖晃烤盤，燉蛋的邊緣應該已經凝固，但中心區域仍然有如果凍般微微晃動的狀態 (Jiggle)。此時即可出爐，餘溫會讓中心繼續熟成。",
        "timerMinutes": 45
      },
      {
        "id": "step-8-7btrh",
        "stepNumber": 8,
        "instruction": "將烤缽從熱水中小心取出，放在網架上室溫放涼。 完全放涼後，用保���紙將表面封好（避免吸附雪櫃異味），放入雪櫃冷藏至少 4 小時，最好過夜，讓質地完全凝固與收成。"
      },
      {
        "id": "step-9-1kam0",
        "stepNumber": 9,
        "instruction": "雪櫃取出後印乾表面 → 每杯大約 1.5 至 2 茶匙糖撒完搖平，然後倒走多餘糖。 → 火槍保持大約 8–10cm，火焰一直移動，不要盯住一點燒。 → 分兩輪燒先整體掃到糖融，再第二輪補色。不要一開始就追求深啡色。燒完等 1–2 分鐘才敲",
        "timerMinutes": 2
      }
    ],
    "rating": 3,
    "source": "Recipe Box",
    "isFavorite": false,
    "createdAt": 1784799901382,
    "updatedAt": 1788167647432
  },
  {
    "id": "recipe-box-3-4fbd044c-3e70-4cbf-9f82-7158bc19d139",
    "title": "奶黃馬拉糕",
    "description": "7 吋圓形固底模具（直徑 18 cm，高度至少 7 cm）",
    "category": "中式食物",
    "tags": [
      "待試"
    ],
    "servings": 4,
    "prepTime": 40,
    "cookTime": 30,
    "difficulty": "中等",
    "coverImage": "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&q=80&w=800",
    "ingredients": [
      {
        "id": "ing-2-0-bairb",
        "name": "中筋麵粉",
        "amount": "200",
        "unit": "g"
      },
      {
        "id": "ing-2-1-czaqg",
        "name": "吉士粉",
        "amount": "30",
        "unit": "g"
      },
      {
        "id": "ing-2-2-6uzua",
        "name": "黃糖(或黑糖)",
        "amount": "120",
        "unit": "g"
      },
      {
        "id": "ing-2-3-spdwn",
        "name": "雞蛋",
        "amount": "3",
        "unit": "隻"
      },
      {
        "id": "ing-2-4-o4b7w",
        "name": "淡奶",
        "amount": "80",
        "unit": "ml"
      },
      {
        "id": "ing-2-5-yq7s6",
        "name": "無鹽牛油 (溶化)",
        "amount": "40",
        "unit": "g"
      },
      {
        "id": "ing-2-6-e3ql7",
        "name": "溫水",
        "amount": "60",
        "unit": "ml"
      },
      {
        "id": "ing-2-7-42va7",
        "name": "奶粉",
        "amount": "15",
        "unit": "g"
      },
      {
        "id": "ing-2-8-rpt8v",
        "name": "泡打粉",
        "amount": "3",
        "unit": "g"
      },
      {
        "id": "ing-2-9-6wqlk",
        "name": "耐高糖酵母",
        "amount": "5",
        "unit": "g"
      }
    ],
    "steps": [
      {
        "id": "step-1-eq2bx",
        "stepNumber": 1,
        "instruction": "3隻蛋＋120克黃糖高速打 5–6 分鐘 至淺色、���稠、提起呈緞帶狀",
        "timerMinutes": 6
      },
      {
        "id": "step-2-8xb8j",
        "stepNumber": 2,
        "instruction": "將 5g 耐高糖酵母溶於 60ml 溫水（約 35°C）靜置 5 分鐘激活，再與 80ml 淡奶混合備用。\n將200克中筋麵粉、30克吉士粉、15克奶粉、3克泡打粉 混合過篩, 備用。",
        "timerMinutes": 5
      },
      {
        "id": "step-3-1k66k",
        "stepNumber": 3,
        "instruction": "將Step 2 的乾粉交替分次加入打發蛋糊中（即：乾粉 1/3  --> 液體 1/2 --> 乾粉 1/3 --> 液體 1/2 --> 乾粉 1/3），每次輕手翻拌至無粉粒即可。"
      },
      {
        "id": "step-4-53yux",
        "stepNumber": 4,
        "instruction": "無鹽牛油 40g 融化後放至約 35–40°C, 取一小匙麵糊（約 2–3 湯匙）去牛油碗先混合。再慢慢倒回大盆。輕手拌勻。 麵糊狀態: 提起蛋抽會流下, 可以形成帶狀, 紋路約 2–3 秒消失, 有流動性但唔似水"
      },
      {
        "id": "step-5-e8z93",
        "stepNumber": 5,
        "instruction": "第一次發酵： 蓋上保鮮紙，放在溫暖處（約28-30°C）靜置 60分鐘。見表面密孔＋約升50%。",
        "timerMinutes": 60
      },
      {
        "id": "step-6-pjuld",
        "stepNumber": 6,
        "instruction": "排氣：用刮刀輕輕攪拌麵糊，將裡面的大氣泡攪散 (刮刀攪 15–20下)，讓孔洞更細緻。"
      },
      {
        "id": "step-7-w3ywy",
        "stepNumber": 7,
        "instruction": "第二次發酵： 將麵糊倒入準備好的活底模具中至模具約7成滿。蓋上保鮮紙，再次靜置發酵約 30-45分鐘，直到麵糊膨脹到模具的 8分滿。",
        "timerMinutes": 45
      },
      {
        "id": "step-8-c9as2",
        "stepNumber": 8,
        "instruction": "大火足水： 蒸鍋內加入足夠的水，大火燒至大滾（水生大氣泡）。用竹籠放入蒸鍋。用固底模具（鋪烘焙紙）。全程維持大火蒸 25-30分鐘。（中途絕對不能開蓋）。熄��後，不要馬上開蓋。在鍋內燜 3-5 分鐘讓結構定型，再出鍋放涼。完全冷卻後，用小刀沿邊緣劃一圈脫模。",
        "timerMinutes": 30
      }
    ],
    "notes": "7 吋圓形固底模具（直徑 18 cm，高度至少 7 cm）",
    "privateNotes": "7 吋圓形固底模具（直徑 18 cm，高度至少 7 cm）",
    "rating": 4,
    "source": "Recipe Box",
    "isFavorite": false,
    "createdAt": 1784796649911,
    "updatedAt": 1788164047432
  },
  {
    "id": "recipe-box-4-c2ea9120-11f6-4ed0-ad6d-a2306bd08757",
    "title": "黑森林蛋糕",
    "description": "7 吋\nhttps://www.youtube.com/watch?v=HBsz7YzFnqA",
    "category": "蛋糕",
    "tags": [
      "待試"
    ],
    "servings": 4,
    "prepTime": 30,
    "cookTime": 45,
    "difficulty": "中等",
    "coverImage": "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=800",
    "ingredients": [
      {
        "id": "ing-3-0-s3wkt",
        "name": "蛋",
        "amount": "4",
        "unit": "隻"
      },
      {
        "id": "ing-3-1-htqru",
        "name": "糖",
        "amount": "90",
        "unit": "g"
      },
      {
        "id": "ing-3-2-6irbv",
        "name": "低筋粉",
        "amount": "47",
        "unit": "g"
      },
      {
        "id": "ing-3-3-edo64",
        "name": "可可粉",
        "amount": "27",
        "unit": "g"
      },
      {
        "id": "ing-3-4-l9dgq",
        "name": "黑加侖子啫喱粉",
        "amount": "80",
        "unit": "g"
      },
      {
        "id": "ing-3-5-unu2c",
        "name": "魚膠粉",
        "amount": "5.5",
        "unit": "g"
      },
      {
        "id": "ing-3-6-j8yg9",
        "name": "熱水",
        "amount": "200",
        "unit": "g"
      },
      {
        "id": "ing-3-7-pppni",
        "name": "水",
        "amount": "200",
        "unit": "g"
      },
      {
        "id": "ing-3-8-bbmxx",
        "name": "60–65% cocoa 的 dark chocolate",
        "amount": "108",
        "unit": "g"
      },
      {
        "id": "ing-3-9-jidtd",
        "name": "全脂牛奶",
        "amount": "80",
        "unit": "g"
      },
      {
        "id": "ing-3-10-poe7a",
        "name": "35% whipping cream",
        "amount": "163",
        "unit": "g"
      }
    ],
    "steps": [
      {
        "id": "step-1-f6l10",
        "stepNumber": 1,
        "instruction": "黑加侖子啫喱\n啫喱粉 80g 放入容器。加入 200g 熱水。攪拌至完全溶解。\n4g 魚膠粉先用12G水吸收。加入啫喱水。完全混合。倒入淺盤。\n(最好用一個比 7 吋蛋糕稍大的平底容器，讓啫喱厚度約 3–4mm。)\n急凍30分鐘，完全凝固後再切出：約 17–17.5cm ���片。",
        "timerMinutes": 30
      },
      {
        "id": "step-2-pg6la",
        "stepNumber": 2,
        "instruction": "朱古力海綿蛋糕\n低筋粉47g ＋ 27g 可可粉混合過篩。\n蛋黃分3次加入45g 糖打起，攪拌至顏色稍淡、糖大致溶解。\n蛋白打至起泡後，分次加入第二份 45g 糖。打至中性偏硬、但仍有光澤的蛋白霜。\n取約 1/3 蛋白霜加入蛋黃糊，拌鬆。加入剩餘蛋白霜。\n分2次加入混好已過篩的低筋粉+可可粉。用刮刀由底向上翻拌，直到看不到乾粉。\n倒入 7 吋模。輕敲 1–2 下排出大氣泡\n170°C，上下火 25分鐘",
        "timerMinutes": 25
      },
      {
        "id": "step-3-x4l93",
        "stepNumber": 3,
        "instruction": "Light Illanka Mousse\n1.5g 魚膠粉 +  7.5g 冷水浸泡至完全吸水。\n108g Illanka 63% 切碎。隔水或微波爐低功率融化至順滑。約 40–45°C。\n80g 全脂奶，加熱至接近沸騰。加入已泡好的 gelatin，完全溶解\n把約 1/3 熱奶倒入 chocolate。用手提打蛋器由中心開始攪拌。你要看到：光亮、有彈性、沒有油水分離\n再逐步加入剩餘 milk。\n163g whipping cream 打至：soft / mousse texture。\n待 Chocolate mixture 降至35–40°C 加入 whipped cream。用刮刀輕輕 fold。"
      },
      {
        "id": "step-4-4h2ja",
        "stepNumber": 4,
        "instruction": "組裝\n蛋糕完全冷卻 → 脫模 → 橫切兩片\n\n底部海綿\n→ 黑加侖子啫喱\n→ 約 165–175g mousse\n→ 第二片海綿\n→ 黑加侖子啫喱\n→ 約 165–175g mousse\n抹平。\n\n冷藏至少 6 小時。最好：冷藏過��。"
      }
    ],
    "notes": "7 吋\nhttps://www.youtube.com/watch?v=HBsz7YzFnqA",
    "privateNotes": "7 吋\nhttps://www.youtube.com/watch?v=HBsz7YzFnqA",
    "rating": 4,
    "source": "Recipe Box",
    "isFavorite": false,
    "createdAt": 1787092978704,
    "updatedAt": 1788160447432
  },
  {
    "id": "recipe-box-5-10cf5a0a-8e25-4aa4-b4d0-2655ef9a2b5e",
    "title": "Melon Pan",
    "description": "8個, 每個生坯：約90g 。 原食譜水是80g，我試用70g做，已需要打差不多半小時，改為70g",
    "category": "麵包",
    "tags": [
      "待試"
    ],
    "servings": 4,
    "prepTime": 50,
    "cookTime": 20,
    "difficulty": "進階",
    "coverImage": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800",
    "ingredients": [
      {
        "id": "ing-4-0-oe8gl",
        "name": "高筋麵粉",
        "amount": "200",
        "unit": "g"
      },
      {
        "id": "ing-4-1-vr93c",
        "name": "細砂糖",
        "amount": "95",
        "unit": "g"
      },
      {
        "id": "ing-4-2-gkj3f",
        "name": "鹽",
        "amount": "3",
        "unit": "g"
      },
      {
        "id": "ing-4-3-e81u2",
        "name": "Instant Dry Yeast",
        "amount": "4",
        "unit": "g"
      },
      {
        "id": "ing-4-4-sc879",
        "name": "全蛋",
        "amount": "60",
        "unit": "g"
      },
      {
        "id": "ing-4-5-d7aai",
        "name": "Double cream",
        "amount": "35",
        "unit": "g"
      },
      {
        "id": "ing-4-6-y9sok",
        "name": "水",
        "amount": "70",
        "unit": "g"
      },
      {
        "id": "ing-4-7-d5raw",
        "name": "無鹽牛油",
        "amount": "70",
        "unit": "g"
      },
      {
        "id": "ing-4-8-qqbeu",
        "name": "低筋麵粉",
        "amount": "130",
        "unit": "g"
      },
      {
        "id": "ing-4-9-lzy5w",
        "name": "Capella Cantaloupe",
        "amount": "1",
        "unit": "g"
      }
    ],
    "steps": [
      {
        "id": "step-1-07kgo",
        "stepNumber": 1,
        "instruction": "Cookie Dough\n- 40g 無鹽牛油室溫軟化 加入65g 細砂糖拌至均勻。不用特別打發。\n(牛油狀態: 手指可以輕易壓下去，但牛油仍然是固體。)\n- 40g 全蛋分 3–4次加入。每次完全混合後再加入下一次。\n- 加入：1.0g Capella Cantaloupe 拌勻。\n- 加入：130g 低筋麵粉用刮刀切拌。不要揉成麵糰。只要沒有乾粉即可。\n- 壓成約 1cm 厚���保鮮紙包好。放雪櫃：至少3小時 (最好一晚)"
      },
      {
        "id": "step-2-ixeqg",
        "stepNumber": 2,
        "instruction": "麵包麵糰\n- 高筋麵粉 200g + 糖 30g + 鹽 3g + Instant yeast 4g 混合均勻。\n- 加入全蛋 20g + Double cream 35g + 水 70g 混合成麵糰。\n- 先揉至開始形成麵筋，加入：無鹽牛油 30g\n- 搓至麵糰有彈性，表面較光滑 (麵糰完成溫度：約28°C)"
      },
      {
        "id": "step-3-yz36y",
        "stepNumber": 3,
        "instruction": "第一次發酵\n約60分鐘。應看到麵糰明顯膨脹、內部開始充氣。",
        "timerMinutes": 60
      },
      {
        "id": "step-4-m0nxu",
        "stepNumber": 4,
        "instruction": "分割成8個， 約50g。每份滾圓。蓋好。鬆弛15分鐘。",
        "timerMinutes": 15
      },
      {
        "id": "step-5-v8wsg",
        "stepNumber": 5,
        "instruction": "取出冷藏好的 cookie dough。稍微回溫幾分鐘，但不要讓牛油變得太軟。分成8份，滾圓，擀成：直徑約8–10cm"
      },
      {
        "id": "step-6-7wwdj",
        "stepNumber": 6,
        "instruction": "每個麵包麵糰：\n- 再次輕輕滾圓\n- Cookie dough 放在上面\n- 輕輕包覆整個麵包，會有太多包唔晒的感覺，不用怕，發酵之後剛好\n- 表面沾砂糖\n- 用刮板／Melon Pan cutter 壓出菱形格紋 (格紋不要壓太深。只需要形成清楚的網紋，不要切穿 cookie shell)"
      },
      {
        "id": "step-7-x753d",
        "stepNumber": 7,
        "instruction": "第二次發酵 45–60分鐘 (25–28°C)\n看到：麵包明顯膨脹，cookie shell 被麵包向外撐，格紋仍清楚\n輕按麵包體後慢慢回彈。\n\n170°C  15–18分鐘",
        "timerMinutes": 60
      }
    ],
    "notes": "8個, 每個生坯：約90g 。 原食譜水是80g，我試用70g做，已需要打差不多半小時，改為70g",
    "privateNotes": "8個, 每個生坯：約90g 。 原食譜水是80g，我試用70g做，已需要打差不多半小時，改為70g",
    "rating": 4,
    "source": "Recipe Box",
    "isFavorite": false,
    "createdAt": 1786611795705,
    "updatedAt": 1788156847432
  },
  {
    "id": "recipe-box-6-98e41ba1-0410-42c6-b609-e42740aad30e",
    "title": "費南雪 Financier",
    "description": "西式小食美味手作食譜",
    "category": "西式小食",
    "tags": [
      "已成功"
    ],
    "servings": 4,
    "prepTime": 20,
    "cookTime": 30,
    "difficulty": "簡單",
    "coverImage": "https://mriniqvuukgmynunozis.supabase.co/storage/v1/object/public/recipe-images/1784931930277_99tlik.png",
    "ingredients": [
      {
        "id": "ing-5-0-q9f98",
        "name": "蛋白 (約 2 個中型雞蛋)",
        "amount": "60",
        "unit": "g"
      },
      {
        "id": "ing-5-1-k5khc",
        "name": "無鹽牛油",
        "amount": "65",
        "unit": "g"
      },
      {
        "id": "ing-5-2-m15ei",
        "name": "糖粉",
        "amount": "60",
        "unit": "g"
      },
      {
        "id": "ing-5-3-d20kp",
        "name": "杏仁粉",
        "amount": "25",
        "unit": "g"
      },
      {
        "id": "ing-5-4-mscje",
        "name": "低筋麵粉",
        "amount": "25",
        "unit": "g"
      },
      {
        "id": "ing-5-5-2dkt2",
        "name": "蜂蜜",
        "amount": "5",
        "unit": "g"
      },
      {
        "id": "ing-5-6-ueye0",
        "name": "鹽",
        "amount": "1",
        "unit": "g"
      }
    ],
    "steps": [
      {
        "id": "step-1-4yax7",
        "stepNumber": 1,
        "instruction": "將無鹽牛油 65g 放入小鍋中，用中小火加熱融化。 牛油會開始冒大泡泡並發出聲音，接著泡泡會變小，底部開始出現焦黃色的沉澱物（乳固體），同時散發出類似烤榛果的濃郁香氣。一看到顏色變成琥珀色，立刻離火，並將鍋底浸入冷水一秒止沸，避免過焦。 用細濾網過濾掉太粗的焦渣，取 50-55g 放在一旁放涼至微溫（約 40°C–50°C）備用。"
      },
      {
        "id": "step-2-71iwq",
        "stepNumber": 2,
        "instruction": "將低筋麵粉 25g、杏仁粉 25g 、糖粉 60g 、鹽 1g 一起過篩放入大碗中，用打蛋器攪拌均勻。 加入蛋白 60g 和蜂蜜 5g ，用打蛋器順著同一個方向輕輕攪拌均勻，直到看不見乾粉、質地滑順即可。（注意：順攪即可，不要用力過度打入太多空氣"
      },
      {
        "id": "step-3-i8j5l",
        "stepNumber": 3,
        "instruction": "將微溫的焦香奶油分 2-3 次倒入麵糊中，每次都輕輕攪拌均勻，讓油脂完全融入麵糊。 完成後的麵糊會呈現非常亮麗、絲滑的狀態。"
      },
      {
        "id": "step-4-jqp3w",
        "stepNumber": 4,
        "instruction": "靜置（關鍵）：將麵糊蓋上保鮮膜，放入雪櫃冷藏至少 1-2 小時（能冷藏一夜更好），這能讓杏仁粉充分吸收水分，風味更融合，烤出來的質地更濕潤。"
      },
      {
        "id": "step-5-e8bnc",
        "stepNumber": 5,
        "instruction": "預熱烤箱：烤前將烤箱預熱至 190°C。在費南雪模具內塗上薄薄一層融化奶油（食譜份量外），方便脫模。將冷藏的麵糊取出（此時會變濃稠），裝入擠花袋或用湯匙舀入模具中，約 8分滿。 烘烤：放入烤箱中層，以 190°C 烤約 12–15 分鐘。烤到邊緣呈現金黃焦脆，中間高高隆起、上色漂亮即可。出爐後留模 8–10 分鐘再起模",
        "timerMinutes": 15
      }
    ],
    "rating": 5,
    "source": "Recipe Box",
    "isFavorite": true,
    "createdAt": 1784931933212,
    "updatedAt": 1788153247432
  },
  {
    "id": "recipe-box-7-5dd61959-63a5-49bb-8dbf-6fec34b1cc15",
    "title": "黑芝麻卷蛋",
    "description": "28×21cm焗盤\nhttps://www.instagram.com/p/DbCiD9duPfd/",
    "category": "蛋糕",
    "tags": [
      "待試"
    ],
    "servings": 4,
    "prepTime": 30,
    "cookTime": 45,
    "difficulty": "中等",
    "coverImage": "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&q=80&w=800",
    "ingredients": [
      {
        "id": "ing-6-0-54xv3",
        "name": "雞蛋",
        "amount": "5",
        "unit": "隻"
      },
      {
        "id": "ing-6-1-sw6fk",
        "name": "砂糖",
        "amount": "55",
        "unit": "g"
      },
      {
        "id": "ing-6-2-xevww",
        "name": "牛奶",
        "amount": "60",
        "unit": "g"
      },
      {
        "id": "ing-6-3-9lwyp",
        "name": "植物油",
        "amount": "50",
        "unit": "g"
      },
      {
        "id": "ing-6-4-2oabw",
        "name": "低筋麵粉",
        "amount": "50",
        "unit": "g"
      },
      {
        "id": "ing-6-5-c5ej5",
        "name": "黑芝麻粉",
        "amount": "20",
        "unit": "g"
      },
      {
        "id": "ing-6-6-2s80r",
        "name": "檸檬汁",
        "amount": "15",
        "unit": "滴"
      }
    ],
    "steps": [
      {
        "id": "step-1-ykyfx",
        "stepNumber": 1,
        "instruction": "在平烤盤底部及四周鋪好牛油紙），確保紙張貼服。"
      },
      {
        "id": "step-2-b5cd6",
        "stepNumber": 2,
        "instruction": "將植物油 50g 與牛奶 60g 倒入盆中，用手動打蛋器快速攪拌至完全乳化（看不見油星，呈現泛白的液體狀態）"
      },
      {
        "id": "step-3-5n6qb",
        "stepNumber": 3,
        "instruction": "將低筋麵粉 50g 與黑芝麻粉 20g 混合過篩加入拌勻。"
      },
      {
        "id": "step-4-942yl",
        "stepNumber": 4,
        "instruction": "最後加入蛋黃 5隻，拌至滑順流質的麵糊，放置備用"
      },
      {
        "id": "step-5-dt0o4",
        "stepNumber": 5,
        "instruction": "​蛋白中加入15滴檸檬汁，用電動打蛋器中速打發。​將 55g 細砂糖分 3 次加入（出現粗泡時、泡沫變細緻時、出現紋路時）。​狀態確認：打至中性發泡（Soft-medium peaks）。提起打蛋頭時，蛋白霜會呈現一個微微彎曲的「大鳥嘴」狀。千萬不要打到全硬，否則捲蛋糕時極易斷裂。"
      },
      {
        "id": "step-6-jd73g",
        "stepNumber": 6,
        "instruction": "取 1/3 的蛋白霜加入黑芝麻糊中，用刮刀以「切拌」和「翻拌」的手法輕輕混合。​將混合好的麵糊倒回剩下的蛋白霜盆中，繼續輕柔且快速地翻拌均勻，直到顏色一致。"
      },
      {
        "id": "step-7-7oho4",
        "stepNumber": 7,
        "instruction": "將麵糊從較高處倒入鋪好牛油紙的烤盤中，用刮刀將表面完全抹平，確保四個角落都有麵糊。​在桌面上將烤盤重震兩下，震出內部大氣泡。​放入烤箱中層，150度上火 140度下火 焗25分鐘。輕按表面有彈性且不留指印即可出爐。",
        "timerMinutes": 25
      },
      {
        "id": "step-8-rxex4",
        "stepNumber": 8,
        "instruction": "出爐後立刻抓住牛油紙邊緣，將蛋糕片提離烤盤，放在冷涼架上。 → 撕開四邊紙 → 表面蓋新紙保濕 → 微溫時空卷 → 放涼 → 打開抹餡 → 再正式捲 用牛油紙包緊，再包 cling film，放雪櫃 至少 2 小時。"
      },
      {
        "id": "step-9-grtyc",
        "stepNumber": 9,
        "instruction": "抹餡: YOUGURT 打開後倒走表面水。匙羹輕輕拌勻 yogurt。加糖粉攪勻 (只用匙羹或膠刮輕輕拌避免出水) 士多啤梨切好後用廚房紙印乾。即刻抹餡、捲起、雪藏定型。"
      }
    ],
    "notes": "28×21cm焗盤\nhttps://www.instagram.com/p/DbCiD9duPfd/",
    "privateNotes": "28×21cm焗盤\nhttps://www.instagram.com/p/DbCiD9duPfd/",
    "rating": 4,
    "source": "Recipe Box",
    "isFavorite": false,
    "createdAt": 1785359166308,
    "updatedAt": 1788149647432
  },
  {
    "id": "recipe-box-8-791a3419-dbdd-4b2c-b43c-b7ed19f3c070",
    "title": "花生糯米糍",
    "description": "中式食物美味手作食譜",
    "category": "中式食物",
    "tags": [
      "待試"
    ],
    "servings": 4,
    "prepTime": 40,
    "cookTime": 30,
    "difficulty": "中等",
    "coverImage": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800",
    "ingredients": [
      {
        "id": "ing-7-0-fqkr5",
        "name": "糯米粉",
        "amount": "120",
        "unit": "g"
      },
      {
        "id": "ing-7-1-qhzu0",
        "name": "粟粉",
        "amount": "15",
        "unit": "g"
      },
      {
        "id": "ing-7-2-i4yaa",
        "name": "木薯粉",
        "amount": "5",
        "unit": "g"
      },
      {
        "id": "ing-7-3-a1tse",
        "name": "糖粉",
        "amount": "20",
        "unit": "g"
      },
      {
        "id": "ing-7-4-zhysh",
        "name": "全脂牛奶",
        "amount": "185",
        "unit": "g"
      },
      {
        "id": "ing-7-5-b1ged",
        "name": "椰漿",
        "amount": "20",
        "unit": "g"
      },
      {
        "id": "ing-7-6-avxk3",
        "name": "麥芽糖",
        "amount": "8",
        "unit": "g"
      },
      {
        "id": "ing-7-7-kt2eg",
        "name": "植物油",
        "amount": "8",
        "unit": "g"
      },
      {
        "id": "ing-7-8-za4fl",
        "name": "熟花生",
        "amount": "80",
        "unit": "g"
      },
      {
        "id": "ing-7-9-w2h78",
        "name": "乾椰絲",
        "amount": "15",
        "unit": "g"
      },
      {
        "id": "ing-7-10-5zi2g",
        "name": "熟芝麻",
        "amount": "10",
        "unit": "g"
      },
      {
        "id": "ing-7-11-k1lx8",
        "name": "融化牛油",
        "amount": "8",
        "unit": "g"
      },
      {
        "id": "ing-7-12-gpm8y",
        "name": "糖",
        "amount": "25",
        "unit": "g"
      }
    ],
    "steps": [
      {
        "id": "step-1-nqgg8",
        "stepNumber": 1,
        "instruction": "花生 80g 以 150°C 焗 8 分鐘，完全放涼。放入保鮮袋中，用擀麵棍壓碎: 56g（約70%）壓成粗碎 → 約芝麻到綠豆大��，有口感。 24g（約30%）打成細碎粉狀 → 接近花生粉，但不用細到像麵粉。 將花生碎 + 椰絲 15g + 白砂糖 25g + 熟白芝麻 10g + 融化牛油 8g 混合拌後冷藏15分鐘。",
        "timerMinutes": 8
      },
      {
        "id": "step-2-2gcni",
        "stepNumber": 2,
        "instruction": "取 20g 許全脂牛奶微微加熱，放入 8g 麥芽糖漿攪拌至完全融化。"
      },
      {
        "id": "step-3-hl15h",
        "stepNumber": 3,
        "instruction": "將所有粉類（糯米粉 120g、粟粉 15g、木薯粉 5g、糖粉 20g）混合。"
      },
      {
        "id": "step-4-kbt63",
        "stepNumber": 4,
        "instruction": "倒入牛奶 165g、椰漿 20g，以及剛才融化了麥芽糖的牛奶，攪拌均勻至無顆粒狀態。（建議過篩一次，麵糊會更細膩）"
      },
      {
        "id": "step-5-1h9cm",
        "stepNumber": 5,
        "instruction": "找一個較淺的寬口盤 (蒸盤厚度 ≤2cm)，倒入麵糊，蓋上保鮮膜（並用牙籤在表面戳幾個小洞透氣）。放入蒸鍋，水滾後大火蒸約 18–22 分鐘，直到✔ 中央完全透明 ✔ 插竹籤無白漿",
        "timerMinutes": 22
      },
      {
        "id": "step-6-x42wd",
        "stepNumber": 6,
        "instruction": "麵團蒸熟出爐後，趁熱將 8g 無味植物油 倒在麵團表面。 放 3–5 分鐘 到雙手能承受的溫度後，戴上防沾手套，將油慢慢揉進麵團中。 一開始會覺得油麵分離，請耐心反覆拉扯、揉捏，直到麵團把油完全吸收，變得光滑有彈性即可。將揉好的麵團用保鮮膜貼著表面包緊，放涼備用（或冷藏 20 分鐘讓它不那麼黏手）。",
        "timerMinutes": 5
      },
      {
        "id": "step-7-hkxub",
        "stepNumber": 7,
        "instruction": "將麵團平均分成每份約 30 g 的小麵糰。 將小麵糰壓扁，邊緣捏薄，包入約 10-15g 的花生椰絲��。 利用虎口慢慢向上收攏，將收口處捏緊捏死，防止餡料漏出。放室溫休息 20 分鐘。 將包好的糯米糍放入裝有椰絲的盤子中滾動，輕輕按壓讓椰絲均勻黏附。放密封盒（不要雪）",
        "timerMinutes": 20
      }
    ],
    "rating": 4,
    "source": "Recipe Box",
    "isFavorite": false,
    "createdAt": 1784931363341,
    "updatedAt": 1788146047433
  },
  {
    "id": "recipe-box-9-82c7bde8-6645-40be-b644-86a710da11d0",
    "title": "合桃曲奇",
    "description": "西式小食美味手作食譜",
    "category": "西式小食",
    "tags": [
      "已成功"
    ],
    "servings": 4,
    "prepTime": 20,
    "cookTime": 30,
    "difficulty": "簡單",
    "coverImage": "https://mriniqvuukgmynunozis.supabase.co/storage/v1/object/public/recipe-images/1784932144151_e5m0q0.png",
    "ingredients": [
      {
        "id": "ing-8-0-lje5b",
        "name": "自發粉",
        "amount": "160",
        "unit": "g"
      },
      {
        "id": "ing-8-1-nlny4",
        "name": "核桃",
        "amount": "70",
        "unit": "g"
      },
      {
        "id": "ing-8-2-h06da",
        "name": "糖粉",
        "amount": "70",
        "unit": "g"
      },
      {
        "id": "ing-8-3-3l2om",
        "name": "牛油 (室溫軟化)",
        "amount": "90",
        "unit": "g"
      },
      {
        "id": "ing-8-4-5ereq",
        "name": "蛋黃",
        "amount": "1",
        "unit": "個"
      },
      {
        "id": "ing-8-5-upjps",
        "name": "鹽",
        "amount": "1",
        "unit": "g"
      }
    ],
    "steps": [
      {
        "id": "step-1-6sc8x",
        "stepNumber": 1,
        "instruction": "核桃 70g 用 150°C 焗 5–8 分鐘至出香氣，放涼備用。\n自發粉 160g、鹽 1g 混合過篩",
        "timerMinutes": 8
      },
      {
        "id": "step-2-5056o",
        "stepNumber": 2,
        "instruction": "牛油 90g，加入糖粉 70g，用電��打蛋器稍微打至順滑、顏色略變淺（不用過度打發，否則烤的時候會過度攤平）。"
      },
      {
        "id": "step-3-vigto",
        "stepNumber": 3,
        "instruction": "加入蛋黃 1個 拌勻。"
      },
      {
        "id": "step-4-soei3",
        "stepNumber": 4,
        "instruction": "倒入過篩的自發粉 160g 和放涼的核桃碎，用刮刀以「切拌」方式混合至無粉粒（切忌過度揉麵，以免出筋變硬）。"
      },
      {
        "id": "step-5-ysspt",
        "stepNumber": 5,
        "instruction": "秤重分出每個 18–20g，搓圓排好，用大拇指在中間輕輕壓一個凹槽。放入已170°C的焗爐烘烤12–15 分鐘。烤好後必須在烤盤上完全放涼（約 15–20 分鐘）定型，餅乾才會變得酥脆結實",
        "timerMinutes": 15
      }
    ],
    "rating": 5,
    "source": "Recipe Box",
    "isFavorite": true,
    "createdAt": 1784932130932,
    "updatedAt": 1788142447433
  },
  {
    "id": "recipe-box-10-bd40a4dc-0920-46ec-923c-e3695355bc6f",
    "title": "棋子餅",
    "description": "中式食物美味手作食譜",
    "category": "中式食物",
    "tags": [
      "待改善"
    ],
    "servings": 4,
    "prepTime": 40,
    "cookTime": 30,
    "difficulty": "中等",
    "coverImage": "https://mriniqvuukgmynunozis.supabase.co/storage/v1/object/public/recipe-images/1784931038715_fkj5xf.png",
    "ingredients": [
      {
        "id": "ing-9-0-c1j4l",
        "name": "無鹽牛油 (軟化至像軟膏狀)",
        "amount": "200",
        "unit": "g"
      },
      {
        "id": "ing-9-1-8hiw4",
        "name": "糖霜",
        "amount": "80",
        "unit": "g"
      },
      {
        "id": "ing-9-2-qszsq",
        "name": "蛋黃  (約 3 隻大蛋黃)",
        "amount": "60",
        "unit": "g"
      },
      {
        "id": "ing-9-3-or4t8",
        "name": "Golden Syrup",
        "amount": "48",
        "unit": "g"
      },
      {
        "id": "ing-9-4-njvh3",
        "name": "雲呢拿香油 (可選)",
        "amount": "3",
        "unit": "滴"
      },
      {
        "id": "ing-9-5-vheth",
        "name": "中筋麵粉",
        "amount": "280",
        "unit": "g"
      },
      {
        "id": "ing-9-6-ji054",
        "name": "粟粉",
        "amount": "120",
        "unit": "g"
      },
      {
        "id": "ing-9-7-ppb0i",
        "name": "奶粉",
        "amount": "40",
        "unit": "g"
      },
      {
        "id": "ing-9-8-g04pl",
        "name": "餡料",
        "amount": "450",
        "unit": "g"
      }
    ],
    "steps": [
      {
        "id": "step-1-g8shc",
        "stepNumber": 1,
        "instruction": "將蓮蓉/豆沙放入不沾平底鍋，用中小火翻炒，過程中加入少許油（���花生油或牛油）。炒到餡料變成一團、不黏刮刀、且摸起來質感紮實（像橡皮泥）即可。 冷卻： 炒好後必須完全放涼才能開始包，否則餘溫會讓餅皮的牛油融化，導致餅皮變得過於軟爛。"
      },
      {
        "id": "step-2-94pc4",
        "stepNumber": 2,
        "instruction": "牛油 200g + 糖霜 80g 拌至順滑即可 ❌ 不需要打發"
      },
      {
        "id": "step-3-9t7hl",
        "stepNumber": 3,
        "instruction": "加入蛋黃 3隻、Golden syrup 48g、雲呢拿油👉 用手動打蛋器拌勻至柔滑，質地像軟花生醬"
      },
      {
        "id": "step-4-gm2b3",
        "stepNumber": 4,
        "instruction": "篩入中筋麵粉 280g + 粟粉 120g + 奶粉 40g  拌至成團即可 ❌ 不要過度搓揉 麵團應該：✔ 不黏手 ✔ 可按壓不裂 ✔ 像軟橡皮泥 👉 包保鮮紙 ❄ 雪櫃 30 分鐘",
        "timerMinutes": 30
      },
      {
        "id": "step-5-mxejt",
        "stepNumber": 5,
        "instruction": "從雪櫃拿出來後，您可以在室溫下讓它多鬆弛（Rest）10–15 分鐘再開始分切包餡。 包餡 : 皮 : 餡 = 約 25g : 15g (⚠ 先分好餡料再取麵粉) 皮壓扁 👉 包入餡料 👉 搓圓 👉 放入元寶模壓形 ❄ 放冰格 15 分鐘（關鍵‼）",
        "timerMinutes": 15
      },
      {
        "id": "step-6-7z73l",
        "stepNumber": 6,
        "instruction": "165°C, 先焗 8 分鐘 定形，取出放涼 5 分鐘，掃薄蛋液 (蛋液過篩一次) (只掃在餅皮的「凸起處」即可)，再焗 8-10 分鐘 至金黃 (如果發現表面上色太快，可以將溫度調低 10°C 續焗。)",
        "timerMinutes": 8
      }
    ],
    "rating": 3,
    "source": "Recipe Box",
    "isFavorite": false,
    "createdAt": 1784931012894,
    "updatedAt": 1788138847433
  },
  {
    "id": "recipe-box-11-5127fe6d-66ea-4a8e-b8cb-6e00b5fddb94",
    "title": "蛋黃酥",
    "description": "無水奶油 - 100% butter ghee: Natco Pure Butter Ghee is 99.8%\n20 顆",
    "category": "中式食物",
    "tags": [
      "待試"
    ],
    "servings": 4,
    "prepTime": 40,
    "cookTime": 30,
    "difficulty": "中等",
    "coverImage": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800",
    "ingredients": [
      {
        "id": "ing-10-0-zk6kc",
        "name": "低筋麵粉",
        "amount": "315",
        "unit": "g"
      },
      {
        "id": "ing-10-1-7o3vd",
        "name": "糖粉",
        "amount": "25",
        "unit": "g"
      },
      {
        "id": "ing-10-2-xn77o",
        "name": "無水奶油 (Natco Pure Butter Ghee)",
        "amount": "140",
        "unit": "g"
      },
      {
        "id": "ing-10-3-5gaw5",
        "name": "冷水",
        "amount": "57",
        "unit": "g"
      },
      {
        "id": "ing-10-4-k8gto",
        "name": "鹽",
        "amount": "1",
        "unit": "g"
      },
      {
        "id": "ing-10-5-wdogr",
        "name": "豆沙",
        "amount": "30",
        "unit": "g"
      },
      {
        "id": "ing-10-6-ygy21",
        "name": "鹹蛋黃",
        "amount": "20",
        "unit": "個"
      }
    ],
    "steps": [
      {
        "id": "step-1-l32ag",
        "stepNumber": 1,
        "instruction": "鹹蛋黃處理:  鹹蛋黃表面噴／薄薄沾上米酒，主要是去腥。放在烤盤上。180°C 烤約8分鐘。(目標是半熟，不要烤到乾硬、出大量油。)",
        "timerMinutes": 8
      },
      {
        "id": "step-2-2kes6",
        "stepNumber": 2,
        "instruction": "A. 油皮:  低筋麵粉 150g + 糖粉25g + 鹽1g 先混合。加入無水奶油 65g 拌勻。分次加入冷水。揉至麵糰均勻、有延展性。蓋好保鮮膜，鬆弛約15分鐘。\nB: 油酥: 低筋麵粉 165g＋無水奶油 75g 混合成均勻麵糰即可。不需要揉出筋性",
        "timerMinutes": 15
      },
      {
        "id": "step-3-x8ihn",
        "stepNumber": 3,
        "instruction": "分割\n油皮：20份 × 15g\n油酥：20份 × 12g\n油皮包住油酥。"
      },
      {
        "id": "step-4-3d35d",
        "stepNumber": 4,
        "instruction": "第一次桿捲\n每個麵糰：\n1. 壓扁。\n2. 桿成長橢圓形。\n3. 從上往下捲起。收口向下。\n4. 蓋保鮮膜鬆弛 至少10分鐘。",
        "timerMinutes": 10
      },
      {
        "id": "step-5-ojesk",
        "stepNumber": 5,
        "instruction": "第二次桿捲\n1. 將麵糰轉90°。\n2. 再桿長。再捲一次。收口向下。\n3. 再鬆弛 至少10分鐘。",
        "timerMinutes": 10
      },
      {
        "id": "step-6-4ssj3",
        "stepNumber": 6,
        "instruction": "包餡\n30g 烏豆沙＋1顆鹹蛋黃\n烏豆沙壓扁 → 放鹹蛋黃 → 用虎口慢慢收口 → 搓圓。\n\n190°C / 190°C，約25–30分鐘",
        "timerMinutes": 30
      }
    ],
    "notes": "無水奶油 - 100% butter ghee: Natco Pure Butter Ghee is 99.8%\n20 顆",
    "privateNotes": "無水奶油 - 100% butter ghee: Natco Pure Butter Ghee is 99.8%\n20 顆",
    "rating": 4,
    "source": "Recipe Box",
    "isFavorite": false,
    "createdAt": 1786609619793,
    "updatedAt": 1788135247433
  },
  {
    "id": "recipe-box-12-8ff29ba6-700f-4b3f-ae01-4efdd473361e",
    "title": "橙香朱古力大理石磅蛋糕",
    "description": "蛋糕美味手作食譜",
    "category": "蛋糕",
    "tags": [
      "待試"
    ],
    "servings": 4,
    "prepTime": 30,
    "cookTime": 45,
    "difficulty": "中等",
    "coverImage": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800",
    "ingredients": [
      {
        "id": "ing-11-0-pzrxw",
        "name": "無鹽牛油 (室溫軟化)",
        "amount": "180",
        "unit": "g"
      },
      {
        "id": "ing-11-1-gj7bt",
        "name": "細砂糖",
        "amount": "160",
        "unit": "g"
      },
      {
        "id": "ing-11-2-ndidc",
        "name": "鹽",
        "amount": "1",
        "unit": "g"
      },
      {
        "id": "ing-11-3-n8zbq",
        "name": "橙皮屑 (1.5 至 2 個橙的份量)",
        "amount": "",
        "unit": ""
      },
      {
        "id": "ing-11-4-iwvqd",
        "name": "雞蛋",
        "amount": "3",
        "unit": "隻"
      },
      {
        "id": "ing-11-5-rs1ys",
        "name": "低筋麵粉",
        "amount": "185",
        "unit": "g"
      },
      {
        "id": "ing-11-6-9dsik",
        "name": "泡打粉",
        "amount": "5",
        "unit": "g"
      },
      {
        "id": "ing-11-7-8b2ni",
        "name": "全脂牛奶 (室溫)",
        "amount": "45",
        "unit": "g"
      },
      {
        "id": "ing-11-8-wvxlw",
        "name": "橙汁 (室溫)",
        "amount": "25",
        "unit": "g"
      },
      {
        "id": "ing-11-9-nqju0",
        "name": "orange extract",
        "amount": "0.25",
        "unit": "TSP"
      },
      {
        "id": "ing-11-10-1b76u",
        "name": "希臘乳酪 (室溫) (FAGE 5%，倒去水分)",
        "amount": "25",
        "unit": "g"
      },
      {
        "id": "ing-11-11-eryzr",
        "name": "無糖可可粉",
        "amount": "15",
        "unit": "g"
      },
      {
        "id": "ing-11-12-tu1wp",
        "name": "熱牛奶",
        "amount": "35",
        "unit": "g"
      },
      {
        "id": "ing-11-13-se1qg",
        "name": "無鹽牛油",
        "amount": "10",
        "unit": "g"
      },
      {
        "id": "ing-11-14-aj7nr",
        "name": "糖",
        "amount": "8",
        "unit": "g"
      }
    ],
    "steps": [
      {
        "id": "step-1-vbr0q",
        "stepNumber": 1,
        "instruction": "準備模具與預熱\n底部及兩側長邊鋪上牛油紙，紙張需高出模邊 2–3cm。預熱焗爐至 160°C。牛奶、橙汁及乳酪先室溫放半小時"
      },
      {
        "id": "step-2-ea10k",
        "stepNumber": 2,
        "instruction": "製作朱古力醬\n將 15g 可可粉與 8g 糖混合，倒入 35g 熱牛奶拌勻。趁熱加入 10g 牛油攪拌至呈現光滑濃稠的醬狀。完全放涼備用。"
      },
      {
        "id": "step-3-6xctl",
        "stepNumber": 3,
        "instruction": "打發牛油\n確認牛油軟化至手指按壓有凹位。先將橙皮屑和砂糖用手搓香，再加牛油及鹽屑打發至顏色泛白、呈蓬鬆的羽毛忌廉狀。`"
      },
      {
        "id": "step-4-ckh0s",
        "stepNumber": 4,
        "instruction": "雞蛋打散並過篩。將蛋液分 5–6 次加入打發好的牛油中，每次高速打發至完全吸收：打到看不見滑滑的蛋液、盆邊沒有油水分離才加下一次。（如邊緣開始油水分離，立刻加 1 湯匙低筋麵粉拌勻救場）。"
      },
      {
        "id": "step-5-s837z",
        "stepNumber": 5,
        "instruction": "粉液交錯： 低筋麵粉與泡打粉混合過篩。另將牛奶、橙汁、乳酪及 orange extract 混合。用刮刀按「1/3粉類 → 1/2液體 → 1/3粉類 → 1/2液體 → 1/3粉類」的次序，輕柔翻拌至拌到無乾粉就停"
      },
      {
        "id": "step-6-d55tz",
        "stepNumber": 6,
        "instruction": "大理石調色： 取出約 1/4 的白麵糊，加入已放涼的朱古力醬，輕柔拌勻至表面有光澤且不乾硬"
      },
      {
        "id": "step-7-inb7a",
        "stepNumber": 7,
        "instruction": "入模畫紋： 將白麵糊與朱古力麵糊交錯層疊放入模具（最多裝 7 分滿，剩餘麵糊可裝入紙杯）。用竹籤插到底，Z字形劃 2–3次就停，切忌過度畫圈。\n\n上下火 160°C 焗 45–55 分鐘。約 30 分鐘時若表面已上色，蓋上錫紙防焦。竹籤插入中心，拔出有��量濕潤蛋糕碎 （濕碎可以，濕漿不可以） 即可出爐。出爐後連同牛油紙將蛋糕提出，室溫靜置 15–20 分鐘。微暖時用保鮮紙將其嚴密包裹鎖住水氣，靜置至完全冷卻後即可切片。",
        "timerMinutes": 55
      }
    ],
    "rating": 4,
    "source": "Recipe Box",
    "isFavorite": false,
    "createdAt": 1786645985381,
    "updatedAt": 1788131647433
  },
  {
    "id": "recipe-box-13-1cd786d8-fddb-492c-ab1f-b42609caf1f1",
    "title": "花生酥",
    "description": "中式食物美味手作食譜",
    "category": "中式食物",
    "tags": [
      "已成功"
    ],
    "servings": 4,
    "prepTime": 40,
    "cookTime": 30,
    "difficulty": "中等",
    "coverImage": "https://mriniqvuukgmynunozis.supabase.co/storage/v1/object/public/recipe-images/1784931661580_tjoo51.png",
    "ingredients": [
      {
        "id": "ing-12-0-89ztd",
        "name": "Self Raising Flour",
        "amount": "185",
        "unit": "g"
      },
      {
        "id": "ing-12-1-8z72b",
        "name": "鹽",
        "amount": "1",
        "unit": "g"
      },
      {
        "id": "ing-12-2-szmq9",
        "name": "滑順花生醬",
        "amount": "93",
        "unit": "g"
      },
      {
        "id": "ing-12-3-qxuea",
        "name": "糖粉",
        "amount": "60",
        "unit": "g"
      },
      {
        "id": "ing-12-4-07ncl",
        "name": "花生油",
        "amount": "50",
        "unit": "ml"
      },
      {
        "id": "ing-12-5-yx9c0",
        "name": "無鹽牛油 或 豬油 (放常溫稍微軟化）",
        "amount": "60",
        "unit": "g"
      },
      {
        "id": "ing-12-6-0fqtt",
        "name": "花生碎",
        "amount": "53",
        "unit": "g"
      },
      {
        "id": "ing-12-7-ybbf3",
        "name": "蛋黃",
        "amount": "1",
        "unit": "個"
      },
      {
        "id": "ing-12-8-73pqc",
        "name": "蛋黃 (表面裝飾)",
        "amount": "1",
        "unit": "個"
      }
    ],
    "steps": [
      {
        "id": "step-1-9n0xc",
        "stepNumber": 1,
        "instruction": "白鑊小火炒香花生 53g ，開極小火不停翻炒 15–20 分鐘。聞到濃郁花生香、皮變深且開始微裂時撈出，放涼，去皮，用擀麵棍壓碎，保留碎粒感，不要壓成粉。",
        "timerMinutes": 20
      },
      {
        "id": "step-2-9k9dn",
        "stepNumber": 2,
        "instruction": "將軟化的固態油（牛油或豬油 60g）與糖粉 60g、鹽 1g 一同放入盆中，用打蛋器或刮刀攪打至顏色稍微變淺、呈現乳霜狀（不用過度打發，均勻滑順即可）。加入花生醬 93g 和蛋黃1個 攪順，繼續攪拌均勻。接著倒入 50ml 花生油，攪拌至油脂完全吸收。"
      },
      {
        "id": "step-3-vkvrd",
        "stepNumber": 3,
        "instruction": "篩入 Self Raising Flour 185g＋1g 鹽，倒入自炒花生碎。 用刮刀壓拌成團（不要揉)"
      },
      {
        "id": "step-4-mqzmj",
        "stepNumber": 4,
        "instruction": "每份 25–28g，搓圓輕壓。"
      },
      {
        "id": "step-5-8pjz8",
        "stepNumber": 5,
        "instruction": "刷一層薄蛋黃液 (蛋黃 1個＋水 1茶匙)。\n\nFan Oven : 150°C -16–18分鐘 ｜ Top & Bottom :160°C - 18–20分鐘 見邊位微裂、底部淡金黃即出。 放室溫靜置 15–20分鐘定型再移動",
        "timerMinutes": 18
      }
    ],
    "rating": 5,
    "source": "Recipe Box",
    "isFavorite": true,
    "createdAt": 1784931664392,
    "updatedAt": 1788128047433
  },
  {
    "id": "recipe-box-14-15ca9e87-bff8-4762-ab81-e355d4ccf477",
    "title": "月餅",
    "description": "轉化糖漿是Invert Sugar Syrup / Invert Syrup / Mooncake Syrup",
    "category": "中式食物",
    "tags": [
      "待試"
    ],
    "servings": 4,
    "prepTime": 40,
    "cookTime": 30,
    "difficulty": "中等",
    "coverImage": "https://images.unsplash.com/photo-1568254183919-78a4f43a2877?auto=format&fit=crop&q=80&w=800",
    "ingredients": [
      {
        "id": "ing-13-0-tw5xb",
        "name": "中筋麵粉",
        "amount": "122",
        "unit": "g"
      },
      {
        "id": "ing-13-1-8lsel",
        "name": "轉化糖漿",
        "amount": "82",
        "unit": "g"
      },
      {
        "id": "ing-13-2-ezxvj",
        "name": "花生油",
        "amount": "18",
        "unit": "g"
      },
      {
        "id": "ing-13-3-52bt0",
        "name": "梘水",
        "amount": "1.2",
        "unit": "g"
      },
      {
        "id": "ing-13-4-vus00",
        "name": "白蓮蓉",
        "amount": "400",
        "unit": "g"
      },
      {
        "id": "ing-13-5-fhcz1",
        "name": "鹹蛋黃",
        "amount": "176",
        "unit": "g"
      }
    ],
    "steps": [
      {
        "id": "step-1-m7fcc",
        "stepNumber": 1,
        "instruction": "製作月餅皮\n82g糖漿＋18g花生油＋1.2g梘水 拌勻。然後把 122g中筋麵粉堆成小山，中間開洞。倒入糖漿混合物，用刮刀逐步將麵粉刮入糖漿。搓至成為均勻的月餅麵糰。"
      },
      {
        "id": "step-2-8hsly",
        "stepNumber": 2,
        "instruction": "靜置\n放室溫約：2小時讓麵糰充分起筋，令餅皮有韌性，不會過分鬆軟"
      },
      {
        "id": "step-3-ceudr",
        "stepNumber": 3,
        "instruction": "處理餡料\n鹹蛋黃：略蒸約2分鐘後放涼。然後秤重，將蛋黃分成：約11g x 16份 \n400g白蓮蓉分成：25g × 16\n25g白蓮蓉壓平。放入約11g鹹蛋黃。慢慢將蓮蓉包住蛋黃，搓圓。",
        "timerMinutes": 2
      },
      {
        "id": "step-4-sk7ub",
        "stepNumber": 4,
        "instruction": "224g麵糰分成14g × 16的餅皮，像餃子皮一樣，一邊轉動，一邊由中央向外推薄。不要把中央壓得太薄。餅皮包住蓮蓉蛋黃餡。慢慢收口，搓成略長的形狀。"
      },
      {
        "id": "step-5-pl5bw",
        "stepNumber": 5,
        "instruction": "入月餅模\n模內撒非常少���麵粉。放入月餅胚。用掌心壓實，取出月餅。"
      },
      {
        "id": "step-6-7sizw",
        "stepNumber": 6,
        "instruction": "烘焗\n第一段: 220°C｜2分鐘取出。掃一層非常薄的蛋漿。\n第二段: 160°C｜18分鐘 完成。",
        "timerMinutes": 2
      },
      {
        "id": "step-7-2izkp",
        "stepNumber": 7,
        "instruction": "回油\n出爐後室溫放置約2日。"
      }
    ],
    "notes": "轉化糖漿是Invert Sugar Syrup / Invert Syrup / Mooncake Syrup",
    "privateNotes": "轉化糖漿是Invert Sugar Syrup / Invert Syrup / Mooncake Syrup",
    "rating": 4,
    "source": "Recipe Box",
    "isFavorite": false,
    "createdAt": 1787091000006,
    "updatedAt": 1788124447433
  }
];
