'use client'
import { useState } from 'react'

export default function Experience() {
  const pageTitle = "Experience";
  const [activeTab, setActiveTab] = useState('work')
  const cardStyle = "w-full bg-slate-900/40 border border-slate-700/50 p-8 rounded-xl mb-8";

  const workHistory = [
    {
      company: "Crown Castle",
      startDate: "October 2023",
      endDate: "February 2026",
      stints: [
        {
          title: "QE Engineer II",
          startDate: "October 2023",
          endDate: "February 2026",
          location: "Remote",
          takeaways: "This was my first time at a company with a dedicated team for Quality Engineering. It was a great experience to be part of a team of 20+ QEs. I became comfortable performing UI, API and SQL database validation both manually and through automation (Playwright, Postman) against in-house GIS applications. Through no fault of my own, I was impacted by company-wide layoffs in February 2026 that significantly reduced the size of the QE team. I am grateful for the experience and the opportunity to work with such a talented team. I learned a lot during my time at Crown Castle and am excited to take that experience to my next role.",
          bullets: [
            "Owned the full testing lifecycle as the sole QE on multiple Agile teams developing in-house GIS web/desktop apps",
            "Engineered and scaled an automation suite of 100+ Playwright (JS) tests integrated into Harness CI/CD pipelines, monitored daily via Datadog dashboard, tests covered UI, API, and SQL database validation",
            "Architected a robust API regression suite of 1,000+ tests in Postman Enterprise that executed in minutes, providing immediate confidence in code stability before production deployments",
            "Accelerated test velocity using GitHub Copilot for rapid automated test development",
            "Designed and prioritized hundreds of test cases in QMetry including smoke, regression, P1-P4 to ensure release stability",
            "Partnered with Developers and PMs to influence product quality from inception, reviewed developer code frequently to identify edge cases missed, consulted with end users to align automation with real-world workflows",
            "Led a critical divestiture effort  to cleanse, separate, and migrate GIS test assets during a corporate sell-off"
          ]
        }
      ]
    },
    {
      company: "Solers/Peraton",
      startDate: "June 2015",
      endDate: "October 2023",
      stints: [
        {
          title: "Test Engineer",
          startDate: "September 2020",
          endDate: "October 2023",
          location: "Hybrid, Arlington, VA",
          takeaways: "This stint marked a pivotal shift in my career as I transitioned from a Software Engineer to a Test Engineer, fully embracing the world of Quality Assurance. I was one of 5+ testers on a large development team. I became an experienced manual tester and expanded my skills in automated testing using Selenium. After 3 years on this project, and another program contract ending, I decided to seek new opportunities outside the government contracting space.",
          bullets: [
            "Designed and implemented 1,000+ automated UI regression tests from scratch using Selenium (C#) and Visual Studio, covering complex multi-user roles across the entire application",
            "Performed critical smoke testing to ensure zero-defect deployments for 30+ prod deployments",
            "Tested countless stories and bugs, documenting detailed test execution steps and results within TFS/Azure DevOps",
            "Created over 100 high-priority defects found during manual, automated, and exploratory testing",
            "Executed API-level validation using Swagger, validated logs in Splunk",
          ]
        },
        {
          title: "Software Engineer",
          startDate: "June 2015",
          endDate: "September 2020",
          location: "Hybrid, Arlington, VA",
          takeaways: "My career in tech started as a back-end developer at Solers, a government contracting company. Over a five-year tenure as a Software Engineer, I contributed to a diverse range of government projects, developing a keen eye for identifying defects and a passion for root-cause analysis. Eventually, I took ownership of a legacy Selenium test suite which was used for automating UI test cases for a web application. Transforming that framework kickstarted my passion for automated testing. During my time on that project, the company was acquired by Peraton, a larger government contractor. When the program contract ended, I used this as an opportunity to alter my career path.",
          bullets: [
            "Maintained and added to preexisting Selenium automated test suite (Java) containing hundreds of UI tests, monitored results daily, mastered creation of XPaths",
            "Became team lead and scrum master in 2020, led team of 5-10 members over 7+ months, including running sprint ceremonies, assisting team members, and conducting code reviews",
            "Completed back-end Java developer tickets, including creating and maintaining Unit Tests using JUnit",
            "Assisted the test team with regression testing before every release",
          ]
        }
      ]
    }
  ]

  return (
    <main className="max-w-5xl mx-auto min-h-screen text-slate-200">
      <h1 id="experienceTitle" className="pb-30 text-violet-300 text-6xl md:text-8xl font-extrabold text-center tracking-tight">
        {pageTitle}
      </h1>
      
      
      <div className={`w-250 flex flex-col`}>
        <div className="flex w-full">
        <button 
          id="workHistoryTab"
          onClick={() => setActiveTab('work')}
          className={`w-1/2 py-5 text-2xl font-bold rounded-t-2xl transition-all duration-200
            ${activeTab === 'work' 
              ? 'bg-slate-800 border-t border-x border-slate-700 shadow-[0_-4px_10px_rgba(0,0,0,0.2)]' 
              : 'text-slate-500 bg-transparent border-b border-slate-700 hover:bg-slate-900/40 hover:text-slate-300'}`}
        >
          Work History
        </button>

        <button
          id="personalProjectsTab" 
          onClick={() => setActiveTab('projects')}
          className={`w-1/2 py-5 text-2xl font-bold rounded-t-2xl transition-all duration-200
            ${activeTab === 'projects' 
              ? 'bg-slate-800  border-t border-x border-slate-700 shadow-[0_-4px_10px_rgba(0,0,0,0.2)]' 
              : 'text-slate-500 bg-transparent border-b border-slate-700 hover:bg-slate-900/40 hover:text-slate-300'}`}
        >
          Personal Projects
        </button>
      </div>

        {/* CONTENT BOX - Forced to fill the 900px exactly */}
        <div className="w-full bg-slate-800 p-10 rounded-b-3xl border-x border-b border-slate-700 shadow-2xl min-h-175">
          
          {activeTab === 'work' ? (
            <div className="w-full">
              {workHistory.map((job, jobIndex) => (
                <div key={jobIndex} id={`job-${jobIndex}`} className="w-full bg-slate-900/40 border border-slate-700/50 p-8 rounded-xl mb-8">
                  {/* Company Header */}
                  <div className="flex justify-between items-baseline mb-6 border-b border-slate-800 pb-4">
                    <h4 id={`companyHeader-${jobIndex}`} className="text-3xl font-extrabold text-violet-300">{job.company}</h4>
                    <span id={`companyDates-${jobIndex}`} className="text-slate-500 text-lg italic">{job.startDate} — {job.endDate}</span>
                  </div>

                  {/* Stints Container */}
                  <div className="space-y-12">
                    {job.stints.map((stint, stintIndex) => (
                      <div key={stintIndex} id={`stint-${jobIndex}-${stintIndex}`} className="relative pl-8  border-slate-700">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h5 id={`stintTitle-${jobIndex}-${stintIndex}`} className="text-2xl font-bold text-blue-300">{stint.title}</h5>
                            <p id={`stintLocation-${jobIndex}-${stintIndex}`} className="text-slate-400 font-medium">{stint.location}</p>
                          </div>
                          {(stint.startDate !== job.startDate || stint.endDate !== job.endDate) && (
                            <span id={`stintDates-${jobIndex}-${stintIndex}`} className="text-slate-500 italic text-sm">{stint.startDate} — {stint.endDate}</span>
                          )}
                        </div>

                        <ul className="mt-4 space-y-3 text-slate-200 list-disc pl-5 leading-relaxed">
                          {stint.bullets.map((bullet, bIndex) => (
                            <li key={bIndex}>{bullet}</li>
                          ))}
                        </ul>

                        {/* My Take */}
                        {stint.takeaways && (
                          <div className="mt-6 py-4 border-y border-slate-700/60">
                            <p className="text-xs font-semibold uppercase tracking-widest text-violet-400 mb-2">More Info</p>
                            <p id={`stintTakeaways-${jobIndex}-${stintIndex}`} className="text-slate-400 leading-relaxed italic">{stint.takeaways}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full">
              
              <div className="w-full bg-slate-900/40 border border-slate-700/50 p-8 rounded-xl mb-8">
                <h4 className="text-3xl font-bold text-violet-300">This Website</h4>
                <p className="text-xl text-slate-300 mt-2"></p>
                <p className="mt-6 text-slate-400 leading-relaxed">
                  Coming Soon!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}