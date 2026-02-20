'use client'
import { usePostHog } from 'posthog-js/react'

export default function Home() {
  const displayName = "Dan Dutil";
  const jobTitle = "QA & Automation Engineer";
  const posthog = usePostHog()

  const resumeLink = "/Dutil_resume_2026.pdf";
  const linkedInLink = "https://www.linkedin.com/in/dan-dutil-b15161a5/";
  const summaryGridNotes = [
    {
      title: "Experience",
      content: "10+ years spanning Quality Assurance and Software Engineering"
    },
    {
      title: "Tech Stack",
      content: "Automated testing experience with Playwright, Selenium, and Postman(UI, API, & DB)"
    },
    {
      title: "Language-Agnostic",
      content: "Experience with JavaScript, Java, Python, C#, SQL"
    },
    {
      title: "Traits",
      content: "Versatile, Meticulous, Curious, and Collaborative"
    }
  ]
  

  return (
    <main className="flex min-h-screen flex-col items-center text-slate-200">
      <div className="text-center mb-12">
        {/* display name and job title */}
        <h1 className="text-violet-300 text-6xl md:text-8xl font-extrabold tracking-tight">
          {displayName}
        </h1>
        <h2 className="text-2xl md:text-3xl font-semibold mt-4 tracking-tight">
          {jobTitle}
        </h2>
      </div>

      {/* display summary grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full text-lg">
        {summaryGridNotes.map((note, idx) => (
          <div key={idx} className="p-6 bg-slate-900/50 rounded-xl border border-slate-800">
            <h3 className="font-bold text-violet-300 mb-2">{note.title}</h3>
            <p>{note.content}</p>
          </div>
        ))}
      </div>

      {/* action buttons */}
      <div className="flex gap-4 mt-12">
        <a
          href={resumeLink}
          download="Dan_Dutil_Resume.pdf"
          onClick={() => posthog?.capture('resume_downloaded')}
          className="px-6 py-4 bg-violet-500 hover:bg-violet-600 text-slate-200 font-bold rounded-full shadow-lg shadow-violet-900/50"
        >
          Get My Resume
        </a>
        <a
          href={linkedInLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => posthog?.capture('linkedin_clicked')}
          className="px-6 py-4 bg-violet-500 hover:bg-violet-600 text-slate-200 font-bold rounded-full shadow-lg shadow-violet-900/50"
        >
          View LinkedIn
        </a>
      </div>
    </main>
  );
}