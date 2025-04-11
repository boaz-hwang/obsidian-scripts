const { google } = require("googleapis");
const path = require("path");

(async () => {
  const auth = new google.auth.GoogleAuth({
    keyFile: path.join(__dirname, "credentials.json"),
    scopes: ["https://www.googleapis.com/auth/calendar.readonly"],
  });

  const calendar = google.calendar({ version: "v3", auth });

  const now = new Date();
  const startOfDay = new Date(now.setHours(0, 0, 0, 0)).toISOString();
  const endOfDay = new Date(now.setHours(23, 59, 59, 999)).toISOString();

  const calendarIds = [
    "b270153a64665cb6607d9d8feb37bdb481f54f18a3f3a2fc91367d3d6105988d@group.calendar.google.com",
    "hkc7180@gmail.com",
  ];

  let allEvents = [];

  for (const calendarId of calendarIds) {
    const res = await calendar.events.list({
      calendarId,
      timeMin: startOfDay,
      timeMax: endOfDay,
      singleEvents: true,
      orderBy: "startTime",
    });
    allEvents = allEvents.concat(res.data.items || []);
  }

  // 중복 제거
  const seen = new Set();
  const dedupedEvents = allEvents.filter((event) => {
    const start = new Date(
      event.start.dateTime || event.start.date
    ).toISOString();
    const end = new Date(event.end.dateTime || event.end.date).toISOString();
    const title = event.summary || "제목 없음";
    const key = `${title}-${start}-${end}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  if (dedupedEvents.length === 0) {
    console.log("- 오늘은 일정이 없습니다.");
    return;
  }

  // 시간 정렬
  dedupedEvents.sort(
    (a, b) =>
      new Date(a.start.dateTime || a.start.date) -
      new Date(b.start.dateTime || b.start.date)
  );

  // 타임라인 범위 계산
  const firstEventStart = new Date(
    dedupedEvents[0].start.dateTime || dedupedEvents[0].start.date
  );
  const lastEventEnd = new Date(
    dedupedEvents[dedupedEvents.length - 1].end.dateTime ||
      dedupedEvents[dedupedEvents.length - 1].end.date
  );

  // 15분 단위 슬롯 만들기
  const slots = [];
  const current = new Date(firstEventStart);
  while (current < lastEventEnd) {
    const slotStart = new Date(current);
    current.setMinutes(current.getMinutes() + 15);
    const slotEnd = new Date(current);
    const matchedEvent = dedupedEvents.find((event) => {
      const start = new Date(event.start.dateTime || event.start.date);
      const end = new Date(event.end.dateTime || event.end.date);
      return slotStart >= start && slotStart < end;
    });

    slots.push({
      start: new Date(slotStart),
      end: new Date(slotEnd),
      title: matchedEvent?.summary || null,
    });
  }

  // 연속된 슬롯을 묶기
  const merged = [];
  let temp = slots[0];
  for (let i = 1; i < slots.length; i++) {
    const curr = slots[i];
    const isSame = temp.title === curr.title;
    const isContinuous = temp.end.getTime() === curr.start.getTime();

    if (isSame && isContinuous) {
      temp.end = curr.end;
    } else {
      merged.push(temp);
      temp = curr;
    }
  }
  merged.push(temp);

  // 출력

  // 출력
  const output = merged.map((block, idx) => {
    const format = (d) => {
      const h = d.getHours();
      const m = d.getMinutes();
      return m === 0 ? `${h}시` : `${h}시 ${m.toString().padStart(2, "0")}분`;
    };

    const line = `- ${format(block.start)} - ${format(block.end)} ${
      block.title || ""
    }`;

    // 첫 줄은 그대로, 그 이후는 "> -" 접두어 추가
    return idx === 0 ? line : `> ${line}`;
  });

  // [!Todos] 블록 제목 포함
  console.log(output.join("\n"));
})();
