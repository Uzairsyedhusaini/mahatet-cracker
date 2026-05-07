type RawQuestion = {
  question_number: string;
  question: string;
  options: Record<string, string>;
  answer: string;
  explanation?: string;
};

type RawSection = {
  context?: string;
  questions: RawQuestion[];
};

type QuizData = RawSection[] | RawQuestion[];

type QuizParams = {
  paper?: string;
  paperType?: string;
  subject?: string;
  year?: string;
};

type QuizLoader = () => QuizData | null;

type QuizEntry = {
  paperLabel: string;
  paperTypeLabel: string; // "" for Paper 1
  subjectLabel: string;
  year: string;
  key: string;
  loader: QuizLoader;
};

const normalize = (value: string) =>
  value.trim().toLowerCase().replace(/\s+/g, "-");

const makeKey = (
  paper: string,
  paperType: string,
  subject: string,
  year: string
) =>
  [
    normalize(paper),
    normalize(paperType || "default"),
    normalize(subject),
    normalize(year),
  ].join("|");

const safeLoad = (loader: () => unknown, label: string): QuizData | null => {
  try {
    const loaded = loader();
    const data = (loaded as any)?.default ?? loaded;

    if (!Array.isArray(data)) {
      console.log(`⚠️ Quiz JSON is not an array: ${label}`);
      return null;
    }

    return data as QuizData;
  } catch (error) {
    console.log(`❌ Failed to load quiz JSON: ${label}`, error);
    return null;
  }
};

  

const QUIZ_LOADERS: Record<string, QuizLoader> = {};
const QUIZ_ENTRIES: QuizEntry[] = [];

const registerQuiz = (
  paper: string,
  paperType: string,
  subject: string,
  year: string,
  loader: QuizLoader
) => {
  const key = makeKey(paper, paperType, subject, year);

  QUIZ_LOADERS[key] = loader;
  QUIZ_ENTRIES.push({
    paperLabel: paper,
    paperTypeLabel: paperType,
    subjectLabel: subject,
    year,
    key,
    loader,
  });
};

// =========================
// PAPER 1
// =========================
registerQuiz("Paper 1", "", "Urdu", "2025", () =>
  safeLoad(() => require("./paper1/urdu/2025.json"), "paper1/urdu/2025")
);

registerQuiz("Paper 1", "", "English", "2025", () =>
  safeLoad(() => require("./paper1/english/2025.json"), "paper1/english/2025")
);

registerQuiz("Paper 1", "", "Maths", "2025", () =>
  safeLoad(() => require("./paper1/maths/2025.json"), "paper1/maths/2025")
);

registerQuiz("Paper 1", "", "CDP", "2025", () =>
  safeLoad(() => require("./paper1/cdp/2025.json"), "paper1/cdp/2025")
);

// =========================
// PAPER 2 → MATHS-SCIENCE
// =========================
registerQuiz("Paper 2", "Maths-Science", "Urdu", "2025", () =>
  safeLoad(
    () => require("./paper2/maths-science/urdu/2025.json"),
    "paper2/maths-science/urdu/2025"
  )
);

registerQuiz("Paper 2", "Maths-Science", "English", "2025", () =>
  safeLoad(
    () => require("./paper2/maths-science/english/2025.json"),
    "paper2/maths-science/english/2025"
  )
);

registerQuiz("Paper 2", "Maths-Science", "Maths", "2025", () =>
  safeLoad(
    () => require("./paper2/maths-science/maths/2025.json"),
    "paper2/maths-science/maths/2025"
  )
);

registerQuiz("Paper 2", "Maths-Science", "CDP", "2025", () =>
  safeLoad(
    () => require("./paper2/maths-science/cdp/2025.json"),
    "paper2/maths-science/cdp/2025"
  )
);

registerQuiz("Paper 2", "Maths-Science", "Science", "2025", () =>
  safeLoad(
    () => require("./paper2/maths-science/science/2025.json"),
    "paper2/maths-science/science/2025"
  )
);

// =========================
// PAPER 2 → SOCIAL SCIENCE
// NOTE: folder name must match your actual folder exactly.
// =========================
registerQuiz("Paper 2", "Social Science", "Urdu", "2025", () =>
  safeLoad(
    () => require("./paper2/social science/urdu/2025.json"),
    "paper2/social science/urdu/2025"
  )
);

registerQuiz("Paper 2", "Social Science", "English", "2025", () =>
  safeLoad(
    () => require("./paper2/social science/english/2025.json"),
    "paper2/social science/english/2025"
  )
);

registerQuiz("Paper 2", "Social Science", "CDP", "2025", () =>
  safeLoad(
    () => require("./paper2/social science/cdp/2025.json"),
    "paper2/social science/cdp/2025"
  )
);

registerQuiz("Paper 2", "Social Science", "Social Science", "2025", () =>
  safeLoad(
    () => require("./paper2/social science/social science/2025.json"),
    "paper2/social science/social science/2025"
  )
);

// =========================
// PUBLIC API
// =========================
export function getQuizData(params: QuizParams): QuizData | null {
  try {
    const paper = params.paper?.trim() || "";
    const paperType = params.paperType?.trim() || "";
    const subject = params.subject?.trim() || "";
    const year = params.year?.trim() || "";

    if (!paper || !subject || !year) {
      console.log("❌ Missing quiz params");
      return null;
    }

    const key = makeKey(paper, paperType, subject, year);
    const loader = QUIZ_LOADERS[key];

    if (!loader) {
      console.log("⚠️ No quiz loader registered for:", key);
      return null;
    }

    const data = loader();

    if (!data || !Array.isArray(data) || data.length === 0) {
      console.log("⚠️ Quiz data empty or unavailable for:", key);
      return null;
    }

    return data;
  } catch (error) {
    console.log("🔥 getQuizData failed:", error);
    return null;
  }
}

export function getAvailablePapers(): string[] {
  const papers = new Set<string>();

  QUIZ_ENTRIES.forEach((entry) => {
    papers.add(entry.paperLabel);
  });

  return Array.from(papers);
}

export function getAvailablePaperTypes(paper: string): string[] {
  const normalizedPaper = normalize(paper);
  const paperTypes = new Set<string>();

  QUIZ_ENTRIES.forEach((entry) => {
    if (normalize(entry.paperLabel) === normalizedPaper && entry.paperTypeLabel) {
      paperTypes.add(entry.paperTypeLabel);
    }
  });

  return Array.from(paperTypes);
}

export function getAvailableSubjects(
  paper: string,
  paperType: string = ""
): string[] {
  const normalizedPaper = normalize(paper);
  const normalizedPaperType = normalize(paperType || "default");
  const subjects = new Set<string>();

  QUIZ_ENTRIES.forEach((entry) => {
    const entryPaper = normalize(entry.paperLabel);
    const entryPaperType = normalize(entry.paperTypeLabel || "default");

    if (entryPaper === normalizedPaper && entryPaperType === normalizedPaperType) {
      subjects.add(entry.subjectLabel);
    }
  });

  return Array.from(subjects);
}

export function getAvailableYears(
  paper: string,
  paperType: string = "",
  subject: string
): string[] {
  const normalizedPaper = normalize(paper);
  const normalizedPaperType = normalize(paperType || "default");
  const normalizedSubject = normalize(subject);
  const years = new Set<string>();

  QUIZ_ENTRIES.forEach((entry) => {
    const entryPaper = normalize(entry.paperLabel);
    const entryPaperType = normalize(entry.paperTypeLabel || "default");
    const entrySubject = normalize(entry.subjectLabel);

    if (
      entryPaper === normalizedPaper &&
      entryPaperType === normalizedPaperType &&
      entrySubject === normalizedSubject
    ) {
      years.add(entry.year);
    }
  });

  return Array.from(years).sort((a, b) => Number(b) - Number(a));
}

export function hasQuizData(params: QuizParams): boolean {
  return getQuizData(params) !== null;
}

export function getAllQuizKeys(): string[] {
  return Object.keys(QUIZ_LOADERS);
}