export type Locale = "en" | "de";

const translations = {
  en: {
    // Navbar
    appTitle: "Quiz-App",
    navImport: "Import",
    navHighscores: "Highscores",
    navThemeLight: "Light",
    navThemeDark: "Dark",

    // Home
    homeHeading: "Quiz-App",
    homeSubheading: "Pick a topic and test your knowledge.",
    questionsCount: (n: number) => `${n} questions`,
    loadingTopics: "Loading topics...",
    couldNotLoadTopics: "Could not load topics:",

    // Topic descriptions
    "topic.git.description":
      "Version control fundamentals — commits, branches, merging, and collaboration.",
    "topic.github-actions.description":
      "CI/CD pipelines — workflows, jobs, steps, runners, and automation.",
    "topic.terraform.description":
      "Infrastructure as Code — providers, resources, state, and the plan/apply cycle.",
    "topic.docker.description":
      "Containerization — images, containers, Dockerfiles, and registries.",

    // Quiz UI
    backToTopics: "Back to topics",
    previous: "Previous",
    next: "Next",
    submit: "Submit",
    retry: "Retry",
    allTopics: "All Topics",
    quizComplete: "Quiz Complete!",
    correct: (score: number, total: number) => `${score} of ${total} correct`,
    correctAnswer: "Correct:",
    timeElapsed: "Time",
    loadingQuiz: "Loading quiz...",
    topicNotFound: "Topic not found.",
    couldNotLoadQuiz: "Could not load quiz:",

    // Highscore UI
    saveYourHighscore: "Save your highscore",
    yourName: "Your name",
    save: "Save",
    saving: "Saving...",
    highscoreSaved: "Highscore saved.",
    topTen: "Top 10",
    noHighscoresYet: "No highscores yet.",
    couldNotLoadHighscores: "Could not load highscores:",
    nameLengthHint: "Please enter a name with 2-40 characters.",

    // Import page
    importQuestions: "Import questions",
    importDescription:
      "Upload one JSON file in the defined format to create or update a topic and add questions.",
    upload: "Upload",
    uploading: "Uploading...",
    selectJsonFirst: "Please select a JSON file first.",
    uploadFailed: "Upload failed",
    importSuccessful: "Import successful: topic",
    created: "created",
    updated: "updated",
    questionsInserted: "question(s) inserted.",

    // Highscores page
    highscoresPageHeading: "Highscores by topic",
    highscoresPageSubheading: "Top entries across all available topics.",
    loadingHighscoresPage: "Loading highscores...",
    couldNotLoadHighscoresPage: "Could not load highscores page:",
  },
  de: {
    // Navbar
    appTitle: "Quiz-App",
    navImport: "Import",
    navHighscores: "Highscores",
    navThemeLight: "Hell",
    navThemeDark: "Dunkel",

    // Home
    homeHeading: "Quiz-App",
    homeSubheading: "Wähle ein Thema und teste dein Wissen.",
    questionsCount: (n: number) => `${n} Fragen`,
    loadingTopics: "Themen werden geladen...",
    couldNotLoadTopics: "Themen konnten nicht geladen werden:",

    // Topic descriptions
    "topic.git.description":
      "Versionskontrolle — Commits, Branches, Merging und Zusammenarbeit.",
    "topic.github-actions.description":
      "CI/CD-Pipelines — Workflows, Jobs, Steps, Runner und Automatisierung.",
    "topic.terraform.description":
      "Infrastructure as Code — Provider, Ressourcen, State und der Plan/Apply-Zyklus.",
    "topic.docker.description":
      "Containerisierung — Images, Container, Dockerfiles und Registries.",

    // Quiz UI
    backToTopics: "Zurück zur Übersicht",
    previous: "Zurück",
    next: "Weiter",
    submit: "Abgeben",
    retry: "Nochmal",
    allTopics: "Alle Themen",
    quizComplete: "Quiz abgeschlossen!",
    correct: (score: number, total: number) => `${score} von ${total} richtig`,
    correctAnswer: "Richtig:",
    timeElapsed: "Zeit",
    loadingQuiz: "Quiz wird geladen...",
    topicNotFound: "Thema nicht gefunden.",
    couldNotLoadQuiz: "Quiz konnte nicht geladen werden:",

    // Highscore UI
    saveYourHighscore: "Highscore speichern",
    yourName: "Dein Name",
    save: "Speichern",
    saving: "Speichert...",
    highscoreSaved: "Highscore gespeichert.",
    topTen: "Top 10",
    noHighscoresYet: "Noch keine Highscores.",
    couldNotLoadHighscores: "Highscores konnten nicht geladen werden:",
    nameLengthHint: "Bitte einen Namen mit 2-40 Zeichen eingeben.",

    // Import page
    importQuestions: "Fragen importieren",
    importDescription:
      "Lade eine JSON-Datei im definierten Format hoch, um ein Thema zu erstellen oder zu aktualisieren und Fragen hinzuzufügen.",
    upload: "Hochladen",
    uploading: "Lädt hoch...",
    selectJsonFirst: "Bitte zuerst eine JSON-Datei auswählen.",
    uploadFailed: "Upload fehlgeschlagen",
    importSuccessful: "Import erfolgreich: Thema",
    created: "erstellt",
    updated: "aktualisiert",
    questionsInserted: "Frage(n) eingefügt.",

    // Highscores page
    highscoresPageHeading: "Highscores nach Thema",
    highscoresPageSubheading: "Top-Einträge über alle verfügbaren Themen.",
    loadingHighscoresPage: "Highscores werden geladen...",
    couldNotLoadHighscoresPage: "Highscore-Seite konnte nicht geladen werden:",
  },
};

export type Translations = typeof translations.en;
export type TranslationKey = keyof Translations;

export default translations;
